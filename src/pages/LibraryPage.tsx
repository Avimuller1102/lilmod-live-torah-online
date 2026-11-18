/**
 * /cours — bibliothèque des replays : recherche, filtres, tri, séries, mises en avant.
 */
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Layers, Search, X } from 'lucide-react';
import { teacherById, useCatalog } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import { CardSkeleton, EmptyState, PageHero, VideoCard } from '@/components/ui';
import { matchScore } from '../../shared/catalog.js';

const PAGE = 24;

const LibraryPage = () => {
  const { data, loading, error } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [limit, setLimit] = useState(PAGE);
  const q = params.get('q') || '';
  const teacher = params.get('intervenant') || '';
  const theme = params.get('theme') || '';
  const serie = params.get('serie') || '';
  const sort = params.get('tri') === 'anciens' ? 'anciens' : 'recents';
  const themeLabel = data?.categories.find((c) => c.id === theme)?.label;
  useSeo(themeLabel ? `Cours : ${themeLabel}` : 'Cours en replay', 'Bibliothèque des cours de Torah LILMOD en replay : recherche par titre, enseignant, thème et série.');

  const set = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
    setLimit(PAGE);
  };

  const teachers = useMemo(() => data?.teachers || [], [data]);
  const videos = useMemo(() => {
    let list = (data?.videos || []).filter(
      (v) => (!teacher || v.teacherId === teacher) && (!theme || v.categories.includes(theme)) && (!serie || v.seriesId === serie),
    );
    if (q.trim().length >= 2) {
      list = list
        .map((v) => ({ v, s: matchScore(q, [[v.title, 3], [teacherById(teachers, v.teacherId)?.name || '', 2], [v.excerpt || '', 1]]) }))
        .filter((r) => r.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((r) => r.v);
    } else if (sort === 'anciens') {
      list = [...list].reverse();
    }
    return list;
  }, [data, q, teacher, theme, serie, sort, teachers]);
  const featured = (data?.videos || []).filter((v) => v.featured).slice(0, 4);
  const hasFilters = Boolean(q || teacher || theme || serie);

  return (
    <>
      <PageHero eyebrow="Bibliothèque" title={themeLabel || 'Les cours en replay'} subtitle="Tous les enseignements publiés sur la chaîne LILMOD, classés par intervenant, thème et série.">
        <form role="search" className="mt-6 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="recherche-cours" className="sr-only">Rechercher une vidéo</label>
          <div className="flex items-center gap-2 rounded-2xl bg-white p-1.5 pl-4 shadow-lg">
            <Search className="h-5 w-5 flex-shrink-0 text-neutral-400" aria-hidden="true" />
            <input
              id="recherche-cours"
              type="search"
              value={q}
              onChange={(e) => set('q', e.target.value)}
              placeholder="Titre, Rav, paracha, thème…"
              className="h-11 min-w-0 flex-1 bg-transparent text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
            />
          </div>
        </form>
      </PageHero>

      <section className="section-padding pt-8">
        <div className="container-custom">
          {/* Séries */}
          {!hasFilters && (data?.series || []).length > 0 && (
            <div className="mb-10">
              <div className="mb-4 flex items-end justify-between gap-3">
                <h2 className="font-display text-2xl font-semibold text-neutral-950">Séries</h2>
                <Link to="/series" className="text-sm font-semibold text-primary-700 hover:underline">Toutes les séries →</Link>
              </div>
              <ul className="carousel-sm sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
                {data!.series
                  .map((s) => ({ s, c: data!.videos.filter((v) => v.seriesId === s.id).length }))
                  .filter((x) => x.c > 0)
                  .sort((a, b) => b.c - a.c)
                  .slice(0, 8)
                  .map(({ s }) => {
                  const count = data!.videos.filter((v) => v.seriesId === s.id).length;
                  return (
                    <li key={s.id}>
                      <Link to={`/series/${s.id}`} className="flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white p-4 hover:border-accent-300">
                        <Layers className="mb-2 h-5 w-5 text-accent-600" aria-hidden="true" />
                        <span className="font-display text-[17px] font-semibold leading-snug text-neutral-950">{s.title}</span>
                        <span className="mt-1 text-sm text-neutral-500">{teacherById(teachers, s.teacherId)?.name}</span>
                        <span className="mt-auto pt-2 text-xs font-semibold text-accent-700">{count} épisode{count > 1 ? 's' : ''}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {!hasFilters && featured.length > 0 && (
            <div className="mb-10">
              <h2 className="mb-4 font-display text-2xl font-semibold text-neutral-950">À la une</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {featured.map((v) => <VideoCard key={v.id} video={v} teacher={teacherById(teachers, v.teacherId)} />)}
              </div>
            </div>
          )}

          {/* Filtres */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <label htmlFor="f-intervenant" className="sr-only">Intervenant</label>
            <select id="f-intervenant" value={teacher} onChange={(e) => set('intervenant', e.target.value)} className="field h-11 w-auto py-0 text-sm">
              <option value="">Tous les intervenants</option>
              {teachers.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <label htmlFor="f-theme" className="sr-only">Thème</label>
            <select id="f-theme" value={theme} onChange={(e) => set('theme', e.target.value)} className="field h-11 w-auto py-0 text-sm">
              <option value="">Tous les thèmes</option>
              {(data?.categories || []).map((c) => <option key={c.id} value={c.id}>{c.label} ({c.count})</option>)}
            </select>
            <label htmlFor="f-serie" className="sr-only">Série</label>
            <select id="f-serie" value={serie} onChange={(e) => set('serie', e.target.value)} className="field h-11 w-auto py-0 text-sm">
              <option value="">Toutes les séries</option>
              {(data?.series || []).map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            {!q && (
              <>
                <label htmlFor="f-tri" className="sr-only">Tri</label>
                <select id="f-tri" value={sort} onChange={(e) => set('tri', e.target.value === 'anciens' ? 'anciens' : '')} className="field h-11 w-auto py-0 text-sm">
                  <option value="recents">Plus récents</option>
                  <option value="anciens">Plus anciens</option>
                </select>
              </>
            )}
            {hasFilters && (
              <button type="button" onClick={() => setParams(new URLSearchParams(), { replace: true })} className="inline-flex h-11 items-center gap-1 rounded-xl px-3 text-sm font-semibold text-primary-700 hover:bg-primary-50">
                <X className="h-4 w-4" aria-hidden="true" /> Effacer
              </button>
            )}
            <p className="ml-auto text-sm text-neutral-500" aria-live="polite">{!loading && `${videos.length} vidéo${videos.length > 1 ? 's' : ''}`}</p>
          </div>

          {loading && <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"><CardSkeleton count={8} video /></div>}
          {!loading && error && <EmptyState title="La bibliothèque est momentanément indisponible">Toutes les vidéos restent accessibles sur <a className="font-semibold text-primary-700 underline" href="https://www.youtube.com/@Lilmodfr/videos" target="_blank" rel="noopener noreferrer">la chaîne YouTube LILMOD</a>.</EmptyState>}
          {!loading && !error && videos.length === 0 && <EmptyState icon={<Search className="h-6 w-6" />} title="Aucune vidéo ne correspond">Essayez un autre mot ou retirez un filtre.</EmptyState>}
          {!loading && videos.length > 0 && (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {videos.slice(0, limit).map((v, i) => <VideoCard key={v.id} video={v} teacher={teacherById(teachers, v.teacherId)} priority={i < 4} />)}
              </div>
              {videos.length > limit && (
                <div className="mt-8 text-center">
                  <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="btn-outline">
                    Afficher plus de vidéos ({videos.length - limit} restantes)
                  </button>
                </div>
              )}
            </>
          )}
          <p className="mt-10 text-center text-sm text-neutral-500">
            L'archive complète reste disponible sur <a className="font-semibold text-primary-700 underline" href="https://www.youtube.com/@Lilmodfr/videos" target="_blank" rel="noopener noreferrer">la chaîne YouTube LILMOD</a>.
          </p>
        </div>
      </section>
    </>
  );
};

export default LibraryPage;
