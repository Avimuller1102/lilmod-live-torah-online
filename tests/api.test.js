import test from 'node:test';
import assert from 'node:assert/strict';

process.env.LILMOD_STORE = 'memory';
process.env.ADMIN_PASSWORD = 'mot-de-passe-de-test-123';
process.env.URL = 'https://lilmod.fr';
delete process.env.MAILCHIMP_API_KEY;

const { default: admin } = await import('../netlify/functions/admin.js');
const { default: api } = await import('../netlify/functions/api.js');
const { runHourly } = await import('../netlify/functions/scheduled-hourly.js');
const { weekOf, addDaysToKey } = await import('../shared/time.js');

/* Faux réseau : YouTube, Hebcal et Mailchimp simulés, rien ne sort réellement. */
const mailchimpCalls = [];
const realFetch = globalThis.fetch;
globalThis.fetch = async (url, opts = {}) => {
  const u = String(url);
  if (u.includes('youtube.com/feeds')) {
    return new Response(`<feed><entry><yt:videoId>abc123def45</yt:videoId><title>Rav Menahem Akerman - Tefila : la Amida. Episode 4</title><published>2026-11-14T18:03:50+00:00</published><media:description>Cours</media:description></entry></feed>`);
  }
  if (u.includes('hebcal.com')) return new Response(JSON.stringify({ items: [{ category: 'parashat', title: 'Parachat Vayetzei' }] }));
  if (u.includes('api.mailchimp.com')) {
    mailchimpCalls.push({ url: u, method: opts.method || 'GET', body: opts.body });
    if (u.endsWith('/ping')) return new Response(JSON.stringify({ health_status: 'ok' }));
    if (u.includes('/segments')) return new Response(JSON.stringify({ segments: [{ id: 77, name: 'quotidien' }] }));
    if (u.endsWith('/campaigns') && opts.method === 'POST') return new Response(JSON.stringify({ id: 'camp1', web_id: 1 }));
    return new Response('{}');
  }
  return realFetch(url, opts);
};

