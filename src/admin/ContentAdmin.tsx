/**
 * Administration — intervenants, séries et vidéos.
 */
import { useMemo, useState } from 'react';
import { Pencil, Plus, RefreshCw, Star } from 'lucide-react';
import { adminApi, useAdmin } from './api';
import { Field, Modal, Panel, Pill, btn, useFlash } from './ui';
import { CATEGORIES, matchScore } from '../../shared/catalog.js';
import { formatShortDate } from '../../shared/time.js';

const list = (v: string) => v.split(',').map((x) => x.trim()).filter(Boolean);

/** Recadre la photo en carré (centre), la réduit à 480 px et la convertit en WebP. */
async function resizePhoto(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('Image illisible.'));
      i.src = url;
    });
    const side = Math.min(img.naturalWidth, img.naturalHeight);
    const size = Math.min(480, side);
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
    const webp = canvas.toDataURL('image/webp', 0.85);
    return webp.startsWith('data:image/webp') ? webp : canvas.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function PhotoField({ value, onChange, flash }: { value: string; onChange: (v: string) => void; flash: any }) {
  const [busy, setBusy] = useState(false);
  return (
    <div>
      <span className="field-label">Photo</span>
      <div className="flex items-center gap-3">
        {value ? <img src={value} alt="" className="h-16 w-16 rounded-2xl object-cover ring-1 ring-neutral-200" /> : <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-xs text-neutral-400">aucune</span>}
        <label className={`${btn.outline} cursor-pointer`}>
          {busy ? 'Envoi…' : 'Téléverser une photo'}
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={busy}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setBusy(true);
              try {
                const dataUrl = await resizePhoto(file);
                const r = await adminApi('POST', '/media', { dataUrl });
                onChange(r.url);
                flash.ok('Photo téléversée : pensez à enregistrer.');
              } catch (err: any) {
                flash.error(err.message);
              } finally {
                setBusy(false);
                e.target.value = '';
              }
            }}
          />
        </label>
        {value && <button type="button" className={btn.outline} onClick={() => onChange('')}>Retirer</button>}
      </div>
    </div>
  );
}

function Teachers() {
  const { data, reload } = useAdmin<{ items: any[] }>('/teachers');
  const [form, setForm] = useState<any>(null);
  const flash = useFlash();
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, createdAt, updatedAt, ...p } = form;
      p.aliases = typeof p.aliases === 'string' ? list(p.aliases) : p.aliases;
      if (id) await adminApi('PUT', `/teachers/${id}`, p);
      else await adminApi('POST', '/teachers', p);
      flash.ok('Intervenant enregistré.');
      setForm(null);
      reload();
    } catch (err: any) {
      flash.error(err.message);
    }
  };
  return (
    <div className="space-y-5">
      {flash.node}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Intervenants</h1>
          <p className="text-sm text-neutral-500">N'indiquez que des présentations vérifiées. Les variantes d'écriture servent à reconnaître l'intervenant dans les titres des vidéos.</p>
        </div>
        <button type="button" className={btn.primary} onClick={() => setForm({ name: '', shortName: '', photo: '', specialty: '', bio: '', aliases: '', hidden: false })}><Plus className="h-4 w-4" aria-hidden="true" /> Ajouter</button>
      </div>
      <Panel>
        <ul className="divide-y divide-neutral-100">
          {(data?.items || []).map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-3 py-3">
              <span className="flex min-w-0 items-center gap-3">
                {t.photo ? <img src={t.photo} alt="" className="h-11 w-11 rounded-full object-cover" /> : <span className="h-11 w-11 rounded-full bg-neutral-200" />}
                <span className="min-w-0">
                  <span className="font-semibold">{t.name}</span> {t.hidden && <Pill className="bg-neutral-100 text-neutral-500">masqué</Pill>} {!t.bio && <Pill className="bg-amber-50 text-amber-800">présentation à compléter</Pill>}
                  <span className="block truncate text-sm text-neutral-500">{t.specialty}</span>
                </span>
              </span>
              <button type="button" className={btn.outline} onClick={() => setForm({ ...t, aliases: (t.aliases || []).join(', ') })}><Pencil className="h-4 w-4" aria-hidden="true" /> Modifier</button>
            </li>
          ))}
        </ul>
      </Panel>
      <Modal open={!!form} title={form?.id ? 'Modifier l’intervenant' : 'Nouvel intervenant'} onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Nom complet *" htmlFor="t-name"><input id="t-name" className="field" required value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nom court" htmlFor="t-short"><input id="t-short" className="field" value={form.shortName} onChange={(e) => set('shortName', e.target.value)} /></Field>
              <Field label="Domaines d'enseignement" htmlFor="t-spec"><input id="t-spec" className="field" value={form.specialty} onChange={(e) => set('specialty', e.target.value)} /></Field>
            </div>
            <PhotoField value={form.photo} onChange={(v) => set('photo', v)} flash={flash} />
            <Field label="Présentation vérifiée" htmlFor="t-bio"><textarea id="t-bio" rows={4} className="field" value={form.bio} onChange={(e) => set('bio', e.target.value)} /></Field>
            <Field label="Variantes d'écriture (séparées par des virgules)" htmlFor="t-alias" hint="Ex. : ben ichay, ben ishai, benichay"><input id="t-alias" className="field" value={form.aliases} onChange={(e) => set('aliases', e.target.value)} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4" checked={form.hidden} onChange={(e) => set('hidden', e.target.checked)} /> Masquer sur le site</label>
            <div className="flex justify-end gap-2"><button type="button" className={btn.outline} onClick={() => setForm(null)}>Annuler</button><button type="submit" className={btn.primary}>Enregistrer</button></div>
          </form>
        )}
      </Modal>
    </div>
  );
}

