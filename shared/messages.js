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
  const { il, fr, same } = dualTimes(course.start);
  return same ? h(il) : `${h(il)} Israël · ${h(fr)} France`;
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

function emailShell({ siteUrl, preheader, title, subtitle, body, contactEmail, whatsappUrl }) {
  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title>
<style>@media (max-width:620px){.wrap{width:100%!important}.pad{padding:20px!important}.btn{display:block!important;text-align:center!important}}</style></head>
<body style="margin:0;padding:0;background:${COLORS.sand};font-family:Arial,Helvetica,sans-serif;color:${COLORS.text}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.sand}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#ffffff;border-radius:14px;overflow:hidden">
<tr><td style="background:${COLORS.navy};padding:28px 32px" class="pad">
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td><img src="${siteUrl}/icons/icon-192.png" width="52" height="52" alt="LILMOD" style="display:block;border-radius:50%;border:2px solid ${COLORS.gold}"></td>
<td style="padding-left:14px;color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:.5px">LILMOD<div style="font-size:12px;font-weight:normal;color:#E8C76D;letter-spacing:2px;text-transform:uppercase">La Torah en direct d'Israël</div></td>
</tr></table>
<h1 style="margin:22px 0 4px;color:#ffffff;font-size:24px;line-height:1.25">${escapeHtml(title)}</h1>
${subtitle ? `<p style="margin:0;color:#c9d6ea;font-size:15px">${escapeHtml(subtitle)}</p>` : ''}
</td></tr>
<tr><td class="pad" style="padding:28px 32px">${body}</td></tr>
<tr><td class="pad" style="padding:0 32px 28px">
<a class="btn" href="${siteUrl}/programme/" style="display:inline-block;background:${COLORS.navy};color:#ffffff;text-decoration:none;font-weight:bold;padding:13px 22px;border-radius:8px;margin:0 8px 8px 0">Programme complet</a>
<a class="btn" href="${siteUrl}/cours/" style="display:inline-block;background:${COLORS.sand};color:${COLORS.navy};text-decoration:none;font-weight:bold;padding:13px 22px;border-radius:8px;border:1px solid ${COLORS.line}">Derniers replays</a>
</td></tr>
<tr><td style="background:${COLORS.sand};padding:22px 32px;font-size:12px;line-height:1.6;color:${COLORS.muted}" class="pad">
LILMOD by Torah MiTzion — cours de Torah en français, en direct de Jérusalem.<br>
${contactEmail ? `Contact : <a href="mailto:${escapeHtml(contactEmail)}" style="color:${COLORS.muted}">${escapeHtml(contactEmail)}</a><br>` : ''}
${whatsappUrl ? `<a href="${escapeHtml(whatsappUrl)}" style="color:${COLORS.muted}">Rejoindre le groupe WhatsApp</a> · ` : ''}<a href="${siteUrl}/" style="color:${COLORS.muted}">lilmod.fr</a><br><br>
Vous recevez cet e-mail car vous êtes inscrit(e) aux communications LILMOD.<br>
<a href="*|UPDATE_PROFILE|*" style="color:${COLORS.muted}">Gérer mes préférences</a> · <a href="*|UNSUB|*" style="color:${COLORS.muted}">Se désinscrire</a><br>*|LIST:ADDRESSLINE|*
</td></tr></table></td></tr></table></body></html>`;
}

function courseRowHtml(c, { teachers, siteUrl, withButton }) {
  const t = teacherName(c, teachers);
  const { il, fr, same } = dualTimes(c.start);
  const join = withButton && c.joinPublic && c.joinUrl ? c.joinUrl : courseUrl(siteUrl, c);
  return `<tr><td style="padding:14px 0;border-bottom:1px solid ${COLORS.line}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td width="92" valign="top" style="font-size:18px;font-weight:bold;color:${COLORS.navy}">${h(il)}<div style="font-size:11px;font-weight:normal;color:${COLORS.muted}">${same ? 'Israël / France' : `Israël<br>${h(fr)} France`}</div></td>
<td valign="top"><div style="font-size:16px;font-weight:bold;color:${COLORS.text};line-height:1.35">${escapeHtml(c.title)}</div>
${t ? `<div style="font-size:14px;color:${COLORS.gold};margin-top:2px">${escapeHtml(t)}</div>` : ''}
${c.description ? `<div style="font-size:13px;color:${COLORS.muted};margin-top:4px;line-height:1.5">${escapeHtml(c.description).slice(0, 220)}</div>` : ''}
<a href="${escapeHtml(join)}" style="display:inline-block;margin-top:8px;font-size:13px;font-weight:bold;color:${COLORS.navy}">${withButton && c.joinPublic && c.joinUrl ? 'Rejoindre le cours →' : 'Voir le cours →'}</a>
</td></tr></table></td></tr>`;
}

export function emailWeekly(courses, { teachers = [], siteUrl, weekStart, parasha = '', contactEmail = '', whatsappUrl = '' }) {
  const list = announceable(courses);
  let body = '';
  for (let i = 0; i < 7; i++) {
    const day = addDaysToKey(weekStart, i);
    const ofDay = coursesOfDay(list, day);
    if (!ofDay.length) continue;
    body += `<h2 style="margin:22px 0 4px;font-size:15px;letter-spacing:1px;text-transform:uppercase;color:${COLORS.gold}">${escapeHtml(formatDayKey(day))}</h2>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${ofDay.map((c) => courseRowHtml(c, { teachers, siteUrl, withButton: false })).join('')}</table>`;
  }
  if (!body) body = `<p style="font-size:15px">Le programme de la semaine sera bientôt publié sur <a href="${siteUrl}/programme/">lilmod.fr</a>.</p>`;
  const title = `Programme de la semaine du ${formatDayKey(weekStart)}`;
  return {
    subject: `LILMOD — ${title}${parasha ? ` · Paracha ${parasha}` : ''}`,
    previewText: `${list.length} cours cette semaine en direct d'Israël`,
    html: emailShell({ siteUrl, preheader: `${list.length} cours cette semaine`, title, subtitle: parasha ? `Paracha ${parasha}` : '', body, contactEmail, whatsappUrl }),
    courseIds: list.map((c) => c.id),
  };
}

export function emailDaily(courses, { teachers = [], siteUrl, dayKey, contactEmail = '', whatsappUrl = '' }) {
  const ofDay = coursesOfDay(announceable(courses), dayKey);
  const body = ofDay.length
    ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${ofDay.map((c) => courseRowHtml(c, { teachers, siteUrl, withButton: true })).join('')}</table>`
    : `<p style="font-size:15px">Pas de cours programmé aujourd'hui.</p>`;
  const title = `Les cours d'aujourd'hui — ${formatDayKey(dayKey)}`;
  return {
    subject: `LILMOD — ${title}`,
    previewText: `${ofDay.length} cours aujourd'hui`,
    html: emailShell({ siteUrl, preheader: `${ofDay.length} cours aujourd'hui`, title, subtitle: '', body, contactEmail, whatsappUrl }),
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
