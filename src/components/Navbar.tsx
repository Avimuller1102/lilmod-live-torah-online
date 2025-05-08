
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
                className="h-12 w-12 rounded-full"
              />
              <div className="flex flex-col ml-2">
                <span className="text-2xl font-bold text-lilmod-blue">LILMOD</span>
                <span className="text-xs text-lilmod-gold -mt-1">.fr</span>
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
              className="flex items-center text-lilmod-gold hover:text-lilmod-blue font-medium transition-colors"
            >
              <Link className="w-4 h-4 mr-1" />
              <span>Tous nos liens</span>
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
              <div className="flex space-x-4">
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
