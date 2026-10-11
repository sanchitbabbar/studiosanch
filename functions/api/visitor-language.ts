// Country is supplied by Cloudflare, never by an untrusted request header.
export function onRequestGet({ request }: { request: Request & { cf?: { country?: string } } }): Response {
  return Response.json({ language: request.cf?.country === 'FR' ? 'fr' : 'en' }, {
    headers: { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' },
  });
}
