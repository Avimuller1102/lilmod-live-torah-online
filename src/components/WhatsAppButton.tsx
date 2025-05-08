
import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  return (
    <a 
      href="https://wa.me/972585766985" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center"
      aria-label="Contact WhatsApp"
    >
      <span className="mr-2 hidden sm:inline">📲 Poser une question ?</span>
      <MessageCircle className="w-5 h-5" />
    </a>
  );
};

export default WhatsAppButton;