function SeriesAdmin() {
  const { data, reload } = useAdmin<{ items: any[] }>('/series');
  const { data: t } = useAdmin<{ items: any[] }>('/teachers');
  const [form, setForm] = useState<any>(null);
  const flash = useFlash();
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, createdAt, updatedAt, ...p } = form;
      p.match = typeof p.match === 'string' ? list(p.match) : p.match;
      const m = String(p.playlistId || '').match(/list=([a-zA-Z0-9_-]+)/);
      if (m) p.playlistId = m[1];
      if (id) await adminApi('PUT', `/series/${id}`, p);
      else await adminApi('POST', '/series', p);
      flash.ok('Série enregistrée.');
      setForm(null);
      reload();
    } catch (err: any) {
      flash.error(err.message);
    }
  };
  return (
    <div className="space-y-5">
      {flash.node}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Séries</h1>
          <p className="max-w-2xl text-sm text-neutral-500">Une vidéo rejoint une série si elle est de l'enseignant choisi et que son titre contient un des mots-clés, ou si elle vient de la playlist YouTube indiquée.</p>
        </div>
        <button type="button" className={btn.primary} onClick={() => setForm({ title: '', teacherId: '', description: '', match: '', playlistId: '', hidden: false })}><Plus className="h-4 w-4" aria-hidden="true" /> Nouvelle série</button>
      </div>
      <Panel>
        <ul className="divide-y divide-neutral-100">
          {(data?.items || []).map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 py-3">
              <span className="min-w-0">
                <span className="font-semibold">{s.title}</span> {s.hidden && <Pill className="bg-neutral-100 text-neutral-500">masquée</Pill>} {s.playlistId && <Pill className="bg-red-50 text-red-700">playlist</Pill>}
                <span className="block text-sm text-neutral-500">{(t?.items || []).find((x) => x.id === s.teacherId)?.name} · mots-clés : {(s.match || []).join(', ') || '—'}</span>
              </span>
              <button type="button" className={btn.outline} onClick={() => setForm({ ...s, match: (s.match || []).join(', ') })}><Pencil className="h-4 w-4" aria-hidden="true" /> Modifier</button>
            </li>
          ))}
        </ul>
      </Panel>
      <Modal open={!!form} title={form?.id ? 'Modifier la série' : 'Nouvelle série'} onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Titre *" htmlFor="s-title"><input id="s-title" className="field" required value={form.title} onChange={(e) => set('title', e.target.value)} /></Field>
            <Field label="Enseignant" htmlFor="s-teacher">
              <select id="s-teacher" className="field" value={form.teacherId} onChange={(e) => set('teacherId', e.target.value)}>
                <option value="">—</option>
                {(t?.items || []).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
              </select>
            </Field>
            <Field label="Descriptif" htmlFor="s-desc"><textarea id="s-desc" rows={3} className="field" value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
            <Field label="Mots-clés dans les titres (séparés par des virgules)" htmlFor="s-match"><input id="s-match" className="field" value={form.match} onChange={(e) => set('match', e.target.value)} /></Field>
            <Field label="Playlist YouTube (lien ou identifiant, facultatif)" htmlFor="s-pl"><input id="s-pl" className="field" value={form.playlistId} onChange={(e) => set('playlistId', e.target.value)} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4" checked={form.hidden} onChange={(e) => set('hidden', e.target.checked)} /> Masquer sur le site</label>
            <div className="flex justify-end gap-2"><button type="button" className={btn.outline} onClick={() => setForm(null)}>Annuler</button><button type="submit" className={btn.primary}>Enregistrer</button></div>
          </form>
        )}
      </Modal>
    </div>
  );
}

