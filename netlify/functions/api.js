/**
 * API publique LILMOD (lecture seule).
 *   GET /api/v1/programme?from=YYYY-MM-DD&to=YYYY-MM-DD
 *   GET /api/v1/programme/:id
 *   GET /api/v1/catalog              intervenants, séries, thèmes, vidéos
 *   GET /api/v1/videos/:id
 *   GET /api/v1/settings             liens publics (WhatsApp, newsletter, don)
 *   GET /api/v1/ics/:id              fichier calendrier d'un cours
 * Les brouillons, cours privés, notes internes et liens non publics ne sortent jamais.
 */
import { addDaysToKey, weekOf, zonedTimeToUtc, TZ_ISRAEL } from '../../shared/time.js';
import { isPublicCourse, publicCourse, sortByStart } from '../../shared/programme.js';
import { CATEGORIES, enrichVideo } from '../../shared/catalog.js';
import { courseToIcs } from '../../shared/messages.js';
import { getCourses, getSeries, getSettings, getTeachers, getVideos, upsertVideos } from '../lib/data.js';
import { fetchFeed } from '../lib/youtube.js';
import { readJSON } from '../lib/store.js';
import { error, json, routeParts, siteUrl } from '../lib/http.js';

const CACHE_SHORT = 'public, max-age=60, stale-while-revalidate=300';
const CACHE_MEDIUM = 'public, max-age=300, stale-while-revalidate=3600';
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const publicTeacher = ({ aliases, ...t }) => t;

async function programme(url) {
  const week = weekOf(new Date());
  const from = DATE_RE.test(url.searchParams.get('from') || '') ? url.searchParams.get('from') : week.start;
  const to = DATE_RE.test(url.searchParams.get('to') || '') ? url.searchParams.get('to') : addDaysToKey(week.start, 13);
  const fromMs = zonedTimeToUtc(from, '00:00', TZ_ISRAEL).getTime();
  const toMs = zonedTimeToUtc(addDaysToKey(to, 1), '00:00', TZ_ISRAEL).getTime();
  if (toMs - fromMs > 120 * 86400000) return error('Période trop longue (120 jours maximum).');
  const [courses, teachers, series] = await Promise.all([getCourses(), getTeachers(), getSeries()]);
  const list = sortByStart(courses.filter((c) => isPublicCourse(c) && Date.parse(c.start) >= fromMs && Date.parse(c.start) < toMs)).map(publicCourse);
  return json(
    { from, to, courses: list, teachers: teachers.filter((t) => !t.hidden).map(publicTeacher), series: series.filter((s) => !s.hidden), generatedAt: new Date().toISOString() },
    { cache: CACHE_SHORT },
  );
}

async function catalog() {
  let videos = await getVideos();
  if (!videos.length) {
    // Première utilisation : on amorce l'archive avec le flux public (sans bloquer en cas d'échec).
    try {
      await upsertVideos(await fetchFeed());
      videos = await getVideos();
    } catch {
      /* le site reste utilisable sans vidéos */
    }
  }
  const [teachers, series] = await Promise.all([getTeachers(), getSeries()]);
  const slim = videos.map(({ description, ...v }) => ({ ...v, excerpt: String(description || '').slice(0, 220) }));
  const usedCategories = CATEGORIES.filter((c) => videos.some((v) => v.categories.includes(c.id))).map((c) => ({
    id: c.id,
    label: c.label,
    count: videos.filter((v) => v.categories.includes(c.id)).length,
  }));
  return json(
    {
      teachers: teachers.filter((t) => !t.hidden).map(publicTeacher),
      series: series.filter((s) => !s.hidden),
      categories: usedCategories,
      videos: slim,
      generatedAt: new Date().toISOString(),
    },
    { cache: CACHE_MEDIUM },
  );
}

export default async (req) => {
  if (req.method !== 'GET') return error('Méthode non autorisée.', 405);
  const url = new URL(req.url);
  const [resource, id] = routeParts(req, '/api/v1');
  try {
    if (resource === 'programme' && !id) return await programme(url);
    if (resource === 'programme' && id) {
      const course = (await getCourses()).find((c) => c.id === id);
      if (!course || !isPublicCourse(course)) return error('Cours introuvable.', 404);
      const teachers = await getTeachers();
      return json({ course: publicCourse(course), teacher: publicTeacher(teachers.find((t) => t.id === course.teacherId) || { id: '' }) }, { cache: CACHE_SHORT });
    }
    if (resource === 'catalog') return await catalog();
    if (resource === 'videos' && id) {
      const videos = await getVideos();
      const video = videos.find((v) => v.id === id);
      if (!video) return error('Vidéo introuvable.', 404);
      return json({ video }, { cache: CACHE_MEDIUM });
    }
    if (resource === 'settings') {
      const s = await getSettings();
      return json(
        { whatsappGroupUrl: s.whatsappGroupUrl, newsletterSignupUrl: s.newsletterSignupUrl, donateUrl: s.donateUrl, contactEmail: s.contactEmail },
        { cache: CACHE_MEDIUM },
      );
    }
    if (resource === 'media' && id) {
      const media = await readJSON(`media-${id.replace(/[^a-z0-9_-]/gi, '')}`, null);
      if (!media) return error('Image introuvable.', 404);
      return new Response(Buffer.from(media.data, 'base64'), {
        headers: { 'Content-Type': media.type, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' },
      });
    }
    if (resource === 'ics' && id) {
      const course = (await getCourses()).find((c) => c.id === id);
      if (!course || !isPublicCourse(course)) return error('Cours introuvable.', 404);
      const teacher = (await getTeachers()).find((t) => t.id === course.teacherId)?.name || '';
      return new Response(courseToIcs(publicCourse(course), { siteUrl: siteUrl(req), teacher }), {
        headers: {
          'Content-Type': 'text/calendar; charset=utf-8',
          'Content-Disposition': `attachment; filename="lilmod-${id.replace(/[^a-z0-9_-]/gi, '')}.ics"`,
          'Cache-Control': CACHE_SHORT,
        },
      });
    }
    return error('Ressource introuvable.', 404);
  } catch (err) {
    console.error(err);
    return error('Service momentanément indisponible.', 503);
  }
};

export const config = { path: '/api/v1/*' };

// Pour les tests
export { enrichVideo };
