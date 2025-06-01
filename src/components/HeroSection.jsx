
import React, { useState, useEffect } from 'react';
import { Play, Youtube, Headphones, Calendar } from 'lucide-react';
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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Modern Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-lilmod-gold/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-amber-200/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-lilmod-gold/5 to-transparent rounded-full"></div>
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute top-20 left-20 w-16 h-16 bg-gradient-to-br from-lilmod-gold/30 to-amber-300/30 rounded-2xl rotate-45 animate-pulse"></div>
      <div className="absolute bottom-32 right-16 w-12 h-12 bg-gradient-to-br from-lilmod-blue/20 to-blue-300/20 rounded-full animate-bounce"></div>
      <div className="absolute top-1/3 right-32 w-8 h-8 bg-gradient-to-br from-lilmod-gold/40 to-yellow-300/40 rounded-lg rotate-12 animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-lilmod-gold/20 to-amber-200/30 text-lilmod-navy rounded-full text-sm font-semibold backdrop-blur-sm border border-lilmod-gold/30">
                🔴 EN DIRECT DEPUIS ISRAËL
              </span>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-lilmod-navy via-lilmod-blue to-lilmod-navy bg-clip-text text-transparent">
                  Étudiez la Torah
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl font-light text-lilmod-navy/80">
                  en ligne
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 max-w-2xl leading-relaxed">
                Rejoignez des milliers d'étudiants dans le monde pour des cours de Torah authentiques en français
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <a 
                href="#content-library"
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-lilmod-gold to-amber-400 hover:from-amber-400 hover:to-lilmod-gold text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                Commencer maintenant
              </a>
              
              <a 
                href="https://www.youtube.com/@Lilmodfr"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/80 hover:bg-white text-lilmod-navy border-2 border-lilmod-gold/30 hover:border-lilmod-gold font-semibold rounded-2xl transition-all duration-300 backdrop-blur-sm shadow-lg hover:shadow-xl"
              >
                <Youtube className="w-6 h-6 mr-3 text-red-500 group-hover:scale-110 transition-transform" />
                Notre chaîne YouTube
              </a>
            </div>

            {/* Quick Access Links */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              <a 
                href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center p-4 bg-white/70 backdrop-blur-sm border border-green-200 rounded-xl hover:bg-white/90 hover:shadow-lg transition-all text-gray-700 group"
              >
                <Headphones className="w-8 h-8 text-green-500 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold text-sm">Podcasts</div>
                  <div className="text-xs text-gray-500">Sur Spotify</div>
                </div>
              </a>
              
              <a 
                href="#schedule"
                className="flex items-center p-4 bg-white/70 backdrop-blur-sm border border-red-200 rounded-xl hover:bg-white/90 hover:shadow-lg transition-all text-gray-700 group"
              >
                <Calendar className="w-8 h-8 text-red-500 mr-3 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold text-sm">Planning</div>
                  <div className="text-xs text-gray-500">Cours live</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Side - Interactive Card */}
          <div className="lg:pl-12">
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl overflow-hidden rounded-3xl">
              <CardContent className="p-0">
                <div className="relative h-80 overflow-hidden">
                  <img 
                    src={highlights[currentSlide].image}
                    alt={highlights[currentSlide].title}
                    className="w-full h-full object-cover transition-all duration-1000 transform hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                    <h3 className="text-2xl font-bold mb-3">{highlights[currentSlide].title}</h3>
                    <p className="text-blue-100 text-lg">{highlights[currentSlide].subtitle}</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex space-x-3 justify-center">
                    {highlights.map((_, index) => (
                      <button
                        key={index}
                        className={`w-4 h-4 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-gradient-to-r from-lilmod-gold to-amber-400 shadow-lg' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modern Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center text-lilmod-navy/60">
          <span className="text-xs font-medium mb-2">Découvrir</span>
          <div className="w-1 h-8 bg-gradient-to-b from-lilmod-gold to-transparent rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
