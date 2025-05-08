
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Support = () => {
  const handleDonationClick = (amount: string) => {
    // Rediriger vers la page de don avec le montant pré-sélectionné
    window.open("https://www.jgive.com/new/en/usd/donation-targets/146180", "_blank");
    toast({
      title: "Merci pour votre soutien",
      description: "Vous êtes redirigé vers notre page de dons sécurisée.",
    });
  };

  return (
    <section id="support" className="bg-gradient-to-br from-amber-50 to-amber-100 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">AIDER LILMOD</h2>
        
        <div className="max-w-3xl mx-auto">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="bg-lilmod-gold/10 p-4 rounded-full mb-6">
                  <Heart className="w-12 h-12 text-lilmod-gold" />
                </div>
                <h3 className="text-2xl font-bold text-lilmod-navy mb-4">Soutenez notre mission</h3>
                <p className="text-gray-700 mb-8">
                  LILMOD est une organisation à but non lucratif qui diffuse des cours de Torah en ligne depuis 2015. Votre soutien permet à des milliers de personnes d'accéder gratuitement à un enseignement juif de qualité. Chaque don compte et nous permet de continuer notre mission.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mb-8">
                  <button 
                    onClick={() => handleDonationClick("18")} 
                    className="bg-lilmod-gold hover:bg-yellow-500 text-white py-3 px-6 rounded-md font-medium transition-colors"
                  >
                    18€
                  </button>
                  <button 
                    onClick={() => handleDonationClick("50")} 
                    className="bg-lilmod-gold hover:bg-yellow-500 text-white py-3 px-6 rounded-md font-medium transition-colors"
                  >
                    50€
                  </button>
                  <button 
                    onClick={() => handleDonationClick("100")} 
                    className="bg-lilmod-gold hover:bg-yellow-500 text-white py-3 px-6 rounded-md font-medium transition-colors"
                  >
                    100€
                  </button>
                </div>
                
                <a
                  href="https://www.jgive.com/new/en/usd/donation-targets/146180"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-lilmod-blue hover:bg-lilmod-navy text-white py-3 px-8 rounded-md font-medium transition-colors w-full sm:w-auto inline-block text-center"
                >
                  Faire un don
                </a>
                
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
