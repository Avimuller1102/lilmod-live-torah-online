# LILMOD — documentation technique

## Architecture

```
Administration (/admin, React)
        │  API protégée /api/admin/*  (netlify/functions/admin.js)
        ▼
Base unique : Netlify Blobs (store « lilmod »)
  courses · rules · teachers · series · videos · settings · communications · logs · users · trash
        │
        ├─► Site public (React)  ← API publique /api/v1/*  (netlify/functions/api.js)
        ├─► Pages pré-remplies pour Google / WhatsApp  (netlify/edge-functions/seo.js)
        ├─► Sitemap dynamique  (netlify/functions/sitemap.js)
        ├─► Newsletter + e-mail du jour  → Mailchimp API  (netlify/lib/comms.js, mailchimp.js)
        ├─► Messages WhatsApp (texte + lien wa.me)  (shared/messages.js)
        ├─► Agendas : .ics et Google Agenda
        └─► Tâche horaire (netlify/functions/scheduled-hourly.js) :
              nouvelles vidéos YouTube, cours terminés, brouillon de l'e-mail du jour
```

- **Front** : React 18 + Vite + Tailwind, routage `react-router-dom`, pages chargées à la demande.
- **Logique partagée** (`shared/`, JavaScript pur, utilisée par le site *et* le serveur) :
  `time.js` (fuseaux via `Intl`, aucun décalage codé en dur), `programme.js` (statuts, récurrences,
  duplication, contrôles), `messages.js` (WhatsApp, e-mails, .ics), `catalog.js` (intervenants, thèmes,
  séries, recherche tolérante).
- **Aucun service payant ajouté** : Netlify (Functions, Edge Functions, Blobs, tâches planifiées, Image CDN).

## Variables d'environnement (Netlify → Project configuration → Environment variables)

| Variable | Obligatoire | Rôle |
|---|---|---|
| `ADMIN_PASSWORD` | **oui** (pour /admin) | Mot de passe du compte `admin`. |
| `ADMIN_SECRET` | recommandé | Clé de signature des sessions (chaîne aléatoire longue). À défaut, dérivée de `ADMIN_PASSWORD`. |
| `MAILCHIMP_API_KEY` | non | Clé API Mailchimp (format `xxxx-us21`). Sans elle : aperçu + copie du HTML. |
| `YOUTUBE_API_KEY` | non | Import **complet** de l'archive YouTube (sinon : flux public, 15 dernières vidéos, accumulées chaque heure). Restreindre la clé à l'API YouTube Data v3. |
| `PODCAST_RSS_URL` | non | Déjà renseigné dans le code. |

Aucune clé n'est jamais envoyée au navigateur.

## Statuts d'un cours

`draft` (brouillon, invisible) → `scheduled` (validé, invisible) → `published` (visible) →
`done` / `replay` (automatique après l'horaire) ; `cancelled` (visible comme annulé s'il avait été publié).

## Sécurité

- Session : jeton HMAC (cookie `HttpOnly; Secure; SameSite=Strict`, 12 h), en-tête anti-CSRF `x-lilmod-admin`.
- Mots de passe des comptes équipe : scrypt. Limitation des tentatives de connexion.
- Validation de toutes les saisies (zod) ; liens `https://` uniquement ; aucune injection HTML (React + échappement).
- Liens privés et notes internes jamais renvoyés par l'API publique (testé).
- Envois réels : verrou global `liveSendingEnabled` (administrateur + mot « ACTIVER »), confirmation « ENVOYER »,
  clé d'opération par période (pas de double envoi), rectificatif pour toute correction après envoi.
- `/admin` : `noindex` + `X-Robots-Tag`, `Cache-Control: no-store`.

## WhatsApp : ce qui est possible

- **Groupes / communautés existants** : la plateforme officielle WhatsApp Business (Cloud API) **ne permet pas**
  de publier dans un groupe. Les solutions qui le font pilotent WhatsApp Web (non officielles, risque de blocage) :
  elles ont été volontairement écartées.
- **Solution livrée** : message généré depuis le programme → « Copier » ou « Ouvrir dans WhatsApp » (`wa.me`), historique.
- **Évolution possible** : une **Chaîne WhatsApp** LILMOD (diffusion à sens unique, abonnement volontaire) ou des
  messages 1-à-1 via la Cloud API (modèles approuvés par Meta, opt-in explicite, coût par conversation).
  À décider avant toute mise en place.

## Mailchimp

- Réutilise l'audience existante (identifiant à saisir dans Paramètres) ; aucune liste créée.
- Segmentation par **tag** (ex. `quotidien` pour l'e-mail du jour) : seules les personnes ayant le tag le reçoivent.
  Le consentement à l'e-mail quotidien doit être recueilli via le formulaire Mailchimp (groupe / tag).
- Merge tags `*|UNSUB|*`, `*|UPDATE_PROFILE|*`, `*|LIST:ADDRESSLINE|*` inclus (désinscription réglementaire).

## Tests

```bash
npm test            # 30 tests : fuseaux, récurrences, contrôles, messages, API, sécurité, Mailchimp simulé, SEO
npm run build
npm run test:e2e    # parcours complet dans un navigateur (15 étapes), données temporaires
npm run serve:local # site + API en local : http://localhost:4321 (ADMIN_PASSWORD=… dans l'environnement)
```

## Déploiement

1. Ajouter `ADMIN_PASSWORD` (et `ADMIN_SECRET`) dans Netlify.
2. Fusionner la branche `plateforme` dans `main` → Netlify publie automatiquement.
3. Vérifier : `/programme`, `/cours`, `/admin`, `/sitemap.xml`.

Au premier lancement, la base est vide : intervenants et séries de départ sont repris du code, les vidéos
se remplissent dès la première visite de `/cours` (puis chaque heure).

## Retour arrière

- **Site** : Netlify → Deploys → choisir le déploiement précédent → *Publish deploy* (instantané).
- **Code** : la branche `sauvegarde/avant-plateforme` contient l'état exact d'avant la refonte.
- **Données** : Paramètres → Sauvegardes (export / restauration ; une copie de sécurité est créée avant chaque restauration).
