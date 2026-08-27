const ORIGIN = 'https://studiosanch.com';
const UPSTREAM = 'https://api-origin.studiosanch.com/api/client.php';
const COOKIE = '__Host-sanch_client';
const RELAY_AGENT = 'StudioSanchClientRelay/1.0';

// Temporary diagnostic: only anonymous GET failures, encrypted before logging.
// The private key is kept locally, never deployed. Remove after investigation.
const DIAGNOSTIC_PUBLIC_KEY: JsonWebKey = {"kty":"RSA","n":"qHRboQx5T2zBmRgw8jpWx_b-8OBBPapEEKBcP2iK147BiBNsXBa-or_LFmapFpWCz1PI0_heyVE3y6SP8siOGI60Y94WdmH3aP5vh8vCt932RSu7ijbxIuw9A5UrcPEz1gkdKr0cD9AX7NSpiZhXhuieaVbe7jgA4xzaBdSBhWDqn1vLFq_vtXGLVYH1x7KuyWF67e334e__W9dIFhJOJiQ2Ty19xHjKXP3nIMEziyyDgXrSDAHdMs-IfB9ugv9jOpqGfMZpulalrWG6FFgNkasqoU8OtJnVxfVKC8_MK2bzXa9whJ5gnNbYWi6c-h0ck00d0Sr5dhdqeHE12lRW5w","e":"AQAB"};
async function encryptedSnapshot(response: Response, bytes: ArrayBuffer, requestId: string): Promise<void> {
  if (Date.now() >= Date.parse('2026-08-29T00:00:00Z')) return;
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const publicKey = await crypto.subtle.importKey('jwk', DIAGNOSTIC_PUBLIC_KEY, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
  const wrapped = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, await crypto.subtle.exportKey('raw', key));
  const payload = JSON.stringify({ requestId, capturedAt: new Date().toISOString(), requestedUrl: UPSTREAM,
    responseUrl: response.url, redirected: response.redirected, redirectPolicy: 'manual', status: response.status,
    headers: Array.from(response.headers.entries()), body: new TextDecoder().decode(bytes) });
  if (payload.length > 100000) return;
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(payload));
  const base64 = (value: ArrayBuffer | Uint8Array) => btoa(Array.from(new Uint8Array(value instanceof Uint8Array ? value.buffer : value), b => String.fromCharCode(b)).join(''));
  const envelope = JSON.stringify({ iv: base64(iv), key: base64(wrapped), ciphertext: base64(ciphertext) });
  const count = Math.ceil(envelope.length / 3000);
  for (let i = 0; i < count; i++) console.error('client-relay encrypted-202:', JSON.stringify({ requestId, part: i + 1, count, data: envelope.slice(i * 3000, (i + 1) * 3000) }));
}

async function diagnoseAccepted(response: Response, requestId: string, startedAt: string, anonymousGet: boolean): Promise<void> {
  // Deliberately not a raw dump: challenge bodies and cookies may contain secrets.
  const technicalHeaders: Record<string, string> = {};
  for (const name of ['date', 'content-type', 'content-length', 'server', 'cf-ray', 'x-request-id']) {
    const value = response.headers.get(name);
    if (value && value.length <= 160 && /^[a-zA-Z0-9 .,:;/=_+-]+$/.test(value)) technicalHeaders[name] = value;
  }
  let content: Record<string, unknown> = { read: 'unavailable' };
  try {
    const bytes = await limitedBody(response.body, 65536);
    if (anonymousGet) {
      try { await encryptedSnapshot(response, bytes, requestId); } catch { /* Diagnostics must not affect authentication. */ }
    }
    const text = new TextDecoder().decode(bytes);
    content = {
      read: 'complete', bytes: bytes.byteLength,
      html: /<!doctype html|<html[\s>]/i.test(text),
      javascript: /<script[\s>]/i.test(text),
      challengeMentioned: /captcha|challenge|checking your browser|verify you are human/i.test(text),
    };
  } catch { /* Keep the original upstream status, even when its body cannot be read. */ }
  console.error('client-relay upstream-202:', JSON.stringify({
    startedAt, receivedAt: new Date().toISOString(), requestId,
    upstream: UPSTREAM, userAgent: RELAY_AGENT, headers: technicalHeaders, content,
    sourceIp: 'not available to the relay',
  }));
}

function headers(): Headers {
  return new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store, private, max-age=0',
    'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'no-referrer',
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  });
}

