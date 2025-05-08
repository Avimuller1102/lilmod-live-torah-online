
import React, { useState } from 'react';
import { Mail } from 'lucide-react';

const NewsletterButton = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <a 
      href="https://mailchi.mp/4fbd1394a7fd/inscription-feed-lilmod"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-44 right-6 bg-lilmod-blue hover:bg-lilmod-navy text-white p-3 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="S'abonner à la newsletter"
    >
      <span className={`mr-2 ${isHovered ? 'sm:inline' : 'hidden'} transition-all duration-300`}>
        Newsletter
      </span>
      <Mail className="w-5 h-5" />
    </a>
  );
};

export default NewsletterButton;
