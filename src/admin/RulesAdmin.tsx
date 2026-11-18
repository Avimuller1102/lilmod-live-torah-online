/**
 * Administration — cours récurrents (séances habituelles).
 * « Préparer la semaine » crée automatiquement leurs occurrences en brouillon ;
 * modifier une occurrence ne change ni la règle ni les autres semaines.
 */
import { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { adminApi, useAdmin } from './api';
import { Field, Modal, Panel, Pill, btn, useFlash } from './ui';
import { WEEKDAYS_FR, TZ_ISRAEL, TZ_FRANCE, localDateKey } from '../../shared/time.js';
import { PLATFORMS } from '../../shared/programme.js';
import { CATEGORIES } from '../../shared/catalog.js';

const EMPTY = {
  title: '', description: '', teacherId: '', seriesId: '', category: '', weekdays: [0] as number[], time: '20:30', durationMin: 60,
  timezone: TZ_ISRAEL, intervalWeeks: 1, startDate: localDateKey(new Date()), endDate: '', platform: 'zoom', joinUrl: '', joinPublic: true,
  visibility: 'public', thumbnail: '', active: true,
};

export default function RulesAdmin() {
  const { data, reload } = useAdmin<{ items: any[] }>('/rules');
  const { data: t } = useAdmin<{ items: any[] }>('/teachers');
  const { data: s } = useAdmin<{ items: any[] }>('/series');
  const [form, setForm] = useState<any>(null);
  const flash = useFlash();
  const teachers = t?.items || [];
  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { id, createdAt, updatedAt, ...payload } = form;
      payload.durationMin = Number(payload.durationMin);
      payload.intervalWeeks = Number(payload.intervalWeeks);
      if (id) await adminApi('PUT', `/rules/${id}`, payload);
      else await adminApi('POST', '/rules', payload);
      flash.ok('Cours récurrent enregistré. Les semaines déjà préparées ne sont pas modifiées.');
      setForm(null);
      reload();
    } catch (err: any) {
      flash.error(err.message);
    }
  };

  const rules = data?.items || [];
  return (
    <div className="space-y-5">
      {flash.node}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-neutral-950">Cours récurrents</h1>
          <p className="max-w-2xl text-sm text-neutral-500">Les séances habituelles de la semaine. Dans « Programme », le bouton « Préparer depuis les cours récurrents » les ajoute en brouillon : il ne reste qu'à ajuster les titres.</p>
        </div>
        <button type="button" className={btn.primary} onClick={() => setForm({ ...EMPTY })}><Plus className="h-4 w-4" aria-hidden="true" /> Nouveau cours récurrent</button>
      </div>
      <Panel>
        {rules.length === 0 ? (
          <p className="text-sm text-neutral-500">Aucun cours récurrent. Créez par exemple « Paracha de la semaine — chaque dimanche à 20h30 ».</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {rules.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span>
                  <span className="font-semibold text-neutral-900">{r.title}</span>{' '}
                  {!r.active && <Pill className="bg-neutral-100 text-neutral-500">désactivé</Pill>}
                  <span className="block text-sm text-neutral-500">
                    {r.weekdays.map((d: number) => WEEKDAYS_FR[d]).join(', ')} à {r.time} ({r.timezone === TZ_FRANCE ? 'heure de France' : "heure d'Israël"})
                    {r.intervalWeeks > 1 ? ` · toutes les ${r.intervalWeeks} semaines` : ' · chaque semaine'}
                    {' · '}{teachers.find((x) => x.id === r.teacherId)?.name || 'enseignant ?'}
                  </span>
                </span>
                <button type="button" className={btn.outline} onClick={() => setForm({ ...EMPTY, ...r })}><Pencil className="h-4 w-4" aria-hidden="true" /> Modifier</button>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Modal open={!!form} title={form?.id ? 'Modifier le cours récurrent' : 'Nouveau cours récurrent'} onClose={() => setForm(null)} wide>
        {form && (
          <form onSubmit={save} className="space-y-4">
            <Field label="Titre *" htmlFor="r-title"><input id="r-title" className="field" required value={form.title} onChange={(e) => set('title', e.target.value)} /></Field>
            <fieldset>
              <legend className="field-label">Jour(s) *</legend>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS_FR.map((d, i) => (
                  <label key={d} className={`cursor-pointer rounded-xl border px-3 py-2 text-sm font-semibold ${form.weekdays.includes(i) ? 'border-primary-700 bg-primary-700 text-white' : 'border-neutral-300 bg-white'}`}>
                    <input type="checkbox" className="sr-only" checked={form.weekdays.includes(i)} onChange={(e) => set('weekdays', e.target.checked ? [...form.weekdays, i].sort() : form.weekdays.filter((x: number) => x !== i))} />
                    {d}
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-4">
              <Field label="Heure *" htmlFor="r-time"><input id="r-time" type="time" className="field" required value={form.time} onChange={(e) => set('time', e.target.value)} /></Field>
              <Field label="Durée (min)" htmlFor="r-dur"><input id="r-dur" type="number" min={10} max={600} className="field" value={form.durationMin} onChange={(e) => set('durationMin', e.target.value)} /></Field>
              <Field label="Heure saisie en" htmlFor="r-tz">
                <select id="r-tz" className="field" value={form.timezone} onChange={(e) => set('timezone', e.target.value)}>
                  <option value={TZ_ISRAEL}>Israël</option>
                  <option value={TZ_FRANCE}>France</option>
                </select>
              </Field>
              <Field label="Périodicité" htmlFor="r-int">
                <select id="r-int" className="field" value={form.intervalWeeks} onChange={(e) => set('intervalWeeks', Number(e.target.value))}>
                  <option value={1}>Chaque semaine</option>
                  <option value={2}>Toutes les 2 semaines</option>
                  <option value={3}>Toutes les 3 semaines</option>
                  <option value={4}>Toutes les 4 semaines</option>
                </select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="À partir du" htmlFor="r-start"><input id="r-start" type="date" className="field" required value={form.startDate} onChange={(e) => set('startDate', e.target.value)} /></Field>
              <Field label="Jusqu'au (facultatif)" htmlFor="r-end"><input id="r-end" type="date" className="field" value={form.endDate} onChange={(e) => set('endDate', e.target.value)} /></Field>
              <Field label="Enseignant" htmlFor="r-teacher">
                <select id="r-teacher" className="field" value={form.teacherId} onChange={(e) => set('teacherId', e.target.value)}>
                  <option value="">—</option>
                  {teachers.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </select>
              </Field>
              <Field label="Série" htmlFor="r-series">
                <select id="r-series" className="field" value={form.seriesId} onChange={(e) => set('seriesId', e.target.value)}>
                  <option value="">—</option>
                  {(s?.items || []).map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
                </select>
              </Field>
              <Field label="Thème" htmlFor="r-cat">
                <select id="r-cat" className="field" value={form.category} onChange={(e) => set('category', e.target.value)}>
                  <option value="">—</option>
                  {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </Field>
              <Field label="Diffusion" htmlFor="r-platform">
                <select id="r-platform" className="field" value={form.platform} onChange={(e) => set('platform', e.target.value)}>
                  {Object.entries(PLATFORMS).map(([k, v]) => <option key={k} value={k}>{v as string}</option>)}
                </select>
              </Field>
            </div>
            <Field label="Lien de participation habituel" htmlFor="r-join"><input id="r-join" type="url" className="field" placeholder="https://" value={form.joinUrl} onChange={(e) => set('joinUrl', e.target.value)} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4" checked={form.joinPublic} onChange={(e) => set('joinPublic', e.target.checked)} /> Lien public (affiché sur le site et dans les messages)</label>
            <Field label="Description" htmlFor="r-desc"><textarea id="r-desc" rows={2} className="field" value={form.description} onChange={(e) => set('description', e.target.value)} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="h-4 w-4" checked={form.active} onChange={(e) => set('active', e.target.checked)} /> Actif</label>
            <div className="flex justify-end gap-2">
              <button type="button" className={btn.outline} onClick={() => setForm(null)}>Annuler</button>
              <button type="submit" className={btn.primary}>Enregistrer</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
