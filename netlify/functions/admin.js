/**
 * API d'administration LILMOD — toutes les routes sous /api/admin/ sont protégées
 * (session signée + en-tête anti-CSRF pour les modifications).
 */
import { addDaysToKey, courseTiming, localDateKey, weekOf, zonedTimeToUtc, TZ_FRANCE } from '../../shared/time.js';
import { duplicateWeek, makeId, prepareWeekFromRules, slugify, sortByStart, validateCourses } from '../../shared/programme.js';
import { previewMergeTags } from '../../shared/messages.js';
import {
  getComms, getCourses, getLogs, getRules, getSeries, getSettings, getTeachers, getUsers, getVideoMap, getVideos,
  log, saveCourses, saveRules, saveSeries, saveSettings, saveTeachers, saveUsers, saveVideoMap, upsertVideos,
} from '../lib/data.js';
import { readJSON, writeJSON } from '../lib/store.js';
import {
  checkCredentials, clearCookie, hashPassword, readSession, recordFailure, sessionCookie, signSession, tooManyAttempts,
} from '../lib/auth.js';
import { courseSchema, parse, ruleSchema, seriesSchema, settingsSchema, teacherSchema, videoPatchSchema } from '../lib/schemas.js';
import { buildDaily, buildWeekly, emailAction, logWhatsapp } from '../lib/comms.js';
import * as mailchimp from '../lib/mailchimp.js';
import { fetchAllWithApi, fetchFeed } from '../lib/youtube.js';
import { error, json, readBody, routeParts, siteUrl } from '../lib/http.js';
import { importKey, parseProgrammeText } from '../../shared/importer.js';
import { occurrenceId } from '../../shared/programme.js';
import { weekdayOfKey } from '../../shared/time.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const fail = (message, status = 400) => Object.assign(new Error(message), { status });

function weekRange(weekStart) {
  const start = DATE_RE.test(weekStart || '') ? weekStart : weekOf(new Date()).start;
  return {
    start,
    fromMs: zonedTimeToUtc(start, '00:00', TZ_FRANCE).getTime(),
    toMs: zonedTimeToUtc(addDaysToKey(start, 7), '00:00', TZ_FRANCE).getTime(),
  };
}
const inRange = (c, r) => c.start && Date.parse(c.start) >= r.fromMs && Date.parse(c.start) < r.toMs;

/* ------------------------------------------------------------------ */

async function dashboard() {
  const now = new Date();
  const [courses, comms, logs, settings, videos] = await Promise.all([getCourses(), getComms(), getLogs(), getSettings(), getVideoMap()]);
  const today = localDateKey(now);
  const week = weekRange(weekOf(now).start);
  const active = courses.filter((c) => c.status !== 'cancelled');
  return {
    today: sortByStart(active.filter((c) => localDateKey(c.start) === today)),
    weekCount: active.filter((c) => inRange(c, week)).length,
    upcoming: sortByStart(active.filter((c) => Date.parse(c.start) > now.getTime())).slice(0, 8),
    drafts: courses.filter((c) => c.status === 'draft' || c.status === 'scheduled').length,
    replaysToComplete: sortByStart(
      courses.filter((c) => ['published', 'done'].includes(c.status) && courseTiming(c, now) === 'past' && !c.replayUrl),
    ).slice(-20),
    pendingComms: comms.filter((c) => ['prepared', 'draft', 'test', 'scheduled'].includes(c.status)).slice(0, 10),
    errors: logs.filter((l) => l.level === 'error').slice(0, 10),
    videosCount: Object.keys(videos).length,
    liveSendingEnabled: settings.liveSendingEnabled,
    mailchimpConfigured: mailchimp.mailchimpConfigured(),
    youtubeApiConfigured: Boolean(process.env.YOUTUBE_API_KEY),
  };
}

/* ------------------------------------------------------------------ */
/* Cours                                                               */
/* ------------------------------------------------------------------ */

