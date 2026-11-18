/** Appels à l'API d'administration (cookie de session + en-tête anti-CSRF). */
import { useCallback, useEffect, useState } from 'react';

export class AdminError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function adminApi<T = any>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`/api/admin${path}`, {
    method,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json', 'x-lilmod-admin': '1' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const type = res.headers.get('content-type') || '';
  const data = type.includes('json') ? await res.json() : null;
  if (!res.ok) throw new AdminError(data?.error || `Erreur ${res.status}`, res.status);
  return data as T;
}

/** Charge une ressource d'administration, avec rechargement manuel. */
export function useAdmin<T = any>(path: string | null) {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: string }>({ data: null, loading: Boolean(path), error: '' });
  const load = useCallback(async () => {
    if (!path) return;
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      setState({ data: await adminApi<T>('GET', path), loading: false, error: '' });
    } catch (e: any) {
      setState({ data: null, loading: false, error: e.message });
    }
  }, [path]);
  useEffect(() => {
    load();
  }, [load]);
  return { ...state, reload: load };
}
