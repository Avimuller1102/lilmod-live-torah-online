/**
 * LILMOD - Hero Section
 */

import { useEffect, useState } from 'react';
import { ArrowRight, CalendarDays, Heart, Play, Radio, Youtube } from 'lucide-react';
import { IMAGES, SOCIAL_LINKS, SPEAKERS } from '@/lib/constants';

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

      <div className="container-custom relative z-10 flex min-h-[100svh] items-center pb-20 pt-28 md:pt-32">
        <div className="w-full min-w-0 max-w-4xl">
          <div
            className={`mb-7 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur transition-all duration-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
            }`}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            <span className="text-sm font-bold text-white">Cours de Torah en live depuis Jérusalem</span>
          </div>

          <div
            className={`mb-6 flex items-center gap-4 transition-all delay-75 duration-500 ${
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
            className={`max-w-4xl text-balance text-4xl font-extrabold leading-[1.02] text-white sm:text-5xl md:text-7xl lg:text-8xl transition-all delay-100 duration-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            Étudier la Torah en français, en direct d'Israël.
          </h1>

          <p
            className={`mt-7 w-full max-w-[21rem] text-base leading-8 text-blue-50/90 sm:max-w-xl md:max-w-2xl md:text-xl transition-all delay-150 duration-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            Plus de 10 cours live par semaine, des milliers d'enseignements disponibles,
            et une communauté francophone connectée aux textes depuis Jérusalem.
          </p>

          <div
            className={`mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap transition-all delay-200 duration-500 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}
          >
            <a href="#videos" className="btn-accent w-full px-7 py-4 sm:w-auto">
              <Play className="h-5 w-5 fill-current" />
              Voir les cours
            </a>
            <a href="#audio" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto">
              <Radio className="h-5 w-5" />
              Écouter les podcasts
            </a>
            <a href={SOCIAL_LINKS.donate} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-7 py-4 font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20 sm:w-auto">
              <Heart className="h-5 w-5 fill-current text-red-300" />
              Soutenir
            </a>
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

      <a
        href="#mission"
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur transition-colors hover:text-white md:inline-flex"
      >
        Découvrir
        <ArrowRight className="h-4 w-4 rotate-90" />
      </a>
    </section>
  );
};

export default HeroSection;
