import { scryptSync } from 'node:crypto';

const ORIGIN = 'https://studiosanch.com';
const COOKIE = '__Host-sanch_client';
const SESSION_IDLE = 1800;
const SESSION_ABSOLUTE = 28800;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

type D1Result<T = Record<string, unknown>> = { results?: T[]; success?: boolean; meta?: { changes?: number } };
type D1Statement = { bind(...values: unknown[]): D1Statement; first<T = Record<string, unknown>>(): Promise<T | null>; run(): Promise<D1Result>; };
type D1Database = { prepare(sql: string): D1Statement; batch(statements: D1Statement[]): Promise<D1Result[]>; };
type Env = { CLIENT_DB: D1Database; CLIENT_RATE_SECRET: string; };
type Context = { request: Request; env: Env; };
type Account = { id: string; username: string; status: string; session_version: number; password_hash: string | null; invitation_hash: string | null; invitation_expires: number | null; };
type Session = { tokenHash: string; csrf: string; user: { id: string; username: string } | null; };

function secureHeaders(): Headers {
  return new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, private, max-age=0',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
  });
}
function reply(status: number, body: Record<string, unknown>, cookie?: string): Response {
  const headers = secureHeaders();
  if (cookie) headers.set('Set-Cookie', `${COOKIE}=${cookie}; Path=/; Secure; HttpOnly; SameSite=Strict`);
  return new Response(JSON.stringify(body), { status, headers });
}
function fail(status: number, code: string): Response { return reply(status, { error: code }); }
function bytesToHex(bytes: Uint8Array): string { return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(''); }
function randomHex(bytes: number): string { return bytesToHex(crypto.getRandomValues(new Uint8Array(bytes))); }
async function sha256(value: string): Promise<string> { return bytesToHex(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))); }
async function hmac(secret: string, value: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return bytesToHex(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value))));
}
function equalHex(left: string, right: string): boolean {
  if (left.length !== right.length || !/^[a-f0-9]+$/i.test(left + right)) return false;
  let difference = 0;
  for (let i = 0; i < left.length; i++) difference |= left.charCodeAt(i) ^ right.charCodeAt(i);
  return difference === 0;
}
async function passwordHash(password: string, salt = randomHex(16)): Promise<string> {
  const derived = scryptSync(password, salt, 32, { N: SCRYPT_N, r: SCRYPT_R, p: SCRYPT_P, maxmem: 32 * 1024 * 1024 });
  return `scrypt$${SCRYPT_N}$${SCRYPT_R}$${SCRYPT_P}$${salt}$${derived.toString('hex')}`;
}
async function passwordVerify(password: string, encoded: string): Promise<boolean> {
  const [algorithm, n, r, p, salt, expected] = encoded.split('$');
  if (algorithm !== 'scrypt' || Number(n) !== SCRYPT_N || Number(r) !== SCRYPT_R || Number(p) !== SCRYPT_P || !/^[a-f0-9]{32}$/.test(salt || '') || !/^[a-f0-9]{64}$/.test(expected || '')) return false;
  const actual = (await passwordHash(password, salt)).split('$')[5];
  return equalHex(actual, expected);
}
function cookieValue(request: Request): string | null {
  const raw = request.headers.get('Cookie') || '';
  const value = raw.split(';').map(item => item.trim()).find(item => item.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) || '';
  return /^[a-f0-9]{64}$/.test(value) ? value : null;
}
async function openSession(request: Request, db: D1Database): Promise<{ session: Session; cookie?: string }> {
  const now = Math.floor(Date.now() / 1000);
  const token = cookieValue(request);
  if (token) {
    const tokenHash = await sha256(token);
    const row = await db.prepare(`SELECT s.csrf, s.account_id, s.session_version, s.created_at, s.last_seen, s.expires_at,
      a.id AS user_id, a.username, a.status, a.session_version AS current_version
      FROM client_sessions s LEFT JOIN client_accounts a ON a.id = s.account_id WHERE s.token_hash = ?`).bind(tokenHash).first<Record<string, unknown>>();
    if (row && Number(row.expires_at) > now && now - Number(row.last_seen) <= SESSION_IDLE && now - Number(row.created_at) <= SESSION_ABSOLUTE &&
        (!row.account_id || (row.status === 'active' && Number(row.session_version) === Number(row.current_version)))) {
      await db.prepare('UPDATE client_sessions SET last_seen = ? WHERE token_hash = ?').bind(now, tokenHash).run();
      return { session: { tokenHash, csrf: String(row.csrf), user: row.account_id ? { id: String(row.user_id), username: String(row.username) } : null } };
    }
    await db.prepare('DELETE FROM client_sessions WHERE token_hash = ?').bind(tokenHash).run();
  }
  const freshToken = randomHex(32); const tokenHash = await sha256(freshToken); const csrf = randomHex(32);
  await db.prepare('INSERT INTO client_sessions(token_hash, csrf, created_at, last_seen, expires_at) VALUES (?, ?, ?, ?, ?)').bind(tokenHash, csrf, now, now, now + SESSION_ABSOLUTE).run();
  return { session: { tokenHash, csrf, user: null }, cookie: freshToken };
}
async function rotateSession(db: D1Database, oldHash: string, account?: Account): Promise<{ session: Session; cookie: string }> {
  const now = Math.floor(Date.now() / 1000); const token = randomHex(32); const tokenHash = await sha256(token); const csrf = randomHex(32);
  await db.batch([
    db.prepare('DELETE FROM client_sessions WHERE token_hash = ?').bind(oldHash),
    db.prepare('INSERT INTO client_sessions(token_hash, csrf, account_id, session_version, created_at, last_seen, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)').bind(tokenHash, csrf, account?.id || null, account?.session_version || null, now, now, now + SESSION_ABSOLUTE),
  ]);
  return { session: { tokenHash, csrf, user: account ? { id: account.id, username: account.username } : null }, cookie: token };
}
async function rateLimit(db: D1Database, secret: string, scope: string, identifier: string, maximum: number): Promise<number | null> {
  const now = Math.floor(Date.now() / 1000); const bucket = await hmac(secret, `${scope}:${identifier}`);
  await db.prepare(`INSERT INTO client_auth_limits(bucket, attempts, expires_at) VALUES (?, 1, ?)
    ON CONFLICT(bucket) DO UPDATE SET attempts = CASE WHEN expires_at <= ? THEN 1 ELSE attempts + 1 END,
    expires_at = CASE WHEN expires_at <= ? THEN excluded.expires_at ELSE expires_at END`).bind(bucket, now + 900, now, now).run();
  const row = await db.prepare('SELECT attempts, expires_at FROM client_auth_limits WHERE bucket = ?').bind(bucket).first<{ attempts: number; expires_at: number }>();
  return row && Number(row.attempts) > maximum ? Math.max(1, Number(row.expires_at) - now) : null;
}
async function parseBody(request: Request): Promise<Record<string, unknown> | Response> {
  if (Number(request.headers.get('Content-Length') || 0) > 8192) return fail(413, 'invalid_request');
  const text = await request.text();
  if (text.length > 8192) return fail(413, 'invalid_request');
  try { const data = JSON.parse(text); return data && typeof data === 'object' && !Array.isArray(data) ? data : fail(400, 'invalid_request'); }
  catch { return fail(400, 'invalid_request'); }
}
export async function onRequest({ request, env }: Context): Promise<Response> {
  let stage = 'request-validation';
  const url = new URL(request.url);
  if (url.origin !== ORIGIN || url.pathname !== '/api/client.php') return fail(403, 'request_rejected');
  if (!env.CLIENT_DB || !env.CLIENT_RATE_SECRET || env.CLIENT_RATE_SECRET.length < 32) return fail(503, 'service_unavailable');
  if (!['GET', 'POST'].includes(request.method)) { const response = fail(405, 'invalid_request'); response.headers.set('Allow', 'GET, POST'); return response; }
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site') return fail(403, 'request_rejected');
  if (request.method === 'POST' && request.headers.get('Origin') !== ORIGIN) return fail(403, 'request_rejected');
  if (request.method === 'POST' && request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return fail(415, 'invalid_request');
  if (request.method === 'POST' && Number(request.headers.get('Content-Length') || 0) > 8192) return fail(413, 'invalid_request');
  try {
    stage = 'rate-limit';
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    if (request.method === 'GET' && !cookieValue(request)) {
      const retry = await rateLimit(env.CLIENT_DB, env.CLIENT_RATE_SECRET, 'new-session', ip, 120);
      if (retry) { const response = fail(429, 'rate_limited'); response.headers.set('Retry-After', String(retry)); return response; }
    }
    stage = 'open-session';
    const { session, cookie } = await openSession(request, env.CLIENT_DB);
    if (request.method === 'GET') return reply(200, { user: session.user, csrf: session.csrf }, cookie);
    if (request.headers.get('X-CSRF-Token') !== session.csrf) return fail(403, 'request_rejected');
    stage = 'parse-body';
    const parsed = await parseBody(request); if (parsed instanceof Response) return parsed;
    const action = String(parsed.action || '');
    if (action === 'logout') { const rotated = await rotateSession(env.CLIENT_DB, session.tokenHash); return reply(200, { user: null, csrf: rotated.session.csrf }, rotated.cookie); }
    if (!['login', 'activate'].includes(action)) return fail(400, 'invalid_request');
    const username = String(parsed.username || '').toLowerCase().trim(); const password = String(parsed.password || '');
    if (!/^[a-z0-9][a-z0-9._-]{2,63}$/.test(username) || !password || password.length > 1024) return fail(401, 'invalid_credentials');
    stage = 'authentication-rate-limit';
    let retry = await rateLimit(env.CLIENT_DB, env.CLIENT_RATE_SECRET, 'ip', ip, 30);
    if (!retry) retry = await rateLimit(env.CLIENT_DB, env.CLIENT_RATE_SECRET, 'username', username, 10);
    if (retry) { const response = fail(429, 'rate_limited'); response.headers.set('Retry-After', String(retry)); return response; }
    stage = 'load-account';
    const account = await env.CLIENT_DB.prepare('SELECT id, username, status, session_version, password_hash, invitation_hash, invitation_expires FROM client_accounts WHERE username = ?').bind(username).first<Account>();
    if (action === 'activate') {
      const token = String(parsed.token || '');
      if (!/^[a-f0-9]{64}$/.test(token)) return fail(400, 'invalid_invitation');
      if ([...password].length < 15 || [...password].length > 128) return fail(400, 'password_length');
      const invitationHash = await sha256(token); const now = Math.floor(Date.now() / 1000);
      if (!account || account.status === 'disabled' || account.invitation_hash !== invitationHash || Number(account.invitation_expires) <= now) return fail(400, 'invalid_invitation');
      stage = 'password-hash';
      const encoded = await passwordHash(password);
      stage = 'activate-account';
      const result = await env.CLIENT_DB.prepare(`UPDATE client_accounts SET password_hash = ?, status = 'active', session_version = session_version + 1,
        invitation_hash = NULL, invitation_expires = NULL WHERE id = ? AND invitation_hash = ? AND invitation_expires > ? AND status <> 'disabled'`).bind(encoded, account.id, invitationHash, now).run();
      if (!result.success || result.meta?.changes !== 1) return fail(400, 'invalid_invitation');
      stage = 'rotate-activation-session';
      const rotated = await rotateSession(env.CLIENT_DB, session.tokenHash);
      return reply(200, { activated: true, csrf: rotated.session.csrf }, rotated.cookie);
    }
    // The fixed dummy hash makes unknown-user and known-user attempts perform the same expensive verification.
    const dummy = 'scrypt$16384$8$1$00000000000000000000000000000000$87f8b88e3c7a8e7dd9f302c48c6297125ffe76f3cdb8010708f796beeb875a32';
    stage = 'password-verify';
    const valid = await passwordVerify(password, account?.password_hash || dummy);
    if (!valid || !account || account.status !== 'active') return fail(401, 'invalid_credentials');
    stage = 'rotate-login-session';
    const rotated = await rotateSession(env.CLIENT_DB, session.tokenHash, account);
    return reply(200, { user: rotated.session.user, csrf: rotated.session.csrf }, rotated.cookie);
  } catch (error) {
    console.error('client-auth failure', { stage, name: error instanceof Error ? error.name : 'UnknownError' });
    return fail(503, 'service_unavailable');
  }
}
