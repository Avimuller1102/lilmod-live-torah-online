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
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="mx-auto max-w-5xl">
          {/* Main Card */}
          <div className="relative overflow-hidden rounded-lg border border-neutral-200 bg-primary-900 shadow-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(216,174,69,0.26),transparent_28rem)]" />

            <div className="relative p-6 md:p-10">
              <div className="mb-10 text-center">
                {/* Icon */}
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-white/10 text-accent-200 ring-1 ring-white/10">
                  <Mail className="w-8 h-8 text-white" />
                </div>

                <h2 className="mb-4 text-3xl font-black text-white md:text-4xl">
                  Recevoir le programme avant de manquer le cours.
                </h2>
                <p className="mx-auto max-w-xl text-blue-50/80">
                  Inscrivez-vous pour recevoir le programme des cours, des rappels, 
                  et du contenu exclusif directement dans votre boîte mail.
                </p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={index} className="rounded-lg border border-white/10 bg-white/10 p-4 text-center">
                      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-accent-400/15 text-accent-200">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h4 className="mb-1 font-bold text-white">
                        {benefit.title}
                      </h4>
                      <p className="text-sm text-blue-50/70">
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
                  className="inline-flex items-center justify-center gap-3 rounded-lg bg-accent-500 px-10 py-4 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-accent-600 hover:shadow-lg hover:shadow-accent-500/25"
                >
                  <Mail className="w-5 h-5" />
                  S'inscrire à la Newsletter
                </a>
                <p className="mt-4 text-sm text-blue-50/60">
                  Pas de spam, désinscription facile à tout moment.
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
