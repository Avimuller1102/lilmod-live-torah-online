/**
 * LILMOD - Support/Donate Section
 * 
 * Beautiful donation section with:
 * - Mission statement
 * - Donation amount buttons
 * - JGive integration
 * - Tax deduction notice
 */

import { Heart, Gift, Star, Sparkles } from 'lucide-react';
import { SOCIAL_LINKS, DONATION_AMOUNTS } from '@/lib/constants';

const Support = () => {
  const handleDonationClick = () => {
    window.open(SOCIAL_LINKS.donate, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="support" className="section-padding bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-accent-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-accent-500/10 rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-500/20 rounded-full mb-6">
              <Heart className="w-10 h-10 text-accent-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              Soutenez Notre Mission
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              LILMOD est une organisation à but non lucratif. Votre soutien permet à des milliers 
              de personnes d'accéder gratuitement à un enseignement juif de qualité.
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-8 md:p-10">
              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Gift className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-800 mb-1">Accès Gratuit</h4>
                    <p className="text-sm text-neutral-600">
                      Tous nos cours restent gratuits grâce à vos dons
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-800 mb-1">Qualité Premium</h4>
                    <p className="text-sm text-neutral-600">
                      Des enseignants de haut niveau depuis Israël
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary-800 mb-1">Impact Réel</h4>
                    <p className="text-sm text-neutral-600">
                      Chaque don contribue à diffuser la Torah
                    </p>
                  </div>
                </div>
              </div>

              {/* Donation Amounts */}
              <div className="mb-8">
                <p className="text-center text-sm font-medium text-neutral-500 mb-4">
                  Choisissez un montant
                </p>
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  {DONATION_AMOUNTS.map((amount) => (
                    <button
                      key={amount.value}
                      onClick={handleDonationClick}
                      className="py-4 px-6 bg-accent-50 hover:bg-accent-100 border-2 border-accent-200 hover:border-accent-400 rounded-xl font-bold text-accent-700 transition-all duration-300 hover:scale-105"
                    >
                      {amount.label}
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
                  className="inline-flex items-center justify-center gap-3 py-4 px-10 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-primary-900 font-bold rounded-xl transition-all duration-300 hover:shadow-gold-lg hover:-translate-y-1"
                >
                  <Heart className="w-5 h-5" />
                  Faire un don
                </a>

                {/* Tax Notice */}
                <p className="mt-6 text-sm text-neutral-500">
                  <span className="inline-flex items-center gap-1">
                    ✓ Dons déductibles des impôts en Israël et en France
                  </span>
                </p>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-6 border-t border-neutral-100">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-left">
                <div className="text-3xl">🙏</div>
                <div>
                  <p className="font-medium text-primary-800">
                    Merci de votre générosité !
                  </p>
                  <p className="text-sm text-neutral-600">
                    Ensemble, nous diffusons la lumière de la Torah dans le monde
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
