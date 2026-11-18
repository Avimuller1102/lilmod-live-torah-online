/**
 * Accès aux données publiques LILMOD (API /api/v1), avec cache mémoire.
 * Une panne de l'API ne casse jamais la page : les composants affichent un état vide.
 */
import { useEffect, useState } from 'react';

export type Teacher = { id: string; name: string; shortName?: string; photo?: string; specialty?: string; bio?: string; hidden?: boolean };
export type Series = { id: string; title: string; teacherId: string; description?: string; match?: string[]; playlistId?: string; hidden?: boolean };
export type Category = { id: string; label: string; count: number };
export type Video = {
  id: string; title: string; publishedAt: string; thumbnail: string; url: string; excerpt?: string; description?: string;
  teacherId: string; seriesId: string; categories: string[]; episode: number | null; featured?: boolean; duration?: string; incomplete?: boolean;
};
export type Course = {
  id: string; title: string; description?: string; teacherId: string; seriesId?: string; category?: string;
  start: string; end?: string; timezone: string; platform: 'zoom' | 'youtube' | 'other'; joinUrl?: string; joinPublic?: boolean;
  status: string; visibility?: string; thumbnail?: string; replayUrl?: string; pdfUrl?: string; organizer?: string;
};
export type Catalog = { teachers: Teacher[]; series: Series[]; categories: Category[]; videos: Video[] };
export type Programme = { from: string; to: string; courses: Course[]; teachers: Teacher[]; series: Series[] };
export type PublicSettings = { whatsappGroupUrl: string; newsletterSignupUrl: string; donateUrl: string; contactEmail: string };

const cache = new Map<string, Promise<unknown>>();

export function getJSON<T>(url: string, { fresh = false } = {}): Promise<T> {
  if (fresh || !cache.has(url)) {
    const p = fetch(url, { headers: { Accept: 'application/json' } }).then(async (res) => {
      if (!res.ok || !(res.headers.get('content-type') || '').includes('json')) {
        cache.delete(url);
        throw new Error(`HTTP ${res.status}`);
      }
      return res.json();
    });
    cache.set(url, p);
  }
  return cache.get(url) as Promise<T>;
}

export function useData<T>(url: string | null) {
  const [state, setState] = useState<{ data: T | null; loading: boolean; error: string | null }>({ data: null, loading: Boolean(url), error: null });
  useEffect(() => {
    if (!url) return;
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    getJSON<T>(url)
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((e) => alive && setState({ data: null, loading: false, error: e.message }));
    return () => {
      alive = false;
    };
  }, [url]);
  return state;
}

export const useCatalog = () => useData<Catalog>('/api/v1/catalog');
export const useSettings = () => useData<PublicSettings>('/api/v1/settings');
export const useProgramme = (from?: string, to?: string) =>
  useData<Programme>(`/api/v1/programme${from ? `?from=${from}${to ? `&to=${to}` : ''}` : ''}`);

export const DEFAULT_SETTINGS: PublicSettings = {
  whatsappGroupUrl: 'https://chat.whatsapp.com/KR5PN77WbfvDb4zFgBu3Cl',
  newsletterSignupUrl: 'https://mailchi.mp/4fbd1394a7fd/inscription-feed-lilmod',
  donateUrl: 'https://www.jgive.com/new/en/ils/donation-targets/166202',
  contactEmail: 'aaronbotbol@gmail.com',
};

export function usePublicSettings(): PublicSettings {
  const { data } = useSettings();
  return { ...DEFAULT_SETTINGS, ...(data || {}) };
}

export const teacherById = (teachers: Teacher[] = [], id?: string) => teachers.find((t) => t.id === id);