function Videos() {
  const { data, reload, loading } = useAdmin<{ videos: any[] }>('/videos');
  const { data: t } = useAdmin<{ items: any[] }>('/teachers');
  const { data: s } = useAdmin<{ items: any[] }>('/series');
  const [q, setQ] = useState('');
  const [onlyIncomplete, setOnlyIncomplete] = useState(false);
  const [busy, setBusy] = useState(false);
  const flash = useFlash();
  const videos = useMemo(() => {
    let v = data?.videos || [];
    if (onlyIncomplete) v = v.filter((x) => !x.teacherId);
    if (q.trim().length >= 2) v = v.filter((x) => matchScore(q, [[x.title, 1]]) > 0);
    return v.slice(0, 200);
  }, [data, q, onlyIncomplete]);
  const patch = async (id: string, p: any) => {
    try {
      await adminApi('PATCH', `/videos/${encodeURIComponent(id)}`, p);
      flash.ok('Vidéo mise à jour.');
      reload();
    } catch (e: any) {
      flash.error(e.message);
    }
  };
  return (
    <div className="space-y-5">
      {flash.node}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Vidéos</h1>
          <p className="max-w-2xl text-sm text-neutral-500">
            Les nouvelles vidéos YouTube sont ajoutées automatiquement chaque heure ; aucune n'est jamais supprimée. Intervenant, série et thèmes sont détectés depuis le titre et peuvent être corrigés ici.
          </p>
        </div>
        <button
          type="button"
          className={btn.primary}
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              const r = await adminApi('POST', '/videos/sync');
              flash.ok(`${r.added} nouvelle(s) vidéo(s) — ${r.total} au total.${r.errors?.length ? ` Erreurs : ${r.errors.join(' ; ')}` : ''}`);
              reload();
            } catch (e: any) {
              flash.error(e.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <RefreshCw className={`h-4 w-4 ${busy ? 'animate-spin' : ''}`} aria-hidden="true" /> Synchroniser maintenant
        </button>
      </div>
      <Panel>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <label htmlFor="v-q" className="sr-only">Filtrer</label>
          <input id="v-q" className="field max-w-xs" placeholder="Filtrer par titre…" value={q} onChange={(e) => setQ(e.target.value)} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4" checked={onlyIncomplete} onChange={(e) => setOnlyIncomplete(e.target.checked)} /> Sans intervenant identifié</label>
          <span className="text-sm text-neutral-500">{data?.videos.length || 0} vidéos</span>
        </div>
        {loading ? (
          <p className="text-sm text-neutral-500">Chargement…</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {videos.map((v) => (
              <li key={v.id} className="grid gap-3 py-3 md:grid-cols-[120px_1fr_auto] md:items-center">
                <img src={v.thumbnail} alt="" loading="lazy" className="h-[68px] w-[120px] rounded-lg object-cover" />
                <div className="min-w-0">
                  <p className="font-semibold leading-snug text-neutral-900">{v.title}</p>
                  <p className="text-xs text-neutral-500">{formatShortDate(v.publishedAt)} · {v.categories.map((c: string) => CATEGORIES.find((x) => x.id === c)?.label).join(', ') || 'sans thème'}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <label className="sr-only" htmlFor={`vt-${v.id}`}>Intervenant</label>
                    <select id={`vt-${v.id}`} className="field h-9 w-auto py-0 text-sm" value={v.teacherId} onChange={(e) => patch(v.id, { teacherId: e.target.value })}>
                      <option value="">Intervenant ?</option>
                      {(t?.items || []).map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                    </select>
                    <label className="sr-only" htmlFor={`vs-${v.id}`}>Série</label>
                    <select id={`vs-${v.id}`} className="field h-9 w-auto py-0 text-sm" value={v.seriesId} onChange={(e) => patch(v.id, { seriesId: e.target.value })}>
                      <option value="">Pas de série</option>
                      {(s?.items || []).map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button type="button" className={btn.outline} aria-pressed={!!v.featured} onClick={() => patch(v.id, { featured: !v.featured })} title="Mettre à la une">
                    <Star className={`h-4 w-4 ${v.featured ? 'fill-accent-400 text-accent-500' : ''}`} aria-hidden="true" /> <span className="sr-only">À la une</span>
                  </button>
                  <button type="button" className={btn.outline} onClick={() => patch(v.id, { hidden: !v.hidden })}>{v.hidden ? 'Afficher' : 'Masquer'}</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </div>
  );
}

export default function ContentAdmin({ kind }: { kind: 'teachers' | 'series' | 'videos' }) {
  if (kind === 'teachers') return <Teachers />;
  if (kind === 'series') return <SeriesAdmin />;
  return <Videos />;
}
