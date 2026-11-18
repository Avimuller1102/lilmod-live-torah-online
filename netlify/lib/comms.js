/**
 * Communications générées depuis la base unique des cours.
 *
 * Garde-fous :
 * - chaque communication a une clé d'opération (« weekly:2026-11-15 », « daily:2026-11-18 »…) ;
 * - une communication déjà programmée ou envoyée ne peut pas être renvoyée ni modifiée :
 *   il faut créer un message rectificatif ;
 * - aucun envoi réel aux abonnés tant que « liveSendingEnabled » n'est pas activé
 *   explicitement dans les paramètres, et chaque envoi réel demande une confirmation ;
 * - une erreur Mailchimp ou WhatsApp est journalisée et ne bloque jamais le site.
 */
import { addDaysToKey, localDateKey, weekOf, zonedTimeToUtc, TZ_FRANCE } from '../../shared/time.js';
import { isPublicCourse, makeId } from '../../shared/programme.js';
import { emailDaily, emailWeekly, whatsappDaily, whatsappWeekly } from '../../shared/messages.js';
import { getComms, getCourses, getSettings, getTeachers, log, saveComms } from './data.js';
import * as mailchimp from './mailchimp.js';

export async function fetchParasha(dayKey) {
  try {
    const [y, m, d] = dayKey.split('-').map(Number);
    const res = await fetch(`https://www.hebcal.com/shabbat?cfg=json&geonameid=281184&M=on&lg=fr&gy=${y}&gm=${m}&gd=${d}`);
    if (!res.ok) return '';
    const data = await res.json();
    const item = (data.items || []).find((i) => i.category === 'parashat');
    return item ? String(item.title).replace(/^Parac?hah?t?\s+|^Parashah?t?\s+/i, '') : '';
  } catch {
    return '';
  }
}

async function publishedCoursesBetween(fromKey, toKey) {
  const courses = await getCourses();
  const from = zonedTimeToUtc(fromKey, '00:00', TZ_FRANCE).getTime();
  const to = zonedTimeToUtc(addDaysToKey(toKey, 1), '00:00', TZ_FRANCE).getTime();
  return courses.filter((c) => isPublicCourse(c) && Date.parse(c.start) >= from && Date.parse(c.start) < to);
}

export async function buildWeekly(weekStart, site) {
  const start = weekStart || weekOf(new Date()).start;
  const [courses, teachers, settings, parasha] = await Promise.all([
    publishedCoursesBetween(start, addDaysToKey(start, 6)),
    getTeachers(),
    getSettings(),
    fetchParasha(addDaysToKey(start, 6)),
  ]);
  const poster = settings.weekly?.posters?.[start] || '';
  const opts = {
    teachers, siteUrl: site, weekStart: start, parasha, contactEmail: settings.contactEmail, whatsappUrl: settings.whatsappGroupUrl,
    title: settings.weekly?.title, posterUrl: poster && poster.startsWith('/') ? `${site}${poster}` : poster,
  };
  return { key: `weekly:${start}`, weekStart: start, parasha, courses, email: emailWeekly(courses, opts), whatsapp: whatsappWeekly(courses, opts) };
}

export async function buildDaily(dayKey, site) {
  const day = dayKey || localDateKey(new Date());
  const [courses, teachers, settings] = await Promise.all([publishedCoursesBetween(day, day), getTeachers(), getSettings()]);
  const opts = { teachers, siteUrl: site, dayKey: day, contactEmail: settings.contactEmail, whatsappUrl: settings.whatsappGroupUrl };
  return { key: `daily:${day}`, dayKey: day, courses, email: emailDaily(courses, opts), whatsapp: whatsappDaily(courses, opts) };
}

const FINAL = new Set(['scheduled', 'sent', 'sending']);

async function upsertComm(record) {
  const comms = await getComms();
  const idx = comms.findIndex((c) => c.id === record.id);
  if (idx >= 0) comms[idx] = record;
  else comms.unshift(record);
  await saveComms(comms.slice(0, 500));
  return record;
}

export async function findComm(key, channel = 'email') {
  return (await getComms()).find((c) => c.key === key && c.channel === channel && c.status !== 'failed' && c.status !== 'superseded');
}

/**
 * Action e-mail : 'draft' (crée le brouillon Mailchimp), 'test' (envoi de test aux
 * adresses de test), 'schedule' (programmation) ou 'send' (envoi immédiat).
 */