async function saveCourse(input, user, existingId) {
  const data = parse(courseSchema, input);
  const courses = await getCourses();
  const now = new Date().toISOString();
  if (existingId) {
    const idx = courses.findIndex((c) => c.id === existingId);
    if (idx < 0) throw fail('Cours introuvable.', 404);
    const prev = courses[idx];
    const next = { ...prev, ...data, id: prev.id, updatedAt: now, updatedBy: user };
    if (['published', 'cancelled', 'done', 'replay'].includes(next.status) && !next.publishedAt) next.publishedAt = now;
    if (next.replayUrl && next.status === 'done') next.status = 'replay';
    courses[idx] = next;
    await saveCourses(courses);
    const changedTime = prev.start !== next.start || prev.end !== next.end;
    await log('cours.modifié', { id: next.id, title: next.title, changedTime, status: next.status }, { user });
    return next;
  }
  const course = {
    ...data,
    id: data.id && !courses.some((c) => c.id === data.id) ? data.id : makeId('c'),
    createdAt: now,
    updatedAt: now,
    updatedBy: user,
    publishedAt: data.status === 'published' ? now : '',
  };
  courses.push(course);
  await saveCourses(courses);
  await log('cours.créé', { id: course.id, title: course.title }, { user });
  return course;
}

async function deleteCourse(id, user) {
  const courses = await getCourses();
  const course = courses.find((c) => c.id === id);
  if (!course) throw fail('Cours introuvable.', 404);
  if (course.publishedAt) throw fail('Un cours déjà publié ne peut pas être supprimé : passez-le en « Annulé ».', 409);
  const trash = await readJSON('trash', []);
  trash.unshift({ ...course, deletedAt: new Date().toISOString(), deletedBy: user });
  await writeJSON('trash', trash.slice(0, 500));
  await saveCourses(courses.filter((c) => c.id !== id));
  await log('cours.supprimé', { id, title: course.title, restaurable: true }, { user });
  return { ok: true };
}

async function restoreCourse(id, user) {
  const trash = await readJSON('trash', []);
  const item = trash.find((c) => c.id === id);
  if (!item) throw fail('Élément introuvable dans la corbeille.', 404);
  const { deletedAt, deletedBy, ...course } = item;
  const courses = await getCourses();
  if (!courses.some((c) => c.id === id)) courses.push(course);
  await saveCourses(courses);
  await writeJSON('trash', trash.filter((c) => c.id !== id));
  await log('cours.restauré', { id }, { user });
  return course;
}

async function prepareWeek({ weekStart }, user) {
  const r = weekRange(weekStart);
  const [rules, courses] = await Promise.all([getRules(), getCourses()]);
  const created = prepareWeekFromRules(rules, courses, r.start).map((c) => ({ ...c, createdAt: new Date().toISOString(), updatedBy: user }));
  await saveCourses([...courses, ...created]);
  await log('programme.semaine_préparée', { weekStart: r.start, created: created.length }, { user });
  return { created };
}

async function duplicate({ fromWeek, toWeek }, user) {
  if (!DATE_RE.test(fromWeek || '') || !DATE_RE.test(toWeek || '')) throw fail('Semaines invalides.');
  const from = weekRange(fromWeek);
  const courses = await getCourses();
  const source = courses.filter((c) => inRange(c, from) && c.status !== 'cancelled');
  const copies = duplicateWeek(source, from.start, weekRange(toWeek).start).map((c) => ({ ...c, createdAt: new Date().toISOString(), updatedBy: user }));
  await saveCourses([...courses, ...copies]);
  await log('programme.semaine_dupliquée', { fromWeek: from.start, toWeek, created: copies.length }, { user });
  return { created: copies };
}

async function validateWeek(weekStart) {
  const r = weekRange(weekStart);
  const [courses, teachers, comms] = await Promise.all([getCourses(), getTeachers(), getComms()]);
  const week = courses.filter((c) => inRange(c, r));
  const undated = courses.filter((c) => !c.start && c.status !== 'cancelled');
  const sent = comms.filter((c) => ['sent', 'scheduled'].includes(c.status) || c.channel === 'whatsapp');
  return { weekStart: r.start, issues: validateCourses([...week, ...undated], { teachers, sentCommunications: sent }), count: week.length };
}

