/**
 * Génération des communications à partir de la base unique des cours :
 * messages WhatsApp, e-mails (hebdomadaire et quotidien), liens calendrier.
 */
import {
  TZ_FRANCE,
  TZ_ISRAEL,
  addDaysToKey,
  courseEnd,
  dualTimes,
  formatDayKey,
  localDateKey,
} from './time.js';
import { coursesOfDay, sortByStart } from './programme.js';

const h = (t) => t.replace(':', 'h');

export function courseUrl(siteUrl, course) {
  return `${siteUrl}/programme/${encodeURIComponent(course.id)}`;
}

function teacherName(course, teachers) {
  return teachers.find((t) => t.id === course.teacherId)?.name || '';
}

function timeLabel(course) {
  const { il, fr } = dualTimes(course.start);
  return `${h(fr)} (${h(il)} Israël)`;
}

/** Cours à annoncer : on exclut toujours les annulés et les non publics. */
function announceable(courses) {
  return sortByStart(courses.filter((c) => c.status !== 'cancelled' && c.visibility !== 'private' && c.start));
}

/* ------------------------------------------------------------------ */
/* WhatsApp                                                            */
/* ------------------------------------------------------------------ */

export function whatsappWeekly(courses, { teachers = [], siteUrl, weekStart, parasha = '' }) {
  const list = announceable(courses);
  const lines = ['*LILMOD — PROGRAMME DE LA SEMAINE*'];
  if (parasha) lines.push(`_Paracha ${parasha}_`);
  lines.push('');
  for (let i = 0; i < 7; i++) {
    const day = addDaysToKey(weekStart, i);
    const ofDay = coursesOfDay(list, day);
    if (!ofDay.length) continue;
    lines.push(`*${formatDayKey(day)}*`);
    for (const c of ofDay) {
      lines.push(`${timeLabel(c)} — ${c.title}`);
      const t = teacherName(c, teachers);
      if (t) lines.push(`Avec ${t}`);
    }
    lines.push('');
  }
  if (lines.length <= 3) lines.push('Le programme de la semaine sera bientôt publié.', '');
  lines.push('Retrouvez tous les horaires et les liens sur :', `${siteUrl}/programme/`);
  return lines.join('\n');
}

export function whatsappDaily(courses, { teachers = [], siteUrl, dayKey, includeLinks = true }) {
  const ofDay = coursesOfDay(announceable(courses), dayKey);
  const lines = ["*LILMOD — LES COURS D'AUJOURD'HUI*", `_${formatDayKey(dayKey)}_`, ''];
  if (!ofDay.length) {
    lines.push("Pas de cours programmé aujourd'hui.", '');
  }
  ofDay.forEach((c, i) => {
    lines.push(`*${i + 1}. ${c.title}*`);
    lines.push(`🕐 ${timeLabel(c)}`);
    const t = teacherName(c, teachers);
    if (t) lines.push(`👤 ${t}`);
    if (includeLinks && c.joinPublic && c.joinUrl) lines.push(`▶️ ${c.joinUrl}`);
    else lines.push(`🔗 ${courseUrl(siteUrl, c)}`);
    lines.push('');
  });
  lines.push('Programme complet :', `${siteUrl}/programme/`);
  return lines.join('\n');
}

export function whatsappShareUrl(text) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

/* ------------------------------------------------------------------ */
/* E-mails (HTML compatible Mailchimp, lisible sur mobile)             */
/* ------------------------------------------------------------------ */

export const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);

const COLORS = { navy: '#10243D', gold: '#B88A24', sand: '#F8F5EF', text: '#262626', muted: '#5f6670', line: '#E8E2D6' };

const YOUTUBE_URL = 'https://www.youtube.com/@Lilmodfr';

/** Gabarit e-mail inspiré de la newsletter LILMOD habituelle (colonne centrée, blocs par jour). */
/** Lien « Le programme complet et les horaires sur lilmod.fr » en bas des e-mails : retiré à la demande de l'équipe (remettre à true pour le réafficher). */
const SHOW_PROGRAMME_LINK = false;

