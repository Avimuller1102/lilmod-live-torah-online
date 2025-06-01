
import React, { useState, useEffect } from 'react';
import { Play, Youtube, Headphones, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const highlights = [
    {
      title: "Cours de Torah en direct",
      subtitle: "Rejoignez nos cours en live depuis Israël",
      image: "/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png"
    },
    {
      title: "Bibliothèque de +2500 cours",
      subtitle: "Accédez à notre vaste collection d'enseignements",
      image: "/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png"
    },
    {
      title: "Enseignants reconnus",
      subtitle: "Apprenez avec les meilleurs Rabbanim",
      image: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % highlights.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-lilmod-navy via-blue-900 to-slate-900">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] repeat"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-lilmod-gold/20 text-lilmod-gold rounded-full text-sm font-medium mb-4">
                🔴 EN DIRECT DEPUIS ISRAËL
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Étudiez la <span className="text-lilmod-gold">Torah</span> en ligne
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl">
              Rejoignez des milliers d'étudiants dans le monde pour des cours de Torah authentiques en français
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
              <a 
                href="#videos"
                className="inline-flex items-center justify-center px-8 py-4 bg-lilmod-gold hover:bg-yellow-500 text-lilmod-navy font-bold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-xl"
              >
                <Play className="w-6 h-6 mr-3" />
                Commencer maintenant
              </a>
              
              <a 
                href="https://www.youtube.com/@Lilmodfr"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-bold rounded-xl transition-all duration-300 backdrop-blur-sm"
              >
                <Youtube className="w-6 h-6 mr-3" />
                Notre chaîne YouTube
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <div className="text-2xl font-bold text-lilmod-gold">2500+</div>
                <div className="text-sm text-blue-200">Cours disponibles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-lilmod-gold">20+</div>
                <div className="text-sm text-blue-200">Intervenants</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-lilmod-gold">10k+</div>
                <div className="text-sm text-blue-200">Heures d'étude</div>
              </div>
            </div>
          </div>

          {/* Right Side - Highlight Cards */}
          <div className="lg:pl-12">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={highlights[currentSlide].image}
                    alt={highlights[currentSlide].title}
                    className="w-full h-full object-cover transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">{highlights[currentSlide].title}</h3>
                    <p className="text-blue-100">{highlights[currentSlide].subtitle}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex space-x-2 justify-center">
                    {highlights.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentSlide ? 'bg-lilmod-gold' : 'bg-white/30'
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Access Links */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <a 
                href="#audio"
                className="flex items-center p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all text-white group"
              >
                <Headphones className="w-8 h-8 text-green-400 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold">Podcasts</div>
                  <div className="text-sm text-blue-200">Sur Spotify</div>
                </div>
              </a>
              
              <a 
                href="#videos"
                className="flex items-center p-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl hover:bg-white/20 transition-all text-white group"
              >
                <Youtube className="w-8 h-8 text-red-400 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold">Vidéos</div>
                  <div className="text-sm text-blue-200">Sur YouTube</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-lilmod-gold/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
    </section>
  );
};

export default HeroSection;
