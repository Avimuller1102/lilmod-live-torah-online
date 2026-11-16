/**
 * LILMOD - Navbar Component
 * 
 * Responsive navigation with:
 * - Sticky header with scroll effect
 * - Mobile hamburger menu
 * - Social links
 * - Premium styling
 */

import { useState, useEffect } from 'react';
import { Menu, X, Youtube, Instagram, ExternalLink, Mail, Headphones, Heart } from 'lucide-react';
import { NAV_LINKS, SOCIAL_LINKS, IMAGES } from '@/lib/constants';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Skip Link for Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent-500 focus:text-white focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-xl shadow-sm ring-1 ring-neutral-900/5 py-2'
            : 'bg-transparent py-4'
        }`}
        role="navigation"
        aria-label="Navigation principale"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              className="group flex min-w-0 flex-shrink-0 items-center gap-3 xl:mr-8"
              aria-label="LILMOD - Retour à l'accueil"
            >
              <div className="relative">
                <img
                  src={IMAGES.logo}
                  alt="LILMOD Logo"
                  className="w-12 h-12 rounded-full border-2 border-accent-500 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="eager"
                />
              </div>
              <div className="flex min-w-0 flex-col">
                <span className={`text-2xl font-display font-bold transition-colors ${
                  scrolled ? 'text-primary-900' : 'text-white'
                }`}>
                  LILMOD
                </span>
                <span className={`text-xs font-medium transition-colors ${
                  scrolled ? 'text-accent-500' : 'text-accent-300'
                } truncate`}>
                  Torah Live depuis Israël
                </span>
              </div>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden xl:flex items-center gap-4 whitespace-nowrap">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-all duration-300 hover:text-accent-500 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-accent-500 after:transition-all after:duration-300 hover:after:w-full ${
                    scrolled ? 'text-primary-700' : 'text-white/90'
                  }`}
                >
                  {link.label}
                </a>
              ))}

              {/* CTA Buttons */}
              <div className="flex items-center gap-3 ml-2">
                <a
                  href={SOCIAL_LINKS.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hidden 2xl:flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    scrolled
                      ? 'bg-accent-50 text-accent-700 hover:bg-accent-100'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Nos liens</span>
                </a>
                <a
                  href={SOCIAL_LINKS.newsletter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                    scrolled
                      ? 'bg-primary-700 text-white hover:bg-primary-800'
                      : 'bg-white text-primary-900 hover:bg-blue-50'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Newsletter</span>
                </a>
                <a
                  href={SOCIAL_LINKS.donate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-accent-600"
                >
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Soutenir</span>
                </a>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className={`xl:hidden flex-shrink-0 p-2 rounded-lg transition-colors ${
                scrolled ? 'text-primary-800 hover:bg-neutral-100' : 'text-white hover:bg-white/10'
              }`}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`xl:hidden fixed inset-0 top-0 bg-white z-40 transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          aria-hidden={!isOpen}
        >
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <a href="#home" className="flex items-center gap-3" onClick={closeMenu}>
                <img
                  src={IMAGES.logo}
                  alt="LILMOD"
                  className="w-10 h-10 rounded-full border-2 border-accent-500"
                />
                <span className="text-xl font-display font-bold text-primary-800">LILMOD</span>
              </a>
              <button
                onClick={closeMenu}
                className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
                aria-label="Fermer le menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Links */}
            <div className="flex-1 overflow-y-auto py-6 px-4">
              <nav className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="block px-4 py-3 text-lg font-medium text-primary-800 hover:bg-primary-50 hover:text-primary-600 rounded-lg transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              {/* Mobile CTA */}
              <div className="mt-6 space-y-3">
                <a
                  href={SOCIAL_LINKS.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 font-medium bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors"
                  onClick={closeMenu}
                >
                  <ExternalLink className="w-5 h-5" />
                  Tous nos liens
                </a>
                <a
                  href={SOCIAL_LINKS.newsletter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 font-medium bg-primary-500 text-white rounded-xl hover:bg-primary-600 transition-colors"
                  onClick={closeMenu}
                >
                  <Mail className="w-5 h-5" />
                  S'abonner à la Newsletter
                </a>
              </div>

              {/* Mobile Social Links */}
              <div className="mt-8 pt-6 border-t">
                <p className="text-sm font-medium text-neutral-500 mb-4">Suivez-nous</p>
                <div className="flex gap-4">
                  <a
                    href={SOCIAL_LINKS.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-6 h-6" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-pink-50 text-pink-600 rounded-xl hover:bg-pink-100 transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                  <a
                    href={SOCIAL_LINKS.spotify}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                    aria-label="Spotify"
                  >
                    <Headphones className="w-6 h-6" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div
            className="xl:hidden fixed inset-0 bg-black/50 z-30"
            onClick={closeMenu}
            aria-hidden="true"
          />
        )}
      </nav>
    </>
  );
};

export default Navbar;
