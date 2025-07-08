
import React from 'react';
import { Play, Youtube, Headphones } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Motifs de fond subtils */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-indigo-500/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-blue-600/25 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-8 text-center py-20">
        {/* Logo LILMOD agrandi et mieux placé */}
        <div className="mb-16 animate-fadeIn">
          <div className="flex flex-col items-center">
            <img 
              src="/lovable-uploads/f633489f-70d3-45ce-bfcf-5b9aced172df.png" 
              alt="LILMOD - Torah Mitzion Logo" 
              className="h-32 md:h-40 lg:h-48 mb-10 drop-shadow-2xl transform hover:scale-105 transition-all duration-500 rounded-2xl"
            />
          </div>
        </div>

        {/* Titre principal avec nouveau style */}
        <div className="mb-20 animate-slideIn">
          <h1 className="text-5xl md:text-6xl lg:text-8xl font-black mb-12 max-w-5xl mx-auto leading-tight font-serif">
            <span className="bg-gradient-to-r from-slate-800 via-blue-900 to-indigo-900 bg-clip-text text-transparent font-black tracking-tight">
              LILMOD
            </span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-700 mt-4 block">
              Une Torah vivante sur tous les fronts
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez l'étude de la Torah avec les meilleurs enseignants francophones. 
            Des cours accessibles partout dans le monde.
          </p>
        </div>

        {/* Plateformes disponibles avec design amélioré */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-12 border-2 border-slate-200/50 shadow-2xl max-w-5xl mx-auto animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col items-center gap-12">
            <span className="text-xl font-bold text-slate-800 mb-6">Disponible sur toutes les plateformes :</span>
            <div className="flex flex-wrap items-center justify-center gap-12">
              <a 
                href="https://www.youtube.com/@Lilmodfr/videos" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-gradient-to-r from-white to-red-50 hover:from-red-50 hover:to-red-100 px-12 py-8 rounded-2xl transition-all duration-300 border-2 border-red-200 hover:border-red-400 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Youtube className="w-12 h-12 mr-6 text-red-600 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-slate-800 text-xl">YouTube</div>
                  <div className="text-base text-slate-600 font-medium">Vidéos & Lives</div>
                </div>
              </a>
              
              <a 
                href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-gradient-to-r from-white to-green-50 hover:from-green-50 hover:to-green-100 px-12 py-8 rounded-2xl transition-all duration-300 border-2 border-green-200 hover:border-green-400 shadow-xl hover:shadow-2xl transform hover:scale-105"
              >
                <Headphones className="w-12 h-12 mr-6 text-green-600 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-slate-800 text-xl">Spotify</div>
                  <div className="text-base text-slate-600 font-medium">Podcasts</div>
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
