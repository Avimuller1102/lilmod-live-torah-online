/**
 * Accueil — sections alimentées par les données réelles :
 * aperçu de la semaine, derniers replays, thèmes, intervenants, communauté.
 */
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CalendarDays, Mail, MessageCircle } from 'lucide-react';
import { teacherById, useCatalog, useProgramme, usePublicSettings } from '@/lib/api';
import { CardSkeleton, SectionHeader, TeacherAvatar, VideoCard } from '@/components/ui';
import { formatDayKey, localDateKey, localTime, weekOf, WEEKDAYS_FR } from '../../../shared/time.js';

/* Programme de la semaine ------------------------------------------------ */

export function WeekPreview() {
  const { data } = useProgramme();
  const week = weekOf(new Date());
  const today = localDateKey(new Date());
  const byDay = useMemo(() => {
    const map = new Map<string, NonNullable<typeof data>['courses']>();
    for (const day of week.days) map.set(day, []);
    for (const c of data?.courses || []) {
      const k = localDateKey(c.start);
      if (map.has(k) && c.status !== 'cancelled') map.get(k)!.push(c);
    }
    return map;
  }, [data, week.days]);
  const total = [...byDay.values()].reduce((n, l) => n + l.length, 0);
  if (!total) return null;
  const teachers = data?.teachers || [];

  return (
    <section aria-labelledby="semaine-title" className="section-padding">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Programme de la semaine"
          title={`${total} cours cette semaine`}
          subtitle={`Du ${formatDayKey(week.start)} au ${formatDayKey(week.end)}. Horaires à l'heure de France (heure d'Israël entre parenthèses).`}
          action={
            <Link to="/programme" className="btn-primary">
              Consulter le programme complet
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        <h2 id="semaine-title" className="sr-only">Aperçu du programme</h2>
        <ol className="carousel-lg lg:grid-cols-7 lg:gap-3">
          {week.days.map((day, i) => {
            const list = byDay.get(day) || [];
            const isToday = day === today;
            return (
              <li key={day} className={`rounded-2xl border p-4 ${isToday ? 'border-accent-300 bg-accent-50/60' : 'border-neutral-200/80 bg-white'}`}>
                <p className={`text-sm font-bold ${isToday ? 'text-accent-700' : 'text-neutral-900'}`}>
                  {WEEKDAYS_FR[i]} {isToday && <span className="font-medium">· aujourd'hui</span>}
                </p>
                <p className="text-xs text-neutral-500">{formatDayKey(day).split(' ').slice(1).join(' ')}</p>
                {list.length === 0 ? (
                  <p className="mt-3 text-sm text-neutral-400">—</p>
                ) : (
                  <ul className="mt-3 space-y-2.5">
                    {list.map((c) => (
                      <li key={c.id}>
                        <Link to={`/programme/${c.id}`} className="block rounded-lg hover:text-primary-700">
                          <span className="text-xs font-bold text-primary-700">{localTime(c.start).replace(':', 'h')}</span>
                          <span className="line-clamp-2 text-sm font-medium leading-snug text-neutral-900">{c.title}</span>
                          <span className="text-xs text-neutral-500">{teacherById(teachers, c.teacherId)?.shortName || teacherById(teachers, c.teacherId)?.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* Derniers replays ------------------------------------------------------- */

export function LatestReplays() {
  const { data, loading } = useCatalog();
  const videos = (data?.videos || []).slice(0, 8);
  if (!loading && !videos.length) return null;
  return (
    <section id="videos" aria-labelledby="replays-title" className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Replays"
          title="Les derniers cours publiés"
          subtitle="Les enseignements récents, disponibles en vidéo dès leur mise en ligne sur YouTube."
          action={
            <Link to="/cours" className="btn-outline">
              Toute la bibliothèque
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        <h2 id="replays-title" className="sr-only">Derniers replays</h2>
        <div className="carousel-sm sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {loading ? <CardSkeleton count={4} video /> : videos.map((v, i) => <VideoCard key={v.id} video={v} teacher={teacherById(data?.teachers, v.teacherId)} priority={i < 2} />)}
        </div>
      </div>
    </section>
  );
}

/* Thèmes ------------------------------------------------------------------ */

export function Themes() {
  const { data } = useCatalog();
  const categories = data?.categories || [];
  if (!categories.length) return null;
  return (
    <section aria-labelledby="themes-title" className="section-padding section-band">
      <div className="container-custom">
        <SectionHeader eyebrow="Explorer" title="Explorer par thème" subtitle="Les thèmes apparaissent selon les cours réellement disponibles." />
        <h2 id="themes-title" className="sr-only">Thèmes</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.id}>
              <Link to={`/cours?theme=${c.id}`} className="group flex h-full min-h-[84px] items-center justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 transition-colors hover:border-accent-300 hover:bg-accent-50/40">
                <span>
                  <span className="block font-display text-[17px] font-semibold leading-snug text-neutral-950">{c.label}</span>
                  <span className="text-xs text-neutral-500">{c.count} cours</span>
                </span>
                <BookOpen className="h-5 w-5 flex-shrink-0 text-accent-500 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Intervenants ------------------------------------------------------------ */

export function TeachersStrip() {
  const { data } = useCatalog();
  const teachers = data?.teachers || [];
  if (!teachers.length) return null;
  return (
    <section id="speakers" aria-labelledby="intervenants-title" className="section-padding bg-white">
      <div className="container-custom">
        <SectionHeader
          eyebrow="Intervenants"
          title="Nos Rabbanim et enseignants"
          subtitle="Des enseignants francophones, depuis Israël."
          action={
            <Link to="/intervenants" className="btn-outline">
              Tous les intervenants
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />
        <h2 id="intervenants-title" className="sr-only">Intervenants</h2>
        <ul className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 lg:grid-cols-6">
          {teachers.map((t) => (
            <li key={t.id}>
              <Link to={`/intervenants/${t.id}`} className="group block text-center">
                <span className="mx-auto block aspect-square w-full max-w-[140px] overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-neutral-200">
                  {t.photo ? (
                    <img src={t.photo} alt="" loading="lazy" decoding="async" width={140} height={140} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary-700 to-primary-900">
                      <TeacherAvatar teacher={t} size={64} />
                    </span>
                  )}
                </span>
                <span className="mt-2 block text-[13px] font-semibold leading-tight text-neutral-900 group-hover:text-primary-700 sm:text-sm">{t.name}</span>
                {t.specialty && <span className="mt-0.5 hidden text-xs text-neutral-500 sm:block">{t.specialty}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* Communauté --------------------------------------------------------------- */

export function Community() {
  const settings = usePublicSettings();
  return (
    <section id="communaute" aria-labelledby="communaute-title" className="bg-white py-12 md:py-16">
      <div className="container-custom">
        <div className="overflow-hidden rounded-3xl bg-gradient-hero p-6 text-white md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-200">Rejoindre la communauté</p>
              <h2 id="communaute-title" className="mt-2 font-display text-3xl font-semibold text-white md:text-4xl">Recevez le programme LILMOD chaque semaine.</h2>
              <p className="mt-3 max-w-xl text-blue-50/85">
                Un e-mail en début de semaine avec tous les cours, et les rappels des cours du jour sur WhatsApp. Gratuit, désinscription à tout moment.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <a href={settings.newsletterSignupUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[56px] items-center gap-3 rounded-2xl bg-white px-5 font-semibold text-primary-900 hover:bg-accent-50">
                <Mail className="h-5 w-5 text-accent-600" aria-hidden="true" />
                <span>
                  S'inscrire par e-mail
                  <span className="block text-xs font-normal text-neutral-500">Programme hebdomadaire</span>
                </span>
              </a>
              <a href={settings.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[56px] items-center gap-3 rounded-2xl bg-green-600 px-5 font-semibold text-white hover:bg-green-700">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                <span>
                  Rejoindre le groupe WhatsApp LILMOD
                  <span className="block text-xs font-normal text-green-50">Rappels des cours du jour</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeCTA() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link to="/programme" className="btn-accent px-6 py-3.5">
        <CalendarDays className="h-5 w-5" aria-hidden="true" />
        Voir le programme de la semaine
      </Link>
      <Link to="/cours" className="btn-ghost-light px-6 py-3.5">
        Explorer les cours en replay
      </Link>
    </div>
  );
}
