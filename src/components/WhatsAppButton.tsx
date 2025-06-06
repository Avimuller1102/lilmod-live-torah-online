
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/972585766985" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 transform hover:scale-105"
      aria-label="Contact WhatsApp"
      style={{ filter: 'none', WebkitFilter: 'none', textShadow: 'none' }}
    >
      <span className="mr-2 hidden sm:inline font-medium text-center">📲 Poser une question ?</span>
      <MessageCircle className="w-5 h-5" />
    </a>
  );
};

export default WhatsAppButton;
