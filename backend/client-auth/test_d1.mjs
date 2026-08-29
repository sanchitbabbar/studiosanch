import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { createHash } from 'node:crypto';
const source = readFileSync(new URL('../../functions/api/client.php.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { onRequest } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const url = 'https://studiosanch.com/api/client.php';
const secret = 'test-rate-secret-that-is-longer-than-32-bytes';

class Statement {
  constructor(db, sql) { this.db = db; this.sql = sql.replace(/\s+/g, ' ').trim(); this.values = []; }
  bind(...values) { this.values = values; return this; }
  async first() {
    if (this.sql.startsWith('SELECT s.csrf')) {
      const session = this.db.sessions.get(this.values[0]); if (!session) return null;
      const account = session.account_id ? this.db.accounts.get(session.account_id) : null;
      return { ...session, user_id: account?.id, username: account?.username, project_access: account?.project_access, status: account?.status, current_version: account?.session_version };
    }
    if (this.sql.startsWith('SELECT attempts')) return this.db.limits.get(this.values[0]) || null;
    if (this.sql.startsWith('SELECT id, username')) return [...this.db.accounts.values()].find(a => a.username === this.values[0]) || null;
    throw new Error(`Unhandled first: ${this.sql}`);
  }
  async run() {
    if (this.sql.startsWith('INSERT INTO client_sessions')) {
      const [token_hash, csrf, ...rest] = this.values;
      const [account_id, session_version, created_at, last_seen, expires_at] = rest.length === 3 ? [null, null, ...rest] : rest;
      this.db.sessions.set(token_hash, { token_hash, csrf, account_id, session_version, created_at, last_seen, expires_at }); return { success: true, meta: { changes: 1 } };
    }
    if (this.sql.startsWith('UPDATE client_sessions SET last_seen')) { const row = this.db.sessions.get(this.values[1]); if (row) row.last_seen = this.values[0]; return { success: true, meta: { changes: row ? 1 : 0 } }; }
    if (this.sql.startsWith('DELETE FROM client_sessions')) { const changed = this.db.sessions.delete(this.values[0]); return { success: true, meta: { changes: changed ? 1 : 0 } }; }
    if (this.sql.startsWith('INSERT INTO client_auth_limits')) {
      const [bucket, expiry, now] = this.values; const old = this.db.limits.get(bucket);
      this.db.limits.set(bucket, !old || old.expires_at <= now ? { attempts: 1, expires_at: expiry } : { attempts: old.attempts + 1, expires_at: old.expires_at }); return { success: true, meta: { changes: 1 } };
    }
    if (this.sql.startsWith('UPDATE client_accounts SET password_hash')) {
      const [password_hash, id, invitation_hash, now] = this.values; const account = this.db.accounts.get(id);
      if (!account || account.invitation_hash !== invitation_hash || account.invitation_expires <= now || account.status === 'disabled') return { success: true, meta: { changes: 0 } };
      Object.assign(account, { password_hash, status: 'active', session_version: account.session_version + 1, invitation_hash: null, invitation_expires: null }); return { success: true, meta: { changes: 1 } };
    }
    throw new Error(`Unhandled run: ${this.sql}`);
  }
}
class Database {
  constructor() { this.accounts = new Map(); this.sessions = new Map(); this.limits = new Map(); }
  prepare(sql) { return new Statement(this, sql); }
  async batch(statements) { const out=[]; for (const statement of statements) out.push(await statement.run()); return out; }
}
const envFor = db => ({ CLIENT_DB: db, CLIENT_RATE_SECRET: secret });
const cookieFrom = response => response.headers.get('set-cookie').match(/__Host-sanch_client=([a-f0-9]{64})/)[1];
const post = (cookie, csrf, body, extra = {}) => new Request(url, { method: 'POST', headers: { Origin: 'https://studiosanch.com', 'Content-Type': 'application/json', 'X-CSRF-Token': csrf, Cookie: `__Host-sanch_client=${cookie}`, 'CF-Connecting-IP': '203.0.113.4', ...extra }, body: JSON.stringify(body) });

test('fails closed without D1 binding and on preview host', async () => {
  assert.equal((await onRequest({ request: new Request(url), env: {} })).status, 503);
  assert.equal((await onRequest({ request: new Request('https://preview.pages.dev/api/client.php'), env: envFor(new Database()) })).status, 403);
});

test('creates secure session and rejects invalid origin and CSRF', async () => {
  const db = new Database(); const initial = await onRequest({ request: new Request(url), env: envFor(db) });
  assert.equal(initial.status, 200); assert.match(initial.headers.get('set-cookie'), /Secure; HttpOnly; SameSite=Strict/);
  const data = await initial.json(); const cookie = cookieFrom(initial);
  assert.equal((await onRequest({ request: post(cookie, '0'.repeat(64), { action: 'logout' }), env: envFor(db) })).status, 403);
  assert.equal((await onRequest({ request: post(cookie, data.csrf, { action: 'logout' }, { Origin: 'https://evil.test' }), env: envFor(db) })).status, 403);
});

test('invitation activation, login and logout work end to end', async () => {
  const db = new Database(); const token = 'b'.repeat(64); const now = Math.floor(Date.now()/1000);
  db.accounts.set('account-1', { id: 'account-1', username: 'test.client', project_access: 'photoshoot', status: 'invited', session_version: 1, password_hash: null, invitation_hash: createHash('sha256').update(token).digest('hex'), invitation_expires: now + 3600 });
  const start = await onRequest({ request: new Request(url), env: envFor(db) }); const startData = await start.json();
  const activation = await onRequest({ request: post(cookieFrom(start), startData.csrf, { action: 'activate', username: 'test.client', password: 'correct horse battery staple', token }), env: envFor(db) });
  assert.equal(activation.status, 200); assert.equal((await activation.clone().json()).activated, true);
  const activated = await activation.json(); const activationCookie = cookieFrom(activation);
  const wrong = await onRequest({ request: post(activationCookie, activated.csrf, { action: 'login', username: 'test.client', password: 'wrong password' }), env: envFor(db) }); assert.equal(wrong.status, 401);
  const login = await onRequest({ request: post(activationCookie, activated.csrf, { action: 'login', username: 'test.client', password: 'correct horse battery staple' }), env: envFor(db) });
  assert.equal(login.status, 200); const loginData = await login.json(); assert.deepEqual(loginData.user, { id: 'account-1', username: 'test.client', access: ['photoshoot'] });
  const logout = await onRequest({ request: post(cookieFrom(login), loginData.csrf, { action: 'logout' }), env: envFor(db) });
  assert.equal(logout.status, 200); assert.equal((await logout.json()).user, null);
});
