import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const { default: seo } = await import('../netlify/edge-functions/seo.js');
const shell = readFileSync(new URL('../index.html', import.meta.url), 'utf8').replace(/%VITE_SITE_URL%/g, 'https://lilmod.fr');

const catalog = {
  teachers: [{ id: 'akerman', name: 'Rav Menahem Akerman', specialty: 'Tefila', photo: '/images/speakers/akerman.webp' }],
  series: [{ id: 'introduction-a-la-tefila', title: 'Introduction à la Tefila', description: 'Série sur la Tefila.' }],
  videos: [{ id: 'abc123def45', title: 'Tefila : la Amida <épisode 4>', teacherId: 'akerman', seriesId: 'introduction-a-la-tefila', thumbnail: 'https://i.ytimg.com/vi/abc123def45/hqdefault.jpg', publishedAt: '2026-11-14T18:00:00Z', url: 'https://www.youtube.com/watch?v=abc123def45', excerpt: 'Cours' }],
};
let failCatalog = false;
globalThis.fetch = async (url) => {
  const u = String(url);
  if (u.endsWith('/api/v1/catalog')) return failCatalog ? new Response('err', { status: 503 }) : Response.json(catalog);
  if (u.includes('/api/v1/programme/c1')) return Response.json({ course: { id: 'c1', title: 'Paracha Vayetsé', start: '2026-11-22T18:30:00Z', status: 'published' }, teacher: { name: 'Rav Ben Ichay' } });
  return new Response('not found', { status: 404 });
};
const run = async (path) => {
  const res = await seo(new Request(`https://lilmod.fr${path}`), { next: async () => new Response(shell, { headers: { 'content-type': 'text/html; charset=utf-8' } }) });
  return { status: res.status, html: await res.text(), headers: res.headers };
};

test('pages statiques : titre et canonique', async () => {
  const r = await run('/programme');
  assert.equal(r.status, 200);
  assert.match(r.html, /<title>Programme de la semaine – LILMOD<\/title>/);
  assert.match(r.html, /<link rel="canonical" href="https:\/\/lilmod.fr\/programme"/);
});

test('fiche vidéo : titre échappé, image, VideoObject', async () => {
  const r = await run('/cours/abc123def45/tefila');
  assert.match(r.html, /<title>Tefila : la Amida &lt;épisode 4> – LILMOD<\/title>/);
  assert.match(r.html, /og:image" content="https:\/\/i.ytimg.com\/vi\/abc123def45\/hqdefault.jpg"/);
  assert.match(r.html, /"@type":"VideoObject"/);
  assert.doesNotMatch(r.html, /<épisode 4><\/script>/);
});

test('fiche cours : EducationEvent en ligne', async () => {
  const r = await run('/programme/c1');
  assert.match(r.html, /"@type":"EducationEvent"/);
  assert.match(r.html, /OnlineEventAttendanceMode/);
  assert.match(r.html, /name="description"\s+content="[^"]*avec Rav Ben Ichay/);
  assert.match(r.html, /og:description"\s+content="[^"]*avec Rav Ben Ichay/);
});

test('intervenant et série', async () => {
  assert.match((await run('/intervenants/akerman')).html, /"@type":"Person"/);
  assert.match((await run('/series/introduction-a-la-tefila')).html, /<title>Introduction à la Tefila – LILMOD<\/title>/);
});

test('page inconnue : statut 404 et noindex', async () => {
  const r = await run('/nimporte-quoi');
  assert.equal(r.status, 404);
  assert.match(r.html, /noindex/);
  assert.equal((await run('/cours/inexistant/x')).status, 404);
});

test('administration non indexée', async () => {
  const r = await run('/admin/programme');
  assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow');
});

test('données indisponibles : page servie sans modification', async () => {
  failCatalog = true;
  const { default: fresh } = await import('../netlify/edge-functions/seo.js?sans-cache');
  const res = await fresh(new Request('https://lilmod.fr/intervenants/autre'), { next: async () => new Response(shell, { headers: { 'content-type': 'text/html' } }) });
  const r = { status: res.status, html: await res.text() };
  failCatalog = false;
  assert.equal(r.status, 200);
  assert.match(r.html, /<div id="root"><\/div>/);
});
