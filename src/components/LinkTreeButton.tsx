
import React from 'react';
import { Link } from 'lucide-react';

const LinkTreeButton = () => {
  return (
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
  );
};

export default LinkTreeButton;
