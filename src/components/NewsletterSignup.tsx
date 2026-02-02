
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const NewsletterSignup = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const emailInput = form.querySelector('#email') as HTMLInputElement;
    const email = emailInput.value;
    
    // Extraction du prénom et du nom à partir de l'adresse e-mail
    let firstName = "Abonné";
    let lastName = "";
    
    if (email.includes('@')) {
      const localPart = email.split('@')[0];
      
      // Essayer de déduire prénom et nom si le format est prénom.nom@domaine.com ou prénom_nom@domaine.com
      if (localPart.includes('.')) {
        const parts = localPart.split('.');
        firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        if (parts.length > 1) {
          lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        }
      } else if (localPart.includes('_')) {
        const parts = localPart.split('_');
        firstName = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
        if (parts.length > 1) {
          lastName = parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
        }
      }
    }
    
    // Construction de l'URL avec les paramètres
    const mailchimpUrl = `https://mailchi.mp/4fbd1394a7fd/inscription-feed-lilmod?EMAIL=${encodeURIComponent(email)}&FNAME=${encodeURIComponent(firstName)}&LNAME=${encodeURIComponent(lastName)}&PHONE=0000000000`;
    
    // Redirection vers Mailchimp
    window.open(mailchimpUrl, '_blank');
    
    toast({
      title: "Merci pour votre inscription",
      description: "Vous allez être redirigé vers notre page d'inscription à la newsletter.",
    });
    
    // Réinitialiser le formulaire
    form.reset();
  };

  return (
    <section id="newsletter" className="bg-lilmod-lightBlue py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-3xl font-bold text-lilmod-navy mb-4">Restez informé</h2>
            <p className="text-gray-700 mb-6">
              Recevez nos dernières actualités, le programme des cours et les événements spéciaux directement dans votre boîte mail.
            </p>
            <div className="flex items-start">
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-2">
                <li>Programme hebdomadaire des cours</li>
                <li>Annonces des événements spéciaux</li>
                <li>Résumés des enseignements importants</li>
                <li>Liens vers les derniers cours mis en ligne</li>
              </ul>
            </div>
          </div>
          
          <div className="md:w-1/2 md:pl-8">
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-lilmod-gold/10 p-2 rounded-full mr-3">
                    <Mail className="w-6 h-6 text-lilmod-gold" />
                  </div>
                  <h3 className="font-bold text-xl text-lilmod-navy">S'inscrire à la newsletter</h3>
                </div>
                
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      id="email"
                      placeholder="votre@email.com"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lilmod-blue focus:border-transparent"
                    />
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="consent"
                      required
                      className="h-4 w-4 text-lilmod-blue focus:ring-lilmod-blue border-gray-300 rounded"
                    />
                    <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                      J'accepte de recevoir la newsletter de LILMOD
                    </label>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-lilmod-blue hover:bg-lilmod-navy text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    S'inscrire
                  </button>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Vous pouvez vous désinscrire à tout moment. En vous inscrivant, vous acceptez notre politique de confidentialité.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;
