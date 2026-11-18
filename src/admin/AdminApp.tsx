/**
 * Administration LILMOD — /admin
 * Connexion, navigation et tableau de bord.
 */
import { lazy, Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import {
  AlertTriangle, BookOpen, CalendarDays, ExternalLink, Film, LayoutDashboard, Lock, LogOut, Mail, MessageCircle, Repeat, Settings, Users,
} from 'lucide-react';
import { adminApi, useAdmin } from './api';
import { Panel, Pill, STATUS_STYLE, btn } from './ui';
import { IMAGES } from '@/lib/constants';
import { useSeo } from '@/lib/seo';
import { addDaysToKey, formatDayKey, localDateKey, localTime, weekOf } from '../../shared/time.js';
import { STATUSES } from '../../shared/programme.js';

const ProgrammeAdmin = lazy(() => import('./ProgrammeAdmin'));
const RulesAdmin = lazy(() => import('./RulesAdmin'));
const ContentAdmin = lazy(() => import('./ContentAdmin'));
const CommsAdmin = lazy(() => import('./CommsAdmin'));
const SettingsAdmin = lazy(() => import('./SettingsAdmin'));

export type Session = { username: string; role: 'admin' | 'editor' };

const NAV = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, end: true },
  { to: '/admin/programme', label: 'Programme', icon: CalendarDays },
  { to: '/admin/recurrences', label: 'Cours récurrents', icon: Repeat },
  { to: '/admin/intervenants', label: 'Intervenants', icon: Users },
  { to: '/admin/series', label: 'Séries', icon: BookOpen },
  { to: '/admin/videos', label: 'Vidéos', icon: Film },
  { to: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  { to: '/admin/whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { to: '/admin/parametres', label: 'Paramètres', icon: Settings },
];

function Login({ onLogin }: { onLogin: (s: Session) => void }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-hero p-4">
      <form
        className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError('');
          try {
            const { user } = await adminApi<{ user: Session }>('POST', '/login', { username, password });
            onLogin(user);
          } catch (err: any) {
            setError(err.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <img src={IMAGES.logo} alt="" width={56} height={56} className="mb-4 h-14 w-14 rounded-full border-2 border-accent-400" />
        <h1 className="font-display text-2xl font-semibold text-neutral-950">Administration LILMOD</h1>
        <p className="mb-5 mt-1 text-sm text-neutral-500">Accès réservé à l'équipe.</p>
        <label htmlFor="u" className="field-label">Identifiant</label>
        <input id="u" className="field mb-3" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <label htmlFor="p" className="field-label">Mot de passe</label>
        <input id="p" type="password" className="field" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {error && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
        <button type="submit" disabled={busy} className={`${btn.primary} mt-5 w-full min-h-[48px]`}>
          <Lock className="h-4 w-4" aria-hidden="true" /> {busy ? 'Connexion…' : 'Se connecter'}
        </button>
        <Link to="/" className="mt-4 block text-center text-sm text-neutral-500 hover:text-primary-700">← Retour au site</Link>
      </form>
    </div>
  );
}

function Dashboard({ session }: { session: Session }) {
  const { data, loading, error, reload } = useAdmin<any>('/dashboard');
  const navigate = useNavigate();
  const next = addDaysToKey(weekOf(new Date()).start, 7);
  if (loading) return <p className="text-neutral-500">Chargement…</p>;
  if (error) return <p role="alert" className="rounded-xl bg-red-50 p-4 text-red-700">{error}</p>;
  const stat = (label: string, value: number | string, to?: string) => (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold text-neutral-950">{value}</p>
      {to && <Link to={to} className="mt-1 inline-block text-xs font-semibold text-primary-700 hover:underline">Voir →</Link>}
    </div>
  );
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-neutral-950">Bonjour {session.username} 👋</h1>
          <p className="text-sm text-neutral-500">{formatDayKey(localDateKey(new Date()), { withYear: true })}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btn.primary} onClick={() => navigate(`/admin/programme?semaine=${next}&preparer=1`)}>Préparer la semaine suivante</button>
          <button type="button" className={btn.green} onClick={() => navigate('/admin/whatsapp?type=daily')}>Message WhatsApp du jour</button>
        </div>
      </div>

      {(!data.mailchimpConfigured || !data.liveSendingEnabled) && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          {!data.mailchimpConfigured && <p>• Mailchimp n'est pas encore connecté : les e-mails peuvent être prévisualisés et copiés, mais pas envoyés depuis ici.</p>}
          {!data.liveSendingEnabled && <p>• Les envois réels aux abonnés sont verrouillés (sécurité). Ils se débloquent dans Paramètres.</p>}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {stat("Cours aujourd'hui", data.today.length, '/admin/programme')}
        {stat('Cours cette semaine', data.weekCount, '/admin/programme')}
        {stat('À valider (brouillons)', data.drafts, '/admin/programme')}
        {stat('Replays à compléter', data.replaysToComplete.length)}
        {stat('Vidéos indexées', data.videosCount, '/admin/videos')}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Aujourd'hui">
          {data.today.length ? (
            <ul className="divide-y divide-neutral-100">
              {data.today.map((c: any) => (
                <li key={c.id} className="flex items-center justify-between gap-2 py-2">
                  <span className="min-w-0">
                    <span className="font-semibold text-neutral-900">{localTime(c.start)}</span> — <span className="text-neutral-800">{c.title}</span>
                  </span>
                  <Pill className={STATUS_STYLE[c.status]}>{STATUSES[c.status]}</Pill>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">Aucun cours aujourd'hui.</p>
          )}
        </Panel>
        <Panel title="Prochains cours">
          {data.upcoming.length ? (
            <ul className="divide-y divide-neutral-100">
              {data.upcoming.map((c: any) => (
                <li key={c.id} className="flex items-center justify-between gap-2 py-2 text-sm">
                  <span className="min-w-0 truncate">
                    <span className="font-semibold">{formatDayKey(localDateKey(c.start))} {localTime(c.start)}</span> — {c.title}
                  </span>
                  <Pill className={STATUS_STYLE[c.status]}>{STATUSES[c.status]}</Pill>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">Rien de programmé. Commencez par « Préparer la semaine suivante ».</p>
          )}
        </Panel>
        <Panel title="Replays à compléter">
          {data.replaysToComplete.length ? (
            <ul className="space-y-2 text-sm">
              {data.replaysToComplete.map((c: any) => (
                <li key={c.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">{formatDayKey(localDateKey(c.start))} — {c.title}</span>
                  <Link to={`/admin/programme?semaine=${weekOf(new Date(c.start)).start}&cours=${c.id}`} className="flex-shrink-0 font-semibold text-primary-700 hover:underline">Ajouter le replay</Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">Tous les replays sont renseignés.</p>
          )}
        </Panel>
        <Panel title="Communications en attente" actions={<button type="button" onClick={reload} className={btn.outline}>Actualiser</button>}>
          {data.pendingComms.length ? (
            <ul className="space-y-2 text-sm">
              {data.pendingComms.map((c: any) => (
                <li key={c.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">{c.label}</span>
                  <Pill className="bg-neutral-100 text-neutral-700">{c.status}</Pill>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-500">Aucune communication en attente.</p>
          )}
        </Panel>
      </div>

      {data.errors.length > 0 && (
        <Panel title={<span className="flex items-center gap-2 text-red-700"><AlertTriangle className="h-5 w-5" aria-hidden="true" /> Erreurs récentes</span>}>
          <ul className="space-y-1 text-sm text-neutral-700">
            {data.errors.map((e: any) => (
              <li key={e.id}><span className="text-neutral-400">{new Date(e.at).toLocaleString('fr-FR')}</span> — {e.action} {e.details?.error ? `: ${e.details.error}` : ''}</li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  useSeo('Administration');

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    adminApi<{ user: Session }>('GET', '/me')
      .then(({ user }) => setSession(user))
      .catch(() => setSession(null))
      .finally(() => setChecking(false));
    return () => meta.remove();
  }, []);

  if (checking) return <div className="flex min-h-screen items-center justify-center text-neutral-500">Chargement…</div>;
  if (!session) return <Login onLogin={setSession} />;

  const logout = async () => {
    await adminApi('POST', '/logout').catch(() => undefined);
    setSession(null);
  };

  return (
    <div className="min-h-screen bg-sand-100 lg:flex">
      <aside className="border-b border-neutral-200 bg-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:flex-shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-2 p-4">
          <Link to="/admin" className="flex items-center gap-2">
            <img src={IMAGES.logo} alt="" width={36} height={36} className="h-9 w-9 rounded-full border border-accent-300" />
            <span className="font-display text-lg font-semibold text-primary-900">LILMOD <span className="text-sm font-sans font-medium text-neutral-500">admin</span></span>
          </Link>
          <button type="button" onClick={logout} className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 lg:hidden" aria-label="Se déconnecter">
            <LogOut className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible" aria-label="Administration">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `flex flex-shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold ${isActive ? 'bg-primary-700 text-white' : 'text-neutral-700 hover:bg-neutral-100'}`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden border-t border-neutral-100 p-3 lg:block">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100">
            <ExternalLink className="h-4 w-4" aria-hidden="true" /> Voir le site
          </a>
          <button type="button" onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100">
            <LogOut className="h-4 w-4" aria-hidden="true" /> Se déconnecter ({session.username})
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-6 lg:p-8">
        <Suspense fallback={<p className="text-neutral-500">Chargement…</p>}>
          <Routes>
            <Route index element={<Dashboard session={session} />} />
            <Route path="programme" element={<ProgrammeAdmin session={session} />} />
            <Route path="recurrences" element={<RulesAdmin />} />
            <Route path="intervenants" element={<ContentAdmin kind="teachers" />} />
            <Route path="series" element={<ContentAdmin kind="series" />} />
            <Route path="videos" element={<ContentAdmin kind="videos" />} />
            <Route path="newsletter" element={<CommsAdmin channel="email" session={session} />} />
            <Route path="whatsapp" element={<CommsAdmin channel="whatsapp" session={session} />} />
            <Route path="parametres" element={<SettingsAdmin session={session} />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
