# 🕎 LILMOD.fr - Cours de Torah en Direct depuis Israël

![LILMOD Banner](/public/lovable-uploads/ef1966f8-ad71-4e6c-ac5f-613ab18d578c.png)

> **LILMOD** est une plateforme à but non lucratif qui diffuse en live des cours de Torah en français depuis 2015. Notre mission : rendre accessible un enseignement juif authentique et pertinent.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)

---

## ✨ Fonctionnalités

- 🎥 **Cours en Direct** - Plus de 10 sessions live par semaine avec Q&A
- 📺 **Vidéothèque** - Plus de 2500 cours disponibles sur YouTube
- 🎧 **Podcasts** - Écoutez nos cours sur Spotify
- 👨‍🏫 **Enseignants Experts** - Une équipe de Rabbanim reconnus
- 📧 **Newsletter** - Restez informé du programme hebdomadaire
- 💬 **Contact** - Formulaire de contact fonctionnel

## 🚀 Démarrage Rapide

### Prérequis

- [Node.js](https://nodejs.org/) version 18 ou supérieure
- npm, yarn, ou pnpm

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd lilmod-live-torah-online

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur [http://localhost:3000](http://localhost:3000)

### Configuration du Formulaire de Contact

Le formulaire de contact utilise [Formspree](https://formspree.io) pour envoyer les emails.

1. Créez un compte gratuit sur [formspree.io](https://formspree.io)
2. Créez un nouveau formulaire
3. Ajoutez les emails destinataires :
   - `avimuller1102@gmail.com`
   - `aaronbotbol@gmail.com`
4. Copiez l'ID du formulaire depuis l'URL (ex: `xyzabcde`)
5. Créez un fichier `.env.local` :

```env
VITE_FORMSPREE_ID=votre_id_formspree
```

## 📦 Scripts Disponibles

| Commande          | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Lance le serveur de développement    |
| `npm run build`   | Compile le projet pour la production |
| `npm run preview` | Prévisualise le build de production  |
| `npm run lint`    | Vérifie le code avec ESLint          |

## 🎨 Design System

### Typographie

| Rôle       | Police             | Usage                  |
| ---------- | ------------------ | ---------------------- |
| **Titres** | Playfair Display   | Headings, display text |
| **Corps**  | Source Sans 3      | Paragraphes, UI        |
| **Accent** | Cormorant Garamond | Citations, highlights  |

### Palette de Couleurs - "Jerusalem Gold"

- **Primary** : Bleu profond (#2D5DA9) - Torah, sagesse, confiance
- **Accent** : Or de Jérusalem (#C4A963) - Spiritualité, chaleur
- **Navy** : Bleu marine (#1A365D) - Fonds sombres

## 🏗️ Structure du Projet

```
src/
├── components/           # Composants React
│   ├── Navbar.tsx       # Navigation responsive
│   ├── HeroSection.tsx  # Section héro animée
│   ├── About.tsx        # Section à propos
│   ├── VideoGallery.tsx # Galerie vidéo YouTube
│   ├── AudioLibrary.tsx # Section podcast Spotify
│   ├── Speakers.tsx     # Grille des intervenants
│   ├── Newsletter.tsx   # Inscription newsletter
│   ├── Support.tsx      # Section donation
│   ├── Contact.tsx      # Formulaire de contact
│   └── Footer.tsx       # Pied de page
├── lib/
│   ├── constants.ts     # Configuration centralisée
│   └── utils.ts         # Utilitaires (cn, etc.)
├── App.tsx              # Composant racine
├── main.tsx             # Point d'entrée
└── index.css            # Design system CSS
```

## 🚢 Déploiement

### Vercel (Recommandé)

1. Connectez votre repo GitHub à [Vercel](https://vercel.com)
2. Ajoutez la variable d'environnement `VITE_FORMSPREE_ID`
3. Déployez !

```bash
# Ou via CLI
npm i -g vercel
vercel
```

### Netlify

1. Connectez votre repo à [Netlify](https://netlify.com)
2. Build command : `npm run build`
3. Publish directory : `dist`
4. Ajoutez les variables d'environnement

### Serveur Traditionnel

```bash
# Compiler le projet
npm run build

# Le dossier `dist/` contient le site statique
# Uploadez-le sur votre hébergeur
```

## 🔒 Sécurité

Le site implémente plusieurs mesures de sécurité :

| Mesure              | Description                                             |
| ------------------- | ------------------------------------------------------- |
| **XSS Protection**  | Pas d'utilisation de dangerouslySetInnerHTML            |
| **Validation**      | Validation des formulaires avec Zod                     |
| **Spam Protection** | Champ honeypot dans le formulaire                       |
| **External Links**  | `rel="noopener noreferrer"` sur tous les liens externes |
| **CSP Headers**     | Meta tags de sécurité dans index.html                   |

## ♿ Accessibilité

- Skip link pour la navigation au clavier
- Labels ARIA sur tous les éléments interactifs
- Contraste des couleurs WCAG AA
- Focus visible sur tous les éléments focusables
- Structure sémantique HTML5

## 📱 Responsive Design

Le site est entièrement responsive avec des breakpoints :

- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

## 🛠️ Technologies Utilisées

- **React 18** - Bibliothèque UI
- **TypeScript 5** - Typage statique
- **Vite 5** - Build tool
- **Tailwind CSS 3** - Framework CSS utility-first
- **Radix UI** - Composants accessibles
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation des schémas
- **Lucide React** - Icônes

## 📄 Licence

Ce projet est sous licence MIT.

## 🤝 Contact

- **Email** : aaronbotbol@gmail.com
- **Téléphone** : +972 585766985
- **Adresse** : 54 King Georges Street, Jérusalem, Israël

---

Fait avec ❤️ depuis Jérusalem 🇮🇱

**LILMOD by Torah Mitzion**
