export type ProjectAccess = 'film' | 'photoshoot' | 'installation' | 'identity';
export interface ClientSession {
  csrf: string;
  user: { id: string; username: string; access: ProjectAccess[] } | null;
  activated?: boolean;
}
export class ClientAuthError extends Error {
  constructor(public code: string) { super(code); }
}
// Cookies stay HttpOnly on the PHP server. Never persist passwords/tokens in browser storage.
export async function clientAuth(body?: Record<string, unknown>, csrf?: string): Promise<ClientSession> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch('/api/client.php', {
      method: body ? 'POST' : 'GET', credentials: 'same-origin', cache: 'no-store',
      headers: body ? { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf || '' } : {},
      body: body ? JSON.stringify(body) : undefined, signal: controller.signal,
    });
    if (!response.headers.get('content-type')?.includes('application/json')) throw new ClientAuthError('service_unavailable');
    const data = await response.json();
    if (!response.ok) throw new ClientAuthError(typeof data.error === 'string' ? data.error : 'service_unavailable');
    if (typeof data.csrf !== 'string' || !/^[a-f0-9]{64}$/.test(data.csrf)) throw new ClientAuthError('service_unavailable');
    return data;
  } catch (error) {
    if (error instanceof ClientAuthError) throw error;
    throw new ClientAuthError('service_unavailable');
  } finally { clearTimeout(timeout); }
}