export async function emailAction({ kind, period, action, sendAt, confirm, testEmails, user, site, correctionNote }) {
  if (!mailchimp.mailchimpConfigured()) {
    throw Object.assign(
      new Error("Mailchimp n'est pas encore connecté (clé MAILCHIMP_API_KEY à ajouter dans Netlify). En attendant, copiez le HTML de l'aperçu dans Mailchimp."),
      { status: 503 },
    );
  }
  const settings = await getSettings();
  const built = kind === 'weekly' ? await buildWeekly(period, site) : await buildDaily(period, site);
  const key = correctionNote ? `${built.key}:rectificatif` : built.key;
  const existing = await findComm(key);

  if (existing && FINAL.has(existing.status) && action !== 'status') {
    throw Object.assign(
      new Error(`Cette communication est déjà ${existing.status === 'sent' ? 'envoyée' : 'programmée'} : elle ne peut plus être modifiée. Créez un message rectificatif si nécessaire.`),
      { status: 409 },
    );
  }

  if ((action === 'schedule' || action === 'send') && !settings.liveSendingEnabled) {
    throw Object.assign(new Error('Les envois réels sont verrouillés. Activez « Autoriser les envois réels » dans les paramètres (administrateur).'), { status: 403 });
  }
  if ((action === 'schedule' || action === 'send') && confirm !== 'ENVOYER') {
    throw Object.assign(new Error('Confirmation requise : saisissez ENVOYER pour valider un envoi aux abonnés.'), { status: 400 });
  }
  if (kind === 'daily' && built.email.empty && action !== 'draft') {
    throw Object.assign(new Error("Aucun cours ce jour-là : pas d'e-mail quotidien à envoyer."), { status: 400 });
  }

  const subject = correctionNote ? `[Rectificatif] ${built.email.subject}` : built.email.subject;
  const html = correctionNote
    ? built.email.html.replace('<tr><td class="pad" style="padding:28px 32px">', `<tr><td class="pad" style="padding:28px 32px"><p style="background:#FFF4D6;border:1px solid #E8C76D;border-radius:8px;padding:12px 14px;font-size:14px"><strong>Rectificatif :</strong> ${correctionNote.replace(/[<>&]/g, '')}</p>`)
    : built.email.html;

  const record = existing || {
    id: makeId('com'),
    key,
    type: correctionNote ? 'correction' : kind,
    channel: 'email',
    label: `${kind === 'weekly' ? 'Newsletter hebdomadaire' : 'E-mail quotidien'} ${period}${correctionNote ? ' (rectificatif)' : ''}`,
    status: 'prepared',
    createdAt: new Date().toISOString(),
  };
  Object.assign(record, { subject, courseIds: built.email.courseIds, updatedAt: new Date().toISOString(), user });

  try {
    const mcSettings = settings.mailchimp;
    if (!record.campaignId) {
      const campaign = await mailchimp.createDraftCampaign({
        audienceId: mcSettings.audienceId,
        tag: kind === 'daily' ? mcSettings.dailyTag : mcSettings.weeklyTag,
        subject,
        previewText: built.email.previewText,
        html,
        fromName: mcSettings.fromName,
        replyTo: mcSettings.replyTo || settings.contactEmail,
        title: `LILMOD ${key}`,
      });
      record.campaignId = campaign.id;
      record.status = 'draft';
    }
    if (action === 'test') {
      const emails = (testEmails?.length ? testEmails : mcSettings.testEmails).slice(0, 5);
      if (!emails.length) throw Object.assign(new Error('Aucune adresse de test configurée.'), { status: 400 });
      await mailchimp.sendTest(record.campaignId, emails);
      record.status = 'test';
      record.lastTestTo = emails;
    } else if (action === 'schedule') {
      const when = new Date(sendAt);
      if (Number.isNaN(when.getTime()) || when.getTime() < Date.now() + 15 * 60_000) {
        throw Object.assign(new Error("L'heure d'envoi doit être au moins 15 minutes dans le futur."), { status: 400 });
      }
      when.setUTCMinutes(Math.ceil(when.getUTCMinutes() / 15) * 15, 0, 0); // Mailchimp : quart d'heure
      await mailchimp.scheduleCampaign(record.campaignId, when.toISOString());
      record.status = 'scheduled';
      record.scheduledFor = when.toISOString();
    } else if (action === 'send') {
      await mailchimp.sendNow(record.campaignId);
      record.status = 'sent';
      record.sentAt = new Date().toISOString();
    }
    await upsertComm(record);
    await log(`email.${action}`, { key, campaignId: record.campaignId, status: record.status }, { user });
    return record;
  } catch (err) {
    record.lastError = err.message;
    if (!record.campaignId) record.status = 'failed';
    await upsertComm(record);
    await log(`email.${action}.erreur`, { key, error: err.message }, { user, level: 'error' });
    throw err;
  }
}

/** Trace la préparation d'un message WhatsApp (copie / ouverture), pour l'historique. */
export async function logWhatsapp({ kind, period, text, courseIds = [], user }) {
  const record = {
    id: makeId('com'),
    key: `${kind}:${period}`,
    type: kind,
    channel: 'whatsapp',
    label: `WhatsApp ${kind === 'weekly' ? 'programme de la semaine' : 'cours du jour'} ${period}`,
    status: 'prepared',
    text: String(text || '').slice(0, 8000),
    courseIds,
    createdAt: new Date().toISOString(),
    user,
  };
  await upsertComm(record);
  await log('whatsapp.prepare', { key: record.key }, { user });
  return record;
}
