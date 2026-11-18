/**
 * Tâche planifiée (toutes les heures) :
 * 1. Synchronise les nouvelles vidéos YouTube (flux public) dans l'archive, sans rien supprimer.
 * 2. Passe en « Terminé » les cours publiés dont l'horaire est passé.
 * 3. À l'heure de préparation configurée (heure de France), prépare le brouillon
 *    Mailchimp de l'e-mail du jour. Il n'est programmé automatiquement que si
 *    l'administrateur a explicitement activé les envois réels ET l'envoi quotidien automatique.
 * Chaque étape est isolée : un échec est journalisé sans bloquer les autres.
 */
import { courseTiming, localDateKey, zonedParts, zonedTimeToUtc, TZ_FRANCE } from '../../shared/time.js';
import { getCourses, getSettings, log, saveCourses, upsertVideos } from '../lib/data.js';
import { fetchFeed } from '../lib/youtube.js';
import { buildDaily, emailAction, findComm } from '../lib/comms.js';
import { mailchimpConfigured } from '../lib/mailchimp.js';

export async function runHourly(now = new Date()) {
  const report = {};
  try {
    report.videos = await upsertVideos(await fetchFeed());
  } catch (e) {
    report.videosError = e.message;
    await log('tâche.vidéos.erreur', { error: e.message }, { level: 'error' });
  }

  try {
    const courses = await getCourses();
    let done = 0;
    for (const c of courses) {
      if (c.status === 'published' && courseTiming(c, now) === 'past') {
        c.status = c.replayUrl ? 'replay' : 'done';
        done += 1;
      }
    }
    if (done) await saveCourses(courses);
    report.coursesDone = done;
  } catch (e) {
    report.coursesError = e.message;
  }

  try {
    const settings = await getSettings();
    const hourFrance = zonedParts(now, TZ_FRANCE).hour;
    const today = localDateKey(now);
    const site = (process.env.URL || 'https://lilmod.fr').replace(/\/$/, '');
    if (
      mailchimpConfigured() &&
      hourFrance === settings.daily.prepareHour &&
      !(await findComm(`daily:${today}`)) &&
      !(await buildDaily(today, site)).email.empty
    ) {
      const auto = settings.liveSendingEnabled && settings.daily.autoSend;
      const sendAt = zonedTimeToUtc(today, settings.daily.sendTime, TZ_FRANCE).toISOString();
      const record = await emailAction({
        kind: 'daily',
        period: today,
        action: auto ? 'schedule' : 'draft',
        sendAt,
        confirm: auto ? 'ENVOYER' : undefined,
        user: 'tâche planifiée',
        site,
      }).catch(async (e) => {
        await log('tâche.email_quotidien.erreur', { error: e.message }, { level: 'error' });
        return { status: 'failed', error: e.message };
      });
      report.daily = record.status;
    }
  } catch (e) {
    report.dailyError = e.message;
  }
  return report;
}

export default async () => {
  const report = await runHourly();
  return new Response(JSON.stringify(report), { headers: { 'Content-Type': 'application/json' } });
};

export const config = { schedule: '@hourly' };
