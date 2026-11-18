/**
 * Moteur du programme LILMOD : statuts, visibilité, récurrences,
 * préparation de la semaine, duplication et contrôles avant publication.
 */
import {
  TZ_ISRAEL,
  SUPPORTED_TIMEZONES,
  addDaysToKey,
  courseEnd,
  localDateKey,
  localTime,
  weekdayOfKey,
  zonedTimeToUtc,
} from './time.js';

export const STATUSES = {
  draft: 'Brouillon',
  scheduled: 'Programmé',
  published: 'Publié',
  cancelled: 'Annulé',
  done: 'Terminé',
  replay: 'Replay disponible',
};

export const PLATFORMS = { zoom: 'Zoom', youtube: 'YouTube', other: 'Autre' };

/** Statuts affichés publiquement (un brouillon ou un cours programmé non publié reste invisible). */
const PUBLIC_STATUSES = new Set(['published', 'cancelled', 'done', 'replay']);

export function isPublicCourse(course) {
  if (!course || course.visibility === 'private') return false;
  if (!PUBLIC_STATUSES.has(course.status)) return false;
  // Un cours annulé n'apparaît que s'il avait déjà été publié (pour prévenir les participants).
  if (course.status === 'cancelled' && !course.publishedAt) return false;
  return Boolean(course.start);
}

/**
 * Version publique d'un cours : retire les notes internes et, si le lien n'est
 * pas déclaré public, le lien de participation (lien Zoom privé, etc.).
 */
export function publicCourse(course) {
  const { notes, ...rest } = course;
  if (!course.joinPublic) delete rest.joinUrl;
  return rest;
}

export function sortByStart(list) {
  return [...list].sort((a, b) => String(a.start).localeCompare(String(b.start)));
}

