/**
 * Catalogue : intervenants, thèmes, séries, vidéos et recherche tolérante.
 *
 * Les intervenants et séries « de départ » proviennent uniquement de données
 * réelles déjà présentes (ancien site, titres des vidéos YouTube et des
 * épisodes Spotify). Aucune biographie n'est inventée : les présentations
 * existantes sont reprises telles quelles et peuvent être corrigées dans
 * l'administration.
 */
import { slugify } from './programme.js';

/* ------------------------------------------------------------------ */
/* Normalisation et recherche                                          */
/* ------------------------------------------------------------------ */

/** Minuscules, sans accents ni ponctuation, avec variantes de translittération repliées. */
export function fold(value) {
  return ` ${String(value || '')} `
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’'`´]/g, '')
    .replace(/[^a-z0-9֐-׿]+/g, ' ')
    .replace(/sh/g, 'ch')
    .replace(/tz/g, 'ts')
    .replace(/ph/g, 'f')
    .replace(/ou/g, 'u')
    .replace(/y/g, 'i')
    .replace(/ai/g, 'ai')
    .replace(/([a-z])\1+/g, '$1')
    .replace(/h(?= )/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Score de pertinence simple : tous les mots doivent être présents. */
export function matchScore(query, fields) {
  const words = fold(query).split(' ').filter(Boolean);
  if (!words.length) return 0;
  let score = 0;
  for (const word of words) {
    let best = 0;
    for (const [text, weight] of fields) {
      const f = ` ${fold(text)} `;
      if (f.includes(` ${word} `)) best = Math.max(best, 3 * weight);
      else if (f.includes(` ${word}`)) best = Math.max(best, 2 * weight);
      else if (word.length >= 3 && f.includes(word)) best = Math.max(best, 1 * weight);
    }
    if (!best) return 0;
    score += best;
  }
  return score;
}

/* ------------------------------------------------------------------ */
/* Intervenants                                                        */
/* ------------------------------------------------------------------ */

/** Intervenants connus (ancien site + titres réels des vidéos et podcasts). */
export const SEED_TEACHERS = [
  { id: 'akerman', name: 'Rav Menahem Akerman', shortName: 'Rav Akerman', photo: '/images/speakers/akerman.webp', specialty: 'Kol HaTor, Tefila, éthique de la guerre', bio: "Le Rav Menahem Akerman enseigne à l'institut « Machon Lev » et sur LILMOD.", aliases: ['akerman', 'ackerman'] },
  { id: 'assaf', name: 'Ariel Assaf', shortName: 'Ariel Assaf', photo: '/images/speakers/assaf.webp', specialty: 'Histoire juive', bio: '', aliases: ['ariel assaf'] },
  { id: 'ben-ichay', name: 'Rav Yehouda Ben Ichay', shortName: 'Rav Ben Ichay', photo: '/images/speakers/ben-ichay.webp', specialty: 'Paracha de la semaine', bio: '', aliases: ['ben ichay', 'ben ichai', 'ben ishai', 'benichay', 'ben-ichay'] },
  { id: 'ben-shoushan', name: 'Rav Yossef Ben Shoushan', shortName: 'Rav Ben Shoushan', photo: '/images/speakers/ben-shoushan.webp', specialty: 'Pensée du Rav Kook', bio: '', aliases: ['ben shoushan', 'benshoushan', 'ben-shoushan', 'ben chouchan'] },
  { id: 'botshko', name: 'Rav Botshko', shortName: 'Rav Botshko', photo: '/images/speakers/botshko.webp', specialty: 'Philosophie juive', bio: '', aliases: ['botshko', 'botschko'] },
  { id: 'chouraqui', name: 'Rav Chouraqui', shortName: 'Rav Chouraqui', photo: '/images/speakers/chouraqui.webp', specialty: 'Talmud', bio: '', aliases: ['chouraqui'] },
  { id: 'fizson', name: 'Rav Fizson', shortName: 'Rav Fizson', photo: '/images/speakers/fizson.webp', specialty: 'Étude des textes', bio: '', aliases: ['fizson', 'fiszon'] },
  { id: 'spira', name: 'Georges Spira', shortName: 'Georges Spira', photo: '/images/speakers/spira.webp', specialty: 'Philosophie et pensée juive', bio: '', aliases: ['georges spira', 'spira'] },
  { id: 'kling', name: 'Rav Elie Kling', shortName: 'Rav Kling', photo: '/images/speakers/kling.webp', specialty: 'Paracha et enseignement', bio: '', aliases: ['kling'] },
  { id: 'ouziel', name: 'Rav Shlomo Ouziel', shortName: 'Rav Ouziel', photo: '/images/speakers/ouziel.webp', specialty: 'Études talmudiques', bio: '', aliases: ['ouziel'] },
  { id: 'gross', name: 'Dr Michael Gross', shortName: 'Dr Gross', photo: '', specialty: 'Une notion de la Paracha', bio: '', aliases: ['michael gross', 'dr gross'] },
  { id: 'abitbol', name: 'Marc Abitbol', shortName: 'Marc Abitbol', photo: '', specialty: 'Fêtes et pensée juive', bio: '', aliases: ['marc abitbol'] },
];

export function detectTeacherId(title, teachers = SEED_TEACHERS) {
  const f = ` ${fold(title)} `;
  for (const t of teachers) {
    for (const alias of [t.name, ...(t.aliases || [])]) {
      const a = fold(alias);
      if (a && f.includes(` ${a} `)) return t.id;
    }
  }
  return '';
}

/* ------------------------------------------------------------------ */
/* Thèmes                                                              */
/* ------------------------------------------------------------------ */

export const CATEGORIES = [
  { id: 'paracha', label: 'Paracha de la semaine', keywords: ['paracha', 'parachat', 'parasha', 'sidra'] },
  { id: 'rav-kook', label: 'Rav Kook', keywords: ['rav kook', 'orot', 'kook'] },
  { id: 'tefila', label: 'Tefila', keywords: ['tefila', 'amida', 'priere', 'siddur', 'siddour'] },
  { id: 'fetes', label: 'Fêtes juives', keywords: ['roch hachana', 'kippour', 'soukot', 'souccot', 'hanouka', 'pourim', 'pessah', 'chavouot', 'chofar', 'tichri', 'omer'] },
  { id: 'pensee', label: 'Pensée juive', keywords: ['pensee', 'emouna', 'kouzari', 'kuzari', 'maharal', 'philosophie', 'hassidut', 'ashlag', 'kabbale', 'kol hator'] },
  { id: 'israel', label: "Israël et son histoire", keywords: ['israel', 'sionisme', 'histoire', 'alya', 'guerre', 'geula', 'gueoula', '7 octobre', 'jerusalem'] },
  { id: 'tanakh', label: 'Tanakh', keywords: ['tanakh', 'tanach', 'bible', 'prophete', 'nevi', 'tehilim', 'tehillim', 'psaume'] },
  { id: 'talmud', label: 'Talmud et Halakha', keywords: ['talmud', 'guemara', 'michna', 'halakha', 'halacha', 'loi juive'] },
  { id: 'actualite', label: 'Actualité et réflexion', keywords: ['interview', 'actualite', 'reflexion', 'debat'] },
];

export function detectCategories(text) {
  const f = ` ${fold(text)} `;
  return CATEGORIES.filter((c) => c.keywords.some((k) => f.includes(` ${fold(k)}`))).map((c) => c.id);
}

/* ------------------------------------------------------------------ */
/* Séries                                                              */
/* ------------------------------------------------------------------ */

/**
 * Séries de départ, déduites des titres réels publiés sur YouTube.
 * Une vidéo appartient à une série si elle est de l'enseignant indiqué et que
 * son titre contient l'un des mots-clés (ou si elle y est rattachée à la main).
 */
export const SEED_SERIES = [
  { id: 'introduction-a-la-tefila', title: 'Introduction à la Tefila', teacherId: 'akerman', description: 'Série de cours du Rav Menahem Akerman consacrée à la Tefila : la Amida, la prière personnelle et collective.', match: ['tefila', 'amida'], playlistId: '' },
  { id: 'rav-kook-aux-sources-de-sa-pensee', title: 'Rav Kook : aux sources de sa pensée', teacherId: 'ben-shoushan', description: 'Le Rav Yossef Ben Shoushan explore les écrits et la pensée du Rav Kook.', match: ['rav kook', 'orot'], playlistId: '' },
  { id: 'une-notion-de-la-paracha', title: 'Une notion de la Paracha', teacherId: 'gross', description: 'Chaque semaine, le Dr Michael Gross dégage une notion centrale de la Paracha.', match: ['notion de la paracha', 'paracha'], playlistId: '' },
  { id: 'la-paracha-avec-le-rav-ben-ichay', title: 'La Paracha avec le Rav Ben Ichay', teacherId: 'ben-ichay', description: 'Le cours hebdomadaire du Rav Yehouda Ben Ichay sur la Paracha de la semaine.', match: ['paracha', 'parachat'], playlistId: '' },
];

export function videoSeriesId(video, series) {
  if (video.seriesId) return video.seriesId;
  const f = ` ${fold(video.title)} `;
  const found = series.find(
    (s) => s.teacherId && s.teacherId === video.teacherId && (s.match || []).some((k) => f.includes(` ${fold(k)}`)),
  );
  return found?.id || '';
}

export function episodeNumber(title) {
  const m = String(title || '').match(/(?:[ée]pisode|ep\.?|partie|cours)\s*n?°?\s*(\d{1,3})/i);
  return m ? Number(m[1]) : null;
}

/* ------------------------------------------------------------------ */
/* Vidéos                                                              */
/* ------------------------------------------------------------------ */

export function videoPath(video) {
  return `/cours/${encodeURIComponent(video.id)}/${slugify(video.title) || 'video'}`;
}

/** Enrichit une vidéo brute (YouTube) avec intervenant, thèmes et série. */
export function enrichVideo(video, { teachers = SEED_TEACHERS, series = SEED_SERIES } = {}) {
  const teacherId = video.teacherId || detectTeacherId(video.title, teachers);
  const categories = video.categories?.length ? video.categories : detectCategories(`${video.title} ${video.description || ''}`);
  const enriched = { ...video, teacherId, categories };
  enriched.seriesId = videoSeriesId(enriched, series);
  enriched.episode = episodeNumber(video.title);
  enriched.incomplete = !teacherId;
  return enriched;
}

export function searchAll(query, { videos = [], teachers = [], series = [], courses = [] }) {
  const q = String(query || '').trim();
  if (q.length < 2) return { videos: [], teachers: [], series: [], courses: [], themes: [] };
  const tName = (id) => teachers.find((t) => t.id === id)?.name || '';
  const rank = (items, fieldsOf) =>
    items
      .map((item) => ({ item, score: matchScore(q, fieldsOf(item)) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item);
  return {
    teachers: rank(teachers, (t) => [[t.name, 3], [(t.aliases || []).join(' '), 2], [t.specialty, 1]]).slice(0, 6),
    series: rank(series, (s) => [[s.title, 3], [tName(s.teacherId), 2], [s.description, 1]]).slice(0, 6),
    themes: rank(CATEGORIES, (c) => [[c.label, 3], [c.keywords.join(' '), 2]]).slice(0, 4),
    courses: rank(courses, (c) => [[c.title, 3], [tName(c.teacherId), 2], [c.description, 1]]).slice(0, 8),
    videos: rank(videos, (v) => [[v.title, 3], [tName(v.teacherId), 2], [v.description, 1]]).slice(0, 30),
  };
}
