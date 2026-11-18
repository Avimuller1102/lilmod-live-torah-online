/**
 * /cours/:id/:slug — fiche vidéo : lecteur (chargé au clic), série, recommandations, partage.
 */
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, MessageCircle, Play } from 'lucide-react';
import { teacherById, useCatalog } from '@/lib/api';
import { useSeo } from '@/lib/seo';
import { EmptyState, TeacherAvatar, VideoCard } from '@/components/ui';
import { formatShortDate } from '../../shared/time.js';
import { CATEGORIES, videoPath } from '../../shared/catalog.js';
import { whatsappShareUrl } from '../../shared/messages.js';

const VideoPage = () => {
  const { id = '' } = useParams();
  const { data, loading } = useCatalog();
  const [playing, setPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const video = data?.videos.find((v) => v.id === id);
  const teacher = teacherById(data?.teachers, video?.teacherId);
  const series = data?.series.find((s) => s.id === video?.seriesId);
  useSeo(video?.title || 'Cours en vidéo', video ? `${teacher ? `${teacher.name} — ` : ''}${video.excerpt || video.title}` : undefined);

  const { prev, next, related } = useMemo(() => {
    if (!video || !data) return { prev: undefined, next: undefined, related: [] };
    const episodes = data.videos
      .filter((v) => series && v.seriesId === series.id)
      .sort((a, b) => (a.episode ?? 0) - (b.episode ?? 0) || a.publishedAt.localeCompare(b.publishedAt));
    const idx = episodes.findIndex((v) => v.id === video.id);
    const related = data.videos
      .filter((v) => v.id !== video.id)
      .map((v) => ({ v, s: (v.seriesId && v.seriesId === video.seriesId ? 3 : 0) + (v.teacherId && v.teacherId === video.teacherId ? 2 : 0) + v.categories.filter((c) => video.categories.includes(c)).length }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || b.v.publishedAt.localeCompare(a.v.publishedAt))
      .slice(0, 4)
      .map((r) => r.v);
    return { prev: idx > 0 ? episodes[idx - 1] : undefined, next: idx >= 0 && idx < episodes.length - 1 ? episodes[idx + 1] : undefined, related };
  }, [video, data, series]);

  if (loading) return <div className="container-custom pb-20 pt-32"><div className="aspect-video w-full max-w-4xl animate-pulse rounded-2xl bg-neutral-200" /></div>;
  if (!video)
    return (
      <div className="container-custom pb-20 pt-32">
        <EmptyState title="Cette vidéo est introuvable">
          Elle n'est peut-être pas encore indexée. <a className="font-semibold text-primary-700 underline" href={`https://www.youtube.com/watch?v=${encodeURIComponent(id)}`} target="_blank" rel="noopener noreferrer">La regarder sur YouTube</a> ou <Link to="/cours" className="font-semibold text-primary-700 underline">parcourir la bibliothèque</Link>.
        </EmptyState>
      </div>
    );

  const pageUrl = `${window.location.origin}${videoPath(video)}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copiez le lien :', pageUrl);
    }
  };

  return (
    <article className="pb-16 pt-20 md:pt-24">
      <div className="bg-primary-950">
        <div className="container-custom py-4 md:py-8">
          <div className="relative mx-auto aspect-video max-w-5xl overflow-hidden rounded-none bg-black sm:rounded-2xl">
            {playing ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}?autoplay=1&rel=0`}
                title={video.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            ) : (
              <button type="button" onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={`Lire la vidéo : ${video.title}`}>
                <img src={video.thumbnail.replace('hqdefault', 'maxresdefault')} onError={(e) => ((e.currentTarget.src = video.thumbnail))} alt="" className="h-full w-full object-cover opacity-90" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600 text-white shadow-2xl transition-transform group-hover:scale-110 md:h-20 md:w-20">
                    <Play className="ml-1 h-8 w-8 fill-current" aria-hidden="true" />
                  </span>
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom grid gap-10 pt-8 lg:grid-cols-[1fr_320px]">
        <div>
          <nav className="mb-3 flex flex-wrap items-center gap-1 text-sm text-neutral-500" aria-label="Fil d'Ariane">
            <Link to="/cours" className="hover:text-primary-700">Cours</Link>
            {series && (
              <>
                <span aria-hidden="true">/</span>
                <Link to={`/series/${series.id}`} className="hover:text-primary-700">{series.title}</Link>
              </>
            )}
          </nav>
          <h1 className="font-display text-2xl font-semibold leading-tight text-neutral-950 md:text-4xl">{video.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-600">
            {teacher && (
              <Link to={`/intervenants/${teacher.id}`} className="inline-flex items-center gap-2 font-semibold text-neutral-900 hover:text-primary-700">
                <TeacherAvatar teacher={teacher} size={32} /> {teacher.name}
              </Link>
            )}
            <time dateTime={video.publishedAt}>Publié le {formatShortDate(video.publishedAt)}</time>
            {video.episode && <span>Épisode {video.episode}</span>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {video.categories.map((c) => (
              <Link key={c} to={`/cours?theme=${c}`} className="rounded-full bg-accent-50 px-3 py-1 text-xs font-semibold text-accent-800 ring-1 ring-accent-200 hover:bg-accent-100">
                {CATEGORIES.find((x) => x.id === c)?.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            <a href={whatsappShareUrl(`${video.title}\n${pageUrl}`)} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
              <MessageCircle className="h-4 w-4 text-green-600" aria-hidden="true" /> Partager sur WhatsApp
            </a>
            <button type="button" onClick={copy} className="btn-outline text-sm" aria-live="polite">
              {copied ? <Check className="h-4 w-4 text-green-600" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              {copied ? 'Lien copié' : 'Copier le lien'}
            </button>
            <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
              YouTube <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          {(video.excerpt || video.description) && (
            <div className="mt-8 whitespace-pre-line text-[16px] leading-7 text-neutral-700">{video.description || video.excerpt}</div>
          )}
          {video.incomplete && <p className="mt-6 text-xs text-neutral-400">Informations en cours de complétion.</p>}

          {(prev || next) && (
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link to={videoPath(prev)} className="rounded-2xl border border-neutral-200/80 bg-white p-4 hover:border-primary-300">
                  <span className="flex items-center gap-1 text-xs font-semibold text-neutral-500"><ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Épisode précédent</span>
                  <span className="mt-1 line-clamp-2 block font-semibold text-neutral-900">{prev.title}</span>
                </Link>
              ) : <span />}
              {next && (
                <Link to={videoPath(next)} className="rounded-2xl border border-neutral-200/80 bg-white p-4 text-right hover:border-primary-300">
                  <span className="flex items-center justify-end gap-1 text-xs font-semibold text-neutral-500">Épisode suivant <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></span>
                  <span className="mt-1 line-clamp-2 block font-semibold text-neutral-900">{next.title}</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {related.length > 0 && (
          <aside aria-labelledby="a-voir-aussi">
            <h2 id="a-voir-aussi" className="mb-4 font-display text-xl font-semibold text-neutral-950">À voir aussi</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {related.map((v) => <VideoCard key={v.id} video={v} teacher={teacherById(data?.teachers, v.teacherId)} />)}
            </div>
          </aside>
        )}
      </div>
    </article>
  );
};

export default VideoPage;
