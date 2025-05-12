
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const Partners = () => {
  const partners = [
    {
      id: 1,
      name: "Midreshet Yeouda-Manitou",
      logo: "/lovable-uploads/e1be4e3d-09cd-495d-82e1-76efbe37b316.png",
      url: "#"
    },
    {
      id: 2,
      name: "HOUG",
      logo: "/lovable-uploads/dd8e5170-d14c-486b-a439-362798fd70df.png",
      url: "#"
    }
  ];

  return (
    <section id="partners" className="bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title mb-12">NOS PARTENAIRES</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-items-center">
          {partners.map((partner) => (
            <a 
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center group"
            >
              <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-300 w-full max-w-[200px]">
                <CardContent className="p-4 flex items-center justify-center">
                  <img 
                    src={partner.logo} 
                    alt={`Logo ${partner.name}`}
                    className="h-20 object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </CardContent>
              </Card>
            </a>
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
