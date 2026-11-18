/**
 * LILMOD - Hero Section
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Play, Radio, Youtube } from 'lucide-react';
import { IMAGES, SPEAKERS } from '@/lib/constants';

const heroFaces = SPEAKERS.slice(0, 8);

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="home" className="relative min-h-[100svh] overflow-hidden bg-gradient-hero text-white">
      <div className="absolute inset-0">
        <div className="absolute inset-0 grid grid-cols-2 sm:grid-cols-4 opacity-[0.18] mix-blend-luminosity">
          {heroFaces.map((speaker) => (
            <img
              key={speaker.id}
              src={speaker.image}
              alt=""
              className="h-full min-h-[240px] w-full object-cover grayscale"
              loading="eager"
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/88 to-primary-900/64" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.08)_0,transparent_28%,rgba(216,174,69,0.13)_100%)]" />
      </div>

      <div className="container-custom relative z-10 flex min-h-[88svh] items-center pb-24 pt-28 md:min-h-[92svh] md:pb-32 md:pt-32">
        <div className="w-full min-w-0 max-w-4xl">
          <div
            className={`mb-5 inline-flex items-center gap-3 rounded-full sm:mb-7 border border-white/20 bg-white/10 px-4 py-2 backdrop-blur transition-all duration-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-semibold text-white">LILMOD — La Torah en direct d'Israël</span>
          </div>

          <div
            className={`mb-6 hidden items-center gap-4 transition-all delay-75 duration-500 sm:flex ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <img
              src={IMAGES.logo}
              alt="Logo LILMOD"
              className="h-16 w-16 rounded-full border-3 border-accent-300/70 object-cover shadow-2xl"
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-accent-200">LILMOD by Torah Mitzion</p>
              <p className="text-sm text-blue-100/80">Un peuple, une Torah, une terre</p>
            </div>
            <a
              href="https://torahmitzion.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 hidden border-l border-white/20 pl-5 sm:block"
              aria-label="Torah MiTzion - site officiel"
            >
              <img
                src={IMAGES.torahMitzionLogo}
                alt="Torah MiTzion"
                width={226}
                height={105}
                className="h-14 w-auto"
              />
            </a>
          </div>

          <h1
            className={`max-w-4xl text-balance font-display text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.02em] text-white sm:text-6xl md:text-7xl transition-all delay-100 duration-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            Étudiez la Torah, où que vous soyez.
          </h1>

          <p
            className={`mt-5 w-full max-w-xl text-[17px] leading-7 text-blue-50/90 md:mt-7 md:max-w-2xl md:text-xl md:leading-8 transition-all delay-150 duration-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            Retrouvez chaque semaine des cours en direct avec des Rabbanim francophones, échangez avec
            les enseignants et approfondissez votre étude grâce à notre bibliothèque de vidéos.
          </p>

          <div
            className={`mt-7 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap transition-all delay-200 duration-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            <Link to="/programme" className="btn-accent w-full px-7 py-4 text-base sm:w-auto">
              <CalendarDays className="h-5 w-5" aria-hidden="true" />
              Voir le programme de la semaine
            </Link>
            <Link to="/cours" className="btn-ghost-light w-full px-7 py-4 text-base sm:w-auto">
              <Play className="h-5 w-5 fill-current" aria-hidden="true" />
              Explorer les cours en replay
            </Link>
          </div>

          <div
            className={`mt-10 grid max-w-3xl grid-cols-3 gap-2 sm:mt-12 sm:gap-3 transition-all delay-300 duration-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            {[
              { icon: CalendarDays, value: '2015', label: 'en direct depuis' },
              { icon: Youtube, value: '+2500', label: 'cours disponibles' },
              { icon: Radio, value: '+10', label: 'lives chaque semaine' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="rounded-xl border border-white/15 bg-primary-900/35 p-3 text-white backdrop-blur-xl sm:p-4">
                <Icon className="mb-2 h-4 w-4 text-accent-200 sm:mb-3 sm:h-5 sm:w-5" aria-hidden="true" />
                <div className="font-display text-xl font-bold text-white sm:text-3xl">{value}</div>
                <div className="mt-0.5 text-[11px] leading-tight text-blue-50/75 sm:mt-1 sm:text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroSection;
