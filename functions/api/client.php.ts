const ORIGIN = 'https://studiosanch.com';
const UPSTREAM = 'https://api-origin.studiosanch.com/api/client.php';
const COOKIE = '__Host-sanch_client';

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
  const outgoing = new Headers({ Accept: 'application/json' });
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
  try {
    const upstream = await fetch(UPSTREAM, {
      method: request.method, headers: outgoing, body,
      redirect: 'manual', cache: 'no-store', signal: controller.signal,
    });
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
