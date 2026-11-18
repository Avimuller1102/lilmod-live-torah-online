/**
 * LILMOD — composants d'interface réutilisables (design system).
 */
import { Link } from 'react-router-dom';
import { CalendarPlus, Clock, ExternalLink, PlayCircle, Radio, Video as VideoIcon, XCircle } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Course, Teacher, Video } from '@/lib/api';
import { courseTiming, dualTimes, formatShortDate, localDateKey, formatDayKey } from '../../shared/time.js';
import { videoPath } from '../../shared/catalog.js';

/* Badges ------------------------------------------------------------ */

const BADGE_STYLES = {
  live: 'bg-red-600 text-white',
  upcoming: 'bg-primary-50 text-primary-700 ring-1 ring-primary-100',
  past: 'bg-neutral-100 text-neutral-600',
  cancelled: 'bg-neutral-100 text-neutral-500 line-through',
  replay: 'bg-accent-50 text-accent-700 ring-1 ring-accent-200',
  neutral: 'bg-neutral-100 text-neutral-700',
} as const;

export function Badge({ tone = 'neutral', children }: { tone?: keyof typeof BADGE_STYLES; children: ReactNode }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_STYLES[tone]}`}>{children}</span>;
}

export function CourseStatusBadge({ course, now = new Date() }: { course: Course; now?: Date }) {
  const t = courseTiming(course, now);
  if (t === 'cancelled') return <Badge tone="cancelled"><XCircle className="h-3.5 w-3.5" aria-hidden="true" />Annulé</Badge>;
  if (t === 'live')
    return (
      <Badge tone="live">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        En direct
      </Badge>
    );
  if (t === 'past' && course.replayUrl) return <Badge tone="replay"><PlayCircle className="h-3.5 w-3.5" aria-hidden="true" />Replay disponible</Badge>;
  if (t === 'past') return <Badge tone="past">Terminé</Badge>;
  return <Badge tone="upcoming">À venir</Badge>;
}

/* Intervenants ------------------------------------------------------- */

export function TeacherAvatar({ teacher, size = 40 }: { teacher?: Teacher; size?: number }) {
  const initials = (teacher?.name || 'L')
    .replace(/^(Rav|Dr|Rabbanit)\s+/i, '')
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  if (teacher?.photo)
    return (
      <img
        src={teacher.photo}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className="flex-shrink-0 rounded-full bg-neutral-100 object-cover ring-2 ring-white"
        style={{ width: size, height: size }}
      />
    );
  return (
    <span
      aria-hidden="true"
      className="flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-700 to-primary-900 font-display font-semibold text-accent-200 ring-2 ring-white"
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

/* Heures ------------------------------------------------------------- */

export function DualTime({ iso, className = '' }: { iso: string; className?: string }) {
  const { il, fr } = dualTimes(iso);
  return (
    <span className={className}>
      <span className="font-semibold">{fr.replace(':', 'h')}</span>
      <span className="text-neutral-500"> ({il.replace(':', 'h')} Israël)</span>
    </span>
  );
}

export const PLATFORM_LABEL: Record<string, string> = { zoom: 'Zoom', youtube: 'YouTube', other: 'En ligne' };

/* Carte de cours ------------------------------------------------------ */

export function CourseCard({ course, teacher, compact = false, now = new Date() }: { course: Course; teacher?: Teacher; compact?: boolean; now?: Date }) {
  const timing = courseTiming(course, now);
  const canJoin = (timing === 'live' || timing === 'upcoming') && course.joinPublic && course.joinUrl;
  return (
    <article
      className={`group relative flex h-full flex-col rounded-2xl border bg-white p-4 transition-shadow sm:p-5 ${
        timing === 'live' ? 'border-red-200 shadow-[0_12px_40px_-24px_rgba(220,38,38,0.6)]' : 'border-neutral-200/80 hover:shadow-[0_18px_40px_-28px_rgba(16,36,61,0.45)]'
      } ${timing === 'cancelled' ? 'opacity-70' : ''}`}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <CourseStatusBadge course={course} now={now} />
        <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-500">
          <VideoIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {PLATFORM_LABEL[course.platform] || 'En ligne'}
        </span>
      </div>
      {!compact && <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent-700">{formatDayKey(localDateKey(course.start))}</p>}
      <p className="flex items-center gap-1.5 text-sm text-neutral-800">
        <Clock className="h-4 w-4 flex-shrink-0 text-accent-600" aria-hidden="true" />
        <DualTime iso={course.start} />
      </p>
      <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-neutral-950">
        <Link to={`/programme/${encodeURIComponent(course.id)}`} className="after:absolute after:inset-0 hover:text-primary-700 focus:outline-none">
          {course.title}
        </Link>
      </h3>
      {teacher && (
        <p className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
          <TeacherAvatar teacher={teacher} size={28} />
          {teacher.name}
        </p>
      )}
      {course.organizer && course.organizer !== 'LILMOD' && <p className="mt-1 text-xs font-medium text-neutral-500">Avec {course.organizer}</p>}
      {!compact && course.description && <p className="mt-2 line-clamp-2 text-sm text-neutral-600">{course.description}</p>}
      <div className="relative z-10 mt-auto flex flex-wrap gap-2 pt-4">
        {canJoin && (
          <a
            href={course.joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white ${timing === 'live' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700 hover:bg-primary-800'}`}
          >
            <Radio className="h-4 w-4" aria-hidden="true" />
            Rejoindre le cours
          </a>
        )}
        {timing === 'past' && course.replayUrl && (
          <a href={course.replayUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-accent-500 px-4 text-sm font-semibold text-white hover:bg-accent-600">
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
            Voir le replay
          </a>
        )}
        {timing === 'upcoming' && (
          <a href={`/api/v1/ics/${encodeURIComponent(course.id)}`} className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-neutral-200 px-3 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:text-primary-700">
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">Agenda</span>
          </a>
        )}
      </div>
    </article>
  );
}

