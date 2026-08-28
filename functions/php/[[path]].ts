// Retire legacy PHP routes on Pages, which must never serve subscriber files or PHP source.
export function onRequest(): Response {
  return new Response(JSON.stringify({ success: false, message: 'This service is temporarily unavailable. Please contact contact@studiosanch.com.' }), {
    status: 503,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'" },
  });
}
