/**
 * LILMOD - Contact Section with Formspree Integration
 * 
 * Features:
 * - Working contact form with Formspree
 * - Form validation with Zod
 * - Honeypot spam protection
 * - Success/error handling
 * - Contact information cards
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, MessageSquare, Users } from 'lucide-react';
import { SITE_CONFIG, SOCIAL_LINKS, FORMSPREE_ENDPOINT } from '@/lib/constants';

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Veuillez entrer une adresse email valide'),
  subject: z.string().min(3, 'Le sujet doit contenir au moins 3 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
  // Honeypot field for spam protection
  _gotcha: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Honeypot : un robot remplit ce champ caché, un humain jamais.
    if (data._gotcha) {
      setStatus('success');
      reset();
      return;
    }

    setStatus('submitting');

    try {
      // Using FormData format which is more reliable with Formspree
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('_replyto', data.email);
      formData.append('subject', data.subject);
      formData.append('message', data.message);
      formData.append('_subject', `[LILMOD Contact] ${data.subject}`);
      
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus('success');
        reset();
        setTimeout(() => setStatus('idle'), 8000);
      } else {
        console.error('Formspree error:', responseData);
        throw new Error(responseData.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 8000);
    }
  };

  return (
    <section id="contact" className="section-padding bg-white">
      <div className="container-custom">
        {/* Section Header */}
        <div className="mb-8 text-center md:mb-16">
          <span className="eyebrow">Contact</span>
          <h2 className="section-title mt-5">Une question, une idée, un partenariat ?</h2>
          <p className="section-subtitle mx-auto">
            Une suggestion, un témoignage à partager ou l'envie de soutenir LILMOD ?
            Écrivez-nous, nous vous répondrons rapidement.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Contact Form */}
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 shadow-sm md:p-8">
            <h3 className="text-lg md:text-xl font-display font-bold text-primary-800 mb-4 md:mb-6 flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-accent-500" />
              Envoyez-nous un message
            </h3>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-5" noValidate>
              {/* Honeypot field - hidden from users */}
              <input
                type="text"
                {...register('_gotcha')}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">
                    Nom complet *
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register('name')}
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby={errors.name ? 'name-error' : undefined}
                    autoComplete="name"
                    className={`w-full px-4 py-2.5 md:py-3 rounded-lg border bg-white ${
                      errors.name ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:ring-accent-500'
                    } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="Votre nom"
                    disabled={status === 'submitting'}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    autoComplete="email"
                    className={`w-full px-4 py-2.5 md:py-3 rounded-lg border bg-white ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:ring-accent-500'
                    } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                    placeholder="votre@email.com"
                    disabled={status === 'submitting'}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">
                  Sujet *
                </label>
                <input
                  id="subject"
                  type="text"
                  {...register('subject')}
                    aria-invalid={errors.subject ? 'true' : 'false'}
                    aria-describedby={errors.subject ? 'subject-error' : undefined}
                    autoComplete="off"
                  className={`w-full px-4 py-2.5 md:py-3 rounded-lg border bg-white ${
                    errors.subject ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:ring-accent-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder="Sujet de votre message"
                  disabled={status === 'submitting'}
                />
                {errors.subject && (
                  <p id="subject-error" className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-1.5 md:mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  {...register('message')}
                    aria-invalid={errors.message ? 'true' : 'false'}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  rows={4}
                  className={`w-full px-4 py-2.5 md:py-3 rounded-lg border bg-white resize-none ${
                    errors.message ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200 focus:ring-accent-500'
                  } focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                  placeholder="Votre message..."
                  disabled={status === 'submitting'}
                />
                {errors.message && (
                  <p id="message-error" className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full flex items-center justify-center gap-3 py-3.5 md:py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  status === 'submitting'
                    ? 'bg-neutral-300 cursor-not-allowed'
                    : 'bg-primary-500 hover:bg-primary-600 text-white hover:shadow-blue-lg hover:-translate-y-1'
                }`}
              >
                {status === 'submitting' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer le message
                  </>
                )}
              </button>

              {/* Status Messages */}
              <div aria-live="polite" role="status">
              {status === 'success' && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-green-700">
                    Merci ! Votre message a bien été envoyé, nous vous répondrons rapidement.
                  </p>
                </div>
              )}

              {status === 'error' && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700">
                    Une erreur est survenue. Veuillez réessayer ou nous écrire directement à{' '}
                    <a href={`mailto:${SITE_CONFIG.email}`} className="font-semibold underline">{SITE_CONFIG.email}</a>.
                  </p>
                </div>
              )}
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 md:space-y-6">
            {/* Contact Cards */}
            <div className="bg-white rounded-2xl shadow-sm p-5 md:p-6 border border-neutral-200">
              <h3 className="text-base md:text-lg font-display font-bold text-primary-800 mb-3 md:mb-6">
                Informations de contact
              </h3>

              <div className="space-y-2 md:space-y-5">
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-neutral-50 rounded-xl hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 md:w-6 md:h-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-medium text-neutral-800 group-hover:text-primary-600 transition-colors">
                      Email
                    </div>
                    <div className="text-sm md:text-base text-primary-500 break-all">{SITE_CONFIG.email}</div>
                  </div>
                </a>

                <a
                  href={`tel:${SITE_CONFIG.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-neutral-50 rounded-xl hover:bg-primary-50 transition-colors group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-medium text-neutral-800 group-hover:text-primary-600 transition-colors">
                      Téléphone
                    </div>
                    <div className="text-sm md:text-base text-neutral-600">{SITE_CONFIG.phone}</div>
                  </div>
                </a>

                <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-neutral-50 rounded-xl">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-sm md:text-base font-medium text-neutral-800">Adresse</div>
                    <div className="text-sm md:text-base text-neutral-600">{SITE_CONFIG.address}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp Community Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 md:p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2 md:mb-4">
                <Users className="w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
                <h3 className="text-lg md:text-xl font-display font-bold text-white">
                  Rejoignez notre communauté
                </h3>
              </div>
              <p className="mb-4 md:mb-6 text-sm md:text-base text-green-50">
                Recevez nos actualités et le programme des prochains cours directement sur WhatsApp.
              </p>
              <a
                href={SOCIAL_LINKS.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 w-full py-3 px-6 bg-white text-green-600 font-semibold rounded-xl hover:bg-green-50 transition-colors"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="sm:hidden">Rejoindre sur WhatsApp</span>
                <span className="hidden sm:inline">Rejoindre le groupe WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
