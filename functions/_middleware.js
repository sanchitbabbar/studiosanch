// Apply protection to Functions too: Pages _headers covers static assets only.
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Content-Security-Policy': "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; upgrade-insecure-requests",
  'Strict-Transport-Security': 'max-age=31536000',
};
export async function onRequest(context) {
  const { request } = context;
  let path;
  try { path = decodeURIComponent(new URL(request.url).pathname); }
  catch { return new Response('Bad request', { status: 400, headers: SECURITY_HEADERS }); }
  const blocked = path.split('/').some(part => part.startsWith('.') && part !== '.well-known')
    || /\.(?:env|sql|sqlite(?:3)?|db|pem|key|bak|backup|log|map)$/i.test(path)
    || /^\/(?:backend|node_modules|scripts|security|admin|preview-receipt)(?:\/|$)/i.test(path)
    || /^\/(?:subscribers|emails)\.txt$/i.test(path);
  if (blocked || (/\.php(?:\/|$)/i.test(path) && path !== '/api/client.php')) {
    return new Response('Not found', { status: 404, headers: { ...SECURITY_HEADERS, 'Cache-Control': 'no-store' } });
  }
  if (!['GET', 'HEAD'].includes(request.method)) {
    if (!path.startsWith('/api/')) return new Response('Method not allowed', { status: 405, headers: { ...SECURITY_HEADERS, Allow: 'GET, HEAD', 'Cache-Control': 'no-store' } });
    const origin = request.headers.get('Origin');
    const own = new URL(request.url).origin;
    const allowedOrigins = [own, own.replace('://www.', '://'), own.replace('://', '://www.')];
    if (origin && !allowedOrigins.includes(origin)) return new Response('Forbidden', { status: 403, headers: SECURITY_HEADERS });
    if (request.headers.get('Sec-Fetch-Site') === 'cross-site') return new Response('Forbidden', { status: 403, headers: SECURITY_HEADERS });
    const length = request.headers.get('Content-Length');
    if (length && (!/^\d+$/.test(length) || Number(length) > 2000000)) return new Response('Payload too large', { status: 413, headers: SECURITY_HEADERS });
  }
  const original = await context.next();
  const response = new Response(original.body, original);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!response.headers.has(key)) response.headers.set(key, value);
  }
  response.headers.delete('X-Powered-By');
  if (path.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.delete('Access-Control-Allow-Origin');
  }
  return response;
}
