
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone } from 'lucide-react';
import { ContactAddress } from './ContactAddress';

const ContactInfo = () => {
  return (
    <Card className="border-none shadow-lg overflow-hidden flex-1">
      <CardContent className="p-8">
        <h3 className="text-xl font-bold text-lilmod-navy mb-6 font-serif">Coordonnées</h3>
        
        <div className="space-y-6">
          <div className="flex items-start">
            <Mail className="text-lilmod-blue w-6 h-6 mr-4 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Email</h4>
              <a href="mailto:aaronbotbol@gmail.com" className="text-lilmod-blue hover:underline break-all">
                aaronbotbol@gmail.com
              </a>
            </div>
          </div>
          
          <div className="flex items-start">
            <Phone className="text-lilmod-blue w-6 h-6 mr-4 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-800">Téléphone</h4>
              <a href="tel:+972585766985" className="text-gray-600 hover:text-lilmod-blue">
                +972 585766985
              </a>
            </div>
          </div>
          
          <ContactAddress />
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfo;
