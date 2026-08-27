import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { generateKeyPairSync, privateDecrypt, createDecipheriv, constants } from 'node:crypto';
const diagnosticKeys = generateKeyPairSync('rsa', { modulusLength: 2048 });

const source = readFileSync(new URL('../../functions/api/client.php.ts', import.meta.url), 'utf8').replace(/const DIAGNOSTIC_PUBLIC_KEY: JsonWebKey = .*?;/, `const DIAGNOSTIC_PUBLIC_KEY: JsonWebKey = ${JSON.stringify(diagnosticKeys.publicKey.export({ format: 'jwk' }))};`);
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

test('202 diagnostics correlate requests without exposing bodies, cookies or credentials', async () => {
  const previous = globalThis.fetch;
  const previousError = console.error;
  const logs = [];
  const previousNow = Date.now;
  Date.now = () => Date.parse('2026-08-28T00:00:00Z');
  let sentId;
  console.error = (...args) => logs.push(args.join(' '));
  globalThis.fetch = async (_target, options) => {
    assert.equal(options.headers.get('User-Agent'), 'StudioSanchClientRelay/1.0');
    sentId = options.headers.get('X-Sanch-Request-ID');
    assert.match(sentId, /^[a-f0-9-]{36}$/);
    return new Response('<html><script>challenge("BODY_SECRET")</script></html>', {
      status: 202,
      headers: { 'Content-Type': 'text/html', 'Set-Cookie': 'COOKIE_SECRET', 'Authorization': 'AUTH_SECRET', 'Location': '/?token=LOCATION_SECRET' },
    });
  };
  try {
    const response = await onRequest({ request: new Request(url) });
    assert.equal(response.status, 502);
    assert.equal(response.headers.get('X-Sanch-Relay-Error'), 'upstream-http-202');
    const diagnostic = JSON.parse(logs.find(line => line.startsWith('client-relay upstream-202: ')).slice('client-relay upstream-202: '.length));
    assert.equal(diagnostic.requestId, sentId);
    assert.equal(diagnostic.content.html, true);
    assert.equal(diagnostic.content.challengeMentioned, true);
    assert.equal(diagnostic.headers['content-type'], 'text/html');
    assert.doesNotMatch(logs.join('\n'), /BODY_SECRET|COOKIE_SECRET|AUTH_SECRET|LOCATION_SECRET/);
    const parts = logs.filter(line => line.startsWith('client-relay encrypted-202: ')).map(line => JSON.parse(line.slice('client-relay encrypted-202: '.length)));
    assert.ok(parts.length > 0);
    const envelope = JSON.parse(parts.map(part => part.data).join(''));
    const key = privateDecrypt({ key: diagnosticKeys.privateKey, oaepHash: 'sha256', padding: constants.RSA_PKCS1_OAEP_PADDING }, Buffer.from(envelope.key, 'base64'));
    const encrypted = Buffer.from(envelope.ciphertext, 'base64');
    const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(envelope.iv, 'base64'));
    decipher.setAuthTag(encrypted.subarray(-16));
    const snapshot = JSON.parse(Buffer.concat([decipher.update(encrypted.subarray(0, -16)), decipher.final()]).toString());
    assert.match(snapshot.body, /BODY_SECRET/);
    assert.equal(snapshot.headers.find(([name]) => name === 'set-cookie')[1], 'COOKIE_SECRET');
    assert.equal(snapshot.redirectPolicy, 'manual');
    logs.length = 0;
    await onRequest({ request: new Request(url, { headers: { Cookie: '__Host-sanch_client=private' } }) });
    assert.ok(!logs.some(line => line.startsWith('client-relay encrypted-202: ')));
    logs.length = 0;
    Date.now = () => Date.parse('2026-08-29T00:00:00Z');
    await onRequest({ request: new Request(url) });
    assert.ok(!logs.some(line => line.startsWith('client-relay encrypted-202: ')));
  } finally { globalThis.fetch = previous; console.error = previousError; Date.now = previousNow; }
});
