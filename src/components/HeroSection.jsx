
import React from 'react';
import { Play, Youtube, Headphones, ArrowDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Motifs de fond subtils */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-orange-200/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-amber-200/25 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-gradient-to-r from-yellow-200/20 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 text-center py-24">
        {/* Logo LILMOD - Nouveau design avec le logo uploadé */}
        <div className="mb-16 animate-fadeIn">
          <div className="flex flex-col items-center">
            <img 
              src="/lovable-uploads/1384ffec-f722-4f86-9f49-24cf9dcd659e.png" 
              alt="LILMOD Logo" 
              className="h-24 md:h-32 lg:h-40 mb-6 drop-shadow-2xl transform hover:scale-105 transition-all duration-500"
            />
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent drop-shadow-lg">
                LILMOD
              </span>
            </h1>
          </div>
        </div>

        {/* Titre principal */}
        <div className="mb-20 animate-slideIn">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-light text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed">
            Torah en ligne depuis Israël
          </h2>
          <p className="text-xl md:text-2xl font-light text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez l'étude de la Torah avec les meilleurs enseignants francophones. 
            Des cours accessibles partout dans le monde.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-24 animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <a 
            href="#recherche"
            className="group inline-flex items-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-300/40"
          >
            <Play className="w-7 h-7 mr-4 group-hover:scale-110 transition-transform" />
            Commencer maintenant
          </a>
          
          <a 
            href="https://www.youtube.com/@Lilmodfr" 
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center bg-white/80 backdrop-blur-lg hover:bg-white text-gray-800 px-12 py-6 rounded-2xl font-semibold text-xl transition-all duration-300 border-2 border-orange-200/50 hover:border-orange-400/60 shadow-xl hover:shadow-2xl"
          >
            <Youtube className="w-7 h-7 mr-4 text-red-500 group-hover:scale-110 transition-transform" />
            Notre chaîne YouTube
          </a>
        </div>

        {/* Plateformes disponibles */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-orange-200/40 shadow-2xl max-w-5xl mx-auto animate-fadeIn" style={{ animationDelay: '1s' }}>
          <div className="flex flex-col items-center gap-8">
            <span className="text-lg font-semibold text-gray-700">Disponible sur toutes les plateformes :</span>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <a 
                href="https://www.youtube.com/@Lilmodfr" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-white/90 hover:bg-white px-8 py-5 rounded-xl transition-all duration-300 border border-red-200 hover:border-red-400/60 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Youtube className="w-8 h-8 mr-4 text-red-500 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-gray-800 text-lg">YouTube</div>
                  <div className="text-sm text-gray-600">Vidéos & Lives</div>
                </div>
              </a>
              
              <a 
                href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-white/90 hover:bg-white px-8 py-5 rounded-xl transition-all duration-300 border border-green-200 hover:border-green-400/60 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Headphones className="w-8 h-8 mr-4 text-green-500 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-gray-800 text-lg">Spotify</div>
                  <div className="text-sm text-gray-600">Podcasts</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-orange-600">
          <span className="text-sm font-medium mb-3">Découvrir</span>
          <ArrowDown className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
