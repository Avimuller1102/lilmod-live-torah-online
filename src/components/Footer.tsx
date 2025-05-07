import React from 'react';

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
                className="h-12 w-auto"
              />
              <h3 className="ml-2 text-xl font-bold">LILMOD</h3>
            </div>
            <p className="text-gray-300 mb-4">
              LILMOD by Torah Mitzion diffuse en LIVE depuis 2015, un message juif adapté à l'époque.
            </p>
            <h4 className="font-semibold mb-2 text-lilmod-gold">Nous Suivre</h4>
            <div className="flex gap-4">
              <a href="#" className="text-white hover:text-lilmod-gold transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-lilmod-gold transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-white hover:text-lilmod-gold transition-colors">
                <span className="sr-only">WhatsApp</span>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.031 6.172a5.877 5.877 0 0 0-5.875 5.877c0 1.017.27 2.023.77 2.903L6.15 18l3.13-.773a5.865 5.865 0 0 0 2.751.676h.003c3.232 0 5.875-2.643 5.875-5.877a5.877 5.877 0 0 0-5.875-5.877h-.003z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M12.031 17.172a4.875 4.875 0 0 1-2.48-.676l-.175-.105-1.833.478.49-1.77-.113-.18a4.877 4.877 0 0 1-.75-2.603c0-2.68 2.195-4.875 4.875-4.875a4.88 4.88 0 0 1 4.876 4.874c0 2.685-2.195 4.876-4.876 4.876zm2.849-2.247a.567.567 0 0 0-.39-.186.582.582 0 0 0-.415.126c-.496.324-1.11.583-1.827.643a5.87 5.87 0 0 1-1.758-.125s-.77-.207-.77-.207c-.345.115-.734.207-1.13.207a3.823 3.823 0 0 1-3.825-3.825c0-1.247.616-2.396 1.64-3.095a3.822 3.822 0 0 1 2.185-.73c1.064 0 2.055.414 2.806 1.156a3.886 3.886 0 0 1 1.133 2.755c0 1.126-.44 2.159-1.132 2.932.324.415.731.793 1.213 1.111a.583.583 0 0 0 .27.148z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Nos Partenaires</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Torah Mitzion</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Partenaire 2</a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">Partenaire 3</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-gray-300 hover:text-white transition-colors">Accueil</a>
              </li>
              <li>
                <a href="#schedule" className="text-gray-300 hover:text-white transition-colors">Les directs</a>
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
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
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
