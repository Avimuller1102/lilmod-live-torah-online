
import React from 'react';
import { Play, Youtube, Headphones, Search } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200/20 via-transparent to-amber-200/20"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-orange-300/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-300/15 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-orange-200/20 rounded-full animate-bounce"></div>
      <div className="absolute bottom-20 right-10 w-12 h-12 bg-amber-200/15 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-10 h-10 bg-orange-300/20 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center py-20">
        {/* Logo LILMOD */}
        <div className="mb-12">
          <img 
            src="/lovable-uploads/4d04ef3f-23ad-481a-8676-276bca1684ce.png" 
            alt="LILMOD Logo" 
            className="mx-auto h-20 md:h-24 drop-shadow-lg"
          />
        </div>

        {/* Main Title */}
        <div className="mb-16">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent drop-shadow-lg">
              LILMOD
            </span>
            <br />
            <span className="text-2xl md:text-4xl lg:text-5xl font-light text-gray-700 drop-shadow-sm">
              Torah en ligne depuis Israël
            </span>
          </h1>
          <p className="text-xl md:text-2xl font-light mb-12 text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Découvrez l'étude de la Torah avec les meilleurs enseignants francophones. 
            Des cours en direct et en replay, accessibles partout dans le monde.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-20">
          <a 
            href="#content-library"
            className="group inline-flex items-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-amber-500 hover:to-orange-500 text-white px-12 py-6 rounded-2xl font-bold text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-300/30"
          >
            <Play className="w-7 h-7 mr-4 group-hover:scale-110 transition-transform" />
            Commencer maintenant
          </a>
          
          <a 
            href="https://www.youtube.com/@Lilmodfr" 
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center bg-white/90 backdrop-blur-lg hover:bg-white text-gray-800 px-12 py-6 rounded-2xl font-semibold text-xl transition-all duration-300 border-2 border-orange-200/50 hover:border-orange-400/60 shadow-xl"
          >
            <Youtube className="w-7 h-7 mr-4 text-red-500 group-hover:scale-110 transition-transform" />
            Notre chaîne YouTube
          </a>
        </div>

        {/* Platforms */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 border border-orange-200/40 shadow-2xl max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-8">
            <span className="text-lg font-semibold text-gray-700">Disponible sur toutes les plateformes :</span>
            <div className="flex flex-wrap items-center justify-center gap-10">
              <a 
                href="https://www.youtube.com/@Lilmodfr" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center bg-white/80 hover:bg-white px-8 py-5 rounded-xl transition-all duration-300 border border-red-200 hover:border-red-400/60 shadow-lg hover:shadow-xl"
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
                className="group flex items-center bg-white/80 hover:bg-white px-8 py-5 rounded-xl transition-all duration-300 border border-green-200 hover:border-green-400/60 shadow-lg hover:shadow-xl"
              >
                <Headphones className="w-8 h-8 mr-4 text-green-500 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-gray-800 text-lg">Spotify</div>
                  <div className="text-sm text-gray-600">Podcasts</div>
                </div>
              </a>
              
              <a 
                href="#content-library"
                className="group flex items-center bg-white/80 hover:bg-white px-8 py-5 rounded-xl transition-all duration-300 border border-orange-200 hover:border-orange-400/60 shadow-lg hover:shadow-xl"
              >
                <Search className="w-8 h-8 mr-4 text-orange-500 group-hover:scale-110 transition-transform" />
                <div className="text-left">
                  <div className="font-bold text-gray-800 text-lg">Recherche</div>
                  <div className="text-sm text-gray-600">Rabbanim, Cours</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center text-gray-500">
          <span className="text-xs font-medium mb-2">Découvrir</span>
          <div className="w-1 h-8 bg-gradient-to-b from-orange-400 to-transparent rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
