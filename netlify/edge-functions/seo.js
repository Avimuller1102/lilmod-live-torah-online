/**
 * Edge function SEO : pré-remplit, côté serveur, le titre, la description,
 * l'URL canonique, l'image de partage et les données structurées de chaque page.
 * Ainsi Google, WhatsApp, Facebook… voient le bon contenu sans exécuter JavaScript.
 * En cas d'erreur, la page est servie telle quelle (le site ne dépend pas de cette fonction).
 */
const SITE_NAME = 'LILMOD';
const DEFAULT_DESC =
  "LILMOD by Torah MiTzion : cours de Torah en français, en direct d'Israël. Programme de la semaine, replays, intervenants et séries.";

const STATIC = {
  '/': { title: "LILMOD – La Torah en direct d'Israël", description: DEFAULT_DESC },
  '/programme': { title: 'Programme de la semaine – LILMOD', description: "Les cours de Torah LILMOD de la semaine : horaires à l'heure de France et d'Israël, liens pour rejoindre les cours en direct." },
  '/cours': { title: 'Cours en replay – LILMOD', description: 'Bibliothèque des cours de Torah LILMOD en replay : recherche par titre, enseignant, thème et série.' },
  '/intervenants': { title: 'Nos intervenants – LILMOD', description: 'Les Rabbanim et enseignants de LILMOD : leurs cours en direct, leurs séries et leurs replays.' },
  '/series': { title: 'Séries de cours – LILMOD', description: "Les séries d'enseignements LILMOD : suivez un cours épisode après épisode." },
  '/recherche': { title: 'Recherche – LILMOD', description: DEFAULT_DESC, noindex: true },
  '/confidentialite': { title: 'Politique de confidentialité – LILMOD', description: 'Comment LILMOD utilise vos données.' },
};

const escAttr = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const escText = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
const clip = (s, n = 200) => (String(s || '').length > n ? `${String(s).slice(0, n - 1).trim()}…` : String(s || ''));

let catalogCache = { at: 0, data: null };
async function catalog(origin) {
  if (catalogCache.data && Date.now() - catalogCache.at < 5 * 60_000) return catalogCache.data;
  const res = await fetch(`${origin}/api/v1/catalog`);
  if (!res.ok) throw new Error('catalogue indisponible');
  catalogCache = { at: Date.now(), data: await res.json() };
  return catalogCache.data;
}

async function routeMeta(url) {
  const path = url.pathname.replace(/\/+$/, '') || '/';
  if (STATIC[path]) return { ...STATIC[path], found: true };
  const parts = path.split('/').filter(Boolean).map(decodeURIComponent);
  const origin = url.origin;

  if (parts[0] === 'programme' && parts[1]) {
    const res = await fetch(`${origin}/api/v1/programme/${encodeURIComponent(parts[1])}`);
    if (!res.ok) return { found: false };
    const { course, teacher } = await res.json();
    const when = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' }).format(new Date(course.start));
    return {
      found: true,
      title: `${course.title} – LILMOD`,
      description: clip(`${when} (heure de France)${teacher?.name ? ` avec ${teacher.name}` : ''}. ${course.description || 'Cours de Torah en direct.'}`),
      image: teacher?.photo,
      jsonld: {
        '@context': 'https://schema.org',
        '@type': 'EducationEvent',
        name: course.title,
        description: course.description || undefined,
        startDate: course.start,
        endDate: course.end || undefined,
        eventStatus: course.status === 'cancelled' ? 'https://schema.org/EventCancelled' : 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
        location: { '@type': 'VirtualLocation', url: `${origin}/programme/${course.id}` },
        organizer: { '@type': 'Organization', name: 'LILMOD', url: origin },
        performer: teacher?.name ? { '@type': 'Person', name: teacher.name } : undefined,
        isAccessibleForFree: true,
        inLanguage: 'fr',
      },
    };
  }

  const data = await catalog(origin);
  if (parts[0] === 'cours' && parts[1]) {
    const v = data.videos.find((x) => x.id === parts[1]);
    if (!v) return { found: false };
    const t = data.teachers.find((x) => x.id === v.teacherId);
    return {
      found: true,
      title: `${v.title} – LILMOD`,
      description: clip(`${t ? `${t.name} — ` : ''}${v.excerpt || v.title}`),
      image: v.thumbnail,
      jsonld: {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: v.title,
        description: v.excerpt || v.title,
        thumbnailUrl: [v.thumbnail],
        uploadDate: v.publishedAt,
        embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
        contentUrl: v.url,
        inLanguage: 'fr',
        author: t ? { '@type': 'Person', name: t.name } : undefined,
        publisher: { '@type': 'Organization', name: 'LILMOD' },
      },
    };
  }
  if (parts[0] === 'intervenants' && parts[1]) {
    const t = data.teachers.find((x) => x.id === parts[1]);
    if (!t) return { found: false };
    return {
      found: true,
      title: `${t.name} – LILMOD`,
      description: clip(`${t.name}${t.specialty ? ` — ${t.specialty}` : ''}. Cours en direct et replays sur LILMOD.`),
      image: t.photo ? `${origin}${t.photo}` : undefined,
      jsonld: { '@context': 'https://schema.org', '@type': 'Person', name: t.name, jobTitle: t.specialty || undefined, image: t.photo ? `${origin}${t.photo}` : undefined, worksFor: { '@type': 'Organization', name: 'LILMOD' } },
    };
  }
  if (parts[0] === 'series' && parts[1]) {
    const s = data.series.find((x) => x.id === parts[1]);
    if (!s) return { found: false };
    const first = data.videos.find((v) => v.seriesId === s.id);
    return { found: true, title: `${s.title} – LILMOD`, description: clip(s.description || `Série de cours ${s.title}.`), image: first?.thumbnail };
  }
  return { found: false };
}

