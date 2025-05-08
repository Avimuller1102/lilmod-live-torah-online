
import React, { useState } from 'react';
import { Menu, X, Link, Youtube, Instagram, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex-shrink-0 flex items-center">
              <img 
                src="/lovable-uploads/ef1966f8-ad71-4e6c-ac5f-613ab18d578c.png" 
                alt="LILMOD Logo" 
                className="h-12 w-12 rounded-full border-2 border-lilmod-gold"
              />
              <div className="flex flex-col ml-2">
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold text-lilmod-blue">LILMOD</span>
                  <span className="text-xs text-lilmod-gold ml-1">.fr</span>
                </div>
              </div>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-lilmod-navy hover:text-lilmod-blue font-medium transition-colors">Accueil</a>
            <a href="#schedule" className="text-lilmod-navy hover:text-lilmod-blue font-medium transition-colors">Les directs de la semaine</a>
            <a href="#videos" className="text-lilmod-navy hover:text-lilmod-blue font-medium transition-colors">Les cours en vidéos</a>
            <a href="#audio" className="text-lilmod-navy hover:text-lilmod-blue font-medium transition-colors">Les cours audio</a>
            <a href="#speakers" className="text-lilmod-navy hover:text-lilmod-blue font-medium transition-colors">Les intervenants</a>
            <a href="#support" className="text-lilmod-navy hover:text-lilmod-blue font-medium transition-colors">Aider</a>
            <a href="#contact" className="text-lilmod-navy hover:text-lilmod-blue font-medium transition-colors">Nous Contacter</a>
            <a 
              href="https://linktr.ee/lilmod.torahmitzion" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-lilmod-gold hover:text-lilmod-blue font-medium transition-colors bg-amber-50 px-3 py-1 rounded-md"
            >
              <Link className="w-4 h-4 mr-1" />
              <span>Tous nos liens</span>
            </a>
            <a 
              href="https://mailchi.mp/4fbd1394a7fd/inscription-feed-lilmod" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              <Mail className="w-4 h-4 mr-1" />
              <span>Newsletter</span>
            </a>
          </div>
          
          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMenu}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
            <a 
              href="#home" 
              className="block px-3 py-2 text-lilmod-navy hover:text-lilmod-blue font-medium"
              onClick={toggleMenu}
            >
              Accueil
            </a>
            <a 
              href="#schedule" 
              className="block px-3 py-2 text-lilmod-navy hover:text-lilmod-blue font-medium"
              onClick={toggleMenu}
            >
              Les directs de la semaine
            </a>
            <a 
              href="#videos" 
              className="block px-3 py-2 text-lilmod-navy hover:text-lilmod-blue font-medium"
              onClick={toggleMenu}
            >
              Les cours en vidéos
            </a>
            <a 
              href="#audio" 
              className="block px-3 py-2 text-lilmod-navy hover:text-lilmod-blue font-medium"
              onClick={toggleMenu}
            >
              Les cours audio
            </a>
            <a 
              href="#speakers" 
              className="block px-3 py-2 text-lilmod-navy hover:text-lilmod-blue font-medium"
              onClick={toggleMenu}
            >
              Les intervenants
            </a>
            <a 
              href="#support" 
              className="block px-3 py-2 text-lilmod-navy hover:text-lilmod-blue font-medium"
              onClick={toggleMenu}
            >
              Aider
            </a>
            <a 
              href="#contact" 
              className="block px-3 py-2 text-lilmod-navy hover:text-lilmod-blue font-medium"
              onClick={toggleMenu}
            >
              Nous Contacter
            </a>
            <div className="px-3 py-4 border-t border-gray-200 mt-3">
              <p className="font-medium text-lilmod-navy mb-2">Suivez-nous</p>
              <div className="flex flex-wrap space-x-4">
                <a 
                  href="https://www.youtube.com/@Lilmodfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lilmod-blue hover:text-lilmod-navy"
                >
                  <Youtube className="w-6 h-6" />
                </a>
                <a 
                  href="https://www.instagram.com/lilmod_fr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lilmod-blue hover:text-lilmod-navy"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a 
                  href="https://linktr.ee/lilmod.torahmitzion" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lilmod-blue hover:text-lilmod-navy"
                >
                  <Link className="w-6 h-6" />
                </a>
                <a 
                  href="https://mailchi.mp/4fbd1394a7fd/inscription-feed-lilmod" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lilmod-blue hover:text-lilmod-navy"
                >
                  <Mail className="w-6 h-6" />
                </a>
                <a 
                  href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lilmod-blue hover:text-lilmod-navy"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bouton flottant Linktree */}
      <a 
        href="https://linktr.ee/lilmod.torahmitzion" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-lilmod-gold hover:bg-amber-600 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
        aria-label="Tous nos liens"
      >
        <span className="mr-2 hidden sm:inline">📲 Tous nos liens</span>
        <Link className="w-5 h-5" />
      </a>
    </nav>
  );
};

export default Navbar;
