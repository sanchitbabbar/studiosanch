import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../../functions/api/client.php.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText;
const { onRequest } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const url = 'https://studiosanch.com/api/client.php';
const csrf = 'a'.repeat(64);
const postHeaders = { Origin: 'https://studiosanch.com', 'Content-Type': 'application/json', 'X-CSRF-Token': csrf };

test('rejects preview hosts, cross-origin posts, methods, invalid CSRF and oversized bodies before upstream', async () => {
  const previous = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('Must not fetch'); };
  try {
    for (const [request, status] of [
      [new Request('https://preview.pages.dev/api/client.php'), 403],
      [new Request(url, { method: 'DELETE' }), 405],
      [new Request(url, { method: 'POST', headers: { ...postHeaders, Origin: 'https://evil.test' } }), 403],
      [new Request(url, { method: 'POST', headers: { ...postHeaders, 'X-CSRF-Token': 'bad' } }), 403],
      [new Request(url, { method: 'POST', headers: postHeaders, body: 'x'.repeat(8193) }), 413],
    ]) assert.equal((await onRequest({ request })).status, status);
  } finally { globalThis.fetch = previous; }
});

test('forwards only session/auth headers to fixed HTTPS origin and preserves secure cookie', async () => {
  const previous = globalThis.fetch;
  const cookie = '__Host-sanch_client=session; path=/; secure; HttpOnly; SameSite=Strict';
  globalThis.fetch = async (target, options) => {
    assert.equal(target, 'https://api-origin.studiosanch.com/api/client.php');
    assert.equal(options.redirect, 'manual');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.headers.get('Cookie'), '__Host-sanch_client=session');
    assert.equal(options.headers.get('X-Forwarded-For'), null);
    assert.equal(options.headers.get('Authorization'), null);
    assert.equal(options.headers.get('X-CSRF-Token'), csrf);
    assert.equal(new TextDecoder().decode(options.body), '{"action":"logout"}');
    return new Response(JSON.stringify({ user: null, csrf }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': cookie } });
  };
  try {
    const response = await onRequest({ request: new Request(url + '?upstream=evil', {
      method: 'POST', headers: { ...postHeaders, Cookie: 'analytics=private; __Host-sanch_client=session', Authorization: 'secret', 'X-Forwarded-For': 'spoof' }, body: '{"action":"logout"}',
    }) });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('Set-Cookie'), cookie);
    assert.match(response.headers.get('Cache-Control'), /no-store/);
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), null);
  } finally { globalThis.fetch = previous; }
});

test('fails closed for redirects, HTML, broken JSON and connection errors', async () => {
  const previous = globalThis.fetch;
  try {
    for (const reply of [
      () => new Response(null, { status: 302, headers: { Location: 'https://evil.test' } }),
      () => new Response('upstream private error', { headers: { 'Content-Type': 'text/html' } }),
      () => new Response('broken', { headers: { 'Content-Type': 'application/json' } }),
      () => { throw new Error('private connection details'); },
    ]) {
      globalThis.fetch = async () => reply();
      const response = await onRequest({ request: new Request(url) });
      assert.equal(response.status, 502);
      assert.deepEqual(await response.json(), { error: 'service_unavailable' });
    }
  } finally { globalThis.fetch = previous; }
});
