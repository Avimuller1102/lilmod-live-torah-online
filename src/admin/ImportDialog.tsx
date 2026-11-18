/**
 * Import d'un programme rédigé : texte de la newsletter ou du message WhatsApp,
 * ou lecture directe de la dernière newsletter Mailchimp.
 */
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, Mail, Wand2 } from 'lucide-react';
import { adminApi } from './api';
import { Modal, Pill, btn } from './ui';
import { formatDayKey } from '../../shared/time.js';

export default function ImportDialog({ open, onClose, onDone, flash, mailchimpReady }: any) {
  const [text, setText] = useState('');
  const [items, setItems] = useState<any[] | null>(null);
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [createRules, setCreateRules] = useState(true);
  const [busy, setBusy] = useState('');

  const analyse = async (value = text) => {
    setBusy('analyse');
    try {
      const r = await adminApi('POST', '/programme/import', { text: value });
      setItems(r.items);
    } catch (e: any) {
      setItems(null);
      flash.error(e.message);
    } finally {
      setBusy('');
    }
  };

  const fromMailchimp = async () => {
    setBusy('mailchimp');
    try {
      const r = await adminApi('GET', '/mailchimp/last-campaign');
      setText(r.text);
      flash.ok(`Newsletter « ${r.subject} » chargée.`);
      await analyse(r.text);
    } catch (e: any) {
      flash.error(e.message);
    } finally {
      setBusy('');
    }
  };

  const apply = async () => {
    setBusy('apply');
    try {
      const r = await adminApi('POST', '/programme/import', { text, apply: true, status, createRules });
      flash.ok(
        `${r.created} cours importés${r.rules ? `, ${r.rules} cours récurrents créés` : ''}${r.teachers?.length ? `, nouveaux intervenants : ${r.teachers.join(', ')}` : ''}.`,
      );
      setItems(null);
      setText('');
      onDone();
    } catch (e: any) {
      flash.error(e.message);
    } finally {
      setBusy('');
    }
  };

  const fresh = (items || []).filter((i) => !i.duplicate);

  return (
    <Modal open={open} title="Importer un programme" onClose={onClose} wide>
      {!items ? (
        <div className="space-y-4">
          <p className="text-sm text-neutral-600">
            Collez le programme tel qu'il a été envoyé (newsletter ou WhatsApp). Chaque cours est reconnu : jour, intervenant, heure, titre, lien Zoom et organisateur. Rien n'est enregistré avant votre confirmation.
          </p>
          {mailchimpReady && (
            <button type="button" className={btn.outline} disabled={!!busy} onClick={fromMailchimp}>
              <Mail className="h-4 w-4" aria-hidden="true" /> {busy === 'mailchimp' ? 'Lecture…' : 'Lire la dernière newsletter Mailchimp'}
            </button>
          )}
          <label htmlFor="import-text" className="field-label">Texte du programme</label>
          <textarea
            id="import-text"
            className="field min-h-[320px] font-mono text-[13px]"
            placeholder={'Dimanche 15 Novembre\nRav Shmuel Elikan\n17H00 France\nTitre du cours\nhttps://zoom.us/j/…\nBy MIDRESHET YEHOUDA'}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button type="button" className={btn.outline} onClick={onClose}>Annuler</button>
            <button type="button" className={btn.primary} disabled={!text.trim() || !!busy} onClick={() => analyse()}>
              <Wand2 className="h-4 w-4" aria-hidden="true" /> {busy === 'analyse' ? 'Analyse…' : 'Analyser'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-neutral-700">
            <strong>{items.length} cours reconnus</strong>
            {items.length - fresh.length > 0 && ` dont ${items.length - fresh.length} déjà présents (ignorés)`}. Vérifiez avant d'importer.
          </p>
          <ul className="max-h-[48vh] divide-y divide-neutral-100 overflow-y-auto rounded-xl border border-neutral-200">
            {items.map((i, n) => (
              <li key={n} className={`p-3 text-sm ${i.duplicate ? 'bg-neutral-50 opacity-60' : ''}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-primary-800">{formatDayKey(i.date)} · {i.time} ({i.timezone === 'Europe/Paris' ? 'France' : 'Israël'})</span>
                  {i.duplicate && <Pill className="bg-neutral-200 text-neutral-700">déjà présent</Pill>}
                  {i.organizer && <Pill className="bg-primary-50 text-primary-700">{i.organizer}</Pill>}
                  {!i.teacherId && i.teacherName && <Pill className="bg-amber-50 text-amber-800">nouvel intervenant</Pill>}
                </div>
                <p className="mt-0.5 font-semibold text-neutral-900">{i.title || '(titre manquant)'}</p>
                <p className="text-neutral-600">{i.teacherName || '(intervenant manquant)'}</p>
                <p className="truncate text-xs text-neutral-500">{i.joinUrl || 'pas de lien'}</p>
                {i.warnings?.length > 0 && (
                  <p className="mt-1 flex items-start gap-1 text-xs text-amber-800">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" /> {i.warnings.join(' ')}
                  </p>
                )}
              </li>
            ))}
          </ul>
          <fieldset className="space-y-2 rounded-xl bg-sand-100 p-3 text-sm">
            <legend className="sr-only">Options</legend>
            <label className="flex items-start gap-2">
              <input type="radio" name="st" className="mt-1" checked={status === 'published'} onChange={() => setStatus('published')} />
              <span><strong>Publier directement</strong> (le programme a déjà été annoncé)</span>
            </label>
            <label className="flex items-start gap-2">
              <input type="radio" name="st" className="mt-1" checked={status === 'draft'} onChange={() => setStatus('draft')} />
              <span><strong>En brouillon</strong> (je vérifie puis je publie)</span>
            </label>
            <label className="flex items-start gap-2 border-t border-neutral-200 pt-2">
              <input type="checkbox" className="mt-1" checked={createRules} onChange={(e) => setCreateRules(e.target.checked)} />
              <span><strong>Créer aussi les cours récurrents</strong> : chaque semaine, « Préparer la semaine suivante » recréera ces cours (vous n'aurez qu'à changer les titres).</span>
            </label>
          </fieldset>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" className={btn.outline} onClick={() => setItems(null)}>Modifier le texte</button>
            <button type="button" className={btn.accent} disabled={!fresh.length || !!busy} onClick={apply}>
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {busy === 'apply' ? 'Import…' : `Importer ${fresh.length} cours`}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
