/**
 * /sitemap.xml dynamique : pages, intervenants, séries, vidéos et cours publiés.
 */
import { isPublicCourse } from '../../shared/programme.js';
import { videoPath } from '../../shared/catalog.js';
import { getCourses, getSeries, getTeachers, getVideos } from '../lib/data.js';
import { siteUrl } from '../lib/http.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export default async (req) => {
  const site = siteUrl(req);
  const urls = [
    { loc: '/', changefreq: 'daily', priority: '1.0' },
    { loc: '/programme', changefreq: 'daily', priority: '0.9' },
    { loc: '/cours', changefreq: 'daily', priority: '0.9' },
    { loc: '/intervenants', changefreq: 'weekly', priority: '0.7' },
    { loc: '/series', changefreq: 'weekly', priority: '0.7' },
    { loc: '/confidentialite', changefreq: 'yearly', priority: '0.2' },
  ];
  try {
    const [teachers, series, videos, courses] = await Promise.all([getTeachers(), getSeries(), getVideos(), getCourses()]);
    for (const t of teachers.filter((x) => !x.hidden)) urls.push({ loc: `/intervenants/${t.id}`, changefreq: 'weekly', priority: '0.6' });
    for (const s of series.filter((x) => !x.hidden)) urls.push({ loc: `/series/${s.id}`, changefreq: 'weekly', priority: '0.6' });
    for (const v of videos) urls.push({ loc: videoPath(v), lastmod: String(v.publishedAt).slice(0, 10), changefreq: 'monthly', priority: '0.5' });
    const recent = Date.now() - 60 * 86400000;
    for (const c of courses.filter((x) => isPublicCourse(x) && Date.parse(x.start) > recent)) urls.push({ loc: `/programme/${c.id}`, changefreq: 'daily', priority: '0.5' });
  } catch {
    /* le sitemap de base reste servi */
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `  <url><loc>${esc(site + u.loc)}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`)
    .join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' } });
};

export const config = { path: '/sitemap.xml' };