function replaceMeta(html, meta, url) {
  const canonical = `${url.origin}${url.pathname.replace(/\/+$/, '') || '/'}`;
  const image = meta.image ? (meta.image.startsWith('http') ? meta.image : `${url.origin}${meta.image}`) : null;
  let out = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escText(meta.title)}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${escAttr(meta.description)}$2`)
    .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${escAttr(canonical)}$2`)
    .replace(/(<meta\s+property="og:url"\s+content=")[^"]*(")/, `$1${escAttr(canonical)}$2`)
    .replace(/(<meta\s+property="og:title"\s+content=")[^"]*(")/, `$1${escAttr(meta.title)}$2`)
    .replace(/(<meta\s+property="og:description"\s+content=")[^"]*(")/, `$1${escAttr(meta.description)}$2`)
    .replace(/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, `$1${escAttr(meta.title)}$2`)
    .replace(/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, `$1${escAttr(meta.description)}$2`);
  if (image) {
    out = out
      .replace(/(<meta\s+property="og:image"\s+content=")[^"]*(")/, `$1${escAttr(image)}$2`)
      .replace(/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/, `$1${escAttr(image)}$2`)
      .replace(/\s*<meta property="og:image:width"[^>]*>\s*<meta property="og:image:height"[^>]*>/, '');
  }
  if (meta.noindex) out = out.replace(/(<meta\s+name="robots"\s+content=")[^"]*(")/, '$1noindex, follow$2');
  if (meta.jsonld) {
    const json = JSON.stringify(meta.jsonld).replace(/</g, '\\u003c');
    out = out.replace('</head>', `<script type="application/ld+json">${json}</script>\n</head>`);
  }
  return out;
}

export default async (request, context) => {
  const url = new URL(request.url);
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (request.method !== 'GET' || !type.includes('text/html')) return response;

  if (url.pathname.startsWith('/admin')) {
    const headers = new Headers(response.headers);
    headers.set('X-Robots-Tag', 'noindex, nofollow');
    return new Response(response.body, { status: response.status, headers });
  }

  const html = await response.text();
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  try {
    const meta = await routeMeta(url);
    if (!meta.found) {
      // Page inconnue : vrai statut 404 pour les moteurs de recherche (l'appli affiche sa page 404).
      const body = replaceMeta(html, { title: `Page introuvable – ${SITE_NAME}`, description: DEFAULT_DESC, noindex: true }, url);
      return new Response(body, { status: 404, headers });
    }
    return new Response(replaceMeta(html, meta, url), { status: response.status, headers });
  } catch {
    // Données indisponibles : on sert la page d'origine, sans modification.
    return new Response(html, { status: response.status, headers });
  }
};

export const config = {
  path: '/*',
  excludedPath: ['/api/*', '/assets/*', '/images/*', '/icons/*', '/.netlify/*', '/sitemap.xml', '/robots.txt', '/favicon.ico', '/site.webmanifest'],
};
