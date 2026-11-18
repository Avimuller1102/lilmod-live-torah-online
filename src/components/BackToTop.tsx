import { ArrowUp } from 'lucide-react';

const BackToTop = ({ visible }: { visible: boolean }) => (
  <button
    type="button"
    onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
    aria-label="Revenir en haut de la page"
    tabIndex={visible ? 0 : -1}
    className={`fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-primary-800 text-white shadow-lg shadow-primary-900/25 ring-1 ring-white/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 md:bottom-8 md:right-8 ${
      visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
    }`}
  >
    <ArrowUp className="h-5 w-5" aria-hidden="true" />
  </button>
);

export default BackToTop;
