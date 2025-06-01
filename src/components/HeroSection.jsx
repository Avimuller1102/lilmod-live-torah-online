
import React from 'react';
import { Play, Youtube, Headphones, Calendar } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-lilmod-navy via-lilmod-blue to-blue-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-lilmod-gold/20 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-12 h-12 bg-lilmod-gold/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-white to-lilmod-gold bg-clip-text text-transparent">
              LILMOD
            </span>
            <br />
            <span className="text-3xl md:text-5xl font-light">
              Torah en ligne
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Découvrez l'étude de la Torah avec les meilleurs enseignants francophones. 
            Des cours en direct et en replay, accessibles partout dans le monde.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
          <a 
            href="#content-library"
            className="group inline-flex items-center bg-gradient-to-r from-lilmod-gold to-amber-400 hover:from-amber-400 hover:to-lilmod-gold text-lilmod-navy px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
          >
            <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
            Commencer maintenant
          </a>
          
          <a 
            href="https://www.youtube.com/@Lilmodfr" 
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 border border-white/30 hover:border-white/50"
          >
            <Youtube className="w-6 h-6 mr-3 text-red-400 group-hover:scale-110 transition-transform" />
            Chaîne YouTube
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-lilmod-gold mb-2">500+</div>
            <p className="text-blue-100">Cours disponibles</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-lilmod-gold mb-2">50k+</div>
            <p className="text-blue-100">Étudiants connectés</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-3xl font-bold text-lilmod-gold mb-2">24/7</div>
            <p className="text-blue-100">Accès illimité</p>
          </div>
        </div>

        {/* Platforms */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-blue-200">
          <span className="text-sm font-medium">Disponible sur :</span>
          <div className="flex items-center gap-6">
            <a 
              href="https://www.youtube.com/@Lilmodfr" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-white transition-colors"
            >
              <Youtube className="w-5 h-5 mr-2 text-red-400" />
              <span className="text-sm">YouTube</span>
            </a>
            <a 
              href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center hover:text-white transition-colors"
            >
              <Headphones className="w-5 h-5 mr-2 text-green-400" />
              <span className="text-sm">Spotify</span>
            </a>
            <a 
              href="#schedule"
              className="flex items-center hover:text-white transition-colors"
            >
              <Calendar className="w-5 h-5 mr-2 text-blue-400" />
              <span className="text-sm">En direct</span>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
