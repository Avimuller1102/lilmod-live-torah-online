/**
 * LILMOD - Footer Component
 * 
 * Comprehensive footer with:
 * - Logo and description
 * - Navigation links
 * - Social media links
 * - Partners
 * - Copyright
 */

import { Youtube, Instagram, ExternalLink, Mail, Headphones, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SITE_CONFIG, SOCIAL_LINKS, PARTNERS, IMAGES } from '@/lib/constants';

const FOOTER_LINKS = [
  { label: 'Programme', to: '/programme' },
  { label: 'Cours en replay', to: '/cours' },
  { label: 'Intervenants', to: '/intervenants' },
  { label: 'Séries', to: '/series' },
  { label: 'Témoignages', to: '/#temoignages' },
  { label: 'Soutenir', to: '/#support' },
  { label: 'Contact', to: '/#contact' },
  { label: 'Recherche', to: '/recherche' },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-900 text-white">
      {/* Main Footer */}
      <div className="container-custom py-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-4 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-4 md:mb-6">
              <img
                src={IMAGES.logo}
                alt="LILMOD"
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-accent-500"
              />
              <div>
                <span className="text-2xl font-display font-bold">LILMOD</span>
                <span className="text-accent-400 text-sm">.fr</span>
              </div>
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed mb-5 md:mb-6">
              {SITE_CONFIG.description}
            </p>

            <a
              href="https://torahmitzion.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="mb-5 inline-flex flex-col gap-2 md:mb-6"
              aria-label="Torah MiTzion - site officiel"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200/70">
                Un programme de
              </span>
              <img
                src={IMAGES.torahMitzionLogo}
                alt="Torah MiTzion"
                width={226}
                height={105}
                loading="lazy"
                className="h-11 w-auto md:h-14"
              />
            </a>

            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href={SOCIAL_LINKS.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-red-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-pink-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.spotify}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Spotify"
              >
                <Headphones className="w-5 h-5" />
              </a>
              <a
                href={SOCIAL_LINKS.linktree}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 hover:bg-accent-500 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Linktree"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-base md:text-lg font-display font-bold mb-3 md:mb-6 text-white">Liens Rapides</h4>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 text-[15px] md:block md:space-y-3 md:text-base">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-blue-200 hover:text-accent-300 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="col-span-2 pt-1 md:pt-0">
                <a
                  href={SOCIAL_LINKS.linktree}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Tous nos liens
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h4 className="text-base md:text-lg font-display font-bold mb-3 md:mb-6 text-white">Restez Connecté</h4>
            <div className="grid grid-cols-2 gap-2 md:block md:space-y-4">
              <a
                href={SOCIAL_LINKS.newsletter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/15 rounded-xl transition-colors group"
              >
                <Mail className="w-5 h-5 text-accent-400" />
                <div>
                  <div className="font-medium group-hover:text-accent-400 transition-colors">
                    Newsletter
                  </div>
                  <div className="hidden text-xs text-blue-200 sm:block">Programme hebdomadaire</div>
                </div>
              </a>

              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/10 hover:bg-green-600 rounded-xl transition-colors group"
              >
                <svg className="w-5 h-5 text-green-400 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div>
                  <div className="font-medium group-hover:text-white transition-colors">
                    WhatsApp
                  </div>
                  <div className="hidden text-xs text-blue-200 group-hover:text-white/80 transition-colors sm:block">
                    Groupe communauté
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Partners */}
          <div>
            <h4 className="text-base md:text-lg font-display font-bold mb-3 md:mb-6 text-white">Nos Partenaires</h4>
            <div className="grid grid-cols-2 gap-2 md:block md:space-y-4">
              {PARTNERS.map((partner) => (
                <div
                  key={partner.id}
                  className="flex items-center gap-3 p-3 bg-white/10 rounded-xl"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 object-contain rounded bg-white/10"
                  />
                  <span className="text-xs leading-tight text-blue-200 md:text-sm">
                    {partner.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-4 md:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-1 md:gap-4">
            <p className="text-xs md:text-sm text-blue-200">
              © {currentYear} {SITE_CONFIG.name} — Torah MiTzion ·{' '}
              <Link to="/confidentialite" className="underline-offset-2 hover:underline">Confidentialité</Link>
            </p>
            <p className="text-xs md:text-sm text-blue-200 flex items-center gap-1.5">
              Fait avec <Heart className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-400" aria-hidden="true" /> depuis Jérusalem
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
