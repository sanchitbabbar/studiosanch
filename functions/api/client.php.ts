import { scryptSync } from 'node:crypto';

const ORIGIN = 'https://studiosanch.com';
const COOKIE = '__Host-sanch_client';
const SESSION_IDLE = 1800;
const SESSION_ABSOLUTE = 28800;
const SCRYPT_N = 16384;
const SCRYPT_R = 8;
const SCRYPT_P = 1;

type D1Result<T = Record<string, unknown>> = { results?: T[]; success?: boolean; meta?: { changes?: number } };
type D1Statement = { bind(...values: unknown[]): D1Statement; first<T = Record<string, unknown>>(): Promise<T | null>; all<T = Record<string, unknown>>(): Promise<D1Result<T>>; run(): Promise<D1Result>; };
type D1Database = { prepare(sql: string): D1Statement; batch(statements: D1Statement[]): Promise<D1Result[]>; };
type Env = { CLIENT_DB: D1Database; CLIENT_RATE_SECRET: string; };
type Context = { request: Request; env: Env; };
type ProjectAccess = 'film' | 'photoshoot' | 'installation' | 'identity';
type Account = { id: string; username: string; status: string; session_version: number; password_hash: string | null; invitation_hash: string | null; invitation_expires: number | null; project_access: string };
type SessionUser = { id: string; username: string; access: ProjectAccess[] };
type Session = { tokenHash: string; csrf: string; user: SessionUser | null; };

