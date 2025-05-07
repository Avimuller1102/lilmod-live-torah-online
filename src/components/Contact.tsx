
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">NOUS CONTACTER</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-lilmod-navy mb-6">Envoyez-nous un message</h3>
              
              <form>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <Input id="name" placeholder="Votre nom" className="w-full" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input id="email" type="email" placeholder="votre@email.com" className="w-full" />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet
                  </label>
                  <Input id="subject" placeholder="Sujet de votre message" className="w-full" />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Votre message..." 
                    className="w-full min-h-[150px]" 
                  />
                </div>
                
                <Button className="bg-lilmod-blue hover:bg-lilmod-navy text-white w-full">
                  Envoyer le message
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <div className="flex flex-col gap-6">
            <Card className="border-none shadow-lg overflow-hidden flex-1">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-lilmod-navy mb-6">Coordonnées</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Mail className="text-lilmod-blue w-6 h-6 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-800">Email</h4>
                      <a href="mailto:contact@lilmod.fr" className="text-lilmod-blue hover:underline">
                        contact@lilmod.fr
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone className="text-lilmod-blue w-6 h-6 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-800">Téléphone</h4>
                      <p className="text-gray-600">+33 XX XX XX XX</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPin className="text-lilmod-blue w-6 h-6 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-800">Adresse</h4>
                      <p className="text-gray-600">Paris, France</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg overflow-hidden flex-1">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold text-lilmod-navy mb-6">Rejoignez notre communauté</h3>
                
                <p className="text-gray-700 mb-6">
                  Recevez nos actualités et le programme des prochains cours directement sur WhatsApp.
                </p>
                
                <a 
                  href="https://chat.whatsapp.com/KR5PN77WbfvDb4zFgBu3Cl" 
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors w-full"
                >
                  Rejoindre le groupe WhatsApp
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
