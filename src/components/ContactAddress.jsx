
import React from 'react';
import { MapPin } from 'lucide-react';

export const ContactAddress = () => {
  return (
    <div className="flex items-start">
      <MapPin className="text-lilmod-blue w-6 h-6 mr-4 flex-shrink-0 mt-1" />
      <div className="flex-grow">
        <h4 className="font-medium text-gray-800">Adresse</h4>
        <p className="text-gray-600 break-words">
          54 King Georges Street, Jerusalem, Israel
        </p>
      </div>
    </div>
  );
};
