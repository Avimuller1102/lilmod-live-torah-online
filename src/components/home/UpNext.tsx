/**
 * Accueil — « Les prochains cours » : cours en direct, cours du jour et à venir.
 * Données réelles du programme publié ; rafraîchissement de l'état chaque minute.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays } from 'lucide-react';
import { teacherById, useProgramme, usePublicSettings } from '@/lib/api';
import { CardSkeleton, CourseCard, EmptyState } from '@/components/ui';
import { courseTiming, localDateKey } from '../../../shared/time.js';

export function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}

const UpNext = () => {
  const { data, loading } = useProgramme();
  const settings = usePublicSettings();
  const now = useNow();
  const { live, today, later } = useMemo(() => {
    const courses = (data?.courses || []).filter((c) => c.status !== 'cancelled' || courseTiming(c, now) !== 'past');
    const todayKey = localDateKey(now);
    const live = courses.filter((c) => courseTiming(c, now) === 'live');
    const upcoming = courses.filter((c) => courseTiming(c, now) === 'upcoming' || (c.status === 'cancelled' && Date.parse(c.start) > now.getTime()));
    return {
      live,
      today: upcoming.filter((c) => localDateKey(c.start) === todayKey),
      later: upcoming.filter((c) => localDateKey(c.start) !== todayKey).slice(0, 6),
    };
  }, [data, now]);
  const teachers = data?.teachers || [];
  const list = [...live, ...today, ...later].slice(0, 6);

  return (
    <section id="prochains-cours" aria-labelledby="prochains-cours-title" className="relative z-10 -mt-10 pb-6 md:-mt-16">
      <div className="container-custom">
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-5 shadow-[0_30px_80px_-50px_rgba(15,30,54,0.6)] md:p-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-accent-700">{live.length ? 'En ce moment' : 'À ne pas manquer'}</p>
              <h2 id="prochains-cours-title" className="mt-1 font-display text-2xl font-semibold text-neutral-950 md:text-3xl">
                {live.length ? 'Un cours est en direct' : 'Les prochains cours'}
              </h2>
            </div>
            <Link to="/programme" className="btn-outline self-start text-sm sm:self-auto">
              Programme complet
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CardSkeleton count={3} />
            </div>
          )}

          {!loading && list.length > 0 && (
            <div className="carousel-sm sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
              {list.map((c) => (
                <CourseCard key={c.id} course={c} teacher={teacherById(teachers, c.teacherId)} now={now} />
              ))}
            </div>
          )}

          {!loading && list.length === 0 && (
            <EmptyState icon={<CalendarDays className="h-6 w-6" />} title="Le prochain programme sera bientôt publié">
              <p>
                Pour recevoir les horaires et les liens dès leur publication, rejoignez{' '}
                <a href={settings.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-700 underline">le groupe WhatsApp</a> ou{' '}
                <a href={settings.newsletterSignupUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary-700 underline">la newsletter</a>.
              </p>
            </EmptyState>
          )}
        </div>
      </div>
    </section>
  );
};

export default UpNext;