function emailShell({ siteUrl, preheader, title, subtitle, body, contactEmail, whatsappUrl, posterUrl }) {
  const btn = (href, label, bg) =>
    `<a class="btn" href="${escapeHtml(href)}" style="display:inline-block;background:${bg};color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 26px;border-radius:24px">${label}</a>`;
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title>
<style>@media (max-width:620px){.wrap{width:100%!important}.pad{padding:18px!important}.btn{display:block!important}}</style></head>
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:${COLORS.text}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:20px 10px">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px">
<tr><td align="center" class="pad" style="background:${COLORS.navy};background-image:linear-gradient(140deg,#0F1E36 0%,#172C4D 55%,#0A1426 100%);border-radius:18px 18px 0 0;padding:30px 28px 26px">
<a href="${siteUrl}/"><img src="${siteUrl}/icons/icon-192.png" width="76" height="76" alt="LILMOD" style="display:block;border-radius:50%;border:3px solid #CFA653;background:#ffffff"></a>
<p style="margin:14px 0 0;font-size:12px;font-weight:bold;letter-spacing:3px;text-transform:uppercase;color:#E8C76D">LILMOD · La Torah en direct d'Israël</p>
<h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:28px;line-height:1.25;font-weight:normal;color:#ffffff">${escapeHtml(title)}</h1>
${subtitle ? `<p style="margin:10px 0 0;font-size:15px;color:#E8C76D">${escapeHtml(subtitle)}</p>` : ''}
</td></tr>
<tr><td style="height:6px;background:#CFA653;background-image:linear-gradient(90deg,#9A722B,#E8C76D,#9A722B);font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="height:18px;font-size:0;line-height:0">&nbsp;</td></tr>
${posterUrl ? `<tr><td align="center" style="padding:0 0 18px"><img src="${escapeHtml(posterUrl)}" width="600" alt="Programme de la semaine" style="display:block;width:100%;max-width:600px;height:auto"></td></tr>` : ''}
<tr><td class="pad" style="padding:0 24px">${body}</td></tr>
<tr><td align="center" class="pad" style="padding:26px 24px;border-top:1px solid ${COLORS.line}">
<p style="margin:0 0 4px;font-size:22px;font-weight:bold;color:#25D366">WhatsApp</p>
<p style="margin:0 0 14px;font-size:14px;line-height:1.6;color:${COLORS.text}">LILMOD diffuse chaque jour les cours du jour sur WhatsApp.<br>Retrouvez toutes les infos sur le groupe.</p>
${whatsappUrl ? btn(whatsappUrl, 'Rejoindre le groupe WhatsApp', '#25D366') : ''}
</td></tr>
<tr><td align="center" class="pad" style="padding:26px 24px;border-top:1px solid ${COLORS.line}">
<p style="margin:0 0 4px;font-size:22px;font-weight:bold;color:#FF0000">YouTube</p>
<p style="margin:0 0 14px;font-size:14px;line-height:1.6">Abonnez-vous à notre chaîne pour revoir tous les replays.</p>
${btn(YOUTUBE_URL, 'Voir les replays', '#E62117')}
${SHOW_PROGRAMME_LINK ? `<p style="margin:16px 0 0;font-size:14px"><a href="${siteUrl}/programme/" style="color:${COLORS.navy};font-weight:bold">Le programme complet et les horaires sur lilmod.fr</a></p>` : ''}
</td></tr>
<tr><td align="center" class="pad" style="padding:22px 24px;border-top:1px solid ${COLORS.line};font-size:12px;line-height:1.6;color:${COLORS.muted}">
LILMOD by Torah MiTzion — cours de Torah en français, en direct d'Israël.<br>
${contactEmail ? `Contact : <a href="mailto:${escapeHtml(contactEmail)}" style="color:${COLORS.muted}">${escapeHtml(contactEmail)}</a><br>` : ''}
Vous recevez cet e-mail car vous êtes inscrit(e) aux communications LILMOD.<br>
<a href="*|UPDATE_PROFILE|*" style="color:${COLORS.muted}">Gérer mes préférences</a> · <a href="*|UNSUB|*" style="color:${COLORS.muted}">Se désinscrire</a><br>*|LIST:ADDRESSLINE|*
</td></tr></table></td></tr></table></body></html>`;
}

/** Un cours : intervenant, heure (France puis Israël), titre, lien Zoom cliquable, organisateur, bouton. */
function courseBlockHtml(c, { teachers, siteUrl }) {
  const t = teacherName(c, teachers);
  const { il, fr } = dualTimes(c.start);
  const link = c.joinUrl || courseUrl(siteUrl, c);
  const isZoom = /zoom\.us/i.test(c.joinUrl || '');
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:14px 0 18px">
${t ? `<p style="margin:0;font-size:16px;font-weight:bold;text-decoration:underline;color:${COLORS.navy}">${escapeHtml(t)}</p>` : ''}
<p style="margin:2px 0 8px;font-size:15px;font-weight:bold;color:#C8102E">${h(fr)} France <span style="font-weight:normal;color:${COLORS.muted}">(${h(il)} Israël)</span></p>
<p style="margin:0 0 8px;font-size:17px;line-height:1.4;font-weight:bold;color:${COLORS.text}">${escapeHtml(c.title)}</p>
${c.description ? `<p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:${COLORS.muted}">${escapeHtml(c.description).slice(0, 260)}</p>` : ''}
${c.joinUrl ? `<p style="margin:0 0 10px;font-size:13px;line-height:1.4;word-break:break-all"><a href="${escapeHtml(c.joinUrl)}" style="color:#1a73e8">${escapeHtml(c.joinUrl)}</a></p>` : ''}
${c.organizer ? `<p style="margin:0 0 12px;font-size:12px;font-weight:bold;letter-spacing:.3px;color:${COLORS.text}">By ${escapeHtml(c.organizer.toUpperCase())}</p>` : ''}
<a class="btn" href="${escapeHtml(link)}" style="display:inline-block;background:#1a73e8;color:#ffffff;text-decoration:none;font-weight:bold;font-size:15px;padding:13px 26px;border-radius:24px">${isZoom ? 'Rejoindre le cours sur Zoom' : c.joinUrl ? 'Rejoindre le cours' : 'Voir le cours'}</a>
</td></tr></table>`;
}

function dayBlocksHtml(list, days, opts) {
  let body = '';
  for (const day of days) {
    const ofDay = coursesOfDay(list, day);
    if (!ofDay.length) continue;
    body += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:20px 0 4px;border-top:1px solid ${COLORS.line}">
<p style="margin:0;font-size:15px;font-weight:bold;text-decoration:underline;color:${COLORS.text}">${escapeHtml(formatDayKey(day))}</p>
</td></tr></table>${ofDay.map((c) => courseBlockHtml(c, opts)).join('')}`;
  }
  return body;
}

