/**
 * LILMOD — en-tête du site : navigation principale, recherche globale, menu mobile.
 */
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { CalendarDays, Heart, Menu, Search, X } from 'lucide-react';
import { IMAGES } from '@/lib/constants';
import { usePublicSettings } from '@/lib/api';
import { useScrollState } from '@/hooks/useScrollState';
import BackToTop from '@/components/BackToTop';
import SearchDialog from '@/components/SearchDialog';

export const MAIN_NAV = [
  { label: 'Programme', to: '/programme' },
  { label: 'Cours', to: '/cours' },
  { label: 'Intervenants', to: '/intervenants' },
  { label: 'Séries', to: '/series' },
  { label: 'À propos', to: '/#about' },
];

const NO_SECTIONS: string[] = [];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { progress, scrollY } = useScrollState(NO_SECTIONS);
  const location = useLocation();
  const settings = usePublicSettings();
  const scrolled = scrollY > 20;
  const solid = scrolled || isOpen;

  useEffect(() => setIsOpen(false), [location.pathname, location.hash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/input|textarea|select/i.test((e.target as HTMLElement)?.tagName))) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const linkClass = (active: boolean) =>
    `relative whitespace-nowrap rounded-lg px-2.5 py-2 text-[15px] font-semibold transition-colors xl:px-3 ${
      solid ? (active ? 'text-primary-900 bg-primary-50' : 'text-neutral-700 hover:text-primary-800 hover:bg-neutral-50') : active ? 'text-white bg-white/15' : 'text-white/90 hover:text-white hover:bg-white/10'
    }`;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent-500 focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu principal
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,padding] duration-300 ${
          solid ? 'bg-white/95 py-2 shadow-sm ring-1 ring-neutral-900/5 backdrop-blur-xl' : 'bg-transparent py-3 md:py-4'
        }`}
      >
        <div className="container-custom flex items-center justify-between gap-3">
          <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="LILMOD – accueil">
            <img src={IMAGES.logo} alt="" width={44} height={44} className="h-11 w-11 rounded-full border-2 border-accent-400 bg-white object-cover" />
            <span className="flex min-w-0 flex-col">
              <span className={`font-display text-xl font-bold leading-none ${solid ? 'text-primary-900' : 'text-white'}`}>LILMOD</span>
              <span className={`mt-1 truncate text-[11px] font-semibold uppercase tracking-[0.14em] ${solid ? 'text-accent-700' : 'text-accent-200'}`}>
                En direct d'Israël
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
            {MAIN_NAV.map((item) =>
              item.to.includes('#') ? (
                <Link key={item.to} to={item.to} className={linkClass(false)}>
                  {item.label}
                </Link>
              ) : (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => linkClass(isActive)}>
                  {item.label}
                </NavLink>
              ),
            )}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher un cours, un intervenant, une série"
              className={`flex h-11 items-center gap-2 rounded-xl px-3 text-sm font-medium transition-colors ${
                solid ? 'text-neutral-700 hover:bg-neutral-100' : 'text-white hover:bg-white/10'
              }`}
            >
              <Search className="h-5 w-5" aria-hidden="true" />
              <span className="hidden 2xl:inline">Rechercher</span>
              <kbd className={`hidden rounded border px-1.5 text-[11px] 2xl:inline ${solid ? 'border-neutral-200 text-neutral-400' : 'border-white/30 text-white/70'}`}>/</kbd>
            </button>
            <Link to="/programme" className="hidden h-11 items-center gap-2 rounded-xl bg-accent-500 px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-600 sm:inline-flex">
              <CalendarDays className="h-4 w-4" aria-hidden="true" />
              Programme
            </Link>
            <a
              href={settings.donateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold md:inline-flex ${
                solid ? 'text-primary-800 ring-1 ring-neutral-200 hover:bg-neutral-50' : 'text-white ring-1 ring-white/30 hover:bg-white/10'
              }`}
            >
              <Heart className="h-4 w-4 fill-current text-red-400" aria-hidden="true" />
              Soutenir
            </a>
            <button
              type="button"
              onClick={() => setIsOpen((o) => !o)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl lg:hidden ${solid ? 'text-primary-900 hover:bg-neutral-100' : 'text-white hover:bg-white/10'}`}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-accent-400 to-accent-600 transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0'}`}
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />

        {/* Menu mobile */}
        <div id="mobile-menu" className={`lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
          <nav className="container-custom max-h-[calc(100vh-72px)] overflow-y-auto pb-6 pt-3" aria-label="Menu mobile">
            <ul className="grid gap-1">
              {MAIN_NAV.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="flex min-h-[48px] items-center rounded-xl px-4 text-lg font-semibold text-primary-900 hover:bg-primary-50">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a href={settings.whatsappGroupUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[48px] items-center justify-center rounded-xl bg-green-600 px-3 text-sm font-semibold text-white">
                Groupe WhatsApp
              </a>
              <a href={settings.donateUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-[48px] items-center justify-center rounded-xl bg-accent-500 px-3 text-sm font-semibold text-white">
                Soutenir LILMOD
              </a>
            </div>
          </nav>
        </div>
      </header>

      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
      <BackToTop visible={scrollY > 900 && !isOpen} />
    </>
  );
};

export default Navbar;
