import { useEffect } from 'react';

const SITE_NAME = 'LILMOD';
const DEFAULT_DESCRIPTION =
  "LILMOD by Torah MiTzion : cours de Torah en français, en direct d'Israël. Programme de la semaine, replays, intervenants et séries.";

function setMeta(selector: string, attr: string, value: string) {
  const el = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!el) return;
  el.setAttribute(attr, value);
}

/** Titre, description et URL canonique de la page (le serveur les pré-remplit pour les robots). */
export function useSeo(title: string, description: string = DEFAULT_DESCRIPTION) {
  useEffect(() => {
    const full = title ? `${title} – ${SITE_NAME}` : `${SITE_NAME} – La Torah en direct d'Israël`;
    document.title = full;
    const desc = (description || DEFAULT_DESCRIPTION).slice(0, 300);
    const url = `${window.location.origin}${window.location.pathname}`;
    setMeta('meta[name="description"]', 'content', desc);
    setMeta('meta[property="og:title"]', 'content', full);
    setMeta('meta[property="og:description"]', 'content', desc);
    setMeta('meta[property="og:url"]', 'content', url);
    setMeta('meta[name="twitter:title"]', 'content', full);
    setMeta('meta[name="twitter:description"]', 'content', desc);
    setMeta('link[rel="canonical"]', 'href', url);
  }, [title, description]);
}