function error(status: number, code: string): Response {
  return new Response(JSON.stringify({ error: code }), { status, headers: headers() });
}

function relayError(reason: string): Response {
  console.error('client-relay failure:', reason);
  const response = error(502, 'service_unavailable');
  // Only static categories or HTTP status codes; never upstream content or exception messages.
  response.headers.set('X-Sanch-Relay-Error', reason);
  return response;
}

async function limitedBody(stream: ReadableStream<Uint8Array> | null, max: number): Promise<ArrayBuffer> {
  if (!stream) return new ArrayBuffer(0);
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > max) {
        await reader.cancel();
        throw new Error('Body limit');
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return bytes.buffer;
}

// A fixed upstream: neither the URL nor request headers can choose another server.
export async function onRequest({ request }: { request: Request }): Promise<Response> {
  const url = new URL(request.url);
  // Preview deployments must not authenticate against the production database.
  if (url.origin !== ORIGIN) return error(403, 'request_rejected');
  if (url.pathname !== '/api/client.php') return error(404, 'not_found');
  if (!['GET', 'POST'].includes(request.method)) {
    const response = error(405, 'invalid_request');
    response.headers.set('Allow', 'GET, POST');
    return response;
  }
  if (request.headers.get('Sec-Fetch-Site') === 'cross-site') return error(403, 'request_rejected');
  let body: ArrayBuffer | undefined;
  const requestId = crypto.randomUUID();
  const outgoing = new Headers({ Accept: 'application/json', 'User-Agent': RELAY_AGENT, 'X-Sanch-Request-ID': requestId });
  const cookie = (request.headers.get('Cookie') || '').split(';').map(s => s.trim())
    .find(s => s.startsWith(`${COOKIE}=`));
  if (cookie) outgoing.set('Cookie', cookie);
  if (request.method === 'POST') {
    if (request.headers.get('Origin') !== ORIGIN) return error(403, 'request_rejected');
    const csrf = request.headers.get('X-CSRF-Token') || '';
    if (!/^[a-f0-9]{64}$/.test(csrf)) return error(403, 'request_rejected');
    if (request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'application/json') {
      return error(415, 'invalid_request');
    }
    try { body = await limitedBody(request.body, 8192); }
    catch { return error(413, 'invalid_request'); }
    outgoing.set('Origin', ORIGIN);
    outgoing.set('Content-Type', 'application/json');
    outgoing.set('X-CSRF-Token', csrf);
  }
  // Do not forward X-Forwarded-For or trust caller-provided client-IP headers.
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  let stage = 'connection';
  const startedAt = new Date().toISOString();
  try {
    const upstream = await fetch(UPSTREAM, {
      method: request.method, headers: outgoing, body,
      redirect: 'manual', cache: 'no-store', signal: controller.signal,
    });
    if (upstream.status === 202) {
      await diagnoseAccepted(upstream, requestId, startedAt, request.method === 'GET' && !cookie);
      return relayError('upstream-http-202');
    }
    if (![200, 400, 401, 403, 405, 413, 415, 429, 503].includes(upstream.status) ||
        upstream.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') {
      await upstream.body?.cancel();
      return relayError(`upstream-http-${upstream.status}`);
    }
    stage = 'response-body';
    const bytes = await limitedBody(upstream.body, 16384);
    stage = 'response-json';
    JSON.parse(new TextDecoder().decode(bytes));
    stage = 'response-headers';
    const responseHeaders = headers();
    // PHP sets one host-only session cookie. Keep its Secure/HttpOnly/SameSite flags.
    const setCookie = upstream.headers.get('Set-Cookie');
    if (setCookie?.startsWith(`${COOKIE}=`) && !/;\s*domain=/i.test(setCookie) &&
        /;\s*secure(?:;|$)/i.test(setCookie) && /;\s*httponly(?:;|$)/i.test(setCookie) &&
        /;\s*path=\/(?:;|$)/i.test(setCookie) && /;\s*samesite=strict(?:;|$)/i.test(setCookie)) {
      responseHeaders.set('Set-Cookie', setCookie);
    }
    const retry = upstream.headers.get('Retry-After');
    if (upstream.status === 429 && retry && /^\d{1,5}$/.test(retry)) responseHeaders.set('Retry-After', retry);
    return new Response(bytes, { status: upstream.status, headers: responseHeaders });
  } catch {
    // Never log credentials, cookies, tokens, or upstream error details.
    return relayError(controller.signal.aborted ? 'timeout' : stage);
  } finally {
    clearTimeout(timeout);
  }
}
