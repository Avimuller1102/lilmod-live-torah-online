/**
 * Administration — paramètres, comptes, journal, corbeille et sauvegardes.
 */
import { useEffect, useState } from 'react';
import { Download, Lock, ShieldAlert, Upload } from 'lucide-react';
import { adminApi, useAdmin } from './api';
import { Field, Panel, Pill, btn, useFlash } from './ui';
import type { Session } from './AdminApp';
import { formatDayKey, localDateKey, WEEKDAYS_FR } from '../../shared/time.js';

export default function SettingsAdmin({ session }: { session: Session }) {
  const { data, reload } = useAdmin<any>('/settings');
  const { data: mc } = useAdmin<any>('/mailchimp/status');
  const { data: logs, reload: reloadLogs } = useAdmin<any>('/logs');
  const { data: trash, reload: reloadTrash } = useAdmin<any>('/courses/trash');
  const { data: users, reload: reloadUsers } = useAdmin<any>(session.role === 'admin' ? '/users' : null);
  const [form, setForm] = useState<any>(null);
  const [confirmWord, setConfirmWord] = useState('');
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'editor' });
  const flash = useFlash();
  const isAdmin = session.role === 'admin';

  useEffect(() => {
    if (data?.settings) setForm({ ...data.settings, testEmailsText: (data.settings.mailchimp.testEmails || []).join(', ') });
  }, [data]);
  if (!form) return <p className="text-neutral-500">Chargement…</p>;

  const set = (path: string, v: any) =>
    setForm((f: any) => {
      const [a, b] = path.split('.');
      return b ? { ...f, [a]: { ...f[a], [b]: v } } : { ...f, [a]: v };
    });

  const save = async (e?: React.FormEvent, extra: any = {}) => {
    e?.preventDefault();
    try {
      const { testEmailsText, ...payload } = form;
      payload.mailchimp = { ...payload.mailchimp, testEmails: testEmailsText.split(',').map((x: string) => x.trim()).filter(Boolean) };
      await adminApi('PUT', '/settings', { ...payload, ...extra });
      flash.ok('Paramètres enregistrés.');
      setConfirmWord('');
      reload();
      reloadLogs();
    } catch (err: any) {
      flash.error(err.message);
    }
  };

  const download = async () => {
    try {
      const backup = await adminApi('GET', '/backup');
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `lilmod-sauvegarde-${localDateKey(new Date())}.json`;
      a.click();
      URL.revokeObjectURL(a.href);
      flash.ok('Sauvegarde téléchargée.');
    } catch (e: any) {
      flash.error(e.message);
    }
  };

  const restore = async (file: File) => {
    const word = window.prompt('Restaurer remplacera les données actuelles (une copie de sécurité est faite avant). Tapez RESTAURER pour confirmer :');
    if (word !== 'RESTAURER') return;
    try {
      const data = JSON.parse(await file.text());
      const r = await adminApi('POST', '/backup/restore', { data, confirm: word });
      flash.ok(`Restauration effectuée (copie de sécurité : ${r.snapshotKey}).`);
      reload();
    } catch (e: any) {
      flash.error(e.message);
    }
  };

  return (
    <div className="space-y-5">
      {flash.node}
      <h1 className="font-display text-2xl font-semibold text-neutral-950">Paramètres</h1>

      <form onSubmit={save} className="space-y-5">
        <Panel title="Liens publics" actions={<button type="submit" className={btn.primary}>Enregistrer</button>}>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Lien du groupe WhatsApp" htmlFor="s-wa"><input id="s-wa" type="url" className="field" value={form.whatsappGroupUrl} onChange={(e) => set('whatsappGroupUrl', e.target.value)} /></Field>
            <Field label="Formulaire d'inscription à la newsletter (Mailchimp)" htmlFor="s-nl"><input id="s-nl" type="url" className="field" value={form.newsletterSignupUrl} onChange={(e) => set('newsletterSignupUrl', e.target.value)} /></Field>
            <Field label="Page de don" htmlFor="s-don"><input id="s-don" type="url" className="field" value={form.donateUrl} onChange={(e) => set('donateUrl', e.target.value)} /></Field>
            <Field label="E-mail de contact" htmlFor="s-mail"><input id="s-mail" type="email" className="field" value={form.contactEmail} onChange={(e) => set('contactEmail', e.target.value)} /></Field>
          </div>
        </Panel>

        <Panel title="Mailchimp" actions={<button type="submit" className={btn.primary}>Enregistrer</button>}>
          {!mc?.configured ? (
            <p className="mb-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              Non connecté. Ajoutez la variable <code>MAILCHIMP_API_KEY</code> dans Netlify (Projet → Variables d'environnement), puis rechargez cette page. La clé n'est jamais visible ici.
            </p>
          ) : mc.ok ? (
            <div className="mb-4 rounded-xl bg-green-50 p-3 text-sm text-green-900">
              ✓ Connecté. Audiences existantes :
              <ul className="mt-1 list-disc pl-5">
                {mc.audiences.map((a: any) => (
                  <li key={a.id}>
                    <strong>{a.name}</strong> — identifiant <code>{a.id}</code> ({a.stats?.member_count ?? '?'} abonnés)
                    {a.tags?.length > 0 && <span className="text-green-800"> · tags : {a.tags.map((t: any) => t.name).join(', ')}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">Erreur de connexion : {mc.error}</p>
          )}
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Identifiant de l'audience" htmlFor="m-aud" hint="Liste existante à réutiliser"><input id="m-aud" className="field" value={form.mailchimp.audienceId} onChange={(e) => set('mailchimp.audienceId', e.target.value)} /></Field>
            <Field label="Tag des abonnés « programme hebdomadaire »" htmlFor="m-wt" hint="Vide = toute l'audience"><input id="m-wt" className="field" value={form.mailchimp.weeklyTag} onChange={(e) => set('mailchimp.weeklyTag', e.target.value)} /></Field>
            <Field label="Tag des abonnés « cours du jour »" htmlFor="m-dt" hint="Uniquement les personnes ayant accepté l'e-mail quotidien"><input id="m-dt" className="field" value={form.mailchimp.dailyTag} onChange={(e) => set('mailchimp.dailyTag', e.target.value)} /></Field>
            <Field label="Nom de l'expéditeur" htmlFor="m-from"><input id="m-from" className="field" value={form.mailchimp.fromName} onChange={(e) => set('mailchimp.fromName', e.target.value)} /></Field>
            <Field label="Adresse de réponse" htmlFor="m-reply"><input id="m-reply" type="email" className="field" value={form.mailchimp.replyTo} onChange={(e) => set('mailchimp.replyTo', e.target.value)} /></Field>
            <Field label="Adresses de test (virgules)" htmlFor="m-test"><input id="m-test" className="field" value={form.testEmailsText} onChange={(e) => set('testEmailsText', e.target.value)} /></Field>
          </div>
        </Panel>

        <Panel title="Horaires des communications (heure de France)" actions={<button type="submit" className={btn.primary}>Enregistrer</button>}>
          <div className="grid gap-4 md:grid-cols-4">
            <Field label="Newsletter : jour conseillé" htmlFor="w-day">
              <select id="w-day" className="field" value={form.weekly.sendDay} onChange={(e) => set('weekly.sendDay', Number(e.target.value))}>
                {WEEKDAYS_FR.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
            </Field>
            <Field label="Newsletter : heure" htmlFor="w-time"><input id="w-time" type="time" className="field" value={form.weekly.sendTime} onChange={(e) => set('weekly.sendTime', e.target.value)} /></Field>
            <Field label="E-mail du jour : préparé à" htmlFor="d-prep">
              <select id="d-prep" className="field" value={form.daily.prepareHour} onChange={(e) => set('daily.prepareHour', Number(e.target.value))}>
                {Array.from({ length: 24 }, (_, h) => <option key={h} value={h}>{String(h).padStart(2, '0')}h</option>)}
              </select>
            </Field>
            <Field label="E-mail du jour : envoyé à" htmlFor="d-send"><input id="d-send" type="time" className="field" value={form.daily.sendTime} onChange={(e) => set('daily.sendTime', e.target.value)} /></Field>
          </div>
          <p className="mt-3 text-xs text-neutral-500">Chaque matin, le brouillon de l'e-mail du jour est préparé dans Mailchimp (s'il y a des cours). Il n'est envoyé automatiquement que si l'envoi quotidien automatique est activé ci-dessous.</p>
        </Panel>
      </form>

      <Panel title={<span className="flex items-center gap-2"><ShieldAlert className="h-5 w-5 text-red-600" aria-hidden="true" /> Envois réels aux abonnés</span>}>
        <p className="text-sm text-neutral-700">
          État : {form.liveSendingEnabled ? <Pill className="bg-green-100 text-green-800">autorisés</Pill> : <Pill className="bg-neutral-100 text-neutral-700"><Lock className="mr-1 h-3 w-3" aria-hidden="true" />verrouillés</Pill>}
          {' '}· Envoi quotidien automatique : {form.daily.autoSend ? <Pill className="bg-green-100 text-green-800">activé</Pill> : <Pill className="bg-neutral-100 text-neutral-700">désactivé</Pill>}
        </p>
        {isAdmin ? (
          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-end">
            <Field label="Pour activer, tapez ACTIVER" htmlFor="act"><input id="act" className="field" value={confirmWord} onChange={(e) => setConfirmWord(e.target.value)} autoComplete="off" /></Field>
            {form.liveSendingEnabled ? (
              <button type="button" className={btn.outline} onClick={() => save(undefined, { liveSendingEnabled: false, daily: { ...form.daily, autoSend: false } })}>Verrouiller les envois</button>
            ) : (
              <button type="button" className={btn.danger} disabled={confirmWord !== 'ACTIVER'} onClick={() => save(undefined, { liveSendingEnabled: true, confirm: 'ACTIVER' })}>Autoriser les envois réels</button>
            )}
            <button
              type="button"
              className={btn.outline}
              disabled={!form.liveSendingEnabled || (!form.daily.autoSend && confirmWord !== 'ACTIVER')}
              onClick={() => save(undefined, { daily: { ...form.daily, autoSend: !form.daily.autoSend }, confirm: 'ACTIVER' })}
            >
              {form.daily.autoSend ? "Désactiver l'envoi quotidien automatique" : "Activer l'envoi quotidien automatique"}
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-neutral-500">Réservé aux administrateurs.</p>
        )}
      </Panel>

      {isAdmin && (
        <Panel title="Comptes de l'équipe">
          <ul className="mb-4 divide-y divide-neutral-100 text-sm">
            <li className="py-2"><strong>admin</strong> — administrateur principal (mot de passe défini dans Netlify : ADMIN_PASSWORD)</li>
            {(users?.items || []).map((u: any) => (
              <li key={u.username} className="flex flex-wrap items-center justify-between gap-2 py-2">
                <span><strong>{u.username}</strong> — {u.role === 'admin' ? 'administrateur' : 'éditeur'} {u.disabled && <Pill className="bg-neutral-100 text-neutral-500">désactivé</Pill>}</span>
                <span className="flex gap-2">
                  <button type="button" className={btn.outline} onClick={async () => { await adminApi('PUT', `/users/${u.username}`, { disabled: !u.disabled }).catch((e) => flash.error(e.message)); reloadUsers(); }}>{u.disabled ? 'Réactiver' : 'Désactiver'}</button>
                  <button type="button" className={btn.outline} onClick={async () => { const p = window.prompt('Nouveau mot de passe (10 caractères minimum) :'); if (p) { await adminApi('PUT', `/users/${u.username}`, { password: p }).then(() => flash.ok('Mot de passe modifié.')).catch((e) => flash.error(e.message)); } }}>Nouveau mot de passe</button>
                </span>
              </li>
            ))}
          </ul>
          <form
            className="grid gap-3 md:grid-cols-[1fr_1fr_160px_auto] md:items-end"
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await adminApi('POST', '/users', newUser);
                flash.ok('Compte créé.');
                setNewUser({ username: '', password: '', role: 'editor' });
                reloadUsers();
              } catch (err: any) {
                flash.error(err.message);
              }
            }}
          >
            <Field label="Identifiant" htmlFor="nu"><input id="nu" className="field" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required /></Field>
            <Field label="Mot de passe (10+)" htmlFor="np"><input id="np" type="password" autoComplete="new-password" className="field" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} required minLength={10} /></Field>
            <Field label="Rôle" htmlFor="nr">
              <select id="nr" className="field" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                <option value="editor">Éditeur</option>
                <option value="admin">Administrateur</option>
              </select>
            </Field>
            <button type="submit" className={btn.primary}>Créer</button>
          </form>
          <p className="mt-2 text-xs text-neutral-500">Éditeur : prépare et publie le programme, prépare les messages et envoie des tests. Administrateur : en plus, programme les envois réels, gère les comptes et les sauvegardes.</p>
        </Panel>
      )}

      {isAdmin && (
        <Panel title="Sauvegardes">
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn.primary} onClick={download}><Download className="h-4 w-4" aria-hidden="true" /> Télécharger une sauvegarde</button>
            <label className={`${btn.outline} cursor-pointer`}>
              <Upload className="h-4 w-4" aria-hidden="true" /> Restaurer…
              <input type="file" accept="application/json" className="sr-only" onChange={(e) => e.target.files?.[0] && restore(e.target.files[0])} />
            </label>
          </div>
          <p className="mt-2 text-xs text-neutral-500">Conseil : téléchargez une sauvegarde chaque mois. Avant toute restauration, une copie de sécurité est enregistrée automatiquement.</p>
        </Panel>
      )}

      <Panel title="Corbeille (brouillons supprimés)">
        {(trash?.trash || []).length ? (
          <ul className="divide-y divide-neutral-100 text-sm">
            {trash.trash.slice(0, 30).map((c: any) => (
              <li key={c.id} className="flex items-center justify-between gap-2 py-2">
                <span>{c.title || c.id} {c.start && <span className="text-neutral-500">— {formatDayKey(localDateKey(c.start))}</span>}</span>
                <button type="button" className={btn.outline} onClick={async () => { await adminApi('POST', '/courses/restore', { id: c.id }).then(() => flash.ok('Cours restauré.')).catch((e) => flash.error(e.message)); reloadTrash(); }}>Restaurer</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-500">Vide.</p>
        )}
      </Panel>

      <Panel title="Journal des opérations">
        <ul className="max-h-[420px] space-y-1 overflow-y-auto text-sm">
          {(logs?.items || []).map((l: any) => (
            <li key={l.id} className={l.level === 'error' ? 'text-red-700' : 'text-neutral-700'}>
              <span className="text-neutral-400">{new Date(l.at).toLocaleString('fr-FR')}</span> · {l.user} · <strong>{l.action}</strong>
              {l.details && Object.keys(l.details).length > 0 && <span className="text-neutral-500"> {JSON.stringify(l.details).slice(0, 160)}</span>}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
