
import React from 'react';
import { Instagram, Youtube, Link, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-lilmod-navy text-white">
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src="/lovable-uploads/ef1966f8-ad71-4e6c-ac5f-613ab18d578c.png" 
                alt="LILMOD Logo" 
                className="h-12 w-12 rounded-full"
              />
              <h3 className="ml-3 text-xl font-bold">LILMOD</h3>
            </div>
            <p className="text-gray-300 mb-4">
              LILMOD by Torah Mitzion diffuse en LIVE depuis 2015, un message juif adapté à l'époque.
            </p>
            <h4 className="font-semibold mb-2 text-lilmod-gold">Nous Suivre</h4>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/lilmod_fr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-lilmod-gold transition-colors">
                <span className="sr-only">Instagram</span>
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://www.youtube.com/@Lilmodfr" target="_blank" rel="noopener noreferrer" className="text-white hover:text-lilmod-gold transition-colors">
                <span className="sr-only">YouTube</span>
                <Youtube className="w-6 h-6" />
              </a>
              <a href="https://linktr.ee/lilmod.torahmitzion" target="_blank" rel="noopener noreferrer" className="text-white hover:text-lilmod-gold transition-colors">
                <span className="sr-only">Linktree</span>
                <Link className="w-6 h-6" />
              </a>
              <a href="https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR" target="_blank" rel="noopener noreferrer" className="text-white hover:text-lilmod-gold transition-colors">
                <span className="sr-only">Spotify</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Nos Partenaires</h3>
            <div className="flex flex-col space-y-3">
              <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <img src="/lovable-uploads/e1be4e3d-09cd-495d-82e1-76efbe37b316.png" alt="Manitou" className="h-6 mr-2" />
                Manitou
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <img src="/lovable-uploads/9a5072e7-94de-4215-a3cd-fbd166896144.png" alt="Amounat Shlomo" className="h-6 mr-2" />
                Amounat Shlomo
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center">
                <img src="/lovable-uploads/dd8e5170-d14c-486b-a439-362798fd70df.png" alt="HEUG" className="h-6 mr-2" />
                HEUG
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">Accueil</a>
              </li>
              <li>
                <a href="#videos" className="text-gray-300 hover:text-white transition-colors">Vidéos</a>
              </li>
              <li>
                <a href="#audio" className="text-gray-300 hover:text-white transition-colors">Audio</a>
              </li>
              <li>
                <a href="#speakers" className="text-gray-300 hover:text-white transition-colors">Intervenants</a>
              </li>
              <li>
                <a href="#support" className="text-gray-300 hover:text-white transition-colors">Aider</a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
              </li>
              <li>
                <a href="https://linktr.ee/lilmod.torahmitzion" target="_blank" rel="noopener noreferrer" className="text-lilmod-gold hover:underline">Tous nos liens</a>
              </li>
              <li>
                <a href="https://mailchi.mp/4fbd1394a7fd/inscription-feed-lilmod" target="_blank" rel="noopener noreferrer" className="text-lilmod-gold hover:underline">S'abonner à la newsletter</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 flex justify-center">
          <img 
            src="/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png" 
            alt="Décoration" 
            className="h-10 opacity-50"
          />
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {currentYear} LILMOD.fr - Tous droits réservés</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Mentions légales</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