async function publishWeek({ weekStart, includeDrafts = false }, user) {
  const r = weekRange(weekStart);
  const { issues } = await validateWeek(r.start);
  const blocked = new Set(issues.filter((i) => i.level === 'error').map((i) => i.courseId));
  const courses = await getCourses();
  const now = new Date().toISOString();
  const published = [];
  const skipped = [];
  for (const c of courses) {
    if (!inRange(c, r)) continue;
    if (!(c.status === 'scheduled' || (includeDrafts && c.status === 'draft'))) continue;
    if (blocked.has(c.id)) {
      skipped.push({ id: c.id, title: c.title });
      continue;
    }
    c.status = 'published';
    c.publishedAt = c.publishedAt || now;
    c.updatedAt = now;
    c.updatedBy = user;
    published.push(c.id);
  }
  await saveCourses(courses);
  await log('programme.publié', { weekStart: r.start, published: published.length, skipped: skipped.length }, { user });
  return { published, skipped };
}

/* ------------------------------------------------------------------ */
/* Import d'un programme rédigé (newsletter, WhatsApp)                 */
/* ------------------------------------------------------------------ */

async function importProgramme({ text, apply = false, status = 'draft', createRules = false }, user) {
  if (!String(text || '').trim()) throw fail('Collez le texte du programme.');
  const [teachers, courses, rules] = await Promise.all([getTeachers(), getCourses(), getRules()]);
  const parsed = parseProgrammeText(String(text).slice(0, 60000), { teachers });
  if (!parsed.length) throw fail("Aucun cours reconnu. Vérifiez que chaque cours comporte un jour (ex. « Lundi 16 Novembre ») et une heure (ex. « 17H00 France »).");
  const existingKeys = new Set(courses.filter((c) => c.start).map((c) => importKey(c)));
  const items = parsed.map((p) => ({ ...p, duplicate: existingKeys.has(importKey(p)) }));
  if (!apply) return { items, applied: false };

  const now = new Date().toISOString();
  const newTeachers = [];
  const created = [];
  const createdRules = [];
  for (const item of items) {
    if (item.duplicate) continue;
    let teacherId = item.teacherId;
    if (!teacherId && item.teacherName) {
      const base = slugify(item.teacherName.replace(/^(rav|dr|rabbanit|mme|m\.)\s+/i, '')) || makeId('t');
      teacherId = teachers.some((t) => t.id === base) ? `${base}-${newTeachers.length + 1}` : base;
      const t = { id: teacherId, name: item.teacherName, shortName: item.teacherName, photo: '', specialty: '', bio: '', aliases: [], hidden: false, createdAt: now };
      teachers.push(t);
      newTeachers.push(t);
    }
    const base = {
      title: item.title, description: '', teacherId, seriesId: '', category: item.category || '', timezone: item.timezone,
      platform: /zoom\.us/i.test(item.joinUrl) ? 'zoom' : /youtu/i.test(item.joinUrl) ? 'youtube' : 'other',
      joinUrl: item.joinUrl, joinPublic: true, visibility: 'public', thumbnail: '', organizer: item.organizer || '',
    };
    let courseId = makeId('c');
    let recurrenceId = '';
    if (createRules) {
      const same = rules.find((r) => r.active !== false && r.teacherId === teacherId && r.time === item.time && r.timezone === item.timezone && (r.weekdays || []).includes(weekdayOfKey(item.date)));
      const rule = same || { ...base, id: makeId('r'), weekdays: [weekdayOfKey(item.date)], time: item.time, durationMin: 60, intervalWeeks: 1, startDate: item.date, endDate: '', active: true, createdAt: now };
      if (!same) {
        rules.push(rule);
        createdRules.push(rule);
      }
      courseId = occurrenceId(rule.id, item.date);
      recurrenceId = rule.id;
      if (courses.some((c) => c.id === courseId)) continue;
    }
    const start = new Date(item.start);
    const course = {
      ...base, id: courseId, recurrenceId, occurrenceDate: item.date, start: item.start, end: new Date(start.getTime() + 60 * 60000).toISOString(),
      status, replayUrl: '', pdfUrl: '', notes: 'Importé depuis le programme rédigé.', createdAt: now, updatedAt: now, updatedBy: user,
      publishedAt: status === 'published' ? now : '',
    };
    courses.push(course);
    created.push(course);
  }
  if (newTeachers.length) await saveTeachers(teachers);
  if (createdRules.length) await saveRules(rules);
  await saveCourses(courses);
  await log('programme.importé', { created: created.length, rules: createdRules.length, teachers: newTeachers.map((t) => t.name), status }, { user });
  return { items, applied: true, created: created.length, rules: createdRules.length, teachers: newTeachers.map((t) => t.name) };
}

