/** Validation des données saisies dans l'administration (zod). */
import { z } from 'zod';
import { SUPPORTED_TIMEZONES } from '../../shared/time.js';
import { STATUSES, PLATFORMS } from '../../shared/programme.js';
import { CATEGORIES } from '../../shared/catalog.js';

const text = (max) => z.string().trim().max(max).default('');
const url = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === '' || /^https:\/\/[^\s<>"]+$/i.test(v), { message: 'Lien invalide (https:// obligatoire).' })
  .default('');
const localUrl = z
  .string()
  .trim()
  .max(2000)
  .refine((v) => v === '' || /^https:\/\/[^\s<>"]+$/i.test(v) || /^\/[a-z0-9/_.-]+$/i.test(v), { message: 'Lien d’image invalide.' })
  .default('');
const iso = z.string().refine((v) => !Number.isNaN(Date.parse(v)), { message: 'Date invalide.' });
const id = z.string().trim().max(120).regex(/^[a-zA-Z0-9_-]*$/, 'Identifiant invalide.');
const categoryIds = CATEGORIES.map((c) => c.id);

export const courseSchema = z.object({
  id: id.optional(),
  title: text(200),
  description: text(4000),
  teacherId: id.default(''),
  seriesId: id.default(''),
  category: z.string().refine((v) => v === '' || categoryIds.includes(v), 'Thème inconnu.').default(''),
  start: iso,
  end: iso.or(z.literal('')).default(''),
  timezone: z.enum(SUPPORTED_TIMEZONES).default('Asia/Jerusalem'),
  platform: z.enum(Object.keys(PLATFORMS)).default('zoom'),
  joinUrl: url,
  joinPublic: z.boolean().default(false),
  status: z.enum(Object.keys(STATUSES)).default('draft'),
  visibility: z.enum(['public', 'private']).default('public'),
  thumbnail: localUrl,
  replayUrl: url,
  pdfUrl: url,
  notes: text(4000),
  organizer: text(120),
  recurrenceId: id.default(''),
  occurrenceDate: z.string().max(10).default(''),
});

export const ruleSchema = z.object({
  id: id.optional(),
  title: text(200),
  description: text(4000),
  teacherId: id.default(''),
  seriesId: id.default(''),
  category: z.string().refine((v) => v === '' || categoryIds.includes(v), 'Thème inconnu.').default(''),
  weekdays: z.array(z.number().int().min(0).max(6)).min(1, 'Choisir au moins un jour.'),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Heure invalide (HH:MM).'),
  durationMin: z.number().int().min(10).max(600).default(60),
  timezone: z.enum(SUPPORTED_TIMEZONES).default('Asia/Jerusalem'),
  intervalWeeks: z.number().int().min(1).max(8).default(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).or(z.literal('')).default(''),
  platform: z.enum(Object.keys(PLATFORMS)).default('zoom'),
  joinUrl: url,
  joinPublic: z.boolean().default(false),
  visibility: z.enum(['public', 'private']).default('public'),
  thumbnail: localUrl,
  organizer: text(120),
  active: z.boolean().default(true),
});

export const teacherSchema = z.object({
  id: id.optional(),
  name: text(120).refine((v) => v.length > 1, 'Nom obligatoire.'),
  shortName: text(80),
  photo: localUrl,
  specialty: text(200),
  bio: text(4000),
  aliases: z.array(z.string().trim().max(60)).max(20).default([]),
  hidden: z.boolean().default(false),
});

export const seriesSchema = z.object({
  id: id.optional(),
  title: text(200).refine((v) => v.length > 1, 'Titre obligatoire.'),
  teacherId: id.default(''),
  description: text(4000),
  match: z.array(z.string().trim().max(80)).max(20).default([]),
  playlistId: z.string().trim().max(80).regex(/^[a-zA-Z0-9_-]*$/).default(''),
  hidden: z.boolean().default(false),
});

export const videoPatchSchema = z.object({
  teacherId: id.optional(),
  seriesId: id.optional(),
  categories: z.array(z.string()).max(6).optional(),
  featured: z.boolean().optional(),
  hidden: z.boolean().optional(),
});

export const settingsSchema = z.object({
  whatsappGroupUrl: url,
  newsletterSignupUrl: url,
  donateUrl: url,
  contactEmail: z.string().trim().max(200).default(''),
  mailchimp: z
    .object({
      audienceId: z.string().trim().max(40).default(''),
      fromName: z.string().trim().max(80).default('LILMOD'),
      replyTo: z.string().trim().max(200).default(''),
      dailyTag: z.string().trim().max(80).default(''),
      weeklyTag: z.string().trim().max(80).default(''),
      testEmails: z.array(z.string().trim().email()).max(5).default([]),
    })
    .default({}),
  daily: z
    .object({
      prepareHour: z.number().int().min(0).max(23).default(7),
      sendTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).default('08:00'),
      autoSend: z.boolean().default(false),
    })
    .default({}),
  weekly: z
    .object({
      sendDay: z.number().int().min(0).max(6).default(0),
      sendTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/).default('09:00'),
      title: z.string().trim().max(160).default('Programme de la semaine LILMOD et Midreshet Yehouda-Manitou'),
      posters: z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), localUrl).default({}),
    })
    .default({}),
  liveSendingEnabled: z.boolean().default(false),
});

export function parse(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const message = result.error.issues.map((i) => `${i.path.join('.') || 'donnée'} : ${i.message}`).join(' ; ');
    throw Object.assign(new Error(message), { status: 400 });
  }
  return result.data;
}