export function emailWeekly(courses, { teachers = [], siteUrl, weekStart, parasha = '', contactEmail = '', whatsappUrl = '', title = '', posterUrl = '' }) {
  const list = announceable(courses);
  const days = Array.from({ length: 7 }, (_, i) => addDaysToKey(weekStart, i));
  let body = dayBlocksHtml(list, days, { teachers, siteUrl });
  if (!body) body = `<p style="font-size:15px;text-align:center">Le programme de la semaine sera bientôt publié sur <a href="${siteUrl}/programme/">lilmod.fr</a>.</p>`;
  const heading = title || 'Programme de la semaine LILMOD';
  return {
    subject: `${heading}${parasha ? ` · Paracha ${parasha}` : ''}`,
    previewText: `${list.length} cours cette semaine, en direct d'Israël`,
    html: emailShell({ siteUrl, preheader: `${list.length} cours cette semaine`, title: heading, subtitle: [`Semaine du ${formatDayKey(weekStart)}`, parasha && `Paracha ${parasha}`].filter(Boolean).join(' · '), body, contactEmail, whatsappUrl, posterUrl }),
    courseIds: list.map((c) => c.id),
  };
}

export function emailDaily(courses, { teachers = [], siteUrl, dayKey, contactEmail = '', whatsappUrl = '' }) {
  const ofDay = coursesOfDay(announceable(courses), dayKey);
  const body = ofDay.length ? dayBlocksHtml(ofDay, [dayKey], { teachers, siteUrl }) : `<p style="font-size:15px;text-align:center">Pas de cours programmé aujourd'hui.</p>`;
  const title = "Les cours d'aujourd'hui";
  return {
    subject: `LILMOD — ${title} (${formatDayKey(dayKey)})`,
    previewText: `${ofDay.length} cours aujourd'hui`,
    html: emailShell({ siteUrl, preheader: `${ofDay.length} cours aujourd'hui`, title, subtitle: formatDayKey(dayKey), body, contactEmail, whatsappUrl }),
    courseIds: ofDay.map((c) => c.id),
    empty: ofDay.length === 0,
  };
}

/** Remplace les balises Mailchimp pour un aperçu dans l'administration. */
export function previewMergeTags(html) {
  return html
    .replace(/\*\|UNSUB\|\*/g, '#')
    .replace(/\*\|UPDATE_PROFILE\|\*/g, '#')
    .replace(/\*\|LIST:ADDRESSLINE\|\*/g, '[Adresse postale de la liste Mailchimp]');
}

/* ------------------------------------------------------------------ */
/* Calendriers                                                         */
/* ------------------------------------------------------------------ */

const icsDate = (d) => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const icsEscape = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1');

export function courseToIcs(course, { siteUrl, teacher = '' }) {
  const url = courseUrl(siteUrl, course);
  const desc = [teacher && `Avec ${teacher}`, course.description, course.joinPublic && course.joinUrl ? `Rejoindre : ${course.joinUrl}` : '', `Détails : ${url}`]
    .filter(Boolean)
    .join('\n\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LILMOD//Programme//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${course.id}@lilmod.fr`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(course.start)}`,
    `DTEND:${icsDate(courseEnd(course))}`,
    `SUMMARY:${icsEscape(`LILMOD — ${course.title}`)}`,
    `DESCRIPTION:${icsEscape(desc)}`,
    `URL:${url}`,
    course.status === 'cancelled' ? 'STATUS:CANCELLED' : 'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function googleCalendarUrl(course, { siteUrl, teacher = '' }) {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `LILMOD — ${course.title}`,
    dates: `${icsDate(course.start)}/${icsDate(courseEnd(course))}`,
    details: [teacher && `Avec ${teacher}`, course.description, `Détails : ${courseUrl(siteUrl, course)}`].filter(Boolean).join('\n\n'),
    location: course.joinPublic && course.joinUrl ? course.joinUrl : courseUrl(siteUrl, course),
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export { TZ_FRANCE, TZ_ISRAEL, localDateKey };
