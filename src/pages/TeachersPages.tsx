/**
 * /intervenants et /intervenants/:id — enseignants, leurs prochains cours, replays et séries.
 * Les présentations ne sont affichées que si elles ont été renseignées (aucune biographie inventée).
 */
import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { useCatalog, useProgramme } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import { CardSkeleton, CourseCard, EmptyState, PageHero, TeacherAvatar, VideoCard } from '@/components/ui';
import { useNow } from '@/components/home/UpNext';
import { courseTiming } from '../../shared/time.js';

export const TeachersPage = () => {
  const { data, loading } = useCatalog();
  useSeo('Nos intervenants', 'Les Rabbanim et enseignants de LILMOD : leurs cours en direct, leurs séries et leurs replays.');
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const v of data?.videos || []) m.set(v.teacherId, (m.get(v.teacherId) || 0) + 1);
    return m;
  }, [data]);
  return (
    <>
      <PageHero eyebrow="Intervenants" title="Nos Rabbanim et enseignants" subtitle="Découvrez chaque intervenant, ses prochains cours en direct et ses enseignements en replay." />
      <section className="section-padding pt-10">
        <div className="container-custom">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><CardSkeleton count={6} /></div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(data?.teachers || []).map((t) => (
                <li key={t.id}>
                  <Link to={`/intervenants/${t.id}`} className="group flex h-full items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-4 hover:border-accent-300">
                    {t.photo ? (
                      <img src={t.photo} alt="" width={88} height={88} loading="lazy" className="h-[88px] w-[88px] flex-shrink-0 rounded-2xl object-cover" />
                    ) : (
                      <TeacherAvatar teacher={t} size={88} />
                    )}
                    <span className="min-w-0">
                      <span className="block font-display text-lg font-semibold text-neutral-950 group-hover:text-primary-700">{t.name}</span>
                      {t.specialty && <span className="block text-sm text-accent-700">{t.specialty}</span>}
                      <span className="mt-1 block text-xs text-neutral-500">{counts.get(t.id) || 0} vidéo{(counts.get(t.id) || 0) > 1 ? 's' : ''} indexée{(counts.get(t.id) || 0) > 1 ? 's' : ''}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
};

export const TeacherPage = () => {
  const { id = '' } = useParams();
  const { data, loading } = useCatalog();
  const { data: prog } = useProgramme();
  const now = useNow();
  const teacher = data?.teachers.find((t) => t.id === id);
  useSeo(teacher?.name || 'Intervenant', teacher ? `${teacher.name}${teacher.specialty ? ` — ${teacher.specialty}` : ''}. Cours en direct et replays sur LILMOD.` : undefined);
  const videos = (data?.videos || []).filter((v) => v.teacherId === id);
  const series = (data?.series || []).filter((s) => s.teacherId === id);
  const upcoming = (prog?.courses || []).filter((c) => c.teacherId === id && ['upcoming', 'live'].includes(courseTiming(c, now)));

  if (loading) return <div className="container-custom pb-20 pt-32"><CardSkeleton count={2} /></div>;
  if (!teacher)
    return (
      <div className="container-custom pb-20 pt-32">
        <EmptyState title="Intervenant introuvable"><Link to="/intervenants" className="font-semibold text-primary-700 underline">Voir tous les intervenants</Link></EmptyState>
      </div>
    );

  return (
    <>
      <section className="bg-gradient-hero pb-10 pt-28 text-white md:pb-14 md:pt-36">
        <div className="container-custom flex flex-col gap-6 sm:flex-row sm:items-center">
          {teacher.photo ? (
            <img src={teacher.photo} alt={teacher.name} width={144} height={144} className="h-32 w-32 rounded-3xl border-2 border-accent-300/60 object-cover md:h-36 md:w-36" />
          ) : (
            <TeacherAvatar teacher={teacher} size={128} />
          )}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-200">Intervenant</p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-white md:text-5xl">{teacher.name}</h1>
            {teacher.specialty && <p className="mt-2 text-lg text-blue-50/85">{teacher.specialty}</p>}
          </div>
        </div>
      </section>

      <div className="container-custom space-y-12 py-10 md:py-14">
        {teacher.bio && <p className="max-w-3xl whitespace-pre-line text-[17px] leading-8 text-neutral-800">{teacher.bio}</p>}

        <section aria-labelledby="t-prochains">
          <h2 id="t-prochains" className="mb-4 font-display text-2xl font-semibold text-neutral-950">Prochains cours</h2>
          {upcoming.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((c) => <CourseCard key={c.id} course={c} teacher={teacher} now={now} />)}
            </div>
          ) : (
            <p className="text-neutral-500">Aucun cours programmé pour le moment. <Link to="/programme" className="font-semibold text-primary-700 underline">Voir le programme</Link></p>
          )}
        </section>

        {series.length > 0 && (
          <section aria-labelledby="t-series">
            <h2 id="t-series" className="mb-4 font-display text-2xl font-semibold text-neutral-950">Séries</h2>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {series.map((s) => (
                <li key={s.id}>
                  <Link to={`/series/${s.id}`} className="flex h-full items-start gap-3 rounded-2xl border border-neutral-200/80 bg-white p-4 hover:border-accent-300">
                    <Layers className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-600" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-neutral-950">{s.title}</span>
                      <span className="text-xs text-neutral-500">{videos.filter((v) => v.seriesId === s.id).length} épisodes</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section aria-labelledby="t-replays">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 id="t-replays" className="font-display text-2xl font-semibold text-neutral-950">Derniers replays</h2>
            {videos.length > 8 && (
              <Link to={`/cours?intervenant=${teacher.id}`} className="inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline">
                Tous ses cours ({videos.length}) <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            )}
          </div>
          {videos.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {videos.slice(0, 8).map((v) => <VideoCard key={v.id} video={v} teacher={teacher} />)}
            </div>
          ) : (
            <p className="text-neutral-500">Les replays de cet intervenant seront bientôt indexés.</p>
          )}
        </section>
      </div>
    </>
  );
};
