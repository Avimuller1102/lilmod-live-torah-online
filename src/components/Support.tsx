
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';

const Support = () => {
  return (
    <section id="support" className="bg-lilmod-lightBlue py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">AIDER LILMOD</h2>
        
        <div className="max-w-3xl mx-auto">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-lilmod-blue/10 p-4 rounded-full mb-6">
                  <Heart className="w-12 h-12 text-lilmod-blue" />
                </div>
                <h3 className="text-2xl font-bold text-lilmod-navy mb-4">Soutenez notre mission</h3>
                <p className="text-gray-700 mb-8">
                  LILMOD est une organisation à but non lucratif qui diffuse des cours de Torah en ligne depuis 2015. Votre soutien permet à des milliers de personnes d'accéder gratuitement à un enseignement juif de qualité. Chaque don compte et nous permet de continuer notre mission.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
                  <button className="bg-lilmod-gold hover:bg-yellow-500 text-white py-3 px-6 rounded-md font-medium transition-colors">
                    18€
                  </button>
                  <button className="bg-lilmod-gold hover:bg-yellow-500 text-white py-3 px-6 rounded-md font-medium transition-colors">
                    50€
                  </button>
                  <button className="bg-lilmod-gold hover:bg-yellow-500 text-white py-3 px-6 rounded-md font-medium transition-colors">
                    100€
                  </button>
                </div>
                
                <button className="bg-lilmod-blue hover:bg-lilmod-navy text-white py-3 px-8 rounded-md font-medium transition-colors w-full sm:w-auto">
                  Faire un don
                </button>
                
                <p className="mt-4 text-sm text-gray-500">
                  Les dons à LILMOD sont déductibles des impôts en France.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Support;
