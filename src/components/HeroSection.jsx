
import React from 'react';
import { Play, Youtube, Headphones } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-100 via-orange-100 to-yellow-100">
      {/* Motifs de fond subtils */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-orange-300/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-amber-300/25 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center py-20">
        {/* Logo LILMOD avec coins arrondis */}
        <div className="mb-12 animate-fadeIn">
          <div className="flex flex-col items-center">
            <img 
              src="/lovable-uploads/180a6222-23fc-4499-9a5f-62a4e32b8970.png" 
              alt="LILMOD Logo" 
              className="h-16 md:h-20 lg:h-24 mb-8 drop-shadow-xl transform hover:scale-105 transition-all duration-500 rounded-xl"
            />
          </div>
        </div>

        {/* Titre principal en gras */}
        <div className="mb-16 animate-slideIn">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-8 max-w-5xl mx-auto leading-tight">
            <span className="font-black">LILMOD - Une <span className="text-orange-600 font-black">Torah vivante</span> sur tous les fronts</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Découvrez l'étude de la Torah avec les meilleurs enseignants francophones. 
            Des cours accessibles partout dans le monde.
          </p>
        </div>

        {/* Plateformes disponibles avec design centré */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 border border-orange-200/40 shadow-2xl max-w-5xl mx-auto animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col items-center gap-8">
            <span className="text-lg font-bold text-gray-800">Disponible sur toutes les plateformes :</span>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <a 
                href="https://www.youtube.com/@Lilmodfr/videos" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-white hover:bg-red-50 px-8 py-5 rounded-2xl transition-all duration-300 border-2 border-red-200 hover:border-red-400 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Youtube className="w-8 h-8 mr-4 text-red-500 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-lg">YouTube</div>
                  <div className="text-sm text-gray-600">Vidéos & Lives</div>
                </div>
              </a>
              
              <a 
                href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-white hover:bg-green-50 px-8 py-5 rounded-2xl transition-all duration-300 border-2 border-green-200 hover:border-green-400 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Headphones className="w-8 h-8 mr-4 text-green-500 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-lg">Spotify</div>
                  <div className="text-sm text-gray-600">Podcasts</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
