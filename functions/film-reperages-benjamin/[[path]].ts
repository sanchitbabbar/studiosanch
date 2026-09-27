import { isFilmClientAuthorized } from '../api/client.php';

type Context = {
  request: Request;
  env: { CLIENT_DB: Parameters<typeof isFilmClientAuthorized>[1] };
  next: () => Promise<Response>;
};

export async function onRequest(context: Context): Promise<Response> {
  if (context.request.method !== 'GET' && context.request.method !== 'HEAD') {
    return new Response('Method not allowed', { status: 405 });
  }
  if (!(await isFilmClientAuthorized(context.request, context.env.CLIENT_DB))) {
    return new Response('Access denied', { status: 403, headers: { 'Cache-Control': 'no-store' } });
  }
  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'private, no-store');
  headers.set('X-Content-Type-Options', 'nosniff');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
