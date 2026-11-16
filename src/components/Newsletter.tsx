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
    title: "Nouveaux cours",
    description: "Soyez informé des nouvelles séries",
  },
];

const Newsletter = () => {
  return (
    <section aria-labelledby="newsletter-title" className="bg-white py-12 md:py-16">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-2xl border border-accent-200/70 bg-gradient-to-br from-accent-50 via-white to-primary-50 p-6 md:p-10">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent-200/40 blur-3xl" aria-hidden="true" />

          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            <div>
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-700 text-white">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <h2 id="newsletter-title" className="text-2xl font-bold text-neutral-950 md:text-3xl">
                Recevez le programme de la semaine.
              </h2>
              <p className="mt-3 max-w-xl text-neutral-600">
                Les horaires des cours, les rappels avant les lives et les nouveautés,
                directement dans votre boîte mail.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <li
                      key={benefit.title}
                      className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-sm font-medium text-neutral-700"
                    >
                      <Icon className="h-4 w-4 text-accent-600" aria-hidden="true" />
                      {benefit.title}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col gap-3 lg:items-end">
              <a
                href={SOCIAL_LINKS.newsletter}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full justify-center px-8 py-4 text-base lg:w-auto"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                S'inscrire à la newsletter
              </a>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline w-full justify-center lg:w-auto"
              >
                Ou suivre le groupe WhatsApp
              </a>
              <p className="text-center text-xs text-neutral-500 lg:text-right">
                Gratuit · désinscription en un clic
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
