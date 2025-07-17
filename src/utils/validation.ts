/**
 * Utilities for input validation and sanitization
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeInput = (input: string): string => {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .trim()
    .substring(0, 1000); // Limit length
};

export const validateContactForm = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data.name || data.name.length < 2) {
    errors.push('Le nom doit contenir au moins 2 caractères');
  }

  if (!data.email || !validateEmail(data.email)) {
    errors.push('Adresse email invalide');
  }

  if (!data.subject || data.subject.length < 3) {
    errors.push('Le sujet doit contenir au moins 3 caractères');
  }

  if (!data.message || data.message.length < 10) {
    errors.push('Le message doit contenir au moins 10 caractères');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};