/** Identifiant lisible et stable. */
export function makeId(prefix = 'c') {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}${rand}`;
}

export function slugify(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/* ------------------------------------------------------------------ */
/* Récurrences                                                         */
/* ------------------------------------------------------------------ */

/**
 * Une règle récurrente produit des occurrences dont l'identifiant est
 * `${rule.id}__${date}`. Une occurrence déjà créée n'est jamais régénérée :
 * la modifier n'affecte donc pas les autres semaines.
 */
export function occurrenceId(ruleId, dateKey) {
  return `${ruleId}__${dateKey}`;
}

export function expandRule(rule, fromKey, toKey) {
  if (!rule || rule.active === false || !rule.time || !Array.isArray(rule.weekdays)) return [];
  const tz = rule.timezone || TZ_ISRAEL;
  const interval = Math.max(1, Number(rule.intervalWeeks) || 1);
  const anchor = rule.startDate || fromKey;
  const anchorWeekStart = addDaysToKey(anchor, -weekdayOfKey(anchor));
  const out = [];
  for (let key = fromKey; key <= toKey; key = addDaysToKey(key, 1)) {
    if (key < anchor) continue;
    if (rule.endDate && key > rule.endDate) break;
    if (!rule.weekdays.includes(weekdayOfKey(key))) continue;
    const weekStart = addDaysToKey(key, -weekdayOfKey(key));
    const weeks = Math.round((Date.parse(weekStart) - Date.parse(anchorWeekStart)) / (7 * 86400000));
    if (weeks % interval !== 0) continue;
    const start = zonedTimeToUtc(key, rule.time, tz);
    const duration = Number(rule.durationMin) || 60;
    out.push({
      id: occurrenceId(rule.id, key),
      recurrenceId: rule.id,
      occurrenceDate: key,
      title: rule.title || '',
      description: rule.description || '',
      teacherId: rule.teacherId || '',
      seriesId: rule.seriesId || '',
      category: rule.category || '',
      start: start.toISOString(),
      end: new Date(start.getTime() + duration * 60000).toISOString(),
      timezone: tz,
      platform: rule.platform || 'zoom',
      joinUrl: rule.joinUrl || '',
      joinPublic: Boolean(rule.joinPublic),
      visibility: rule.visibility || 'public',
      status: 'draft',
      thumbnail: rule.thumbnail || '',
      replayUrl: '',
      pdfUrl: '',
      notes: '',
    });
  }
  return out;
}

/** « Préparer la semaine suivante » : crée les occurrences manquantes en brouillon. */
export function prepareWeekFromRules(rules, existingCourses, weekStartKey) {
  const weekEnd = addDaysToKey(weekStartKey, 6);
  const existing = new Set(existingCourses.map((c) => c.id));
  const created = [];
  for (const rule of rules) {
    for (const occ of expandRule(rule, weekStartKey, weekEnd)) {
      if (!existing.has(occ.id)) created.push(occ);
    }
  }
  return created;
}

/**
 * Duplique une semaine vers une autre : même jour de la semaine, même heure
 * locale (dans le fuseau du cours), statut brouillon, sans replay.
 */
export function duplicateWeek(courses, fromStartKey, toStartKey) {
  const shift = Math.round((Date.parse(toStartKey) - Date.parse(fromStartKey)) / 86400000);
  return courses.map((c) => {
    const tz = c.timezone || TZ_ISRAEL;
    const dayKey = addDaysToKey(localDateKey(c.start, tz), shift);
    const start = zonedTimeToUtc(dayKey, localTime(c.start, tz), tz);
    const durationMs = courseEnd(c).getTime() - new Date(c.start).getTime();
    return {
      ...c,
      id: makeId('c'),
      recurrenceId: '',
      occurrenceDate: dayKey,
      start: start.toISOString(),
      end: new Date(start.getTime() + durationMs).toISOString(),
      status: 'draft',
      replayUrl: '',
      publishedAt: '',
      createdAt: '',
      updatedAt: '',
    };
  });
}

/* ------------------------------------------------------------------ */
/* Contrôles avant publication                                          */
/* ------------------------------------------------------------------ */

/**
 * Retourne une liste d'alertes { level: 'error' | 'warning', courseId, message }.
 * `sentCommunications` : envois déjà effectués (avec la liste des cours inclus).
 */
export function validateCourses(courses, { teachers = [], sentCommunications = [] } = {}) {
  const issues = [];
  const teacherIds = new Set(teachers.map((t) => t.id));
  const active = courses.filter((c) => c.status !== 'cancelled');
  const push = (level, course, message) => issues.push({ level, courseId: course?.id || '', title: course?.title || '', message });

  for (const c of courses) {
    if (!c.title?.trim()) push('error', c, 'Cours sans titre.');
    if (!c.start || Number.isNaN(Date.parse(c.start))) push('error', c, 'Cours sans date ni horaire.');
    if (c.end && c.start && Date.parse(c.end) <= Date.parse(c.start)) push('error', c, "L'heure de fin précède l'heure de début.");
    if (c.timezone && !SUPPORTED_TIMEZONES.includes(c.timezone)) push('error', c, `Fuseau horaire inconnu : ${c.timezone}.`);
    if (c.status !== 'cancelled' && c.visibility !== 'private' && !c.joinUrl) push('warning', c, 'Lien de participation manquant.');
    if (c.joinUrl && !/^https:\/\//i.test(c.joinUrl)) push('warning', c, 'Le lien de participation ne commence pas par https://.');
    if (c.teacherId && teachers.length && !teacherIds.has(c.teacherId)) push('warning', c, 'Enseignant introuvable.');
    if (!c.teacherId) push('warning', c, 'Aucun enseignant associé.');
    if (c.joinUrl && c.joinPublic && /zoom\.us/i.test(c.joinUrl) && /pwd=/i.test(c.joinUrl)) {
      push('warning', c, 'Lien Zoom avec mot de passe marqué public : vérifier qu\'il peut être diffusé.');
    }
  }

  // Doublons probables et conflits d'horaires
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i];
      const b = active[j];
      if (!a.start || !b.start) continue;
      const sameDay = localDateKey(a.start) === localDateKey(b.start);
      const closeStart = Math.abs(Date.parse(a.start) - Date.parse(b.start)) < 15 * 60000;
      const sameTitle = a.title && b.title && a.title.trim().toLowerCase() === b.title.trim().toLowerCase();
      if ((sameDay && sameTitle) || (closeStart && a.teacherId && a.teacherId === b.teacherId)) {
        push('warning', a, `Doublon probable avec « ${b.title || b.id} ».`);
        continue;
      }
      const overlap = Date.parse(a.start) < courseEnd(b).getTime() && Date.parse(b.start) < courseEnd(a).getTime();
      if (overlap && a.teacherId && a.teacherId === b.teacherId) {
        push('warning', a, `Conflit d'horaire pour le même enseignant avec « ${b.title || b.id} ».`);
      }
    }
  }

  // Cours annulés qui figuraient dans un envoi déjà effectué
  const cancelledIds = new Set(courses.filter((c) => c.status === 'cancelled').map((c) => c.id));
  for (const comm of sentCommunications) {
    for (const id of comm.courseIds || []) {
      if (cancelledIds.has(id)) {
        const c = courses.find((x) => x.id === id);
        push('warning', c, `Cours annulé mais annoncé dans l'envoi « ${comm.label || comm.id} » : prévoir un message rectificatif.`);
      }
    }
  }
  return issues;
}

/** Cours d'une journée (fuseau Israël par défaut), triés, sans les annulés si demandé. */
export function coursesOfDay(courses, dayKey, { includeCancelled = false, timeZone = TZ_ISRAEL } = {}) {
  return sortByStart(
    courses.filter((c) => c.start && localDateKey(c.start, timeZone) === dayKey && (includeCancelled || c.status !== 'cancelled')),
  );
}
