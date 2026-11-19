export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

export function json(data, { status = 200, headers = {}, cache = 'no-store' } = {}) {
  // Réponses publiques : partagées par le cache « durable » du CDN Netlify,
  // pour limiter les exécutions de fonctions (et donc les crédits consommés).
  const cdn = cache.startsWith('public') ? { 'Netlify-CDN-Cache-Control': `${cache}, durable` } : {};
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache, ...cdn, ...SECURITY_HEADERS, ...headers },
  });
}

export function error(message, status = 400, extra = {}) {
  return json({ error: message, ...extra }, { status });
}

export async function readBody(req, maxBytes = 3_000_000) {
  const text = await req.text();
  if (text.length > maxBytes) throw Object.assign(new Error('Requête trop volumineuse.'), { status: 413 });
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw Object.assign(new Error('JSON invalide.'), { status: 400 });
  }
}

export function siteUrl(req) {
  const env = (process.env.URL || '').replace(/\/$/, '');
  if (env) return env;
  try {
    return new URL(req.url).origin;
  } catch {
    return 'https://lilmod.fr';
  }
}

/** Chemin de l'API sans le préfixe, ex. "/api/admin/courses/abc" -> ["courses","abc"] */
export function routeParts(req, prefix) {
  const { pathname } = new URL(req.url);
  return pathname.replace(prefix, '').split('/').filter(Boolean).map(decodeURIComponent);
}
