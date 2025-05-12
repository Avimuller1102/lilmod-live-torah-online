
import React from 'react';
import { MapPin } from 'lucide-react';

export const ContactAddress = () => {
  return (
    <div className="flex items-start">
      <MapPin className="text-lilmod-blue w-6 h-6 mr-4 flex-shrink-0 mt-1" />
      <div className="flex-grow">
        <h4 className="font-medium text-gray-800">Adresse</h4>
        <p className="text-gray-600">
          54 King Georges Street, <br/>
          Jerusalem, Israel
        </p>
        <a 
          href="https://www.google.com/maps/search/?api=1&query=54+King+Georges+Street+Jerusalem+Israel" 
          target="_blank"
          rel="noopener noreferrer"
          className="text-lilmod-blue hover:underline text-sm mt-1 inline-block"
        >
          Voir sur Google Maps
        </a>
      </div>
    </div>
  );
};

