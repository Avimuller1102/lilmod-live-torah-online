
import React from 'react';
import { Play, Youtube, Headphones } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900">
      {/* Motifs de fond subtils */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-blue-400/40 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-tl from-indigo-500/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-gradient-to-r from-slate-400/20 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-8 text-center py-24">
        {/* Logo LILMOD intégré dans le design */}
        <div className="mb-20 animate-fadeIn">
          <div className="flex flex-col items-center">
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-3xl blur-lg opacity-60"></div>
              <img 
                src="/lovable-uploads/9e7c9f9f-1291-4176-97d0-7127b7160926.png" 
                alt="LILMOD - Torah Mitzion Logo" 
                className="relative h-24 md:h-32 lg:h-40 px-8 py-4 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-3xl shadow-2xl transform hover:scale-105 transition-all duration-500"
                style={{ filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))' }}
              />
            </div>
          </div>
        </div>

        {/* Titre principal avec typographie améliorée */}
        <div className="mb-24 animate-slideIn">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-16 max-w-6xl mx-auto leading-tight">
            <span className="bg-gradient-to-r from-white via-blue-100 to-indigo-200 bg-clip-text text-transparent font-black tracking-tight font-serif">
              LILMOD
            </span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl font-bold text-orange-300 mt-6 block font-sans">
              Une Torah vivante sur tous les fronts
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-medium text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Découvrez l'étude de la Torah avec les meilleurs enseignants francophones. 
            Des cours accessibles partout dans le monde.
          </p>
        </div>

        {/* Plateformes disponibles avec design amélioré */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-16 border border-white/20 shadow-2xl max-w-6xl mx-auto animate-fadeIn" style={{ animationDelay: '0.5s' }}>
          <div className="flex flex-col items-center gap-16">
            <span className="text-2xl font-bold text-white mb-8">Disponible sur toutes les plateformes :</span>
            <div className="flex flex-wrap items-center justify-center gap-16">
              <a 
                href="https://www.youtube.com/@Lilmodfr/videos" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-gradient-to-r from-white/90 to-red-50/90 hover:from-red-50 hover:to-red-100 px-16 py-10 rounded-3xl transition-all duration-300 border-2 border-red-200/50 hover:border-red-400 shadow-xl hover:shadow-2xl transform hover:scale-110 backdrop-blur-sm"
              >
                <Youtube className="w-14 h-14 mr-8 text-red-600 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-slate-800 text-2xl">YouTube</div>
                  <div className="text-lg text-slate-600 font-medium">Vidéos & Lives</div>
                </div>
              </a>
              
              <a 
                href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-gradient-to-r from-white/90 to-green-50/90 hover:from-green-50 hover:to-green-100 px-16 py-10 rounded-3xl transition-all duration-300 border-2 border-green-200/50 hover:border-green-400 shadow-xl hover:shadow-2xl transform hover:scale-110 backdrop-blur-sm"
              >
                <Headphones className="w-14 h-14 mr-8 text-green-600 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-slate-800 text-2xl">Spotify</div>
                  <div className="text-lg text-slate-600 font-medium">Podcasts</div>
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