/* Carte vidéo -------------------------------------------------------- */

export function VideoCard({ video, teacher, priority = false }: { video: Video; teacher?: Teacher; priority?: boolean }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition-shadow hover:shadow-[0_18px_40px_-28px_rgba(16,36,61,0.45)]">
      <div className="relative aspect-video overflow-hidden bg-neutral-100">
        <img
          src={video.thumbnail}
          alt=""
          width={480}
          height={270}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {video.duration && <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white">{video.duration}</span>}
        {video.episode && <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-semibold text-primary-800">Épisode {video.episode}</span>}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-neutral-950">
          <Link to={videoPath(video)} className="after:absolute after:inset-0 hover:text-primary-700 focus:outline-none">
            {video.title}
          </Link>
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-xs text-neutral-500">
          <span className="truncate">{teacher?.name || 'LILMOD'}</span>
          <time dateTime={video.publishedAt} className="flex-shrink-0">{formatShortDate(video.publishedAt)}</time>
        </div>
      </div>
    </article>
  );
}

/* États --------------------------------------------------------------- */

export function EmptyState({ icon, title, children }: { icon?: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-neutral-300 bg-white/70 px-6 py-10 text-center">
      {icon && <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-50 text-accent-700">{icon}</div>}
      <p className="font-display text-lg font-semibold text-neutral-900">{title}</p>
      {children && <div className="mx-auto mt-2 max-w-md text-sm text-neutral-600">{children}</div>}
    </div>
  );
}

export function CardSkeleton({ count = 3, video = false }: { count?: number; video?: boolean }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white" aria-hidden="true">
          {video && <div className="aspect-video animate-pulse bg-neutral-100" />}
          <div className="space-y-3 p-4">
            <div className="h-3 w-1/3 animate-pulse rounded bg-neutral-100" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-100" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
      ))}
      <span className="sr-only">Chargement…</span>
    </>
  );
}

export function SectionHeader({ eyebrow, title, subtitle, action }: { eyebrow?: string; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2 className="section-title mt-4">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function ExternalButton({ href, children, className = 'btn-outline' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      <ExternalLink className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-gradient-hero pb-8 pt-24 text-white md:pb-16 md:pt-36">
      <div className="container-custom relative">
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-200 md:mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl font-display text-[1.9rem] font-semibold leading-[1.1] text-white sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-[15px] leading-6 text-blue-50/85 md:mt-4 md:text-lg md:leading-7">{subtitle}</p>}
        {children}
      </div>
    </section>
  );
}
