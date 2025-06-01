
import React from 'react';
import { Play, Youtube, Headphones, Calendar } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-lilmod-navy via-lilmod-blue to-blue-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-purple-500/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-lilmod-gold/20 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-lilmod-gold/20 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-lilmod-gold/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 text-center text-white">
        {/* Status Badge */}
        <div className="mb-8">
          <span className="inline-block px-6 py-3 bg-gradient-to-r from-lilmod-gold/20 to-amber-200/30 text-lilmod-gold rounded-full text-sm font-semibold backdrop-blur-sm border border-lilmod-gold/30 animate-pulse">
            🔴 EN DIRECT DEPUIS ISRAËL
          </span>
        </div>

        {/* Main Title */}
        <div className="mb-12">
          <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-white via-lilmod-gold to-white bg-clip-text text-transparent drop-shadow-2xl">
              LILMOD
            </span>
            <br />
            <span className="text-3xl md:text-5xl font-light text-blue-100 drop-shadow-lg">
              Torah en ligne
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Découvrez l'étude de la Torah avec les meilleurs enseignants francophones. 
            Des cours en direct et en replay, accessibles partout dans le monde.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-16">
          <a 
            href="#content-library"
            className="group inline-flex items-center bg-gradient-to-r from-lilmod-gold to-amber-400 hover:from-amber-400 hover:to-lilmod-gold text-lilmod-navy px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-lilmod-gold/25"
          >
            <Play className="w-7 h-7 mr-4 group-hover:scale-110 transition-transform" />
            Commencer maintenant
          </a>
          
          <a 
            href="https://www.youtube.com/@Lilmodfr" 
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white px-10 py-5 rounded-2xl font-medium text-xl transition-all duration-300 border-2 border-white/30 hover:border-white/50 shadow-xl"
          >
            <Youtube className="w-7 h-7 mr-4 text-red-400 group-hover:scale-110 transition-transform" />
            Chaîne YouTube
          </a>
        </div>

        {/* Platforms */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <div className="flex flex-col items-center gap-6">
            <span className="text-lg font-medium text-blue-200">Disponible sur toutes les plateformes :</span>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <a 
                href="https://www.youtube.com/@Lilmodfr" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-white/10 hover:bg-white/20 px-6 py-4 rounded-xl transition-all duration-300 border border-white/20 hover:border-red-400/50"
              >
                <Youtube className="w-6 h-6 mr-3 text-red-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-semibold text-white">YouTube</div>
                  <div className="text-sm text-blue-200">Vidéos & Lives</div>
                </div>
              </a>
              
              <a 
                href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-white/10 hover:bg-white/20 px-6 py-4 rounded-xl transition-all duration-300 border border-white/20 hover:border-green-400/50"
              >
                <Headphones className="w-6 h-6 mr-3 text-green-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-semibold text-white">Spotify</div>
                  <div className="text-sm text-blue-200">Podcasts</div>
                </div>
              </a>
              
              <a 
                href="#schedule"
                className="group flex items-center bg-white/10 hover:bg-white/20 px-6 py-4 rounded-xl transition-all duration-300 border border-white/20 hover:border-blue-400/50"
              >
                <Calendar className="w-6 h-6 mr-3 text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-semibold text-white">Planning</div>
                  <div className="text-sm text-blue-200">Cours live</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-white/60">
          <span className="text-xs font-medium mb-2">Découvrir</span>
          <div className="w-1 h-8 bg-gradient-to-b from-lilmod-gold to-transparent rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
