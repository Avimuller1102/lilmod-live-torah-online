/**
 * /programme — le programme hebdomadaire, référence unique des horaires.
 * Navigation par semaine et par jour, vue liste (mobile) ou semaine (ordinateur),
 * filtres par enseignant et par thème, états à venir / en direct / terminé / annulé.
 */
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CalendarDays, ChevronLeft, ChevronRight, LayoutGrid, List, Mail, MessageCircle } from 'lucide-react';
import { teacherById, useProgramme, usePublicSettings } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import { CardSkeleton, CourseCard, EmptyState, PageHero } from '@/components/ui';
import { useNow } from '@/components/home/UpNext';
import { addDaysToKey, formatDayKey, localDateKey, weekOf, WEEKDAYS_FR, localTime } from '../../shared/time.js';
import { CATEGORIES } from '../../shared/catalog.js';

const ProgrammePage = () => {
  const [params, setParams] = useSearchParams();
  const now = useNow();
  const settings = usePublicSettings();
  const current = weekOf(now);
  const weekStart = /^\d{4}-\d{2}-\d{2}$/.test(params.get('semaine') || '') ? weekOf(new Date(`${params.get('semaine')}T12:00:00Z`)).start : current.start;
  const weekEnd = addDaysToKey(weekStart, 6);
  const { data, loading, error } = useProgramme(weekStart, weekEnd);
  const [view, setView] = useState<'list' | 'week'>('list');
  const teacherFilter = params.get('intervenant') || '';
  const themeFilter = params.get('theme') || '';
  const today = localDateKey(now);
  const [day, setDay] = useState<string>('');

  useSeo('Programme de la semaine', "Les cours de Torah LILMOD de la semaine : horaires à l'heure de France et d'Israël, liens pour rejoindre les cours en direct, replays.");

  const teachers = data?.teachers || [];
  const courses = useMemo(
    () =>
      (data?.courses || []).filter(
        (c) => (!teacherFilter || c.teacherId === teacherFilter) && (!themeFilter || c.category === themeFilter),
      ),
    [data, teacherFilter, themeFilter],
  );
  const days = Array.from({ length: 7 }, (_, i) => addDaysToKey(weekStart, i));
  const byDay = (d: string) => courses.filter((c) => localDateKey(c.start) === d);
  const usedThemes = CATEGORIES.filter((c) => (data?.courses || []).some((x) => x.category === c.id));
  const usedTeachers = teachers.filter((t) => (data?.courses || []).some((c) => c.teacherId === t.id));
  const visibleDays = day ? [day] : days.filter((d) => byDay(d).length > 0);

  const setParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };
  const goWeek = (delta: number) => {
    setDay('');
    setParam('semaine', delta === 0 ? '' : addDaysToKey(weekStart, delta * 7));
  };

  return (
    <>
      <PageHero
        eyebrow="Programme"
        title="Le programme de la semaine"
        subtitle="Tous les cours en direct, à l'heure de France (heure d'Israël entre parenthèses)."
      >
        <div className="mt-6 hidden flex-wrap gap-3 sm:flex">
          <a href={settings.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-light text-sm">
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Recevoir le programme sur WhatsApp
          </a>
          <a href={settings.newsletterSignupUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-light text-sm">
            <Mail className="h-4 w-4" aria-hidden="true" /> Par e-mail
          </a>
        </div>
      </PageHero>

      <section className="section-padding pt-4 md:pt-10">
        <div className="container-custom">
          {/* Navigation de semaine */}
          <div className="sticky top-[60px] z-30 -mx-5 mb-6 border-b border-neutral-200/80 bg-[#F7F3EC]/95 px-5 py-3 backdrop-blur sm:static sm:mx-0 sm:rounded-2xl sm:border sm:bg-white sm:px-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => goWeek(-1)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white hover:border-primary-300" aria-label="Semaine précédente">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <div className="min-w-0 text-center">
                  <p className="text-sm font-bold text-neutral-900">
                    {weekStart === current.start ? 'Cette semaine' : weekStart === addDaysToKey(current.start, 7) ? 'Semaine prochaine' : `Semaine du ${formatDayKey(weekStart)}`}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatDayKey(weekStart)} → {formatDayKey(weekEnd)}
                  </p>
                </div>
                <button type="button" onClick={() => goWeek(1)} className="flex h-11 w-11 items-center justify-center rounded-xl border border-neutral-200 bg-white hover:border-primary-300" aria-label="Semaine suivante">
                  <ChevronRight className="h-5 w-5" />
                </button>
                {weekStart !== current.start && (
                  <button type="button" onClick={() => goWeek(0)} className="ml-1 rounded-lg px-2 py-1 text-sm font-semibold text-primary-700 underline-offset-2 hover:underline">
                    Aujourd'hui
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {usedTeachers.length > 1 && (
                  <label className="sr-only" htmlFor="filtre-intervenant">Filtrer par intervenant</label>
                )}
                {usedTeachers.length > 1 && (
                  <select id="filtre-intervenant" value={teacherFilter} onChange={(e) => setParam('intervenant', e.target.value)} className="field h-11 w-auto py-0 text-sm">
                    <option value="">Tous les intervenants</option>
                    {usedTeachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                )}
                {usedThemes.length > 1 && (
                  <>
                    <label className="sr-only" htmlFor="filtre-theme">Filtrer par thème</label>
                    <select id="filtre-theme" value={themeFilter} onChange={(e) => setParam('theme', e.target.value)} className="field h-11 w-auto py-0 text-sm">
                      <option value="">Tous les thèmes</option>
                      {usedThemes.map((t) => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </>
                )}
                <div className="hidden rounded-xl border border-neutral-200 bg-white p-1 lg:flex" role="group" aria-label="Affichage">
                  <button type="button" onClick={() => setView('list')} aria-pressed={view === 'list'} className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold ${view === 'list' ? 'bg-primary-700 text-white' : 'text-neutral-600'}`}>
                    <List className="h-4 w-4" aria-hidden="true" /> Liste
                  </button>
                  <button type="button" onClick={() => setView('week')} aria-pressed={view === 'week'} className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold ${view === 'week' ? 'bg-primary-700 text-white' : 'text-neutral-600'}`}>
                    <LayoutGrid className="h-4 w-4" aria-hidden="true" /> Semaine
                  </button>
                </div>
              </div>
            </div>
            {/* Jours */}
            <div className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="Jours de la semaine">
              <button type="button" role="tab" aria-selected={!day} onClick={() => setDay('')} className={`flex-shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold ${!day ? 'bg-primary-700 text-white' : 'bg-white text-neutral-700 ring-1 ring-neutral-200'}`}>
                Toute la semaine
              </button>
              {days.map((d, i) => {
                const count = byDay(d).length;
                return (
                  <button
                    key={d}
                    type="button"
                    role="tab"
                    aria-selected={day === d}
                    onClick={() => setDay(day === d ? '' : d)}
                    className={`flex-shrink-0 rounded-full px-3.5 py-2 text-sm font-semibold ${
                      day === d ? 'bg-primary-700 text-white' : d === today ? 'bg-accent-50 text-accent-800 ring-1 ring-accent-300' : 'bg-white text-neutral-700 ring-1 ring-neutral-200'
                    } ${count ? '' : 'opacity-50'}`}
                  >
                    {WEEKDAYS_FR[i].slice(0, 3)}. {Number(d.slice(8))}
                    {count > 0 && <span className="ml-1 text-xs opacity-75">({count})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {loading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <CardSkeleton count={6} />
            </div>
          )}

          {!loading && error && (
            <EmptyState title="Le programme ne peut pas être chargé pour le moment">
              Réessayez dans quelques instants, ou consultez le groupe <a href={settings.whatsappGroupUrl} className="font-semibold text-primary-700 underline" target="_blank" rel="noopener noreferrer">WhatsApp LILMOD</a>.
            </EmptyState>
          )}

          {!loading && !error && courses.length === 0 && (
            <EmptyState icon={<CalendarDays className="h-6 w-6" />} title={teacherFilter || themeFilter ? 'Aucun cours avec ces filtres' : "Le programme de cette semaine n'est pas encore publié"}>
              {teacherFilter || themeFilter ? (
                <button type="button" className="font-semibold text-primary-700 underline" onClick={() => setParams(new URLSearchParams({ ...(params.get('semaine') ? { semaine: params.get('semaine')! } : {}) }))}>
                  Retirer les filtres
                </button>
              ) : (
                <>
                  Il sera annoncé ici, par e-mail et sur{' '}
                  <a href={settings.whatsappGroupUrl} className="font-semibold text-primary-700 underline" target="_blank" rel="noopener noreferrer">WhatsApp</a>. En attendant, retrouvez les{' '}
                  <Link to="/cours" className="font-semibold text-primary-700 underline">derniers replays</Link>.
                </>
              )}
            </EmptyState>
          )}

          {/* Vue liste (par défaut, et toujours sur mobile) */}
          {!loading && courses.length > 0 && (view === 'list' || typeof window !== 'undefined') && (
            <div className={view === 'week' ? 'lg:hidden' : ''}>
              {visibleDays.map((d) => (
                <section key={d} aria-labelledby={`jour-${d}`} className="mb-8">
                  <h2 id={`jour-${d}`} className={`mb-3 font-display text-xl font-semibold ${d === today ? 'text-accent-700' : 'text-neutral-950'}`}>
                    {formatDayKey(d)} {d === today && <span className="ml-1 align-middle text-sm font-sans font-semibold text-accent-700">· aujourd'hui</span>}
                  </h2>
                  {byDay(d).length ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {byDay(d).map((c) => (
                        <CourseCard key={c.id} course={c} teacher={teacherById(teachers, c.teacherId)} compact now={now} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500">Pas de cours ce jour-là.</p>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* Vue semaine (ordinateur) */}
          {!loading && courses.length > 0 && view === 'week' && (
            <div className="hidden grid-cols-7 gap-2 lg:grid">
              {days.map((d, i) => (
                <div key={d} className={`min-h-[240px] rounded-2xl border p-2.5 ${d === today ? 'border-accent-300 bg-accent-50/50' : 'border-neutral-200/80 bg-white'}`}>
                  <p className={`px-1 text-sm font-bold ${d === today ? 'text-accent-700' : 'text-neutral-900'}`}>{WEEKDAYS_FR[i]}</p>
                  <p className="mb-2 px-1 text-xs text-neutral-500">{Number(d.slice(8))}/{d.slice(5, 7)}</p>
                  <ul className="space-y-2">
                    {byDay(d).map((c) => (
                      <li key={c.id}>
                        <Link to={`/programme/${c.id}`} className={`block rounded-xl border p-2 text-left hover:border-primary-300 ${c.status === 'cancelled' ? 'border-neutral-200 opacity-60' : 'border-neutral-200 bg-white'}`}>
                          <span className="text-xs font-bold text-primary-700">{localTime(c.start).replace(':', 'h')}</span>
                          <span className="line-clamp-3 text-[13px] font-semibold leading-snug text-neutral-900">{c.status === 'cancelled' ? `Annulé — ${c.title}` : c.title}</span>
                          <span className="line-clamp-1 text-[11px] text-neutral-500">{teacherById(teachers, c.teacherId)?.shortName || teacherById(teachers, c.teacherId)?.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default ProgrammePage;
