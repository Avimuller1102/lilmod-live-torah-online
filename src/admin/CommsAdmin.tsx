/**
 * Administration — communications générées depuis le programme publié.
 * - Newsletter (Mailchimp) : aperçu, copie du HTML, brouillon, test, programmation protégée, rectificatif.
 * - WhatsApp : message prêt à copier ou à ouvrir dans WhatsApp, historique des préparations.
 */
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Copy, ExternalLink, Mail, MessageCircle, RefreshCw, Send } from 'lucide-react';
import { adminApi, useAdmin } from './api';
import { Field, Panel, Pill, btn, useFlash } from './ui';
import type { Session } from './AdminApp';
import { addDaysToKey, formatDayKey, localDateKey, weekOf, zonedTimeToUtc, TZ_FRANCE } from '../../shared/time.js';
import { whatsappShareUrl } from '../../shared/messages.js';

const STATUS_LABEL: Record<string, string> = {
  prepared: 'préparé', draft: 'brouillon Mailchimp', test: 'test envoyé', scheduled: 'programmé', sent: 'envoyé', failed: 'échec',
};

export default function CommsAdmin({ channel, session }: { channel: 'email' | 'whatsapp'; session: Session }) {
  const [params, setParams] = useSearchParams();
  const kind = params.get('type') === 'daily' ? 'daily' : 'weekly';
  const defaultPeriod = kind === 'weekly' ? weekOf(new Date()).start : localDateKey(new Date());
  const period = /^\d{4}-\d{2}-\d{2}$/.test(params.get('periode') || '') ? params.get('periode')! : defaultPeriod;
  const { data, loading, error, reload } = useAdmin<any>(`/comms/preview?kind=${kind}&period=${period}`);
  const { data: mc } = useAdmin<any>(channel === 'email' ? '/mailchimp/status' : null);
  const { data: settings } = useAdmin<any>(channel === 'email' ? '/settings' : null);
  const [text, setText] = useState('');
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState('');
  const [sendAt, setSendAt] = useState('');
  const [confirmWord, setConfirmWord] = useState('');
  const [correction, setCorrection] = useState('');
  const flash = useFlash();

  useEffect(() => setText(data?.whatsapp || ''), [data]);
  useEffect(() => {
    const day = kind === 'weekly' ? period : period;
    const s = settings?.settings;
    const time = kind === 'weekly' ? s?.weekly?.sendTime || '09:00' : s?.daily?.sendTime || '08:00';
    const d = zonedTimeToUtc(day, time, TZ_FRANCE);
    const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    setSendAt(local);
  }, [kind, period, settings]);

  const setQuery = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    next.set(k, v);
    if (k === 'type') next.delete('periode');
    setParams(next, { replace: true });
  };
  const shift = (n: number) => setQuery('periode', addDaysToKey(period, n * (kind === 'weekly' ? 7 : 1)));

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      flash.ok(`${label} copié.`);
      return true;
    } catch {
      flash.error('Copie impossible : sélectionnez le texte et copiez-le manuellement.');
      return false;
    }
  };

  const logWhatsapp = () => adminApi('POST', '/comms/whatsapp', { kind, period, text, courseIds: data?.courseIds || [] }).then(reload).catch(() => undefined);

  const emailAction = async (action: string, extra: any = {}) => {
    setBusy(action);
    try {
      const r = await adminApi('POST', '/comms/email', { kind, period, action, ...extra });
      flash.ok(`E-mail : ${STATUS_LABEL[r.record.status] || r.record.status}.`);
      reload();
    } catch (e: any) {
      flash.error(e.message);
    } finally {
      setBusy('');
    }
  };

  const history = (data?.history || []).filter((h: any) => h.channel === channel);
  const sent = (data?.history || []).find((h: any) => h.channel === 'email' && ['sent', 'scheduled'].includes(h.status) && !h.key.endsWith(':rectificatif'));

  return (
    <div className="space-y-5">
      {flash.node}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-neutral-950">{channel === 'email' ? 'Newsletter' : 'WhatsApp'}</h1>
          <p className="text-sm text-neutral-500">Généré automatiquement depuis les cours <strong>publiés</strong> : rien à ressaisir.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-xl border border-neutral-200 bg-white p-1" role="group" aria-label="Type de message">
            <button type="button" aria-pressed={kind === 'weekly'} onClick={() => setQuery('type', 'weekly')} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${kind === 'weekly' ? 'bg-primary-700 text-white' : 'text-neutral-700'}`}>Programme de la semaine</button>
            <button type="button" aria-pressed={kind === 'daily'} onClick={() => setQuery('type', 'daily')} className={`rounded-lg px-3 py-1.5 text-sm font-semibold ${kind === 'daily' ? 'bg-primary-700 text-white' : 'text-neutral-700'}`}>Cours du jour</button>
          </div>
          <button type="button" className={btn.outline} onClick={() => shift(-1)} aria-label="Période précédente">‹</button>
          <span className="text-sm font-semibold">{kind === 'weekly' ? `Semaine du ${formatDayKey(period)}` : formatDayKey(period)}</span>
          <button type="button" className={btn.outline} onClick={() => shift(1)} aria-label="Période suivante">›</button>
          <button type="button" className={btn.outline} onClick={reload} aria-label="Régénérer"><RefreshCw className="h-4 w-4" /></button>
        </div>
      </div>

      {loading && <p className="text-neutral-500">Génération…</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>}
      {data && data.courseIds.length === 0 && (
        <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">Aucun cours publié sur cette période. Publiez d'abord le programme dans « Programme ».</p>
      )}

      {data && channel === 'whatsapp' && (
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <Panel title="Message à envoyer">
            <label htmlFor="wa-text" className="sr-only">Message WhatsApp</label>
            <textarea id="wa-text" className="field min-h-[420px] font-mono text-[13px] leading-6" value={text} onChange={(e) => setText(e.target.value)} />
            <p className="mt-2 text-xs text-neutral-500">Vous pouvez retoucher le texte avant de l'envoyer. *gras* et _italique_ s'affichent dans WhatsApp.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" className={btn.primary} onClick={async () => (await copy(text, 'Message')) && logWhatsapp()}>
                {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />} Copier le texte
              </button>
              <a href={whatsappShareUrl(text)} target="_blank" rel="noopener noreferrer" className={btn.green} onClick={() => logWhatsapp()}>
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> Ouvrir dans WhatsApp
              </a>
            </div>
          </Panel>
          <div className="space-y-5">
            <Panel title="Comment envoyer">
              <ol className="list-decimal space-y-1.5 pl-5 text-sm text-neutral-700">
                <li>Cliquez sur « Ouvrir dans WhatsApp » (ou « Copier »).</li>
                <li>Choisissez le groupe ou la communauté LILMOD.</li>
                <li>Vérifiez et envoyez.</li>
              </ol>
              <p className="mt-3 text-xs text-neutral-500">WhatsApp ne permet pas aux sites de publier automatiquement dans un groupe : l'envoi final reste manuel, en un clic, sans risque pour votre compte.</p>
            </Panel>
            <Panel title="Historique">
              {history.length ? (
                <ul className="space-y-1 text-sm">{history.map((h: any) => <li key={h.id}>{new Date(h.createdAt).toLocaleString('fr-FR')} — préparé par {h.user}</li>)}</ul>
              ) : (
                <p className="text-sm text-neutral-500">Pas encore préparé pour cette période.</p>
              )}
            </Panel>
          </div>
        </div>
      )}

      {data && channel === 'email' && (
        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <Panel title={<span>Aperçu · <span className="font-sans text-sm font-normal text-neutral-600">{data.subject}</span></span>}>
            <iframe title="Aperçu de l'e-mail" srcDoc={data.html} className="h-[640px] w-full rounded-xl border border-neutral-200 bg-white" sandbox="" />
          </Panel>
          <div className="space-y-5">
            <Panel title="Mailchimp">
              {!mc?.configured ? (
                <div className="space-y-3 text-sm">
                  <p className="rounded-xl bg-amber-50 p-3 text-amber-900">Mailchimp n'est pas encore connecté. Vous pouvez copier le HTML et le coller dans une campagne Mailchimp (bloc « Code »).</p>
                  <button type="button" className={btn.primary} onClick={() => copy(data.rawHtml, 'HTML de l’e-mail')}><Copy className="h-4 w-4" aria-hidden="true" /> Copier le HTML</button>
                  <button type="button" className={btn.outline} onClick={() => copy(data.subject, 'Objet')}>Copier l'objet</button>
                </div>
              ) : !mc.ok ? (
                <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">Connexion Mailchimp en erreur : {mc.error}</p>
              ) : (
                <div className="space-y-3 text-sm">
                  <p className="text-green-700">✓ Connecté · audience : {settings?.settings?.mailchimp?.audienceId || <strong className="text-red-700">à choisir dans Paramètres</strong>}</p>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" disabled={!!busy || !!sent} className={btn.outline} onClick={() => emailAction('draft')}><Mail className="h-4 w-4" aria-hidden="true" /> Créer le brouillon</button>
                    <button type="button" disabled={!!busy || !!sent} className={btn.primary} onClick={() => emailAction('test')}><Send className="h-4 w-4" aria-hidden="true" /> Envoyer un test</button>
                    <button type="button" className={btn.outline} onClick={() => copy(data.rawHtml, 'HTML de l’e-mail')}><Copy className="h-4 w-4" aria-hidden="true" /> HTML</button>
                  </div>
                  <p className="text-xs text-neutral-500">Le test part uniquement vers les adresses de test (Paramètres) : {(settings?.settings?.mailchimp?.testEmails || []).join(', ') || 'aucune configurée'}.</p>
                </div>
              )}
            </Panel>

            {mc?.ok && session.role === 'admin' && !sent && (
              <Panel title="Programmer l'envoi aux abonnés">
                {!settings?.settings?.liveSendingEnabled ? (
                  <p className="text-sm text-neutral-600">Les envois réels sont verrouillés. Un administrateur peut les autoriser dans Paramètres.</p>
                ) : (
                  <div className="space-y-3">
                    <Field label="Date et heure d'envoi (votre heure locale)" htmlFor="send-at">
                      <input id="send-at" type="datetime-local" className="field" value={sendAt} onChange={(e) => setSendAt(e.target.value)} />
                    </Field>
                    <Field label="Tapez ENVOYER pour confirmer" htmlFor="confirm">
                      <input id="confirm" className="field" value={confirmWord} onChange={(e) => setConfirmWord(e.target.value)} autoComplete="off" />
                    </Field>
                    <button
                      type="button"
                      className={btn.accent}
                      disabled={confirmWord !== 'ENVOYER' || !!busy}
                      onClick={() => emailAction('schedule', { sendAt: new Date(sendAt).toISOString(), confirm: confirmWord }).then(() => setConfirmWord(''))}
                    >
                      Programmer l'envoi
                    </button>
                  </div>
                )}
              </Panel>
            )}

            {sent && (
              <Panel title="Déjà envoyé">
                <p className="text-sm text-neutral-700">
                  Cet e-mail est {sent.status === 'sent' ? 'envoyé' : `programmé pour le ${new Date(sent.scheduledFor).toLocaleString('fr-FR')}`}. Il ne peut plus être modifié.
                </p>
                {mc?.ok && session.role === 'admin' && settings?.settings?.liveSendingEnabled && (
                  <div className="mt-3 space-y-2">
                    <Field label="Rectificatif (ex. : « Le cours de mardi est déplacé à 21h »)" htmlFor="corr">
                      <textarea id="corr" rows={2} className="field" value={correction} onChange={(e) => setCorrection(e.target.value)} />
                    </Field>
                    <Field label="Tapez ENVOYER pour confirmer" htmlFor="confirm2">
                      <input id="confirm2" className="field" value={confirmWord} onChange={(e) => setConfirmWord(e.target.value)} autoComplete="off" />
                    </Field>
                    <button type="button" className={btn.accent} disabled={!correction.trim() || confirmWord !== 'ENVOYER' || !!busy} onClick={() => emailAction('send', { correctionNote: correction, confirm: confirmWord })}>
                      Envoyer le rectificatif
                    </button>
                  </div>
                )}
              </Panel>
            )}

            <Panel title="Historique">
              {history.length ? (
                <ul className="space-y-1.5 text-sm">
                  {history.map((h: any) => (
                    <li key={h.id} className="flex flex-wrap items-center gap-2">
                      <Pill className="bg-neutral-100 text-neutral-700">{STATUS_LABEL[h.status] || h.status}</Pill>
                      <span>{h.label}</span>
                      {h.lastError && <span className="text-red-600">— {h.lastError}</span>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-500">Rien encore pour cette période.</p>
              )}
              <a href="https://admin.mailchimp.com/campaigns/" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline">
                Ouvrir Mailchimp <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </Panel>
          </div>
        </div>
      )}
    </div>
  );
}
