/**
 * LILMOD - Newsletter Section
 * 
 * Newsletter signup with:
 * - MailChimp integration link
 * - Beautiful design
 * - Incentives
 */

import { Mail, Bell, Calendar, Gift } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';

const benefits = [
  {
    icon: Calendar,
    title: "Programme hebdomadaire",
    description: "Recevez le programme complet des cours de la semaine",
  },
  {
    icon: Bell,
    title: "Rappels avant les cours",
    description: "Ne manquez jamais un cours en direct",
  },
  {
    icon: Gift,
    title: "Contenu exclusif",
    description: "Accédez à du contenu réservé aux abonnés",
  },
];

const Newsletter = () => {
  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Main Card */}
          <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-accent-200/30 to-primary-200/30 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-primary-200/30 to-accent-200/30 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative p-8 md:p-12">
              <div className="text-center mb-10">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-6 shadow-blue">
                  <Mail className="w-8 h-8 text-white" />
                </div>

                <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-800 mb-4">
                  Restez informé avec notre Newsletter
                </h2>
                <p className="text-neutral-600 max-w-lg mx-auto">
                  Inscrivez-vous pour recevoir le programme des cours, des rappels, 
                  et du contenu exclusif directement dans votre boîte mail.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div
                      key={index}
                      className="flex flex-col items-center text-center p-4 bg-neutral-50 rounded-2xl"
                    >
                      <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center mb-3">
                        <Icon className="w-6 h-6 text-accent-600" />
                      </div>
                      <h4 className="font-semibold text-primary-800 mb-1">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-neutral-500">
                        {benefit.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* CTA Button */}
              <div className="text-center">
                <a
                  href={SOCIAL_LINKS.newsletter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-blue-lg hover:-translate-y-1"
                >
                  <Mail className="w-5 h-5" />
                  S'inscrire à la Newsletter
                </a>
                <p className="mt-4 text-sm text-neutral-400">
                  📧 Pas de spam, désinscription facile à tout moment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
