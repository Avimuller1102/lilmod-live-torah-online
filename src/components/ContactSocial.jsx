
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ContactSocial = () => {
  return (
    <Card className="border-none shadow-lg overflow-hidden flex-1">
      <CardContent className="p-8">
        <h3 className="text-xl font-bold text-lilmod-navy mb-6 font-serif">Rejoignez notre communauté</h3>
        
        <p className="text-gray-700 mb-6 font-sans">
          Recevez nos actualités et le programme des prochains cours directement sur WhatsApp.
        </p>
        
        <a 
          href="https://chat.whatsapp.com/KR5PN77WbfvDb4zFgBu3Cl" 
          target="_blank"
          rel="noopener noreferrer" 
          className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors w-full font-sans"
        >
          Rejoindre le groupe WhatsApp
        </a>
      </CardContent>
    </Card>
  );
};

export default ContactSocial;
