/** Éléments d'interface de l'administration. */
import { useEffect, useState, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { useDialog } from '@/hooks/useDialog';

export function Panel({ title, actions, children, className = '' }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-neutral-200 bg-white p-4 md:p-5 ${className}`}>
      {(title || actions) && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          {title && <h2 className="font-display text-lg font-semibold text-neutral-950">{title}</h2>}
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Field({ label, hint, children, htmlFor }: { label: string; hint?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="field-label">{label}</label>
      {children}
      {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

export function Modal({ open, title, onClose, children, wide = false }: { open: boolean; title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  const ref = useDialog<HTMLDivElement>(open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-neutral-950/50 sm:items-center sm:p-4" onClick={onClose}>
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`max-h-[94vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl md:p-6 ${wide ? 'sm:max-w-4xl' : 'sm:max-w-2xl'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-neutral-950">{title}</h2>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-neutral-100" aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Message de retour (succès / erreur) qui disparaît seul. */
export function useFlash() {
  const [flash, setFlash] = useState<{ type: 'ok' | 'error'; text: string } | null>(null);
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), flash.type === 'error' ? 9000 : 4000);
    return () => clearTimeout(t);
  }, [flash]);
  const node = flash ? (
    <div role={flash.type === 'error' ? 'alert' : 'status'} className={`fixed bottom-4 left-1/2 z-[80] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl px-4 py-3 text-sm font-semibold shadow-xl ${flash.type === 'error' ? 'bg-red-600 text-white' : 'bg-primary-900 text-white'}`}>
      {flash.text}
    </div>
  ) : null;
  return {
    node,
    ok: (text: string) => setFlash({ type: 'ok', text }),
    error: (text: string) => setFlash({ type: 'error', text }),
  };
}

export const STATUS_STYLE: Record<string, string> = {
  draft: 'bg-neutral-100 text-neutral-700',
  scheduled: 'bg-amber-100 text-amber-800',
  published: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-700',
  done: 'bg-neutral-200 text-neutral-700',
  replay: 'bg-accent-100 text-accent-800',
};

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${className}`}>{children}</span>;
}

export const btn = {
  primary: 'inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-primary-700 px-4 text-sm font-semibold text-white hover:bg-primary-800 disabled:opacity-50',
  accent: 'inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-accent-500 px-4 text-sm font-semibold text-white hover:bg-accent-600 disabled:opacity-50',
  outline: 'inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-neutral-300 bg-white px-4 text-sm font-semibold text-neutral-800 hover:border-primary-400 disabled:opacity-50',
  danger: 'inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50',
  green: 'inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl bg-green-600 px-4 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50',
};
