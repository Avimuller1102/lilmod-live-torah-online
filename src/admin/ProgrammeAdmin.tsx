/**
 * Administration — programme hebdomadaire.
 * Workflow : préparer → vérifier → publier → générer les communications → ajouter les replays.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Copy, Eye, FileInput, Plus, Repeat, Send, Trash2 } from 'lucide-react';
import { adminApi, useAdmin } from './api';
import { Field, Modal, Panel, Pill, STATUS_STYLE, btn, useFlash } from './ui';
import ImportDialog from './ImportDialog';
import type { Session } from './AdminApp';
import { addDaysToKey, dualTimes, formatDayKey, localDateKey, localTime, weekOf, zonedTimeToUtc, TZ_ISRAEL, TZ_FRANCE } from '../../shared/time.js';
import { PLATFORMS, STATUSES } from '../../shared/programme.js';
import { CATEGORIES } from '../../shared/catalog.js';

type Course = Record<string, any>;

const EMPTY = {
  title: '', description: '', teacherId: '', seriesId: '', category: '', date: '', time: '19:00', endTime: '', timezone: TZ_FRANCE,
  platform: 'zoom', joinUrl: '', joinPublic: true, status: 'draft', visibility: 'public', thumbnail: '', replayUrl: '', pdfUrl: '', notes: '', organizer: '',
};

function toForm(c?: Course, dayKey?: string) {
  if (!c) return { ...EMPTY, date: dayKey || '' };
  const tz = c.timezone || TZ_FRANCE;
  return {
    ...EMPTY,
    ...c,
    date: c.start ? localDateKey(c.start, tz) : '',
    time: c.start ? localTime(c.start, tz) : '20:00',
    endTime: c.end ? localTime(c.end, tz) : '',
  };
}

function fromForm(f: any) {
  const start = zonedTimeToUtc(f.date, f.time, f.timezone).toISOString();
  let end = '';
  if (f.endTime) {
    let e = zonedTimeToUtc(f.date, f.endTime, f.timezone);
    if (e.getTime() <= Date.parse(start)) e = zonedTimeToUtc(addDaysToKey(f.date, 1), f.endTime, f.timezone);
    end = e.toISOString();
  }
  const { date, time, endTime, createdAt, updatedAt, updatedBy, publishedAt, ...rest } = f;
  return { ...rest, start, end };
}

export function CourseEditor({ course, dayKey, teachers, series, onClose, onSaved, flash }: any) {
  const [form, setForm] = useState<any>(() => toForm(course, dayKey));
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));
  const preview = form.date && form.time ? dualTimes(zonedTimeToUtc(form.date, form.time, form.timezone).toISOString()) : null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = fromForm(form);
      const res = course?.id ? await adminApi('PUT', `/courses/${encodeURIComponent(course.id)}`, payload) : await adminApi('POST', '/courses', payload);
      flash.ok('Cours enregistré.');
      onSaved(res.course);
    } catch (err: any) {
      flash.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="space-y-4">
      <Field label="Titre du cours *" htmlFor="c-title">
        <input id="c-title" className="field" value={form.title} onChange={(e) => set('title', e.target.value)} required maxLength={200} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Enseignant" htmlFor="c-teacher">
          <select id="c-teacher" className="field" value={form.teacherId} onChange={(e) => set('teacherId', e.target.value)}>
            <option value="">— Choisir —</option>
            {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </Field>
        <Field label="Thème" htmlFor="c-cat">
          <select id="c-cat" className="field" value={form.category} onChange={(e) => set('category', e.target.value)}>
            <option value="">—</option>
            {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
          </select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Date *" htmlFor="c-date">
          <input id="c-date" type="date" className="field" value={form.date} onChange={(e) => set('date', e.target.value)} required />
        </Field>
        <Field label="Début *" htmlFor="c-time">
          <input id="c-time" type="time" className="field" value={form.time} onChange={(e) => set('time', e.target.value)} required />
        </Field>
        <Field label="Fin" htmlFor="c-end">
          <input id="c-end" type="time" className="field" value={form.endTime} onChange={(e) => set('endTime', e.target.value)} />
        </Field>
        <Field label="Heure saisie en" htmlFor="c-tz">
          <select id="c-tz" className="field" value={form.timezone} onChange={(e) => set('timezone', e.target.value)}>
            <option value={TZ_FRANCE}>France</option>
            <option value={TZ_ISRAEL}>Israël</option>
          </select>
        </Field>
      </div>
      {preview && (
        <p className="rounded-xl bg-primary-50 px-3 py-2 text-sm text-primary-900">
          Affiché aux visiteurs : <strong>{preview.fr.replace(':', 'h')}</strong> ({preview.il.replace(':', 'h')} Israël)
        </p>
      )}
      <Field label="Description / sujet" htmlFor="c-desc">
        <textarea id="c-desc" rows={3} className="field" value={form.description} onChange={(e) => set('description', e.target.value)} maxLength={4000} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Diffusion" htmlFor="c-platform">
          <select id="c-platform" className="field" value={form.platform} onChange={(e) => set('platform', e.target.value)}>
            {Object.entries(PLATFORMS).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}
          </select>
        </Field>
        <div className="sm:col-span-2">
          <Field label="Lien de participation (Zoom, YouTube…)" htmlFor="c-join" hint="Doit commencer par https://">
            <input id="c-join" type="url" className="field" placeholder="https://" value={form.joinUrl} onChange={(e) => set('joinUrl', e.target.value)} />
          </Field>
        </div>
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" className="mt-1 h-4 w-4" checked={form.joinPublic} onChange={(e) => set('joinPublic', e.target.checked)} />
        <span><strong>Lien public</strong> : affiché sur le site et dans les messages. Décochez pour un lien Zoom privé (il ne sera jamais publié).</span>
      </label>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Statut" htmlFor="c-status">
          <select id="c-status" className="field" value={form.status} onChange={(e) => set('status', e.target.value)}>
            {Object.entries(STATUSES).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}
          </select>
        </Field>
        <Field label="Visibilité" htmlFor="c-vis">
          <select id="c-vis" className="field" value={form.visibility} onChange={(e) => set('visibility', e.target.value)}>
            <option value="public">Public</option>
            <option value="private">Réservé (non affiché)</option>
          </select>
        </Field>
        <Field label="Organisateur" htmlFor="c-org">
          <input id="c-org" className="field" list="organizers" placeholder="LILMOD, Midreshet Yehouda-Manitou…" value={form.organizer} onChange={(e) => set('organizer', e.target.value)} />
          <datalist id="organizers"><option value="LILMOD" /><option value="Midreshet Yehouda-Manitou" /><option value="Le HOUG" /><option value="Emounah Chelema" /></datalist>
        </Field>
        <Field label="Série" htmlFor="c-series">
          <select id="c-series" className="field" value={form.seriesId} onChange={(e) => set('seriesId', e.target.value)}>
            <option value="">—</option>
            {series.map((s: any) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </Field>
      </div>
      <details className="rounded-xl border border-neutral-200 p-3">
        <summary className="cursor-pointer text-sm font-semibold text-neutral-800">Replay, support, image, notes internes</summary>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Lien du replay" htmlFor="c-replay"><input id="c-replay" type="url" className="field" placeholder="https://" value={form.replayUrl} onChange={(e) => set('replayUrl', e.target.value)} /></Field>
          <Field label="Support PDF" htmlFor="c-pdf"><input id="c-pdf" type="url" className="field" placeholder="https://" value={form.pdfUrl} onChange={(e) => set('pdfUrl', e.target.value)} /></Field>
          <Field label="Image (lien)" htmlFor="c-thumb"><input id="c-thumb" className="field" placeholder="https://" value={form.thumbnail} onChange={(e) => set('thumbnail', e.target.value)} /></Field>
          <Field label="Notes internes (jamais publiées)" htmlFor="c-notes"><textarea id="c-notes" rows={2} className="field" value={form.notes} onChange={(e) => set('notes', e.target.value)} /></Field>
        </div>
      </details>
      <div className="flex flex-wrap justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className={btn.outline}>Annuler</button>
        <button type="submit" disabled={busy} className={btn.primary}>{busy ? 'Enregistrement…' : 'Enregistrer'}</button>
      </div>
    </form>
  );
}

export default function ProgrammeAdmin({ session }: { session: Session }) {
  const [params, setParams] = useSearchParams();
  const weekStart = /^\d{4}-\d{2}-\d{2}$/.test(params.get('semaine') || '') ? weekOf(new Date(`${params.get('semaine')}T12:00:00Z`)).start : weekOf(new Date()).start;
  const { data, reload } = useAdmin<{ courses: Course[] }>(`/courses?weekStart=${weekStart}`);
  const { data: tData } = useAdmin<{ items: any[] }>('/teachers');
  const { data: sData } = useAdmin<{ items: any[] }>('/series');
  const [issues, setIssues] = useState<any[] | null>(null);
  const [editing, setEditing] = useState<{ course?: Course; dayKey?: string } | null>(null);
  const [busy, setBusy] = useState('');
  const [importOpen, setImportOpen] = useState(false);
  const { data: mcStatus } = useAdmin<any>('/mailchimp/status');
  const flash = useFlash();
  const teachers = tData?.items || [];
  const series = sData?.items || [];
  const days = Array.from({ length: 7 }, (_, i) => addDaysToKey(weekStart, i));
  const courses = useMemo(() => data?.courses || [], [data]);
  const undated = courses.filter((c) => !c.start);
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const c of courses) m[c.status] = (m[c.status] || 0) + 1;
    return m;
  }, [courses]);

  const setWeek = (k: string) => setParams({ semaine: k });

  // Liens directs depuis le tableau de bord
  useEffect(() => {
    const id = params.get('cours');
    if (id && courses.length) {
      const c = courses.find((x) => x.id === id);
      if (c) setEditing({ course: c });
    }
  }, [params, courses]);

  const run = async (label: string, fn: () => Promise<any>, okText: (r: any) => string) => {
    setBusy(label);
    try {
      const r = await fn();
      flash.ok(okText(r));
      reload();
      setIssues(null);
    } catch (e: any) {
      flash.error(e.message);
    } finally {
      setBusy('');
    }
  };

  useEffect(() => {
    if (params.get('preparer') === '1') {
      params.delete('preparer');
      setParams(params, { replace: true });
      run('prepare', () => adminApi('POST', '/programme/prepare', { weekStart }), (r) => `${r.created.length} cours créés en brouillon depuis les cours récurrents.`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validate = async () => {
    setBusy('validate');
    try {
      const r = await adminApi('GET', `/programme/validate?weekStart=${weekStart}`);
      setIssues(r.issues);
    } catch (e: any) {
      flash.error(e.message);
    } finally {
      setBusy('');
    }
  };

  const quickStatus = (c: Course, status: string) =>
    run('status', () => adminApi('PUT', `/courses/${encodeURIComponent(c.id)}`, { ...c, status }), () => `« ${c.title} » : ${STATUSES[status]}.`);

  return (
    <div className="space-y-5">
      {flash.node}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-neutral-950">Programme</h1>
          <p className="text-sm text-neutral-500">1. Préparer · 2. Vérifier · 3. Publier · 4. Communiquer · 5. Ajouter les replays</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className={btn.outline} onClick={() => setWeek(addDaysToKey(weekStart, -7))} aria-label="Semaine précédente"><ChevronLeft className="h-4 w-4" /></button>
          <span className="min-w-[200px] text-center text-sm font-semibold">Semaine du {formatDayKey(weekStart)}</span>
          <button type="button" className={btn.outline} onClick={() => setWeek(addDaysToKey(weekStart, 7))} aria-label="Semaine suivante"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      <Panel>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn.primary} disabled={!!busy} onClick={() => setEditing({ dayKey: weekStart })}>
            <Plus className="h-4 w-4" aria-hidden="true" /> Ajouter un cours
          </button>
          <button type="button" className={btn.outline} disabled={!!busy} onClick={() => setImportOpen(true)}>
            <FileInput className="h-4 w-4" aria-hidden="true" /> Importer un programme
          </button>
          <button type="button" className={btn.outline} disabled={!!busy} onClick={() => run('prepare', () => adminApi('POST', '/programme/prepare', { weekStart }), (r) => `${r.created.length} cours créés en brouillon depuis les cours récurrents.`)}>
            <Repeat className="h-4 w-4" aria-hidden="true" /> Préparer depuis les cours récurrents
          </button>
          <button type="button" className={btn.outline} disabled={!!busy} onClick={() => run('dup', () => adminApi('POST', '/programme/duplicate', { fromWeek: addDaysToKey(weekStart, -7), toWeek: weekStart }), (r) => `${r.created.length} cours recopiés de la semaine précédente (en brouillon).`)}>
            <Copy className="h-4 w-4" aria-hidden="true" /> Recopier la semaine précédente
          </button>
          <button type="button" className={btn.outline} disabled={!!busy} onClick={validate}>
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Vérifier
          </button>
          <a href={`/programme?semaine=${weekStart}`} target="_blank" rel="noopener noreferrer" className={btn.outline}>
            <Eye className="h-4 w-4" aria-hidden="true" /> Voir le site
          </a>
          <button
            type="button"
            className={btn.accent}
            disabled={!!busy}
            onClick={() => {
              if (!window.confirm('Publier les cours « Programmé » et « Brouillon » de cette semaine sur le site ? Les cours comportant une erreur bloquante ne seront pas publiés.')) return;
              run('publish', () => adminApi('POST', '/programme/publish', { weekStart, includeDrafts: true }), (r) => {
                if (!r.total) return "Aucun cours cette semaine : ajoutez des cours ou cliquez sur « Préparer depuis les cours récurrents ».";
                if (!r.published.length && !r.skipped.length) return `Tout est déjà en ligne pour cette semaine (${r.alreadyOnline} cours publiés).`;
                return `${r.published.length} cours publiés${r.alreadyOnline ? ` (${r.alreadyOnline} déjà en ligne)` : ''}${r.skipped.length ? ` — ${r.skipped.length} bloqué(s) : cliquez sur « Vérifier » pour voir quoi corriger` : ''}.`;
              });
            }}
          >
            <Send className="h-4 w-4" aria-hidden="true" /> Publier la semaine
          </button>
          <Link to={`/admin/newsletter?periode=${weekStart}`} className={btn.outline}>Newsletter de la semaine</Link>
          <Link to={`/admin/whatsapp?periode=${weekStart}`} className={btn.green}>WhatsApp de la semaine</Link>
        </div>
        <p className="mt-3 text-xs text-neutral-500">
          {Object.entries(counts).map(([k, v]) => `${STATUSES[k]} : ${v}`).join(' · ') || 'Aucun cours cette semaine.'} — Les brouillons ne sont jamais visibles sur le site.
        </p>
      </Panel>

      {issues && (
        <Panel title={issues.length ? `${issues.length} point(s) à vérifier` : 'Tout est en ordre ✓'}>
          {issues.length > 0 && (
            <ul className="space-y-1.5 text-sm">
              {issues.map((i, n) => (
                <li key={n} className="flex items-start gap-2">
                  <AlertTriangle className={`mt-0.5 h-4 w-4 flex-shrink-0 ${i.level === 'error' ? 'text-red-600' : 'text-amber-600'}`} aria-hidden="true" />
                  <span>
                    <strong>{i.title || '(sans titre)'}</strong> — {i.message}
                    {i.level === 'error' && <Pill className="ml-1 bg-red-100 text-red-700">bloquant</Pill>}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      )}

      {undated.length > 0 && (
        <Panel title="Cours sans date">
          <ul className="text-sm">{undated.map((c) => <li key={c.id}><button type="button" className="text-primary-700 underline" onClick={() => setEditing({ course: c })}>{c.title || c.id}</button></li>)}</ul>
        </Panel>
      )}

      <div className="space-y-4">
        {days.map((d) => {
          const list = courses.filter((c) => c.start && localDateKey(c.start) === d);
          return (
            <Panel
              key={d}
              title={formatDayKey(d)}
              actions={<button type="button" className={btn.outline} onClick={() => setEditing({ dayKey: d })}><Plus className="h-4 w-4" aria-hidden="true" /> Cours</button>}
            >
              {list.length === 0 ? (
                <p className="text-sm text-neutral-400">Aucun cours.</p>
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {list.map((c) => {
                    const t = teachers.find((x) => x.id === c.teacherId);
                    const { il, fr } = dualTimes(c.start);
                    return (
                      <li key={c.id} className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <button type="button" onClick={() => setEditing({ course: c })} className="min-w-0 text-left">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-primary-800">{fr.replace(':', 'h')}</span>
                            <span className="text-xs text-neutral-500">({il.replace(':', 'h')} Israël)</span>
                            <Pill className={STATUS_STYLE[c.status]}>{STATUSES[c.status]}</Pill>
                            {c.recurrenceId && <Pill className="bg-primary-50 text-primary-700">récurrent</Pill>}
                            {!c.joinUrl && <Pill className="bg-amber-50 text-amber-800">sans lien</Pill>}
                            {c.visibility === 'private' && <Pill className="bg-neutral-100 text-neutral-600">réservé</Pill>}
                          </span>
                          <span className={`mt-0.5 block font-semibold text-neutral-900 ${c.status === 'cancelled' ? 'line-through' : ''}`}>{c.title || '(sans titre)'}</span>
                          <span className="text-sm text-neutral-500">{t?.name || 'Enseignant non défini'}{c.organizer ? ` · ${c.organizer}` : ''}</span>
                        </button>
                        <div className="flex flex-shrink-0 flex-wrap gap-1.5">
                          {c.status === 'draft' && <button type="button" className={btn.outline} onClick={() => quickStatus(c, 'scheduled')}>Valider</button>}
                          {c.status !== 'cancelled' && c.publishedAt && <button type="button" className={btn.danger} onClick={() => window.confirm(`Annuler « ${c.title} » ? Il restera affiché comme annulé.`) && quickStatus(c, 'cancelled')}>Annuler</button>}
                          {!c.publishedAt && (
                            <button
                              type="button"
                              className={btn.danger}
                              aria-label={`Supprimer ${c.title}`}
                              onClick={() => window.confirm(`Supprimer le brouillon « ${c.title} » ? (récupérable dans la corbeille)`) && run('del', () => adminApi('DELETE', `/courses/${encodeURIComponent(c.id)}`), () => 'Brouillon supprimé (corbeille).')}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </button>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Panel>
          );
        })}
      </div>

      <ImportDialog open={importOpen} onClose={() => setImportOpen(false)} flash={flash} mailchimpReady={!!mcStatus?.ok} onDone={() => { setImportOpen(false); reload(); }} />
      <Modal open={!!editing} title={editing?.course ? 'Modifier le cours' : 'Nouveau cours'} onClose={() => setEditing(null)} wide>
        {editing && (
          <CourseEditor
            course={editing.course}
            dayKey={editing.dayKey}
            teachers={teachers}
            series={series}
            flash={flash}
            onClose={() => setEditing(null)}
            onSaved={() => {
              setEditing(null);
              if (params.get('cours')) {
                params.delete('cours');
                setParams(params, { replace: true });
              }
              reload();
            }}
          />
        )}
      </Modal>
      <p className="text-xs text-neutral-400">Connecté : {session.username} ({session.role === 'admin' ? 'administrateur' : 'éditeur'})</p>
    </div>
  );
}
