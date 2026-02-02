
import { z } from 'zod';

// Schema de validation pour le formulaire de contact
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Le nom doit contenir au moins 2 caractères" })
    .max(100, { message: "Le nom ne peut pas dépasser 100 caractères" })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { message: "Le nom ne peut contenir que des lettres, espaces et tirets" }),
  email: z
    .string()
    .trim()
    .email({ message: "Adresse email invalide" })
    .max(255, { message: "L'email ne peut pas dépasser 255 caractères" }),
  subject: z
    .string()
    .trim()
    .min(3, { message: "Le sujet doit contenir au moins 3 caractères" })
    .max(200, { message: "Le sujet ne peut pas dépasser 200 caractères" }),
  message: z
    .string()
    .trim()
    .min(10, { message: "Le message doit contenir au moins 10 caractères" })
    .max(2000, { message: "Le message ne peut pas dépasser 2000 caractères" })
});

// Schema de validation pour la newsletter
export const newsletterSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Adresse email invalide" })
    .max(255, { message: "L'email ne peut pas dépasser 255 caractères" }),
  consent: z
    .boolean()
    .refine(val => val === true, { message: "Vous devez accepter de recevoir la newsletter" })
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type NewsletterFormData = z.infer<typeof newsletterSchema>;
