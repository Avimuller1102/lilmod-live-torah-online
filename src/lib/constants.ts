/**
 * LILMOD - Application Constants
 * 
 * Central configuration for all static content, links, and settings.
 * Makes it easy to update content without touching components.
 */

// =============================================================================
// SITE CONFIGURATION
// =============================================================================

export const SITE_CONFIG = {
  name: "LILMOD",
  tagline: "Cours de Torah en Direct depuis Israël",
  description: "LILMOD by Torah Mitzion diffuse en LIVE depuis 2015 des cours de Torah en français. Rejoignez des milliers d'étudiants dans le monde.",
  email: "aaronbotbol@gmail.com",
  phone: "+972 585766985",
  address: "54 King Georges Street, Jerusalem, Israel",
  foundedYear: 2015,
} as const;

// =============================================================================
// SOCIAL LINKS
// =============================================================================

export const SOCIAL_LINKS = {
  youtube: "https://www.youtube.com/@Lilmodfr",
  instagram: "https://www.instagram.com/lilmod_fr",
  spotify: "https://open.spotify.com/show/5oJ8bkMtw0hR1iRxomrSRR",
  linktree: "https://linktr.ee/lilmod.torahmitzion",
  whatsapp: "https://chat.whatsapp.com/KR5PN77WbfvDb4zFgBu3Cl",
  newsletter: "https://mailchi.mp/4fbd1394a7fd/inscription-feed-lilmod",
  donate: "https://www.jgive.com/new/en/ils/donation-targets/166202",
} as const;

// =============================================================================
// IMAGES (optimisées en WebP dans /public/images)
// =============================================================================

export const IMAGES = {
  // Logos
  logo: "/images/logo-lilmod.webp",
  torahMitzionLogo: "/images/torah-mitzion-logo.webp",

  // Speakers
  speakers: {
    akerman: "/images/speakers/akerman.webp",
    assaf: "/images/speakers/assaf.webp",
    benIchay: "/images/speakers/ben-ichay.webp",
    benShoushan: "/images/speakers/ben-shoushan.webp",
    botshko: "/images/speakers/botshko.webp",
    chouraqui: "/images/speakers/chouraqui.webp",
    fizson: "/images/speakers/fizson.webp",
    spira: "/images/speakers/spira.webp",
    kling: "/images/speakers/kling.webp",
    ouziel: "/images/speakers/ouziel.webp",
  },

  // Partners
  partners: {
    manitou: "/images/partners/manitou.webp",
    houg: "/images/partners/houg.webp",
    emounaChelema: "/images/partners/emouna-chelema.webp",
  },
} as const;

// =============================================================================
// SPEAKERS DATA
// =============================================================================

export const SPEAKERS = [
  {
    id: 1,
    name: "Rav Akerman",
    searchQuery: "Akerman",
    image: IMAGES.speakers.akerman,
    specialty: "Kol HaTor et éthique de la guerre",
    bio: "Le Rav Menahem Akerman enseigne à l'institut « Machon Lev » et sur LILMOD. Expert reconnu en philosophie juive et éthique de guerre.",
  },
  {
    id: 2,
    name: "Ariel Assaf",
    searchQuery: "Ariel Assaf",
    image: IMAGES.speakers.assaf,
    specialty: "Histoire juive",
    bio: "Ariel Assaf est spécialisé dans l'histoire juive contemporaine et les relations entre Israël et la diaspora.",
  },
  {
    id: 3,
    name: "Rav Ben Ichay",
    searchQuery: "Ben Ichay",
    image: IMAGES.speakers.benIchay,
    specialty: "Paracha de la semaine",
    bio: "Le Rav Ben Ichay est connu pour ses analyses profondes et pertinentes de la paracha de la semaine.",
  },
  {
    id: 4,
    name: "Rav Ben Shoushan",
    searchQuery: "Benshoushan",
    image: IMAGES.speakers.benShoushan,
    specialty: "Études du Rav Kook",
    bio: "Le Rav Yossef Ben-Shoushan est un spécialiste des écrits du Rav Kook et de sa philosophie.",
  },
  {
    id: 5,
    name: "Rav Botshko",
    searchQuery: "Botschko",
    image: IMAGES.speakers.botshko,
    specialty: "Philosophie juive",
    bio: "Le Rav Botshko est l'un des piliers de l'enseignement de la Torah en français en Israël.",
  },
  {
    id: 6,
    name: "Rav Chouraqui",
    searchQuery: "Chouraqui",
    image: IMAGES.speakers.chouraqui,
    specialty: "Talmud",
    bio: "Le Rav Chouraqui est un expert du Talmud et de son application dans la vie contemporaine.",
  },
  {
    id: 7,
    name: "Rav Fizson",
    searchQuery: "Fizson",
    image: IMAGES.speakers.fizson,
    specialty: "Étude des textes",
    bio: "Le Rav Fizson se distingue par sa maîtrise des textes et son approche pédagogique.",
  },
  {
    id: 8,
    name: "Georges Spira",
    searchQuery: "Spira",
    image: IMAGES.speakers.spira,
    specialty: "Philosophie et pensée juive",
    bio: "Georges Spira partage sa profonde connaissance de la philosophie juive et son application dans la vie moderne.",
  },
  {
    id: 9,
    name: "Rav Kling",
    searchQuery: "Kling",
    image: IMAGES.speakers.kling,
    specialty: "Paracha et enseignement",
    bio: "Le Rav Elie Kling offre des analyses profondes et accessibles sur la paracha et d'autres textes fondamentaux.",
  },
  {
    id: 10,
    name: "Rav Shlomo Ouziel",
    searchQuery: "Ouziel",
    image: IMAGES.speakers.ouziel,
    specialty: "Études talmudiques",
    bio: "Le Rav Shlomo Ouziel est reconnu pour son expertise en études talmudiques et sa pédagogie claire.",
  },
] as const;

