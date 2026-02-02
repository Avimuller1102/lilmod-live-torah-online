
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { newsletterSchema } from '@/lib/validationSchemas';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; consent?: string }>({});

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate with Zod
    const result = newsletterSchema.safeParse({ email, consent });
    
    if (!result.success) {
      const fieldErrors: { email?: string; consent?: string } = {};
      result.error.errors.forEach(err => {
        const field = err.path[0] as 'email' | 'consent';
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      toast({
        title: "Erreur de validation",
        description: "Veuillez corriger les erreurs dans le formulaire.",
        variant: "destructive",
      });
      return;
    }
    
    // Données validées
    const validatedEmail = result.data.email;
    
    // Extraction du prénom et du nom à partir de l'adresse e-mail
    let firstName = "Abonné";
    let lastName = "";
    
    const localPart = validatedEmail.split('@')[0];
    
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
    
    // Construction de l'URL avec les paramètres encodés
    const mailchimpUrl = `https://mailchi.mp/4fbd1394a7fd/inscription-feed-lilmod?EMAIL=${encodeURIComponent(validatedEmail)}&FNAME=${encodeURIComponent(firstName)}&LNAME=${encodeURIComponent(lastName)}&PHONE=0000000000`;
    
    // Redirection vers Mailchimp
    window.open(mailchimpUrl, '_blank');
    
    toast({
      title: "Merci pour votre inscription",
      description: "Vous allez être redirigé vers notre page d'inscription à la newsletter.",
    });
    
    // Réinitialiser le formulaire
    setEmail('');
    setConsent(false);
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
                
                <form onSubmit={handleSubscribe} className="space-y-4" noValidate>
                  <div>
                    <label htmlFor="newsletter-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse email
                    </label>
                    <input
                      type="email"
                      id="newsletter-email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                      }}
                      placeholder="votre@email.com"
                      className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:border-transparent ${
                        errors.email 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-gray-300 focus:ring-lilmod-blue'
                      }`}
                      maxLength={255}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="newsletter-consent"
                      checked={consent}
                      onChange={(e) => {
                        setConsent(e.target.checked);
                        if (errors.consent) setErrors(prev => ({ ...prev, consent: undefined }));
                      }}
                      className={`h-4 w-4 mt-0.5 text-lilmod-blue focus:ring-lilmod-blue border-gray-300 rounded ${
                        errors.consent ? 'border-red-500' : ''
                      }`}
                    />
                    <label htmlFor="newsletter-consent" className="ml-2 block text-sm text-gray-700">
                      J'accepte de recevoir la newsletter de LILMOD
                    </label>
                  </div>
                  {errors.consent && (
                    <p className="text-red-500 text-xs -mt-2">{errors.consent}</p>
                  )}
                  
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
