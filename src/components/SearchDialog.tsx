/**
 * Recherche globale : cours programmés, vidéos, séries, intervenants et thèmes.
 * Tolérante aux accents et aux variantes de translittération (Ben Ichay / Ben Ishai…).
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { useDialog } from '@/hooks/useDialog';
import { useCatalog, useProgramme, teacherById, type Catalog, type Course } from '@/lib/api';
import { searchAll, videoPath } from '../../shared/catalog.js';
import { formatDayKey, localDateKey } from '../../shared/time.js';
import { TeacherAvatar } from '@/components/ui';

export function useSearch(query: string) {
  const { data: catalog, loading } = useCatalog();
  const { data: programme } = useProgramme();
  const results = useMemo(
    () =>
      searchAll(query, {
        videos: catalog?.videos || [],
        teachers: catalog?.teachers || [],
        series: catalog?.series || [],
        courses: programme?.courses || [],
      }),
    [query, catalog, programme],
  );
  return { results, catalog, loading };
}

export function SearchResults({ query, results, catalog, onNavigate, limit = 6 }: { query: string; results: ReturnType<typeof searchAll>; catalog: Catalog | null; onNavigate?: () => void; limit?: number }) {
  const teachers = catalog?.teachers || [];
  const total = results.videos.length + results.teachers.length + results.series.length + results.courses.length + results.themes.length;
  if (query.trim().length < 2) return <p className="px-1 py-6 text-center text-sm text-neutral-500">Tapez au moins deux lettres : un Rav, un thème, une paracha…</p>;
  if (!total)
    return (
      <div className="px-1 py-8 text-center">
        <p className="font-semibold text-neutral-900">Aucun résultat pour « {query} »</p>
        <p className="mt-1 text-sm text-neutral-500">Essayez un autre mot, le nom d'un intervenant ou parcourez la <Link to="/cours" onClick={onNavigate} className="font-semibold text-primary-700 underline">bibliothèque</Link>.</p>
      </div>
    );
  const group = (title: string, children: React.ReactNode) => (
    <div className="mb-4">
      <p className="mb-1 px-2 text-xs font-bold uppercase tracking-wider text-neutral-400">{title}</p>
      <ul>{children}</ul>
    </div>
  );
  const row = (to: string, main: React.ReactNode, sub?: React.ReactNode, left?: React.ReactNode) => (
    <li key={to}>
      <Link to={to} onClick={onNavigate} className="flex min-h-[48px] items-center gap-3 rounded-xl px-2 py-2 hover:bg-primary-50 focus:bg-primary-50 focus:outline-none">
        {left}
        <span className="min-w-0">
          <span className="line-clamp-1 text-sm font-semibold text-neutral-900">{main}</span>
          {sub && <span className="line-clamp-1 text-xs text-neutral-500">{sub}</span>}
        </span>
      </Link>
    </li>
  );
  return (
    <div>
      {results.courses.length > 0 &&
        group(
          'Cours programmés',
          (results.courses as Course[]).slice(0, limit).map((c) => row(`/programme/${c.id}`, c.title, `${formatDayKey(localDateKey(c.start))} · ${teacherById(teachers, c.teacherId)?.name || ''}`)),
        )}
      {results.teachers.length > 0 &&
        group('Intervenants', results.teachers.slice(0, limit).map((t) => row(`/intervenants/${t.id}`, t.name, t.specialty, <TeacherAvatar teacher={t} size={36} />)))}
      {results.series.length > 0 && group('Séries', results.series.slice(0, limit).map((s) => row(`/series/${s.id}`, s.title, teacherById(teachers, s.teacherId)?.name)))}
      {results.themes.length > 0 && group('Thèmes', results.themes.map((t) => row(`/cours?theme=${t.id}`, t.label)))}
      {results.videos.length > 0 &&
        group(
          'Vidéos',
          results.videos.slice(0, limit * 2).map((v) =>
            row(videoPath(v), v.title, teacherById(teachers, v.teacherId)?.name, <img src={v.thumbnail} alt="" width={64} height={36} loading="lazy" className="h-9 w-16 flex-shrink-0 rounded object-cover" />),
          ),
        )}
    </div>
  );
}

const SearchDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useDialog<HTMLDivElement>(open, onClose);
  const navigate = useNavigate();
  const { results, catalog } = useSearch(open ? query : '');

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center bg-primary-950/60 p-3 pt-[8vh] backdrop-blur-sm" onClick={onClose}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Recherche" className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <form
          role="search"
          className="flex items-center gap-2 border-b border-neutral-100 px-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) {
              navigate(`/recherche?q=${encodeURIComponent(query.trim())}`);
              onClose();
            }
          }}
        >
          <Search className="h-5 w-5 flex-shrink-0 text-neutral-400" aria-hidden="true" />
          <label htmlFor="global-search" className="sr-only">Rechercher</label>
          <input
            id="global-search"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Un Rav, une paracha, un thème…"
            autoComplete="off"
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-neutral-900 placeholder:text-neutral-400 focus:outline-none"
          />
          <button type="button" onClick={onClose} aria-label="Fermer la recherche" className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100">
            <X className="h-5 w-5" />
          </button>
        </form>
        <div className="max-h-[65vh] overflow-y-auto p-3">
          <SearchResults query={query} results={results} catalog={catalog} onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SearchDialog;