/* ------------------------------------------------------------------ */
/* Photos téléversées (stockées dans Netlify Blobs)                    */
/* ------------------------------------------------------------------ */

async function uploadMedia({ dataUrl }, user) {
  const m = String(dataUrl || '').match(/^data:(image\/(?:webp|jpeg|png));base64,([A-Za-z0-9+/=]+)$/);
  if (!m) throw fail('Image invalide (formats acceptés : WebP, JPEG, PNG).');
  if (m[2].length > 700_000) throw fail('Image trop lourde (500 Ko maximum après réduction).');
  const id = makeId('img').replace(/_/g, '-');
  await writeJSON(`media-${id}`, { type: m[1], data: m[2], createdAt: new Date().toISOString(), user });
  await log('image.téléversée', { id }, { user });
  return { url: `/api/v1/media/${id}` };
}

/* ------------------------------------------------------------------ */
/* Collections simples (récurrences, intervenants, séries)             */
/* ------------------------------------------------------------------ */

async function upsertItem({ getAll, saveAll, schema, input, id, user, label, idFrom }) {
  const data = parse(schema, input);
  const items = await getAll();
  if (id) {
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) throw fail('Élément introuvable.', 404);
    items[idx] = { ...items[idx], ...data, id, updatedAt: new Date().toISOString() };
    await saveAll(items);
    await log(`${label}.modifié`, { id }, { user });
    return items[idx];
  }
  let newId = data.id || (idFrom ? slugify(idFrom(data)) : '') || makeId(label.slice(0, 1));
  if (items.some((i) => i.id === newId)) newId = `${newId}-${Math.random().toString(36).slice(2, 5)}`;
  const item = { ...data, id: newId, createdAt: new Date().toISOString() };
  items.push(item);
  await saveAll(items);
  await log(`${label}.créé`, { id: newId }, { user });
  return item;
}

/* ------------------------------------------------------------------ */
/* Vidéos                                                              */
/* ------------------------------------------------------------------ */

async function syncVideos(user) {
  const report = { sources: [], errors: [] };
  const collected = [];
  try {
    const feed = await fetchFeed();
    collected.push(...feed);
    report.sources.push(`Flux de la chaîne : ${feed.length} vidéos`);
  } catch (e) {
    report.errors.push(e.message);
  }
  for (const s of await getSeries()) {
    if (!s.playlistId) continue;
    try {
      const feed = await fetchFeed({ playlistId: s.playlistId });
      collected.push(...feed.map((v) => ({ ...v, seriesId: s.id })));
      report.sources.push(`Playlist « ${s.title} » : ${feed.length} vidéos`);
    } catch (e) {
      report.errors.push(`Playlist ${s.title} : ${e.message}`);
    }
  }
  if (process.env.YOUTUBE_API_KEY) {
    try {
      const all = await fetchAllWithApi({ apiKey: process.env.YOUTUBE_API_KEY });
      collected.push(...all);
      report.sources.push(`Import complet (API YouTube) : ${all.length} vidéos`);
    } catch (e) {
      report.errors.push(e.message);
    }
  }
  const result = await upsertVideos(collected);
  await log('vidéos.synchronisées', { ...result, errors: report.errors }, { user, level: report.errors.length ? 'error' : 'info' });
  return { ...result, ...report };
}

async function patchVideo(id, input, user) {
  const patch = parse(videoPatchSchema, input);
  const map = await getVideoMap();
  if (!map[id]) throw fail('Vidéo introuvable.', 404);
  map[id] = { ...map[id], ...patch };
  await saveVideoMap(map);
  await log('vidéo.modifiée', { id, ...patch }, { user });
  return map[id];
}

