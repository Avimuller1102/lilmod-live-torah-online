/** Accès aux collections LILMOD, avec valeurs de départ et journal des opérations. */
import { readJSON, writeJSON } from './store.js';
import { SEED_SERIES, SEED_TEACHERS, enrichVideo } from '../../shared/catalog.js';
import { makeId } from '../../shared/programme.js';

export const DEFAULT_SETTINGS = {
  whatsappGroupUrl: 'https://chat.whatsapp.com/KR5PN77WbfvDb4zFgBu3Cl',
  newsletterSignupUrl: 'https://mailchi.mp/4fbd1394a7fd/inscription-feed-lilmod',
  donateUrl: 'https://www.jgive.com/new/en/ils/donation-targets/166202',
  contactEmail: 'aaronbotbol@gmail.com',
  mailchimp: { audienceId: '', fromName: 'LILMOD', replyTo: '', dailyTag: '', weeklyTag: '', testEmails: [] },
  daily: { prepareHour: 7, sendTime: '08:00', autoSend: false },
  weekly: { sendDay: 0, sendTime: '09:00' },
  // Aucun envoi réel vers les abonnés tant que ce verrou n'est pas levé explicitement.
  liveSendingEnabled: false,
};

export const getCourses = () => readJSON('courses', []);
export const saveCourses = (v) => writeJSON('courses', v);
export const getRules = () => readJSON('rules', []);
export const saveRules = (v) => writeJSON('rules', v);
export const getTeachers = async () => (await readJSON('teachers', null)) ?? SEED_TEACHERS;
export const saveTeachers = (v) => writeJSON('teachers', v);
export const getSeries = async () => (await readJSON('series', null)) ?? SEED_SERIES;
export const saveSeries = (v) => writeJSON('series', v);
export const getVideoMap = () => readJSON('videos', {});
export const saveVideoMap = (v) => writeJSON('videos', v);
export const getComms = () => readJSON('communications', []);
export const saveComms = (v) => writeJSON('communications', v);
export const getUsers = () => readJSON('users', []);
export const saveUsers = (v) => writeJSON('users', v);

export async function getSettings() {
  const stored = (await readJSON('settings', null)) || {};
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    mailchimp: { ...DEFAULT_SETTINGS.mailchimp, ...(stored.mailchimp || {}) },
    daily: { ...DEFAULT_SETTINGS.daily, ...(stored.daily || {}) },
    weekly: { ...DEFAULT_SETTINGS.weekly, ...(stored.weekly || {}) },
  };
}
export const saveSettings = (v) => writeJSON('settings', v);

/** Journal des opérations (les 1000 dernières), avec identifiant d'opération. */
export async function log(action, details = {}, { user = 'système', level = 'info' } = {}) {
  const entry = { id: makeId('op'), at: new Date().toISOString(), user, action, level, details };
  try {
    const logs = await readJSON('logs', []);
    logs.unshift(entry);
    await writeJSON('logs', logs.slice(0, 1000));
  } catch {
    /* le journal ne doit jamais bloquer une opération */
  }
  return entry;
}
export const getLogs = () => readJSON('logs', []);

/** Vidéos enrichies (intervenant, thèmes, série), triées de la plus récente à la plus ancienne. */
export async function getVideos({ includeHidden = false } = {}) {
  const [map, teachers, series] = await Promise.all([getVideoMap(), getTeachers(), getSeries()]);
  return Object.values(map)
    .filter((v) => includeHidden || !v.hidden)
    .map((v) => enrichVideo(v, { teachers, series }))
    .sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
}

/** Ajoute ou met à jour des vidéos sans jamais en supprimer ; conserve les réglages manuels. */
export async function upsertVideos(incoming) {
  const map = await getVideoMap();
  let added = 0;
  let updated = 0;
  for (const v of incoming) {
    if (!v?.id) continue;
    const prev = map[v.id];
    if (!prev) added += 1;
    else updated += 1;
    map[v.id] = {
      ...v,
      ...(prev
        ? {
            teacherId: prev.teacherId || '',
            seriesId: prev.seriesId || '',
            categories: prev.categories || [],
            featured: Boolean(prev.featured),
            hidden: Boolean(prev.hidden),
            firstSeenAt: prev.firstSeenAt,
            duration: v.duration || prev.duration || '',
            description: v.description || prev.description || '',
          }
        : { teacherId: '', seriesId: '', categories: [], featured: false, hidden: false, firstSeenAt: new Date().toISOString() }),
    };
  }
  await saveVideoMap(map);
  return { added, updated, total: Object.keys(map).length };
}
