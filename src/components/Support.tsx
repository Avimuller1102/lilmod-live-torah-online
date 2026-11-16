/**
 * LILMOD - Support/Donate Section
 *
 * Premium donation section with rich visual design
 */

import { useEffect, useRef, useState } from 'react';
import { Heart, Gift, Star, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SOCIAL_LINKS } from '@/lib/constants';

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
          <div className={`text-center mb-8 md:mb-14 transition-all duration-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <div className="mx-auto mb-5 hidden h-16 w-16 items-center justify-center rounded-xl border border-accent-400/20 bg-accent-400/15 md:flex md:mb-6">
              <Heart className="w-10 h-10 text-accent-400 fill-current" aria-hidden="true" />
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 bg-accent-500/20 border border-accent-400/30 rounded-full mb-4">
              <Heart className="h-3.5 w-3.5 fill-current text-accent-300 md:hidden" aria-hidden="true" />
              <span className="text-accent-300 text-xs md:text-sm font-medium tracking-wide">Association à but non lucratif</span>
            </div>
            <h2 className="text-[1.85rem] leading-tight md:text-5xl font-display font-bold text-white mb-3 md:mb-5">
              Soutenez la diffusion gratuite.
            </h2>
            <p className="text-base md:text-lg text-blue-100/75 max-w-2xl mx-auto leading-relaxed">
              Votre soutien permet à des milliers de personnes d'accéder gratuitement
              à un enseignement juif de qualité, depuis Jérusalem.
            </p>
          </div>

          {/* Main Card */}
          <div className={`relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-600 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

            {/* Card top accent stripe */}
            <div className="h-1.5 bg-gradient-to-r from-accent-400 via-accent-500 to-accent-600" />

            <div className="p-5 sm:p-8 md:p-12">

              {/* Impact quote */}
              <div className="text-center mb-6 md:mb-10 p-4 md:p-6 bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl border border-accent-100">
                <p className="text-xl md:text-2xl font-bold text-primary-800 mb-1" lang="he" dir="rtl">תורה לשמה</p>
                <p className="text-sm text-neutral-500">L'étude de la Torah pour elle-même</p>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-2 md:gap-6 mb-6 md:mb-10">
                {[
                  { icon: Gift, title: "Accès 100% Gratuit", desc: "Tous nos cours restent accessibles gratuitement grâce à vos dons", color: "bg-blue-50 text-blue-600" },
                  { icon: Star, title: "Qualité Premium", desc: "Des enseignants d'exception depuis les plus grandes yeshivot d'Israël", color: "bg-amber-50 text-amber-600" },
                  { icon: Sparkles, title: "Impact Mondial", desc: "Des milliers d'apprenants en France, Israël, et partout dans le monde", color: "bg-green-50 text-green-600" },
                ].map(({ icon: Icon, title, desc, color }, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 rounded-xl p-2 text-center transition-colors md:flex-row md:items-start md:gap-4 md:p-4 md:text-left md:hover:bg-neutral-50">
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xs leading-tight font-bold text-primary-800 md:mb-1 md:text-base">{title}</h3>
                      <p className="hidden text-sm text-neutral-500 leading-relaxed md:block">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-neutral-100 mb-5 md:mb-8" />

              {/* How it works */}
              <ol className="mx-auto mb-6 grid max-w-3xl gap-2 sm:grid-cols-3 sm:gap-4 md:mb-10">
                {[
                  'Cliquez sur « Faire un don »',
                  'Choisissez librement votre montant sur JGive',
                  'Recevez votre confirmation par email',
                ].map((step, index) => (
                  <li key={step} className="flex items-center gap-3 rounded-lg border border-accent-100 bg-accent-50/60 px-3 py-2.5 text-sm font-medium text-neutral-700 sm:p-4">
                    <span className="flex h-7 w-7 text-sm sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-500 font-bold text-white" aria-hidden="true">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>

              {/* Main CTA */}
              <div className="text-center">
                <a
                  href={SOCIAL_LINKS.donate}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full sm:inline-flex sm:w-auto items-center justify-center gap-3 py-4 px-12 bg-accent-500 hover:bg-accent-600 text-white font-bold text-lg rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent-500/30 hover:-translate-y-1"
                >
                  <Heart className="w-5 h-5 fill-current" />
                  Faire un don
                  <ArrowRight className="w-5 h-5" />
                </a>

                {/* Tax Notice */}
                <div className="mt-4 md:mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs md:text-sm text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Reçu fiscal selon éligibilité
                  </span>
                  <span className="hidden text-neutral-300 sm:inline" aria-hidden="true">•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Paiement sécurisé via JGive
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="bg-gradient-to-r from-primary-800 to-primary-700 px-5 py-4 md:p-6">
              <div className="flex flex-row items-center justify-center gap-3 text-left md:gap-4 md:text-center">
                <Heart className="h-6 w-6 flex-shrink-0 text-accent-300 md:h-8 md:w-8" aria-hidden="true" />
                <div>
                  <p className="font-bold text-white md:text-lg">
                    Merci de votre générosité !
                  </p>
                  <p className="text-xs md:text-sm text-blue-200/80">
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