const PROJECT_ACCESS = new Set<ProjectAccess>(['film', 'photoshoot', 'installation', 'identity']);
function parseProjectAccess(value: unknown): ProjectAccess[] {
  return [...new Set(String(value || '').split(',').map(item => item.trim()).filter((item): item is ProjectAccess => PROJECT_ACCESS.has(item as ProjectAccess)))];
}
function accountUser(account: Pick<Account, 'id' | 'username' | 'project_access'>): SessionUser {
  return { id: account.id, username: account.username, access: parseProjectAccess(account.project_access) };
}

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
      a.id AS user_id, a.username, a.status, a.session_version AS current_version, a.project_access
      FROM client_sessions s LEFT JOIN client_accounts a ON a.id = s.account_id WHERE s.token_hash = ?`).bind(tokenHash).first<Record<string, unknown>>();
    if (row && Number(row.expires_at) > now && now - Number(row.last_seen) <= SESSION_IDLE && now - Number(row.created_at) <= SESSION_ABSOLUTE &&
        (!row.account_id || (row.status === 'active' && Number(row.session_version) === Number(row.current_version)))) {
      await db.prepare('UPDATE client_sessions SET last_seen = ? WHERE token_hash = ?').bind(now, tokenHash).run();
      return { session: { tokenHash, csrf: String(row.csrf), user: row.account_id ? accountUser({ id: String(row.user_id), username: String(row.username), project_access: String(row.project_access || '') }) : null } };
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
  return { session: { tokenHash, csrf, user: account ? accountUser(account) : null }, cookie: token };
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
  if (Number(request.headers.get('Content-Length') || 0) > 550000) return fail(413, 'invalid_request');
  const text = await request.text();
  if (text.length > 550000) return fail(413, 'invalid_request');
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
  if (request.method === 'POST' && Number(request.headers.get('Content-Length') || 0) > 550000) return fail(413, 'invalid_request');
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
    if (action === 'list_frame_plan' || action === 'save_frame_plan') {
      if (!session.user || !session.user.access.includes('photoshoot')) return fail(403, 'access_denied');
      if (String(parsed.project || '') !== 'grace-in-motion') return fail(400, 'invalid_request');
      if (action === 'list_frame_plan') {
        const row = await env.CLIENT_DB.prepare('SELECT details FROM client_project_frame_plans WHERE project_key = ?').bind('grace-in-motion').first<{ details: string }>();
        return reply(200, { user: session.user, csrf: session.csrf, plan: row?.details || null }, cookie);
      }
      const plan = parsed.plan && typeof parsed.plan === 'object' && !Array.isArray(parsed.plan) ? parsed.plan as Record<string, unknown> : null;
      const frames = plan && Array.isArray(plan.frames) ? plan.frames : null;
      const framesPerDay = String(plan?.framesPerDay || '');
      const shootDays = String(plan?.shootDays || '');
      const allowedKeys = ['visual', 'duration', 'dancers', 'movement', 'phrase', 'repetitions'];
      const allowedMovements = new Set(['Contemporary', 'Modern', 'Lyrical', 'Acrobat', 'Aerial', 'Neoclassical', 'Cabaret', 'Jazz']);
      const validFrames = frames && frames.length >= 1 && frames.length <= 25 && frames.every(frame => {
        if (!frame || typeof frame !== 'object' || Array.isArray(frame)) return false;
        const item = frame as Record<string, unknown>;
        return Object.keys(item).every(key => allowedKeys.includes(key)) &&
          String(item.visual || '').length <= 100 && ['15', '30', '45'].includes(String(item.duration)) &&
          /^(?:[1-9]|10)$/.test(String(item.dancers)) && allowedMovements.has(String(item.movement)) &&
          ['15', '30', '45', '60', '75', '90', '105', '120'].includes(String(item.phrase)) &&
          ['3', '5', '8', '10'].includes(String(item.repetitions));
      });
      if (!plan || !validFrames || !['4', '6', '8', '10'].includes(framesPerDay) || !['1', '2', '3', '4', '5'].includes(shootDays)) return fail(400, 'invalid_request');
      const details = JSON.stringify({ frames, framesPerDay, shootDays });
      const saved = await env.CLIENT_DB.prepare(`INSERT INTO client_project_frame_plans(project_key, details, updated_by, updated_at) VALUES (?, ?, ?, ?)
        ON CONFLICT(project_key) DO UPDATE SET details = excluded.details, updated_by = excluded.updated_by, updated_at = excluded.updated_at`)
        .bind('grace-in-motion', details, session.user.id, Math.floor(Date.now() / 1000)).run();
      if (!saved.success) return fail(503, 'service_unavailable');
      return reply(200, { user: session.user, csrf: session.csrf, saved: true }, cookie);
    }
    if (action === 'list_frame_briefs' || action === 'save_frame_brief') {
      if (!session.user || !session.user.access.includes('photoshoot')) return fail(403, 'access_denied');
      if (String(parsed.project || '') !== 'grace-in-motion') return fail(400, 'invalid_request');
      if (action === 'list_frame_briefs') {
        const result = await env.CLIENT_DB.prepare('SELECT frame_index, details, updated_at FROM client_project_frame_briefs WHERE project_key = ? ORDER BY frame_index').bind('grace-in-motion').all();
        return reply(200, { user: session.user, csrf: session.csrf, briefs: result.results || [] }, cookie);
      }
      const frameIndex = Number(parsed.frame_index);
      const details = parsed.details && typeof parsed.details === 'object' && !Array.isArray(parsed.details) ? parsed.details as Record<string, unknown> : null;
      const allowed = ['vision', 'space', 'set', 'props', 'ambience', 'lighting', 'styling', 'hair', 'makeup'];
      if (!Number.isInteger(frameIndex) || frameIndex < 0 || frameIndex > 24 || !details || Object.keys(details).some(key => !allowed.includes(key))) return fail(400, 'invalid_request');
      const normalized = Object.fromEntries(allowed.map(key => [key, String(details[key] || '').trim()]));
      if (Object.values(normalized).some(value => [...value].length > 1800)) return fail(400, 'invalid_request');
      const saved = await env.CLIENT_DB.prepare(`INSERT INTO client_project_frame_briefs(project_key, frame_index, details, updated_by, updated_at) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(project_key, frame_index) DO UPDATE SET details = excluded.details, updated_by = excluded.updated_by, updated_at = excluded.updated_at`)
        .bind('grace-in-motion', frameIndex, JSON.stringify(normalized), session.user.id, Math.floor(Date.now() / 1000)).run();
      if (!saved.success) return fail(503, 'service_unavailable');
      return reply(200, { user: session.user, csrf: session.csrf, saved: true }, cookie);
    }
    if (action === 'list_ideas' || action === 'add_idea') {
      if (!session.user || !session.user.access.includes('film')) return fail(403, 'access_denied');
      if (String(parsed.project || '') !== 'fashion-film-start') return fail(400, 'invalid_request');
      if (action === 'list_ideas') {
        const result = await env.CLIENT_DB.prepare(`SELECT id, author, kind, body, created_at FROM client_project_ideas
          WHERE project_key = ? ORDER BY created_at DESC LIMIT 100`).bind('fashion-film-start').all();
        return reply(200, { user: session.user, csrf: session.csrf, ideas: result.results || [] }, cookie);
      }
      const kinds = new Set(['direction', 'location', 'styling', 'sound', 'story']);
      const kind = String(parsed.kind || '').toLowerCase();
      const body = String(parsed.body || '').trim();
      if (!kinds.has(kind) || !body || [...body].length > 1200) return fail(400, 'invalid_request');
      const retry = await rateLimit(env.CLIENT_DB, env.CLIENT_RATE_SECRET, 'film-idea', session.user.id, 80);
      if (retry) { const response = fail(429, 'rate_limited'); response.headers.set('Retry-After', String(retry)); return response; }
      const idea = { id: crypto.randomUUID(), author: session.user.username, kind, body, created_at: Math.floor(Date.now() / 1000) };
      const saved = await env.CLIENT_DB.prepare(`INSERT INTO client_project_ideas(id, project_key, account_id, author, kind, body, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(idea.id, 'fashion-film-start', session.user.id, idea.author, idea.kind, idea.body, idea.created_at).run();
      if (!saved.success || saved.meta?.changes !== 1) return fail(503, 'service_unavailable');
      return reply(201, { user: session.user, csrf: session.csrf, idea }, cookie);
    }
    if (['list_inspirations', 'add_inspiration', 'vote_inspiration', 'select_inspiration'].includes(action)) {
      if (!session.user || !session.user.access.includes('film')) return fail(403, 'access_denied');
      if (String(parsed.project || '') !== 'fashion-film-start') return fail(400, 'invalid_request');
      if (action === 'list_inspirations') {
        const result = await env.CLIENT_DB.prepare(`SELECT i.id, i.author, i.owner, i.caption, i.image_data, i.selected, i.created_at,
          SUM(CASE WHEN v.vote = 'yes' THEN 1 ELSE 0 END) AS yes_count,
          SUM(CASE WHEN v.vote = 'no' THEN 1 ELSE 0 END) AS no_count,
          MAX(CASE WHEN v.account_id = ? THEN v.vote ELSE NULL END) AS my_vote
          FROM client_project_inspirations i LEFT JOIN client_project_inspiration_votes v ON v.inspiration_id = i.id
          WHERE i.project_key = ? GROUP BY i.id ORDER BY i.created_at DESC LIMIT 60`).bind(session.user.id, 'fashion-film-start').all();
        return reply(200, { user: session.user, csrf: session.csrf, inspirations: result.results || [] }, cookie);
      }
      const id = String(parsed.id || '');
      if (action === 'add_inspiration') {
        const caption = String(parsed.caption || '').trim();
        const imageData = String(parsed.image || '');
        const owner = String(parsed.owner || '').toLowerCase();
        if (!['alex', 'benjamin'].includes(owner) || [...caption].length > 240 || imageData.length > 1800000 || !/^data:(?:image\/(?:jpeg|png|webp)|video\/(?:mp4|webm|quicktime));base64,[A-Za-z0-9+/=]+$/.test(imageData)) return fail(400, 'invalid_request');
        const retry = await rateLimit(env.CLIENT_DB, env.CLIENT_RATE_SECRET, 'film-inspiration', session.user.id, 40);
        if (retry) { const response = fail(429, 'rate_limited'); response.headers.set('Retry-After', String(retry)); return response; }
        const inspiration = { id: crypto.randomUUID(), author: session.user.username, owner, caption, image_data: imageData, selected: 0, created_at: Math.floor(Date.now() / 1000), yes_count: 0, no_count: 0, my_vote: null };
        const saved = await env.CLIENT_DB.prepare(`INSERT INTO client_project_inspirations(id, project_key, account_id, author, owner, caption, image_data, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).bind(inspiration.id, 'fashion-film-start', session.user.id, inspiration.author, owner, caption, imageData, inspiration.created_at).run();
        if (!saved.success || saved.meta?.changes !== 1) return fail(503, 'service_unavailable');
        return reply(201, { user: session.user, csrf: session.csrf, inspiration }, cookie);
      }
      if (!/^[0-9a-f-]{36}$/i.test(id)) return fail(400, 'invalid_request');
      if (action === 'vote_inspiration') {
        const vote = String(parsed.vote || '');
        if (!['yes', 'no'].includes(vote)) return fail(400, 'invalid_request');
        await env.CLIENT_DB.prepare(`INSERT INTO client_project_inspiration_votes(inspiration_id, account_id, vote, created_at)
          SELECT id, ?, ?, ? FROM client_project_inspirations WHERE id = ? AND project_key = ?
          ON CONFLICT(inspiration_id, account_id) DO UPDATE SET vote = excluded.vote, created_at = excluded.created_at`)
          .bind(session.user.id, vote, Math.floor(Date.now() / 1000), id, 'fashion-film-start').run();
      } else {
        await env.CLIENT_DB.prepare('UPDATE client_project_inspirations SET selected = 1 WHERE id = ? AND project_key = ?').bind(id, 'fashion-film-start').run();
      }
      return reply(200, { user: session.user, csrf: session.csrf, updated: true }, cookie);
    }
    if (action === 'list_gear' || action === 'save_gear') {
      if (!session.user || !session.user.access.includes('film')) return fail(403, 'access_denied');
      if (String(parsed.project || '') !== 'fashion-film-start') return fail(400, 'invalid_request');
      if (action === 'list_gear') {
        const result = await env.CLIENT_DB.prepare('SELECT owner, items, updated_at FROM client_project_gear WHERE project_key = ? ORDER BY owner').bind('fashion-film-start').all();
        return reply(200, { user: session.user, csrf: session.csrf, gear: result.results || [] }, cookie);
      }
      const owner = String(parsed.owner || '').toLowerCase();
      const items = String(parsed.items || '').trim();
      if (!['alex', 'benjamin'].includes(owner) || [...items].length > 2000) return fail(400, 'invalid_request');
      const saved = await env.CLIENT_DB.prepare(`INSERT INTO client_project_gear(project_key, owner, items, updated_by, updated_at) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(project_key, owner) DO UPDATE SET items = excluded.items, updated_by = excluded.updated_by, updated_at = excluded.updated_at`)
        .bind('fashion-film-start', owner, items, session.user.id, Math.floor(Date.now() / 1000)).run();
      if (!saved.success) return fail(503, 'service_unavailable');
      return reply(200, { user: session.user, csrf: session.csrf, saved: true }, cookie);
    }
    if (action === 'list_roles' || action === 'save_roles') {
      if (!session.user || !session.user.access.includes('film')) return fail(403, 'access_denied');
      if (String(parsed.project || '') !== 'fashion-film-start') return fail(400, 'invalid_request');
      if (action === 'list_roles') {
        const result = await env.CLIENT_DB.prepare('SELECT owner, roles, updated_at FROM client_project_roles WHERE project_key = ? ORDER BY owner').bind('fashion-film-start').all();
        return reply(200, { user: session.user, csrf: session.csrf, roles: result.results || [] }, cookie);
      }
      const owner = String(parsed.owner || '').toLowerCase();
      const roles = Array.isArray(parsed.roles) ? parsed.roles.map(String) : [];
      const allowedRoles = new Set(['Director', 'Co-Director', 'Creative Director', 'Director of Photography', 'Cinematographer', 'Camera Operator', 'First Assistant Director', 'Script Supervisor', 'Storyboard Artist', 'Technical Director', 'Art Director', 'Production Designer', 'Atmospheric Survey', 'Post-Production Supervisor', 'Picture Editor', 'Assistant Editor', 'Online Editor · Conform', 'Colorist', 'Finishing Artist', 'Sound Designer', 'Sound Editor', 'Re-Recording Mixer', 'VFX Supervisor']);
      if (!['alex', 'benjamin'].includes(owner) || roles.length > allowedRoles.size || roles.some(role => !allowedRoles.has(role))) return fail(400, 'invalid_request');
      const saved = await env.CLIENT_DB.prepare(`INSERT INTO client_project_roles(project_key, owner, roles, updated_by, updated_at) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(project_key, owner) DO UPDATE SET roles = excluded.roles, updated_by = excluded.updated_by, updated_at = excluded.updated_at`)
        .bind('fashion-film-start', owner, JSON.stringify([...new Set(roles)]), session.user.id, Math.floor(Date.now() / 1000)).run();
      if (!saved.success) return fail(503, 'service_unavailable');
      return reply(200, { user: session.user, csrf: session.csrf, saved: true }, cookie);
    }
    if (action === 'list_narratives' || action === 'save_narrative') {
      if (!session.user || !session.user.access.includes('film')) return fail(403, 'access_denied');
      if (String(parsed.project || '') !== 'fashion-film-start') return fail(400, 'invalid_request');
      if (action === 'list_narratives') {
        const result = await env.CLIENT_DB.prepare('SELECT owner, body, updated_at FROM client_project_narratives WHERE project_key = ? ORDER BY owner').bind('fashion-film-start').all();
        return reply(200, { user: session.user, csrf: session.csrf, narratives: result.results || [] }, cookie);
      }
      const owner = String(parsed.owner || '').toLowerCase();
      const body = String(parsed.body || '').trim();
      if (!['alex', 'benjamin'].includes(owner) || [...body].length > 2400) return fail(400, 'invalid_request');
      const saved = await env.CLIENT_DB.prepare(`INSERT INTO client_project_narratives(project_key, owner, body, updated_by, updated_at) VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(project_key, owner) DO UPDATE SET body = excluded.body, updated_by = excluded.updated_by, updated_at = excluded.updated_at`)
        .bind('fashion-film-start', owner, body, session.user.id, Math.floor(Date.now() / 1000)).run();
      if (!saved.success) return fail(503, 'service_unavailable');
      return reply(200, { user: session.user, csrf: session.csrf, saved: true }, cookie);
    }
    if (action === 'list_suggestions' || action === 'save_suggestion') {
      if (!session.user || !session.user.access.includes('film')) return fail(403, 'access_denied');
      if (String(parsed.project || '') !== 'fashion-film-start') return fail(400, 'invalid_request');
      if (action === 'list_suggestions') {
        const result = await env.CLIENT_DB.prepare('SELECT section, owner, body, updated_at FROM client_project_suggestions WHERE project_key = ? ORDER BY section, owner').bind('fashion-film-start').all();
        return reply(200, { user: session.user, csrf: session.csrf, suggestions: result.results || [] }, cookie);
      }
      const section = String(parsed.section || '').toLowerCase();
      const owner = String(parsed.owner || '').toLowerCase();
      const body = String(parsed.body || '').trim();
      if (!['tone', 'image'].includes(section) || !['alex', 'benjamin'].includes(owner) || [...body].length > 600) return fail(400, 'invalid_request');
      const saved = await env.CLIENT_DB.prepare(`INSERT INTO client_project_suggestions(project_key, section, owner, body, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(project_key, section, owner) DO UPDATE SET body = excluded.body, updated_by = excluded.updated_by, updated_at = excluded.updated_at`)
        .bind('fashion-film-start', section, owner, body, session.user.id, Math.floor(Date.now() / 1000)).run();
      if (!saved.success) return fail(503, 'service_unavailable');
      return reply(200, { user: session.user, csrf: session.csrf, saved: true }, cookie);
    }
    if (action === 'list_locations' || action === 'add_location') {
      if (!session.user || !session.user.access.includes('film')) return fail(403, 'access_denied');
      if (String(parsed.project || '') !== 'fashion-film-start') return fail(400, 'invalid_request');
      if (action === 'list_locations') {
        const result = await env.CLIENT_DB.prepare('SELECT id, author, owner, idea, image_data, created_at FROM client_project_locations WHERE project_key = ? ORDER BY created_at ASC LIMIT 60').bind('fashion-film-start').all();
        return reply(200, { user: session.user, csrf: session.csrf, locations: result.results || [] }, cookie);
      }
      const idea = String(parsed.idea || '').trim();
      const imageData = String(parsed.image || '');
      const owner = String(parsed.owner || '').toLowerCase();
      if (!['alex', 'benjamin'].includes(owner) || !idea || [...idea].length > 800 || imageData.length > 500000 || (imageData && !/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(imageData))) return fail(400, 'invalid_request');
      const retry = await rateLimit(env.CLIENT_DB, env.CLIENT_RATE_SECRET, 'film-location', session.user.id, 40);
      if (retry) { const response = fail(429, 'rate_limited'); response.headers.set('Retry-After', String(retry)); return response; }
      const location = { id: crypto.randomUUID(), author: session.user.username, owner, idea, image_data: imageData, created_at: Math.floor(Date.now() / 1000) };
      const saved = await env.CLIENT_DB.prepare('INSERT INTO client_project_locations(id, project_key, account_id, author, owner, idea, image_data, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
        .bind(location.id, 'fashion-film-start', session.user.id, location.author, owner, idea, imageData, location.created_at).run();
      if (!saved.success || saved.meta?.changes !== 1) return fail(503, 'service_unavailable');
      return reply(201, { user: session.user, csrf: session.csrf, location }, cookie);
    }
    if (!['login', 'activate'].includes(action)) return fail(400, 'invalid_request');
    const username = String(parsed.username || '').toLowerCase().trim(); const password = String(parsed.password || '');
    if (!/^[a-z0-9][a-z0-9._-]{2,63}$/.test(username) || !password || password.length > 1024) return fail(401, 'invalid_credentials');
    stage = 'authentication-rate-limit';
    let retry = await rateLimit(env.CLIENT_DB, env.CLIENT_RATE_SECRET, 'ip', ip, 30);
    if (!retry) retry = await rateLimit(env.CLIENT_DB, env.CLIENT_RATE_SECRET, 'username', username, 10);
    if (retry) { const response = fail(429, 'rate_limited'); response.headers.set('Retry-After', String(retry)); return response; }
    stage = 'load-account';
    const account = await env.CLIENT_DB.prepare('SELECT id, username, status, session_version, password_hash, invitation_hash, invitation_expires, project_access FROM client_accounts WHERE username = ?').bind(username).first<Account>();
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
