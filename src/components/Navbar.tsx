
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
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
              <span className="text-2xl font-bold text-lilmod-blue">LILMOD</span>
              <span className="ml-1 text-xs text-lilmod-gold pt-1">.fr</span>
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
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
