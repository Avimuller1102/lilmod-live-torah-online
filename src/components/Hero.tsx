
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div id="home" className="relative bg-gradient-to-br from-amber-100 to-amber-200">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-8">
        <div className="lg:w-1/2 animate-fade-in">
          <div className="flex items-center mb-6">
            <img 
              src="/lovable-uploads/ef1966f8-ad71-4e6c-ac5f-613ab18d578c.png" 
              alt="LILMOD Logo" 
              className="h-24 w-auto"
            />
            <div className="ml-4">
              <h1 className="text-4xl font-bold text-lilmod-navy sm:text-5xl md:text-6xl">
                LILMOD<span className="text-lilmod-gold pl-3">.fr</span>
              </h1>
              <p className="mt-1 text-lg text-gray-700">
                Cours Torah en direct depuis 2015
              </p>
            </div>
          </div>
          <p className="mt-3 max-w-md text-base text-gray-700 sm:text-lg md:mt-5 md:max-w-3xl">
            LILMOD diffuse en LIVE un message juif adapté à l'époque que nous vivons, celle du retour d'Israël sur sa terre.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button className="bg-lilmod-gold hover:bg-amber-700 text-white px-8 py-3 rounded-md text-base font-medium shadow-md">
              <a href="#schedule">Voir les directs</a>
            </Button>
            <Button variant="outline" className="border-lilmod-gold text-lilmod-navy hover:bg-amber-100 px-8 py-3 rounded-md text-base font-medium shadow-sm">
              <a href="#videos">Découvrir les cours</a>
            </Button>
          </div>
        </div>
        <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
          <div className="relative w-full max-w-lg">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-lilmod-gold rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-lilmod-navy rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 md:p-10 border border-amber-200">
                <h2 className="text-2xl font-bold text-lilmod-navy mb-4">Rejoindre notre communauté</h2>
                <p className="text-gray-700 mb-6">Recevez le programme de la semaine directement sur WhatsApp</p>
                <a 
                  href="https://chat.whatsapp.com/KR5PN77WbfvDb4zFgBu3Cl" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors w-full shadow-sm"
                >
                  Rejoindre le groupe WhatsApp
                </a>
                <div className="mt-4 flex justify-center">
                  <img 
                    src="/lovable-uploads/84063e78-f8c4-434a-a73b-dfecda974b75.png" 
                    alt="LILMOD Logo" 
                    className="h-24 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
