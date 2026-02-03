/**
 * LILMOD - Hero Section
 * 
 * Clean, modern hero with fast animations
 */

import { useState, useEffect } from 'react';
import { Play, Youtube, Radio } from 'lucide-react';
import { SOCIAL_LINKS, IMAGES } from '@/lib/constants';

const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Simple gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      
      {/* Subtle accent circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10 py-20 text-center">
        {/* Live Badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-400/30 rounded-full mb-6 transition-all duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-red-200 text-sm font-medium">En direct depuis Israël</span>
        </div>

        {/* Title */}
        <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          La Torah <span className="text-accent-400">en Direct</span>
        </h1>

        {/* Subtitle */}
        <p className={`text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 transition-all duration-500 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          Cours de Torah en français depuis 2015. Rejoignez notre communauté d'apprenants.
        </p>

        {/* CTA Buttons */}
        <div className={`flex flex-wrap items-center justify-center gap-4 mb-16 transition-all duration-500 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <a
            href="#videos"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            <Play className="w-5 h-5" />
            Voir les Cours
          </a>
          <a
            href={SOCIAL_LINKS.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white font-semibold rounded-xl transition-all duration-200"
          >
            <Youtube className="w-5 h-5 text-red-400" />
            YouTube
          </a>
        </div>

        {/* Stats row */}
        <div className={`flex flex-wrap items-center justify-center gap-8 md:gap-12 transition-all duration-500 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          {[
            { value: "2500+", label: "Cours" },
            { value: "10+", label: "Live/semaine" },
            { value: "20+", label: "Rabbanim" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
              <div className="text-blue-200 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