// =============================================================================
// TÉMOIGNAGES D'ALYA
// =============================================================================

export const TESTIMONIALS = [
  {
    id: 1,
    name: "Catherine Benhamou",
    age: 48,
    city: "Paris",
    highlight: "C'est moi qui ai dit à mon mari : on part !",
    quote:
      "Pendant 15 ans, mon mari voulait faire son Alya, mais moi, je refusais. Quitter mes habitudes, mes proches, tout recommencer… c'était impensable. En découvrant les cours sur LILMOD, mon regard sur Israël a complètement changé. J'ai réalisé que ce que je prenais pour un sacrifice pouvait être une immense chance. Finalement, c'est moi qui ai dit à mon mari : on part !",
  },
  {
    id: 2,
    name: "Michaël Haddad",
    age: 32,
    city: "Marseille",
    highlight: "Je suis revenu en Israël avec une tout autre force intérieure.",
    quote:
      "J'avais déjà tenté mon Alya à 25 ans, mais au bout de six mois, j'étais rentré en France. Je pensais avoir raté ma chance. Des années plus tard, les cours sur LILMOD m'ont redonné confiance. J'ai compris que les difficultés ne devaient pas me faire abandonner mon rêve. Cette fois, je suis revenu en Israël avec une tout autre force intérieure.",
  },
  {
    id: 3,
    name: "Esther Dahan",
    age: 61,
    city: "Strasbourg",
    highlight: "Un jour, j'ai pris mon billet sans même leur dire.",
    quote:
      "À mon âge, je pensais qu'il était trop tard pour tout recommencer. Mes enfants vivaient déjà en Israël, mais je n'osais pas les rejoindre. En suivant les cours sur LILMOD, j'ai retrouvé un élan que je croyais perdu. Un jour, j'ai pris mon billet sans même leur dire. Quand je leur ai annoncé que je venais m'installer définitivement, ils n'en revenaient pas !",
  },
] as const;

// =============================================================================
// PARTNERS DATA
// =============================================================================

export const PARTNERS = [
  {
    id: 1,
    name: "Midreshet Yeouda-Manitou",
    logo: IMAGES.partners.manitou,
    url: "#",
  },
  {
    id: 2,
    name: "HOUG",
    logo: IMAGES.partners.houg,
    url: "#",
  },
] as const;

// =============================================================================
// FORMSPREE CONFIGURATION
// =============================================================================

/**
 * Formspree Form ID
 * 
 * To set this up:
 * 1. Go to https://formspree.io and create a free account
 * 2. Create a new form
 * 3. Add your email addresses: avimuller1102@gmail.com and aaronbotbol@gmail.com
 * 4. Copy the form ID (e.g., "xyzabcde")
 * 5. Replace the placeholder below OR set VITE_FORMSPREE_ID in your .env file
 */
export const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID || "maqblbkg";

// Formspree endpoint
export const FORMSPREE_ENDPOINT = `https://formspree.io/f/${FORMSPREE_ID}`;
