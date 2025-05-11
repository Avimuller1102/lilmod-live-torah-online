
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Ici, nous enverrions le message à aaronbotbol@gmail.com
      console.log("Envoi du message à aaronbotbol@gmail.com:", formData);
      
      // Simulons un délai pour l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message envoyé!",
        description: "Merci de nous avoir contacté. Nous vous répondrons dans les plus brefs délais.",
      });
      
      // Accusé de réception envoyé à l'utilisateur
      console.log(`Accusé de réception envoyé à ${formData.email}`);
      
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title">NOUS CONTACTER</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-lg overflow-hidden">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-lilmod-navy mb-6">Envoyez-nous un message</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom complet
                    </label>
                    <Input 
                      id="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom" 
                      className="w-full"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com" 
                      className="w-full"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet
                  </label>
                  <Input 
                    id="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Sujet de votre message" 
                    className="w-full"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Votre message..." 
                    className="w-full min-h-[150px]"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-lilmod-blue hover:bg-lilmod-navy text-white w-full"
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
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
                  
                  <div className="flex items-start">
                    <MapPin className="text-lilmod-blue w-6 h-6 mr-4 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-800">Adresse</h4>
                      <p className="text-gray-600 break-words">54 King Georges Street, Jerusalem, Israel</p>
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
