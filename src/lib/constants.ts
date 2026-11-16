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
  url: "https://lilmod.fr",
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
// NAVIGATION
// =============================================================================

export const NAV_LINKS = [
  { label: "Accueil", href: "#home" },
  { label: "À propos", href: "#about" },
  { label: "Chabbat", href: "#shabbat" },
  { label: "Vidéos", href: "#videos" },
  { label: "Podcasts", href: "#audio" },
  { label: "Intervenants", href: "#speakers" },
  { label: "Soutenir", href: "#support" },
  { label: "Contact", href: "#contact" },
] as const;

// =============================================================================
// IMAGES - Mapping old lovable-uploads to new paths
// =============================================================================

export const IMAGES = {
  // Logo
  logo: "/lovable-uploads/ef1966f8-ad71-4e6c-ac5f-613ab18d578c.png",
  torahMitzionLogo: "/images/torah-mitzion-logo.png",
  
  // Speakers
  speakers: {
    akerman: "/lovable-uploads/89872365-27db-493a-9c07-f347ffe5a202.png",
    assaf: "/lovable-uploads/bd00c9d7-a9ab-4762-99be-29fe1439438c.png",
    benIchay: "/lovable-uploads/f5f960c5-eaca-4956-990a-e4037d7f1148.png",
    benShoushan: "/lovable-uploads/668de8bb-9dbe-4a6e-8bbd-f98d3c261605.png",
    botshko: "/lovable-uploads/fa44d441-126a-4331-b3f7-5a90c18ed46f.png",
    chouraqui: "/lovable-uploads/b73193cd-b448-4576-8e1f-dab9f685f980.png",
    fizson: "/lovable-uploads/aef209f6-b2c9-4b30-82d6-a4993687c5d6.png",
    spira: "/lovable-uploads/6dd77fab-b7e3-43f2-a533-73dd214c2c41.png",
    kling: "/lovable-uploads/f8411b77-2369-405a-9825-d7d22de77d9c.png",
    ouziel: "/lovable-uploads/2a58f0c8-025e-4695-baa4-13b87253fd9e.png",
  },
  
  // Partners
  partners: {
    manitou: "/lovable-uploads/e1be4e3d-09cd-495d-82e1-76efbe37b316.png",
    houg: "/lovable-uploads/dd8e5170-d14c-486b-a439-362798fd70df.png",
  },
  
  // Decorative
  mizrachi: "/lovable-uploads/4e118333-95ae-4a51-98a3-4b23ec809a80.png",
} as const;

// =============================================================================
// SPEAKERS DATA
// =============================================================================

export const SPEAKERS = [
  {
    id: 1,
    name: "Rav Akerman",
    image: IMAGES.speakers.akerman,
    specialty: "Kol Ator et Morale de Guerre",
    bio: "Le Rav Menahem Akerman enseigne à l'institut « Machon Lev » et sur LILMOD. Expert reconnu en philosophie juive et éthique de guerre.",
    youtubePlaylist: SOCIAL_LINKS.youtube + "/playlists",
  },
  {
    id: 2,
    name: "Ariel Assaf",
    image: IMAGES.speakers.assaf,
    specialty: "Histoire juive",
    bio: "Ariel Assaf est spécialisé dans l'histoire juive contemporaine et les relations entre Israël et la diaspora.",
    youtubePlaylist: SOCIAL_LINKS.youtube + "/playlists",
  },
  {
    id: 3,
    name: "Rav Ben Ichay",
    image: IMAGES.speakers.benIchay,
    specialty: "Paracha de la semaine",
    bio: "Le Rav Ben Ichay est connu pour ses analyses profondes et pertinentes de la paracha de la semaine.",
    youtubePlaylist: SOCIAL_LINKS.youtube + "/playlists",
  },
  {
    id: 4,
    name: "Rav Ben Shoushan",
    image: IMAGES.speakers.benShoushan,
    specialty: "Études du Rav Kook",
    bio: "Le Rav Yossef Ben-Shoushan est un spécialiste des écrits du Rav Kook et de sa philosophie.",
    youtubePlaylist: SOCIAL_LINKS.youtube + "/playlists",
  },
  {
    id: 5,
    name: "Rav Botshko",
    image: IMAGES.speakers.botshko,
    specialty: "Philosophie juive",
    bio: "Le Rav Botshko est l'un des piliers de l'enseignement de la Torah en français en Israël.",
    youtubePlaylist: SOCIAL_LINKS.youtube + "/playlists",
  },
  {
    id: 6,
    name: "Rav Chouraqui",
    image: IMAGES.speakers.chouraqui,
    specialty: "Talmud",
    bio: "Le Rav Chouraqui est un expert du Talmud et de son application dans la vie contemporaine.",
    youtubePlaylist: SOCIAL_LINKS.youtube + "/playlists",
  },
  {
    id: 7,
    name: "Rav Fizson",
    image: IMAGES.speakers.fizson,
    specialty: "Étude des textes",
    bio: "Le Rav Fizson se distingue par sa maîtrise des textes et son approche pédagogique.",
    youtubePlaylist: SOCIAL_LINKS.youtube + "/playlists",
  },
  {
    id: 8,
    name: "Georges Spira",
    image: IMAGES.speakers.spira,
    specialty: "Philosophie et pensée juive",
    bio: "Georges Spira partage sa profonde connaissance de la philosophie juive et son application dans la vie moderne.",
    youtubePlaylist: SOCIAL_LINKS.youtube + "/playlists",
  },
  {
    id: 9,
    name: "Rav Kling",
    image: IMAGES.speakers.kling,
    specialty: "Paracha et enseignement",
    bio: "Le Rav Elie Kling offre des analyses profondes et accessibles sur la paracha et d'autres textes fondamentaux.",
    youtubePlaylist: SOCIAL_LINKS.youtube + "/playlists",
  },
  {
    id: 10,
    name: "Rav Shlomo Ouziel",
    image: IMAGES.speakers.ouziel,
    specialty: "Études talmudiques",
    bio: "Le Rav Shlomo Ouziel est reconnu pour son expertise en études talmudiques et sa pédagogie claire.",
    youtubePlaylist: SOCIAL_LINKS.youtube + "/playlists",
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
// STATISTICS
// =============================================================================

export const STATS = [
  { value: "2500+", label: "Cours disponibles" },
  { value: "20+", label: "Intervenants experts" },
  { value: "10k+", label: "Heures d'enseignement" },
  { value: "2015", label: "Depuis" },
] as const;

// =============================================================================
// DONATION OPTIONS
// =============================================================================

export const DONATION_AMOUNTS = [
  { value: "100", label: "100 ₪" },
  { value: "200", label: "200 ₪" },
  { value: "500", label: "500 ₪" },
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