/* ------------------------------------------------------------------ */
/* Paramètres, comptes, sauvegardes                                    */
/* ------------------------------------------------------------------ */

async function updateSettings(input, session) {
  const current = await getSettings();
  const data = parse(settingsSchema, { ...current, ...input, mailchimp: { ...current.mailchimp, ...(input.mailchimp || {}) }, daily: { ...current.daily, ...(input.daily || {}) }, weekly: { ...current.weekly, ...(input.weekly || {}) } });
  if (data.liveSendingEnabled !== current.liveSendingEnabled || data.daily.autoSend !== current.daily.autoSend) {
    if (session.role !== 'admin') throw fail('Seul un administrateur peut modifier les envois réels.', 403);
    if ((data.liveSendingEnabled || data.daily.autoSend) && input.confirm !== 'ACTIVER') {
      throw fail('Confirmation requise : saisissez ACTIVER pour autoriser des envois réels aux abonnés.');
    }
  }
  await saveSettings(data);
  await log('paramètres.modifiés', { liveSendingEnabled: data.liveSendingEnabled, dailyAutoSend: data.daily.autoSend }, { user: session.username });
  return data;
}

const BACKUP_KEYS = ['courses', 'rules', 'teachers', 'series', 'videos', 'settings', 'communications', 'trash'];

async function backup() {
  const out = { version: 1, exportedAt: new Date().toISOString() };
  for (const k of BACKUP_KEYS) out[k] = await readJSON(k, null);
  return out;
}

async function restore(input, user) {
  if (input.confirm !== 'RESTAURER') throw fail('Confirmation requise : saisissez RESTAURER.');
  const data = input.data;
  if (!data || data.version !== 1) throw fail('Fichier de sauvegarde invalide.');
  const before = await backup();
  const snapshotKey = `backup-${Date.now()}`;
  await writeJSON(snapshotKey, before);
  for (const k of BACKUP_KEYS) if (data[k] !== undefined && data[k] !== null) await writeJSON(k, data[k]);
  await log('sauvegarde.restaurée', { snapshotAvantRestauration: snapshotKey }, { user });
  return { ok: true, snapshotKey };
}

/* ------------------------------------------------------------------ */
/* Routeur                                                             */
/* ------------------------------------------------------------------ */