let cookie = '';
async function call(fn, method, path, body, headers = {}) {
  const req = new Request(`https://lilmod.fr${path}`, {
    method,
    headers: { 'content-type': 'application/json', cookie, 'x-lilmod-admin': '1', ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const res = await fn(req);
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) cookie = setCookie.split(';')[0];
  const type = res.headers.get('content-type') || '';
  return { status: res.status, data: type.includes('json') ? await res.json() : await res.text(), headers: res.headers };
}
const A = (m, p, b, h) => call(admin, m, `/api/admin${p}`, b, h);
const P = (p) => call(api, 'GET', `/api/v1${p}`);

const week = weekOf(new Date());
const nextWeek = addDaysToKey(week.start, 7);

test('accès administration protégé', async () => {
  assert.equal((await A('GET', '/dashboard')).status, 401);
  assert.equal((await A('POST', '/login', { username: 'admin', password: 'faux' })).status, 401);
  const ok = await A('POST', '/login', { username: 'admin', password: process.env.ADMIN_PASSWORD });
  assert.equal(ok.status, 200);
  assert.match(cookie, /^lilmod_admin=/);
  assert.equal((await A('POST', '/courses', { title: 'x' }, { 'x-lilmod-admin': '' })).status, 403, 'anti-CSRF');
});

let ruleId;
test('récurrence + préparer la semaine suivante + modification isolée', async () => {
  const r = await A('POST', '/rules', {
    title: 'La Paracha de la semaine', teacherId: 'ben-ichay', weekdays: [0, 3], time: '20:30', durationMin: 60,
    timezone: 'Asia/Jerusalem', intervalWeeks: 1, startDate: week.start, joinUrl: 'https://zoom.us/j/123', joinPublic: true,
  });
  assert.equal(r.status, 200, JSON.stringify(r.data));
  ruleId = r.data.item.id;
  const prep = await A('POST', '/programme/prepare', { weekStart: nextWeek });
  assert.equal(prep.data.created.length, 2);
  const again = await A('POST', '/programme/prepare', { weekStart: nextWeek });
  assert.equal(again.data.created.length, 0, 'pas de doublon');
  const [first, second] = prep.data.created;
  const edit = await A('PUT', `/courses/${first.id}`, { ...first, title: 'Titre spécial', status: 'scheduled' });
  assert.equal(edit.data.course.title, 'Titre spécial');
  const list = await A('GET', `/courses?weekStart=${nextWeek}`);
  assert.equal(list.data.courses.find((c) => c.id === second.id).title, 'La Paracha de la semaine');
});

test('validation : saisie invalide refusée', async () => {
  const bad = await A('POST', '/courses', { title: 'x', start: 'pas une date', joinUrl: 'javascript:alert(1)' });
  assert.equal(bad.status, 400);
});

let privateId;
test('publication, API publique, liens privés protégés', async () => {
  const priv = await A('POST', '/courses', {
    title: 'Cours réservé', teacherId: 'akerman', start: new Date(Date.parse(week.fromUtc) + 3 * 86400000 + 18 * 3600000).toISOString(),
    joinUrl: 'https://zoom.us/j/999?pwd=secret', joinPublic: false, status: 'scheduled', notes: 'note interne',
  });
  privateId = priv.data.course.id;
  // avant publication : invisible
  let pub = await P(`/programme?from=${week.start}&to=${addDaysToKey(nextWeek, 6)}`);
  assert.equal(pub.data.courses.length, 0);
  const v = await A('GET', `/programme/validate?weekStart=${nextWeek}`);
  assert.ok(Array.isArray(v.data.issues));
  await A('POST', '/programme/publish', { weekStart: week.start });
  const res = await A('POST', '/programme/publish', { weekStart: nextWeek, includeDrafts: true });
  assert.equal(res.data.published.length, 2);
  pub = await P(`/programme?from=${week.start}&to=${addDaysToKey(nextWeek, 6)}`);
  assert.equal(pub.data.courses.length, 3);
  const p = pub.data.courses.find((c) => c.id === privateId);
  assert.equal(p.joinUrl, undefined, 'lien Zoom privé non exposé');
  assert.equal(p.notes, undefined, 'notes internes non exposées');
  const one = await P(`/programme/${privateId}`);
  assert.equal(one.status, 200);
  const ics = await P(`/ics/${privateId}`);
  assert.match(ics.data, /BEGIN:VCALENDAR/);
  assert.doesNotMatch(ics.data, /pwd=secret/);
  const del = await A('DELETE', `/courses/${privateId}`);
  assert.equal(del.status, 409, 'un cours publié ne se supprime pas');
});

test('communications : aperçu, WhatsApp, verrous Mailchimp', async () => {
  const prev = await A('GET', `/comms/preview?kind=weekly&period=${nextWeek}`);
  assert.equal(prev.status, 200);
  assert.match(prev.data.whatsapp, /PROGRAMME DE LA SEMAINE/);
  assert.match(prev.data.whatsapp, /Titre spécial/);
  assert.match(prev.data.html, /Paracha Vayetzei/);
  assert.doesNotMatch(prev.data.html, /\*\|UNSUB\|\*/, 'balises remplacées dans l’aperçu');
  const wa = await A('POST', '/comms/whatsapp', { kind: 'weekly', period: nextWeek, text: prev.data.whatsapp, courseIds: prev.data.courseIds });
  assert.equal(wa.status, 200);

  // Sans clé Mailchimp : erreur claire, site non bloqué
  const noKey = await A('POST', '/comms/email', { kind: 'weekly', period: nextWeek, action: 'draft' });
  assert.equal(noKey.status, 503);
  assert.equal((await P('/programme')).status, 200);

  process.env.MAILCHIMP_API_KEY = 'testkey-us21';
  await A('PUT', '/settings', { mailchimp: { audienceId: 'aud1', testEmails: ['test@example.com'] } });
  const draft = await A('POST', '/comms/email', { kind: 'weekly', period: nextWeek, action: 'test' });
  assert.equal(draft.status, 200, JSON.stringify(draft.data));
  assert.equal(draft.data.record.status, 'test');
  assert.ok(mailchimpCalls.some((c) => c.url.includes('/actions/test')));
  assert.ok(!mailchimpCalls.some((c) => c.url.includes('/actions/send') || c.url.includes('/actions/schedule')), 'aucun envoi réel');

  const locked = await A('POST', '/comms/email', { kind: 'weekly', period: nextWeek, action: 'schedule', confirm: 'ENVOYER', sendAt: new Date(Date.now() + 3600e3).toISOString() });
  assert.equal(locked.status, 403, 'envois réels verrouillés par défaut');
  const noConfirm = await A('PUT', '/settings', { liveSendingEnabled: true });
  assert.equal(noConfirm.status, 400);
  await A('PUT', '/settings', { liveSendingEnabled: true, confirm: 'ACTIVER' });
  const needWord = await A('POST', '/comms/email', { kind: 'weekly', period: nextWeek, action: 'schedule', sendAt: new Date(Date.now() + 3600e3).toISOString() });
  assert.equal(needWord.status, 400, 'confirmation ENVOYER exigée');
  const sched = await A('POST', '/comms/email', { kind: 'weekly', period: nextWeek, action: 'schedule', confirm: 'ENVOYER', sendAt: new Date(Date.now() + 3600e3).toISOString() });
  assert.equal(sched.status, 200, JSON.stringify(sched.data));
  assert.equal(sched.data.record.status, 'scheduled');
  const twice = await A('POST', '/comms/email', { kind: 'weekly', period: nextWeek, action: 'send', confirm: 'ENVOYER' });
  assert.equal(twice.status, 409, 'pas de double envoi');
  await A('PUT', '/settings', { liveSendingEnabled: false });
  delete process.env.MAILCHIMP_API_KEY;
});

test('annulation après envoi : alerte rectificatif', async () => {
  const list = await A('GET', `/courses?weekStart=${nextWeek}`);
  const c = list.data.courses.find((x) => x.title === 'Titre spécial');
  await A('PUT', `/courses/${c.id}`, { ...c, status: 'cancelled' });
  const v = await A('GET', `/programme/validate?weekStart=${nextWeek}`);
  assert.ok(v.data.issues.some((i) => /rectificatif/.test(i.message)));
  const prev = await A('GET', `/comms/preview?kind=weekly&period=${nextWeek}`);
  assert.doesNotMatch(prev.data.whatsapp, /Titre spécial/, 'cours annulé absent des nouveaux messages');
});

test('dupliquer une semaine, corbeille et restauration', async () => {
  const dup = await A('POST', '/programme/duplicate', { fromWeek: nextWeek, toWeek: addDaysToKey(nextWeek, 7) });
  assert.ok(dup.data.created.length >= 1);
  assert.ok(dup.data.created.every((c) => c.status === 'draft'));
  const id = dup.data.created[0].id;
  assert.equal((await A('DELETE', `/courses/${id}`)).status, 200);
  assert.equal((await A('POST', '/courses/restore', { id })).status, 200);
});

test('vidéos : synchronisation, intervenant et série détectés', async () => {
  const sync = await A('POST', '/videos/sync');
  assert.equal(sync.status, 200);
  const cat = await P('/catalog');
  const v = cat.data.videos.find((x) => x.id === 'abc123def45');
  assert.equal(v.teacherId, 'akerman');
  assert.equal(v.seriesId, 'introduction-a-la-tefila');
  assert.ok(cat.data.categories.some((c) => c.id === 'tefila'));
  assert.equal(cat.data.teachers[0].aliases, undefined);
});

test('comptes, sauvegarde, journal', async () => {
  assert.equal((await A('POST', '/users', { username: 'editeur', password: 'court' })).status, 400);
  assert.equal((await A('POST', '/users', { username: 'editeur', password: 'un-long-mot-de-passe', role: 'editor' })).status, 200);
  const backup = await A('GET', '/backup');
  assert.equal(backup.data.version, 1);
  assert.ok(backup.data.courses.length > 0);
  assert.equal((await A('POST', '/backup/restore', { data: backup.data })).status, 400, 'confirmation exigée');
  assert.equal((await A('POST', '/backup/restore', { data: backup.data, confirm: 'RESTAURER' })).status, 200);
  const logs = await A('GET', '/logs');
  assert.ok(logs.data.items.length > 5);
  // l'éditeur ne peut pas lever le verrou des envois
  cookie = '';
  await A('POST', '/login', { username: 'editeur', password: 'un-long-mot-de-passe' });
  assert.equal((await A('PUT', '/settings', { liveSendingEnabled: true, confirm: 'ACTIVER' })).status, 403);
  assert.equal((await A('GET', '/users')).status, 403);
});

test('tâche horaire résistante aux pannes', async () => {
  const saved = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error('réseau indisponible');
  };
  const report = await runHourly(new Date(Date.now() + 30 * 86400000));
  globalThis.fetch = saved;
  assert.ok(report.videosError);
  assert.ok(report.coursesDone >= 1, 'cours passés marqués terminés');
});
