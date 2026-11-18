/**
 * /programme/:id — fiche d'un cours (page d'arrivée des liens WhatsApp et e-mail).
 * Parcours : lien reçu → fiche → bouton « Rejoindre le cours ».
 */
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarPlus, Check, Copy, FileText, MessageCircle, PlayCircle, Radio } from 'lucide-react';
import { useData, usePublicSettings, type Course, type Teacher } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import { CourseStatusBadge, DualTime, EmptyState, PLATFORM_LABEL, TeacherAvatar } from '@/components/ui';
import { useNow } from '@/components/home/UpNext';
import { courseEnd, courseTiming, formatDayKey, localDateKey, localTime, TZ_FRANCE } from '../../shared/time.js';
import { googleCalendarUrl, whatsappShareUrl } from '../../shared/messages.js';
import { CATEGORIES } from '../../shared/catalog.js';

const CoursePage = () => {
  const { id = '' } = useParams();
  const { data, loading, error } = useData<{ course: Course; teacher: Teacher }>(`/api/v1/programme/${encodeURIComponent(id)}`);
  const settings = usePublicSettings();
  const now = useNow(30_000);
  const [copied, setCopied] = useState(false);
  const course = data?.course;
  const teacher = data?.teacher?.id ? data.teacher : undefined;
  useSeo(course ? course.title : 'Cours', course ? `${formatDayKey(localDateKey(course.start))} à ${localTime(course.start)} (heure d'Israël)${teacher ? ` avec ${teacher.name}` : ''}. ${course.description || ''}` : undefined);

  if (loading)
    return (
      <div className="container-custom pb-20 pt-32">
        <div className="h-8 w-2/3 animate-pulse rounded bg-neutral-200" />
        <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
      </div>
    );
  if (error || !course)
    return (
      <div className="container-custom pb-20 pt-32">
        <EmptyState title="Ce cours est introuvable">
          Il a peut-être été déplacé ou n'est pas encore publié. <Link to="/programme" className="font-semibold text-primary-700 underline">Voir le programme de la semaine</Link>.
        </EmptyState>
      </div>
    );

  const timing = courseTiming(course, now);
  const site = window.location.origin;
  const pageUrl = `${site}/programme/${course.id}`;
  const canJoin = (timing === 'live' || timing === 'upcoming') && course.joinPublic && course.joinUrl;
  const minutesToStart = Math.round((Date.parse(course.start) - now.getTime()) / 60000);
  const theme = CATEGORIES.find((c) => c.id === course.category);
  const shareText = `LILMOD — ${course.title}\n${formatDayKey(localDateKey(course.start))} à ${localTime(course.start).replace(':', 'h')} (Israël)${teacher ? `\nAvec ${teacher.name}` : ''}\n${pageUrl}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copiez le lien du cours :', pageUrl);
    }
  };

  return (
    <article>
      <header className="bg-gradient-hero pb-10 pt-24 text-white md:pb-14 md:pt-32">
        <div className="container-custom">
          <Link to="/programme" className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-200 hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Programme de la semaine
          </Link>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <CourseStatusBadge course={course} now={now} />
            {theme && <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">{theme.label}</span>}
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">{PLATFORM_LABEL[course.platform] || 'En ligne'}</span>
            {course.organizer && <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-white">{course.organizer === 'LILMOD' ? 'LILMOD' : `Avec ${course.organizer}`}</span>}
          </div>
          <h1 className={`max-w-3xl font-display text-3xl font-semibold leading-tight text-white md:text-5xl ${timing === 'cancelled' ? 'line-through decoration-2' : ''}`}>{course.title}</h1>
          {teacher && (
            <Link to={`/intervenants/${teacher.id}`} className="mt-4 inline-flex items-center gap-3 rounded-full pr-3 hover:bg-white/10">
              <TeacherAvatar teacher={teacher} size={44} />
              <span className="font-semibold text-white">{teacher.name}</span>
            </Link>
          )}
        </div>
      </header>

      <div className="container-custom grid gap-8 py-8 md:py-12 lg:grid-cols-[1fr_360px]">
        <div className="order-2 lg:order-1">
          {timing === 'cancelled' && (
            <p className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-800">Ce cours est annulé.</p>
          )}
          {course.description ? (
            <div className="whitespace-pre-line text-[17px] leading-8 text-neutral-800">{course.description}</div>
          ) : (
            <p className="text-neutral-500">La description de ce cours sera bientôt complétée.</p>
          )}
          {course.pdfUrl && (
            <a href={course.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn-outline mt-6">
              <FileText className="h-4 w-4" aria-hidden="true" /> Support de cours (PDF)
            </a>
          )}
          {teacher && (
            <div className="mt-10 flex items-start gap-4 rounded-2xl border border-neutral-200/80 bg-white p-5">
              <TeacherAvatar teacher={teacher} size={64} />
              <div>
                <p className="font-display text-lg font-semibold text-neutral-950">{teacher.name}</p>
                {teacher.specialty && <p className="text-sm text-accent-700">{teacher.specialty}</p>}
                <Link to={`/intervenants/${teacher.id}`} className="mt-2 inline-block text-sm font-semibold text-primary-700 hover:underline">
                  Tous ses cours et replays →
                </Link>
              </div>
            </div>
          )}
        </div>

        <aside className="order-1 lg:order-2">
          <div className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-[0_24px_60px_-40px_rgba(15,30,54,0.5)] lg:sticky lg:top-24">
            <p className="text-sm font-bold uppercase tracking-wider text-accent-700">{formatDayKey(localDateKey(course.start), { withYear: true })}</p>
            <p className="mt-2 text-lg text-neutral-900">
              <DualTime iso={course.start} />
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              Fin prévue : {localTime(courseEnd(course).toISOString()).replace(':', 'h')} (Israël) · {localTime(courseEnd(course).toISOString(), TZ_FRANCE).replace(':', 'h')} (France)
            </p>

            {timing === 'upcoming' && minutesToStart <= 120 && minutesToStart > 0 && (
              <p className="mt-4 rounded-xl bg-primary-50 px-3 py-2 text-sm font-semibold text-primary-800">Commence dans {minutesToStart} min</p>
            )}

            <div className="mt-5 grid gap-2">
              {canJoin && (
                <a
                  href={course.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex min-h-[56px] items-center justify-center gap-2 rounded-2xl px-5 text-lg font-semibold text-white ${timing === 'live' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700 hover:bg-primary-800'}`}
                >
                  <Radio className="h-5 w-5" aria-hidden="true" />
                  Rejoindre le cours
                </a>
              )}
              {!canJoin && (timing === 'live' || timing === 'upcoming') && (
                <p className="rounded-xl bg-sand-100 p-3 text-sm text-neutral-700">
                  Le lien de participation est envoyé aux inscrits.{' '}
                  <a href={settings.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-700 underline">Rejoindre le groupe WhatsApp</a>
                </p>
              )}
              {course.replayUrl && (
                <a href={course.replayUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[52px] items-center justify-center gap-2 rounded-2xl bg-accent-500 px-5 font-semibold text-white hover:bg-accent-600">
                  <PlayCircle className="h-5 w-5" aria-hidden="true" /> Voir le replay
                </a>
              )}
              {timing === 'upcoming' && (
                <div className="grid grid-cols-2 gap-2">
                  <a href={googleCalendarUrl(course, { siteUrl: site, teacher: teacher?.name })} target="_blank" rel="noopener noreferrer" className="btn-outline px-3 text-sm">
                    <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Google Agenda
                  </a>
                  <a href={`/api/v1/ics/${encodeURIComponent(course.id)}`} className="btn-outline px-3 text-sm">
                    <CalendarPlus className="h-4 w-4" aria-hidden="true" /> Fichier .ics
                  </a>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <a href={whatsappShareUrl(shareText)} target="_blank" rel="noopener noreferrer" className="btn-outline px-3 text-sm">
                  <MessageCircle className="h-4 w-4 text-green-600" aria-hidden="true" /> Partager
                </a>
                <button type="button" onClick={copy} className="btn-outline px-3 text-sm" aria-live="polite">
                  {copied ? <Check className="h-4 w-4 text-green-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                  {copied ? 'Lien copié' : 'Copier le lien'}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
};

export default CoursePage;
