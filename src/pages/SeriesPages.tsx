/**
 * /series et /series/:id — enseignements organisés en épisodes.
 */
import { Link, useParams } from 'react-router-dom';
import { Layers, Play } from 'lucide-react';
import { teacherById, useCatalog } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import { CardSkeleton, EmptyState, PageHero, TeacherAvatar } from '@/components/ui';
import { formatShortDate } from '../../shared/time.js';
import { videoPath } from '../../shared/catalog.js';

export const SeriesListPage = () => {
  const { data, loading } = useCatalog();
  useSeo('Séries de cours', "Les séries d'enseignements LILMOD : suivez un cours épisode après épisode.");
  return (
    <>
      <PageHero eyebrow="Séries" title="Suivre un enseignement dans la durée" subtitle="Chaque série rassemble les épisodes d'un même cours, dans l'ordre." />
      <section className="section-padding pt-10">
        <div className="container-custom">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><CardSkeleton count={4} /></div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(data?.series || [])
                .map((s) => ({ s, n: (data?.videos || []).filter((v) => v.seriesId === s.id).length }))
                .filter((x) => x.n > 0)
                .sort((a, b) => b.n - a.n)
                .map(({ s }) => {
                const eps = (data?.videos || []).filter((v) => v.seriesId === s.id);
                const teacher = teacherById(data?.teachers, s.teacherId);
                return (
                  <li key={s.id}>
                    <Link to={`/series/${s.id}`} className="flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white hover:border-accent-300">
                      {eps[0] && <img src={eps[0].thumbnail} alt="" loading="lazy" width={480} height={270} className="aspect-video w-full object-cover" />}
                      <span className="flex flex-1 flex-col p-4">
                        <span className="font-display text-lg font-semibold text-neutral-950">{s.title}</span>
                        {teacher && <span className="mt-1 text-sm text-accent-700">{teacher.name}</span>}
                        {s.description && <span className="mt-2 line-clamp-2 text-sm text-neutral-600">{s.description}</span>}
                        <span className="mt-auto pt-3 text-xs font-semibold text-neutral-500">{eps.length} épisode{eps.length > 1 ? 's' : ''}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </>
  );
};

export const SeriesPage = () => {
  const { id = '' } = useParams();
  const { data, loading } = useCatalog();
  const series = data?.series.find((s) => s.id === id);
  const teacher = teacherById(data?.teachers, series?.teacherId);
  useSeo(series?.title || 'Série', series ? `${series.title}${teacher ? ` — ${teacher.name}` : ''}. ${series.description || ''}` : undefined);
  const episodes = (data?.videos || [])
    .filter((v) => v.seriesId === id)
    .sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0) || a.publishedAt.localeCompare(b.publishedAt));

  if (loading) return <div className="container-custom pb-20 pt-32"><CardSkeleton count={3} /></div>;
  if (!series)
    return (
      <div className="container-custom pb-20 pt-32">
        <EmptyState title="Série introuvable"><Link to="/series" className="font-semibold text-primary-700 underline">Voir toutes les séries</Link></EmptyState>
      </div>
    );

  return (
    <>
      <PageHero eyebrow="Série" title={series.title} subtitle={series.description}>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          {teacher && (
            <Link to={`/intervenants/${teacher.id}`} className="inline-flex items-center gap-2 rounded-full pr-3 font-semibold text-white hover:bg-white/10">
              <TeacherAvatar teacher={teacher} size={40} /> {teacher.name}
            </Link>
          )}
          <span className="text-sm text-blue-50/80">{episodes.length} épisode{episodes.length > 1 ? 's' : ''}</span>
          {episodes[0] && (
            <Link to={videoPath(episodes[0])} className="btn-accent">
              <Play className="h-4 w-4 fill-current" aria-hidden="true" /> Commencer au premier épisode
            </Link>
          )}
        </div>
      </PageHero>
      <section className="section-padding pt-10">
        <div className="container-custom max-w-4xl">
          {episodes.length === 0 ? (
            <EmptyState icon={<Layers className="h-6 w-6" />} title="Les épisodes seront bientôt indexés" />
          ) : (
            <ol className="space-y-3">
              {episodes.map((v, i) => (
                <li key={v.id}>
                  <Link to={videoPath(v)} className="group flex items-center gap-4 rounded-2xl border border-neutral-200/80 bg-white p-3 hover:border-primary-300">
                    <span className="w-8 flex-shrink-0 text-center font-display text-lg font-semibold text-accent-600">{v.episode ?? i + 1}</span>
                    <img src={v.thumbnail} alt="" width={160} height={90} loading="lazy" className="h-[56px] w-[100px] flex-shrink-0 rounded-lg object-cover sm:h-[72px] sm:w-[128px]" />
                    <span className="min-w-0">
                      <span className="line-clamp-2 font-semibold leading-snug text-neutral-900 group-hover:text-primary-700">{v.title}</span>
                      <span className="text-xs text-neutral-500">{formatShortDate(v.publishedAt)}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>
    </>
  );
};
