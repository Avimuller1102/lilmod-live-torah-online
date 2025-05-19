
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Partners = () => {
  const partners = [
    {
      id: 1,
      name: "Midreshet Yeouda-Manitou",
      logo: "/lovable-uploads/e1be4e3d-09cd-495d-82e1-76efbe37b316.png"
    },
    {
      id: 2,
      name: "HOUG",
      logo: "/lovable-uploads/dd8e5170-d14c-486b-a439-362798fd70df.png"
    }
  ];

  return (
    <section id="partners" className="bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-lilmod-navy mb-10">
          <span className="relative">
            NOS PARTENAIRES
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-amber-300 to-lilmod-gold"></span>
          </span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <div key={partner.id} className="flex justify-center group">
              <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-300 w-full max-w-[200px]">
                <CardContent className="p-4 flex items-center justify-center">
                  <img 
                    src={partner.logo} 
                    alt={`Logo ${partner.name}`}
                    className="h-20 object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        
        <div className="mt-10 flex justify-center">
          <img 
            src="/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png" 
            alt="Décoration" 
            className="h-16 opacity-70"
          />
        </div>
      </div>
    </section>
  );
};

export default Partners;
