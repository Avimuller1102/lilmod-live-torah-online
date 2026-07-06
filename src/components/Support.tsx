/**
 * LILMOD - Support/Donate Section
 *
 * Premium donation section with rich visual design
 */

import { useEffect, useRef, useState } from 'react';
import { Heart, Gift, Star, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SOCIAL_LINKS, DONATION_AMOUNTS } from '@/lib/constants';

const Support = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleDonationClick = () => {
    window.open(SOCIAL_LINKS.donate, '_blank', 'noopener,noreferrer');
  };

  return (
    <section
      ref={sectionRef}
      id="support"
      className="section-padding relative overflow-hidden bg-primary-900"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Ambient glow effects */}
      <div className="absolute top-10 left-1/4 w-64 h-64 bg-accent-500/15 rounded-full blur-[80px]" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-400/10 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-400/5 rounded-full blur-[120px]" />

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className={`text-center mb-14 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-400/15 rounded-lg mb-6 border border-accent-400/20">
              <Heart className="w-10 h-10 text-accent-400 fill-current" />
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-500/20 border border-accent-400/30 rounded-full mb-4">
              <span className="text-accent-300 text-sm font-medium tracking-wide">Association à but non lucratif</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-5">
              Soutenez la diffusion gratuite.
            </h2>
            <p className="text-lg text-blue-100/75 max-w-2xl mx-auto leading-relaxed">
              Votre soutien permet à des milliers de personnes d'accéder gratuitement
              à un enseignement juif de qualité, depuis Jérusalem.
            </p>
          </div>

          {/* Main Card */}
          <div className={`relative bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

            {/* Card top accent stripe */}
            <div className="h-1.5 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600" />

            <div className="p-8 md:p-12">

              {/* Impact quote */}
              <div className="text-center mb-10 p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg border border-accent-100">
                <p className="text-2xl font-bold text-primary-800 mb-1">"תורה לשמה"</p>
                <p className="text-sm text-neutral-500">L'étude de la Torah pour elle-même</p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                  { icon: Gift, title: "Accès 100% Gratuit", desc: "Tous nos cours restent accessibles gratuitement grâce à vos dons", color: "bg-blue-50 text-blue-600" },
                  { icon: Star, title: "Qualité Premium", desc: "Des enseignants d'exception depuis les plus grandes yeshivot d'Israël", color: "bg-amber-50 text-amber-600" },
                  { icon: Sparkles, title: "Impact Mondial", desc: "Des milliers d'apprenants en France, Israël, et partout dans le monde", color: "bg-green-50 text-green-600" },
                ].map(({ icon: Icon, title, desc, color }, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-xl hover:bg-neutral-50 transition-colors">
                    <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary-800 mb-1">{title}</h4>
                      <p className="text-sm text-neutral-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-100 mb-8" />

              {/* Donation Amounts */}
              <div className="mb-8">
                <p className="text-center text-sm font-semibold text-neutral-400 uppercase tracking-wider mb-5">
                  Choisissez un montant
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                  {DONATION_AMOUNTS.map((amount) => (
                    <button
                      key={amount.value}
                      onClick={handleDonationClick}
                      className="relative group py-4 px-4 bg-gradient-to-br from-accent-50 to-amber-50 hover:from-accent-100 hover:to-amber-100 border border-accent-200 hover:border-accent-500 rounded-lg font-bold text-accent-700 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-accent-200"
                    >
                      <span className="text-lg">{amount.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main CTA */}
              <div className="text-center">
                <a
                  href={SOCIAL_LINKS.donate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 py-4 px-12 bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent-500/30 hover:-translate-y-1"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  Faire un don
                  <ArrowRight className="w-5 h-5" />
                </a>

                {/* Tax Notice */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Reçu fiscal selon éligibilité
                  </span>
                  <span className="hidden sm:block text-neutral-300">•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Paiement sécurisé via JGive
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="bg-gradient-to-r from-primary-800 to-primary-700 p-6">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center">
                <Heart className="h-8 w-8 text-accent-300" />
                <div>
                  <p className="font-bold text-white text-lg">
                    Merci de votre générosité !
                  </p>
                  <p className="text-sm text-blue-200/80">
                    Ensemble, nous diffusons la lumière de la Torah dans le monde entier
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