export default async (req) => {
  const parts = routeParts(req, '/api/admin');
  const [a, b, c] = parts;
  const method = req.method;
  const ip = req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for') || 'local';

  try {
    if (a === 'login' && method === 'POST') {
      if (tooManyAttempts(ip)) return error('Trop de tentatives. Réessayez dans quelques minutes.', 429);
      const body = await readBody(req);
      const session = await checkCredentials(body.username, body.password);
      if (!session) {
        recordFailure(ip);
        await log('connexion.échec', { username: String(body.username || '').slice(0, 40) }, { level: 'error' });
        return error('Identifiant ou mot de passe incorrect.', 401);
      }
      await log('connexion', {}, { user: session.username });
      return json({ user: session }, { headers: { 'Set-Cookie': sessionCookie(signSession(session)) } });
    }
    if (a === 'logout') return json({ ok: true }, { headers: { 'Set-Cookie': clearCookie } });

    const session = readSession(req);
    if (!session) return error('Session expirée : reconnectez-vous.', 401);
    if (method !== 'GET' && req.headers.get('x-lilmod-admin') !== '1') return error('Requête refusée.', 403);
    const user = session.username;
    const isAdmin = session.role === 'admin';
    const body = method === 'GET' || method === 'DELETE' ? {} : await readBody(req);
    const url = new URL(req.url);
    const site = siteUrl(req);

    if (a === 'me') return json({ user: session });
    if (a === 'dashboard') return json(await dashboard());

    // Cours
    if (a === 'courses' && !b && method === 'GET') {
      const courses = await getCourses();
      const from = url.searchParams.get('weekStart');
      return json({ courses: sortByStart(from ? courses.filter((x) => inRange(x, weekRange(from)) || !x.start) : courses) });
    }
    if (a === 'courses' && !b && method === 'POST') return json({ course: await saveCourse(body, user) });
    if (a === 'courses' && b === 'trash' && method === 'GET') return json({ trash: await readJSON('trash', []) });
    if (a === 'courses' && b === 'restore' && method === 'POST') return json({ course: await restoreCourse(body.id, user) });
    if (a === 'courses' && b && method === 'PUT') return json({ course: await saveCourse(body, user, b) });
    if (a === 'courses' && b && method === 'DELETE') return json(await deleteCourse(b, user));

    // Programme
    if (a === 'programme' && b === 'prepare' && method === 'POST') return json(await prepareWeek(body, user));
    if (a === 'programme' && b === 'duplicate' && method === 'POST') return json(await duplicate(body, user));
    if (a === 'programme' && b === 'validate') return json(await validateWeek(url.searchParams.get('weekStart')));
    if (a === 'programme' && b === 'publish' && method === 'POST') return json(await publishWeek(body, user));
    if (a === 'programme' && b === 'import' && method === 'POST') {
      if (body.status === 'published' && !['admin', 'editor'].includes(session.role)) throw fail('Non autorisé.', 403);
      return json(await importProgramme({ ...body, status: body.status === 'published' ? 'published' : 'draft' }, user));
    }
    if (a === 'media' && method === 'POST') return json(await uploadMedia(body, user));
    if (a === 'mailchimp' && b === 'last-campaign') return json(await mailchimp.lastSentCampaign());

    // Récurrences, intervenants, séries
    const collections = {
      rules: { getAll: getRules, saveAll: saveRules, schema: ruleSchema, label: 'récurrence' },
      teachers: { getAll: getTeachers, saveAll: saveTeachers, schema: teacherSchema, label: 'intervenant', idFrom: (d) => d.name },
      series: { getAll: getSeries, saveAll: saveSeries, schema: seriesSchema, label: 'série', idFrom: (d) => d.title },
    };
    if (collections[a]) {
      const col = collections[a];
      if (method === 'GET') return json({ items: await col.getAll() });
      if (method === 'POST') return json({ item: await upsertItem({ ...col, input: body, user }) });
      if (method === 'PUT' && b) return json({ item: await upsertItem({ ...col, input: body, id: b, user }) });
      if (method === 'DELETE' && b) {
        if (a !== 'rules') throw fail('Masquez plutôt cet élément (case « masqué ») pour conserver l’historique.', 409);
        const items = await col.getAll();
        await col.saveAll(items.map((i) => (i.id === b ? { ...i, active: false } : i)));
        await log('récurrence.désactivée', { id: b }, { user });
        return json({ ok: true });
      }
    }

    // Vidéos
    if (a === 'videos' && !b && method === 'GET') return json({ videos: await getVideos({ includeHidden: true }) });
    if (a === 'videos' && b === 'sync' && method === 'POST') return json(await syncVideos(user));
    if (a === 'videos' && b && method === 'PATCH') return json({ video: await patchVideo(b, body, user) });

    // Communications
    if (a === 'comms' && !b && method === 'GET') return json({ items: await getComms() });
    if (a === 'comms' && b === 'preview') {
      const kind = url.searchParams.get('kind') === 'daily' ? 'daily' : 'weekly';
      const period = url.searchParams.get('period') || '';
      const built = kind === 'weekly' ? await buildWeekly(DATE_RE.test(period) ? period : '', site) : await buildDaily(DATE_RE.test(period) ? period : '', site);
      const comms = await getComms();
      return json({
        kind,
        key: built.key,
        period: built.weekStart || built.dayKey,
        parasha: built.parasha || '',
        subject: built.email.subject,
        html: previewMergeTags(built.email.html),
        rawHtml: built.email.html,
        whatsapp: built.whatsapp,
        courseIds: built.email.courseIds,
        history: comms.filter((x) => x.key.startsWith(built.key)),
      });
    }
    if (a === 'comms' && b === 'email' && method === 'POST') {
      if (['schedule', 'send'].includes(body.action) && !isAdmin) throw fail('Seul un administrateur peut programmer un envoi réel.', 403);
      const kind = body.kind === 'daily' ? 'daily' : 'weekly';
      const period = DATE_RE.test(body.period || '') ? body.period : kind === 'weekly' ? weekOf(new Date()).start : localDateKey(new Date());
      return json({ record: await emailAction({ ...body, kind, period, user, site }) });
    }
    if (a === 'comms' && b === 'whatsapp' && method === 'POST') {
      const kind = body.kind === 'daily' ? 'daily' : 'weekly';
      return json({ record: await logWhatsapp({ kind, period: String(body.period || '').slice(0, 10), text: body.text, courseIds: body.courseIds, user }) });
    }

    // Mailchimp
    if (a === 'mailchimp' && b === 'status') {
      if (!mailchimp.mailchimpConfigured()) return json({ configured: false });
      try {
        await mailchimp.ping();
        return json({ configured: true, ok: true, audiences: await mailchimp.listAudiences() });
      } catch (e) {
        return json({ configured: true, ok: false, error: e.message });
      }
    }

    // Paramètres
    if (a === 'settings' && method === 'GET') return json({ settings: await getSettings(), secrets: { mailchimp: mailchimp.mailchimpConfigured(), youtubeApi: Boolean(process.env.YOUTUBE_API_KEY), adminSecret: Boolean(process.env.ADMIN_SECRET) } });
    if (a === 'settings' && method === 'PUT') return json({ settings: await updateSettings(body, session) });

    // Comptes (administrateurs uniquement)
    if (a === 'users') {
      if (!isAdmin) throw fail('Réservé aux administrateurs.', 403);
      const users = await getUsers();
      if (method === 'GET') return json({ items: users.map(({ passwordHash, ...u }) => u) });
      if (method === 'POST') {
        const username = String(body.username || '').trim().toLowerCase();
        if (!/^[a-z0-9._-]{3,40}$/.test(username) || username === 'admin') throw fail('Identifiant invalide (3 à 40 caractères, sans espace).');
        if (String(body.password || '').length < 10) throw fail('Mot de passe trop court (10 caractères minimum).');
        if (users.some((u) => u.username === username)) throw fail('Cet identifiant existe déjà.', 409);
        const role = body.role === 'admin' ? 'admin' : 'editor';
        users.push({ username, role, passwordHash: hashPassword(body.password), createdAt: new Date().toISOString(), disabled: false });
        await saveUsers(users);
        await log('compte.créé', { username, role }, { user });
        return json({ ok: true });
      }
      if (method === 'PUT' && b) {
        const u = users.find((x) => x.username === b);
        if (!u) throw fail('Compte introuvable.', 404);
        if (typeof body.disabled === 'boolean') u.disabled = body.disabled;
        if (body.role) u.role = body.role === 'admin' ? 'admin' : 'editor';
        if (body.password) {
          if (String(body.password).length < 10) throw fail('Mot de passe trop court (10 caractères minimum).');
          u.passwordHash = hashPassword(body.password);
        }
        await saveUsers(users);
        await log('compte.modifié', { username: b }, { user });
        return json({ ok: true });
      }
    }

    // Journal et sauvegardes
    if (a === 'logs') return json({ items: (await getLogs()).slice(0, 300) });
    if (a === 'backup' && method === 'GET') {
      if (!isAdmin) throw fail('Réservé aux administrateurs.', 403);
      await log('sauvegarde.exportée', {}, { user });
      return json(await backup(), { headers: { 'Content-Disposition': `attachment; filename="lilmod-sauvegarde-${localDateKey(new Date())}.json"` } });
    }
    if (a === 'backup' && b === 'restore' && method === 'POST') {
      if (!isAdmin) throw fail('Réservé aux administrateurs.', 403);
      return json(await restore(body, user));
    }

    return error('Route inconnue.', 404, { route: parts.join('/'), c });
  } catch (err) {
    const status = err.status || 500;
    if (status >= 500) console.error(err);
    return error(err.message || 'Erreur interne.', status);
  }
};

export const config = { path: '/api/admin/*' };
