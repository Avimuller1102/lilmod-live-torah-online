
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
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
    <Card className="border-none shadow-lg overflow-hidden">
      <CardContent className="p-8">
        <h3 className="text-xl font-bold text-lilmod-navy mb-6 font-serif">Envoyez-nous un message</h3>
        
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
            className="bg-lilmod-blue hover:bg-lilmod-navy text-white w-full font-sans"
          >
            {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
