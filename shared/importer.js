/**
 * Import d'un programme rédigé (newsletter Mailchimp, message WhatsApp…).
 *
 * Format reconnu (celui de la newsletter LILMOD) :
 *   Dimanche 15 Novembre
 *   Rav Shmuel Elikan
 *   17H00 France
 *   Titre du cours (une ou plusieurs lignes)
 *   https://zoom.us/j/...            ← lien de participation
 *   By MIDRESHET YEHOUDA             ← organisateur
 *   [Cliquez ici…](https://us.list-manage.com/…)   ← lien de suivi Mailchimp, ignoré
 *
 * Rien n'est inventé : un champ absent reste vide et est signalé.
 */
import { TZ_FRANCE, TZ_ISRAEL, addDaysToKey, zonedTimeToUtc } from './time.js';
import { detectCategories, detectTeacherId, fold } from './catalog.js';

const DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'chabbat', 'shabbat'];
const MONTHS = ['janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];

const plain = (s) =>
  String(s || '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();

const pad = (n) => String(n).padStart(2, '0');

/** "Dimanche 15 Novembre" → "2026-11-15" (année la plus proche de la date de référence). */
export function parseDayLine(line, reference = new Date()) {
  const m = plain(line).replace(/[*_]/g, '').match(/^(dimanche|lundi|mardi|mercredi|jeudi|vendredi|samedi|chabbat|shabbat)\s+(\d{1,2})(?:er)?\s+([a-z]+)(?:\s+(\d{4}))?\s*$/);
  if (!m) return null;
  const month = MONTHS.indexOf(m[3]);
  if (month < 0) return null;
  const day = Number(m[2]);
  const refYear = reference.getUTCFullYear();
  const candidates = m[4] ? [Number(m[4])] : [refYear - 1, refYear, refYear + 1];
  let best = null;
  for (const y of candidates) {
    const t = Date.UTC(y, month, day);
    if (!best || Math.abs(t - reference.getTime()) < Math.abs(best.t - reference.getTime())) best = { y, t };
  }
  return `${best.y}-${pad(month + 1)}-${pad(day)}`;
}

/** "17H00 France", "20h30 Israël", "10:15" → { time, timezone } */
export function parseTimeLine(line) {
  const m = plain(line).replace(/[*_]/g, '').match(/^(\d{1,2})\s*[h:]\s*(\d{2})?\s*(?:\(?\s*(france|israel|heure de france|heure d'israel|heure israel)\s*\)?)?\s*$/);
  if (!m) return null;
  const hour = Number(m[1]);
  if (hour > 23) return null;
  const tz = !m[3] || m[3].includes('france') ? TZ_FRANCE : TZ_ISRAEL;
  return { time: `${pad(hour)}:${m[2] || '00'}`, timezone: tz, timezoneGuessed: !m[3] };
}

const URL_RE = /https?:\/\/[^\s)\]>]+/i;
const isTracking = (line) => /list-manage\.com|mailchi\.mp|cliquez ici/i.test(line);

function cleanOrganizer(raw) {
  const v = String(raw || '').trim();
  const f = plain(v);
  if (/yehouda|yeouda|manitou/.test(f)) return 'Midreshet Yehouda-Manitou';
  if (/houg/.test(f)) return 'Le HOUG';
  if (/emoun|chelema|shelema/.test(f)) return 'Emounah Chelema';
  if (/lilmod/.test(f)) return 'LILMOD';
  return v.replace(/\s+/g, ' ');
}

/**
 * Analyse le texte et renvoie la liste des cours trouvés.
 * Chaque cours : { date, time, timezone, start, teacherName, teacherId, title, joinUrl, organizer, category, warnings[] }
 */
export function parseProgrammeText(text, { teachers = [], reference = new Date() } = {}) {
  const lines = String(text || '')
    .replace(/\r/g, '')
    .split('\n')
    .map((l) => l.replace(/ /g, ' ').trim())
    .filter(Boolean);

  const courses = [];
  let currentDay = null;
  let pendingTeacher = '';
  let current = null;

  const finish = () => {
    if (!current) return;
    current.title = current.titleLines.join(' — ').replace(/\s+/g, ' ').trim();
    delete current.titleLines;
    if (!current.title) current.warnings.push('Titre introuvable.');
    if (!current.joinUrl) current.warnings.push('Lien de participation introuvable.');
    if (!current.teacherId) current.warnings.push(current.teacherName ? `Intervenant « ${current.teacherName} » à créer.` : 'Intervenant introuvable.');
    if (current.timezoneGuessed) current.warnings.push("Fuseau non précisé : heure de France supposée.");
    delete current.timezoneGuessed;
    current.category = detectCategories(current.title)[0] || '';
    courses.push(current);
    current = null;
  };

  for (const line of lines) {
    if (isTracking(line)) continue;
    const day = parseDayLine(line, reference);
    if (day) {
      finish();
      currentDay = day;
      pendingTeacher = '';
      continue;
    }
    const time = parseTimeLine(line);
    if (time && currentDay) {
      // L'heure ouvre un nouveau cours ; l'intervenant est la ligne qui la précède.
      let teacherName = pendingTeacher;
      if (current && !current.joinUrl && !pendingTeacher && current.titleLines.length) {
        teacherName = current.titleLines.pop();
      }
      finish();
      const start = zonedTimeToUtc(currentDay, time.time, time.timezone).toISOString();
      current = {
        date: currentDay,
        time: time.time,
        timezone: time.timezone,
        timezoneGuessed: time.timezoneGuessed,
        start,
        teacherName,
        teacherId: teacherName ? detectTeacherId(teacherName, teachers) : '',
        titleLines: [],
        joinUrl: '',
        organizer: '',
        warnings: [],
      };
      pendingTeacher = '';
      continue;
    }
    const by = line.match(/^(?:by|par|organis[ée] par)\s+(.+)$/i);
    if (by && current) {
      current.organizer = cleanOrganizer(by[1]);
      continue;
    }
    const url = line.match(URL_RE);
    if (url && current && !current.joinUrl) {
      current.joinUrl = url[0].replace(/[.,;]+$/, '');
      continue;
    }
    if (url) continue;
    if (!currentDay) continue; // en-tête du message
    if (current && !current.joinUrl) {
      current.titleLines.push(line);
      continue;
    }
    // Ligne après un cours complet : nom de l'intervenant du cours suivant.
    finish();
    pendingTeacher = line.replace(/[*_]/g, '').trim();
  }
  finish();
  return courses;
}

/** Clé de doublon : même début et même intervenant (ou même titre). */
export function importKey(c) {
  return `${c.start}|${c.teacherId || fold(c.teacherName)}`;
}

export function weekStartOf(dateKey) {
  const [y, m, d] = dateKey.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return addDaysToKey(dateKey, -wd);
}
