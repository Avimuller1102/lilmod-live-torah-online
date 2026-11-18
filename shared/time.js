/**
 * Gestion des dates et fuseaux horaires — sans aucun décalage codé en dur.
 *
 * Toutes les dates sont stockées en UTC (ISO 8601). Les conversions vers
 * Europe/Paris et Asia/Jerusalem passent par l'API Intl du navigateur ou de
 * Node, qui connaît les changements d'heure de chaque pays (ils n'ont pas lieu
 * aux mêmes dates en France et en Israël).
 */

export const TZ_ISRAEL = 'Asia/Jerusalem';
export const TZ_FRANCE = 'Europe/Paris';
export const SUPPORTED_TIMEZONES = [TZ_ISRAEL, TZ_FRANCE];

const partsCache = new Map();
function formatter(timeZone) {
  if (!partsCache.has(timeZone)) {
    partsCache.set(
      timeZone,
      new Intl.DateTimeFormat('en-US', {
        timeZone,
        hourCycle: 'h23',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short',
      }),
    );
  }
  return partsCache.get(timeZone);
}

/** Composantes locales (année, mois, jour, heure…) d'un instant dans un fuseau. */
export function zonedParts(date, timeZone) {
  const d = date instanceof Date ? date : new Date(date);
  const out = {};
  for (const p of formatter(timeZone).formatToParts(d)) out[p.type] = p.value;
  const weekdayIndex = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[out.weekday];
  return {
    year: Number(out.year),
    month: Number(out.month),
    day: Number(out.day),
    hour: Number(out.hour) % 24,
    minute: Number(out.minute),
    second: Number(out.second),
    weekday: weekdayIndex,
  };
}

/** Décalage (en minutes) du fuseau par rapport à UTC à un instant donné. */
export function tzOffsetMinutes(date, timeZone) {
  const d = date instanceof Date ? date : new Date(date);
  const p = zonedParts(d, timeZone);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(d.getTime() / 1000) * 1000) / 60000);
}

/**
 * Convertit une date + heure locales ("2026-11-22", "20:30") d'un fuseau en
 * instant UTC. Gère les changements d'heure (double passe sur le décalage).
 */
export function zonedTimeToUtc(dateStr, timeStr, timeZone) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const [hh, mm] = (timeStr || '00:00').split(':').map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  let offset = tzOffsetMinutes(new Date(guess), timeZone);
  let utc = guess - offset * 60000;
  const offset2 = tzOffsetMinutes(new Date(utc), timeZone);
  if (offset2 !== offset) utc = guess - offset2 * 60000;
  return new Date(utc);
}

const pad = (n) => String(n).padStart(2, '0');

/** "YYYY-MM-DD" de l'instant dans le fuseau donné. */
export function localDateKey(date, timeZone = TZ_FRANCE) {
  const p = zonedParts(date, timeZone);
  return `${p.year}-${pad(p.month)}-${pad(p.day)}`;
}

/** "HH:mm" de l'instant dans le fuseau donné. */
export function localTime(date, timeZone = TZ_FRANCE) {
  const p = zonedParts(date, timeZone);
  return `${pad(p.hour)}:${pad(p.minute)}`;
}

/** Ajoute n jours à une date "YYYY-MM-DD" (calendrier pur, sans fuseau). */
export function addDaysToKey(key, n) {
  const [y, m, d] = key.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/** Jour de la semaine (0 = dimanche) d'une date "YYYY-MM-DD". */
export function weekdayOfKey(key) {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/**
 * Semaine LILMOD : du dimanche au samedi, calculée à l'heure de France
 * (heure de référence de LILMOD). Retourne les clés de dates et les bornes UTC.
 */
export function weekOf(date = new Date(), timeZone = TZ_FRANCE) {
  const today = localDateKey(date, timeZone);
  const start = addDaysToKey(today, -weekdayOfKey(today));
  const days = Array.from({ length: 7 }, (_, i) => addDaysToKey(start, i));
  return {
    start,
    end: days[6],
    days,
    fromUtc: zonedTimeToUtc(start, '00:00', timeZone).toISOString(),
    toUtc: zonedTimeToUtc(addDaysToKey(start, 7), '00:00', timeZone).toISOString(),
  };
}

export const WEEKDAYS_FR = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Chabbat'];
const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];

/** "Dimanche 22 novembre" pour une clé de date. */
export function formatDayKey(key, { withYear = false } = {}) {
  const [y, m, d] = key.split('-').map(Number);
  return `${WEEKDAYS_FR[weekdayOfKey(key)]} ${d}${d === 1 ? 'er' : ''} ${MONTHS_FR[m - 1]}${withYear ? ` ${y}` : ''}`;
}

/** "22 nov. 2026" */
export function formatShortDate(date, timeZone = TZ_FRANCE) {
  if (!date) return '';
  return new Intl.DateTimeFormat('fr-FR', { timeZone, day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(date));
}

/** Heure en Israël et en France : { il: "20:30", fr: "19:30", same: false } */
export function dualTimes(iso) {
  const il = localTime(iso, TZ_ISRAEL);
  const fr = localTime(iso, TZ_FRANCE);
  return { il, fr, same: il === fr };
}

/** Libellé de référence : heure de France, heure d'Israël entre parenthèses. « 17h00 (18h00 Israël) » */
export function timeLabel(iso) {
  const { il, fr } = dualTimes(iso);
  return `${fr.replace(':', 'h')} (${il.replace(':', 'h')} Israël)`;
}

/** Durée par défaut d'un cours sans heure de fin (minutes). */
export const DEFAULT_DURATION_MIN = 60;

export function courseEnd(course) {
  if (course.end) return new Date(course.end);
  return new Date(new Date(course.start).getTime() + DEFAULT_DURATION_MIN * 60000);
}

/**
 * État temporel d'un cours. « En direct » uniquement si le cours est publié,
 * non annulé, et que l'instant présent est dans sa plage horaire prévue.
 */
export function courseTiming(course, now = new Date()) {
  if (course.status === 'cancelled') return 'cancelled';
  const start = new Date(course.start).getTime();
  const end = courseEnd(course).getTime();
  const t = now.getTime();
  if (t < start) return 'upcoming';
  if (t <= end) return 'live';
  return 'past';
}
