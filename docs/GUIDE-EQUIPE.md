# Guide de l'équipe LILMOD

Ce guide explique comment préparer et diffuser le programme chaque semaine, **sans développeur**.

Administration : **https://lilmod.fr/admin**

---

## 1. Le principe : une seule saisie

Chaque cours est saisi **une seule fois** dans l'administration. Il alimente automatiquement :

- le site (accueil, page Programme, fiche du cours avec le bouton « Rejoindre le cours ») ;
- la newsletter hebdomadaire et l'e-mail du jour (Mailchimp) ;
- les messages WhatsApp (programme de la semaine, cours du jour) ;
- les liens d'agenda (Google Agenda, fichier .ics).

Une modification d'horaire apparaît sur le site dès qu'elle est enregistrée.

## 2. La semaine type (15 minutes)

| Étape | Où | Quoi |
|---|---|---|
| 1. Préparer | Tableau de bord → **Préparer la semaine suivante** | Les cours habituels sont créés en brouillon. |
| 2. Ajuster | Programme | Cliquez sur un cours pour modifier le titre (ex. la paracha), le lien Zoom, l'enseignant. Ajoutez les cours exceptionnels avec **+ Cours**. |
| 3. Vérifier | Programme → **Vérifier** | Liste des oublis : lien manquant, doublon, horaire incohérent… |
| 4. Publier | Programme → **Publier la semaine** | Les cours deviennent visibles sur le site. |
| 5. Communiquer | **Newsletter de la semaine** / **WhatsApp de la semaine** | Message généré automatiquement : vérifier, puis envoyer. |
| 6. Chaque jour | Tableau de bord → **Message WhatsApp du jour** | Copier ou ouvrir dans WhatsApp, choisir le groupe, envoyer. |
| 7. Après le cours | Tableau de bord → **Replays à compléter** | Coller le lien YouTube du replay. |

> Les **brouillons** ne sont jamais visibles sur le site. Rien n'est publié tant que vous ne cliquez pas sur « Publier la semaine ».

## 3. Les cours récurrents

Menu **Cours récurrents** : décrivez une fois les séances habituelles (ex. « Paracha de la semaine — chaque dimanche à 20h30, heure d'Israël »).

- Périodicité : chaque semaine, toutes les 2, 3 ou 4 semaines ;
- Date de début et, si besoin, de fin ;
- Modifier **une** semaine ne change pas les autres ni la règle.

**Recopier la semaine précédente** (dans Programme) duplique tous les cours de la semaine d'avant, en brouillon.

## 4. Les heures et les fuseaux

- L'heure de référence est **l'heure de France**. Partout (site, e-mails, WhatsApp), l'heure d'Israël est indiquée entre parenthèses : « 17h00 (18h00 Israël) ».
- Saisissez l'heure de France (choix par défaut) ; vous pouvez aussi saisir une heure d'Israël, elle sera convertie.
- Les changements d'heure de chaque pays (qui n'ont pas lieu aux mêmes dates) sont gérés automatiquement.

## 5. Liens Zoom publics ou privés

Dans la fiche d'un cours, la case **« Lien public »** :

- **cochée** : le lien apparaît sur le site, dans les e-mails et sur WhatsApp ;
- **décochée** : le lien n'est **jamais** publié. Les visiteurs voient « Le lien est envoyé aux inscrits ».

## 6. Annuler ou déplacer un cours

- **Annuler** : bouton « Annuler » dans Programme. Le cours reste affiché comme annulé sur le site et disparaît des nouveaux messages.
- Si une newsletter a **déjà été envoyée**, « Vérifier » vous le signale et la page Newsletter propose un **rectificatif**.
- Un cours déjà publié ne peut pas être supprimé (seulement annulé) : c'est volontaire.

## 7. Newsletter (Mailchimp)

Menu **Newsletter** : aperçu de l'e-mail généré à partir des cours publiés.

- **Tant que Mailchimp n'est pas connecté** : « Copier le HTML », puis dans Mailchimp créez une campagne, ajoutez un bloc **Code** et collez.
- **Une fois connecté** : « Créer le brouillon », puis « Envoyer un test » (uniquement vers les adresses de test).
- **Envoi réel** : réservé aux administrateurs, après avoir **autorisé les envois réels** dans Paramètres, et en tapant **ENVOYER**. Un même e-mail ne peut pas partir deux fois.

## 8. WhatsApp

Menu **WhatsApp** : le message est prêt, mis en forme pour WhatsApp.

1. **Ouvrir dans WhatsApp** (ou **Copier le texte**) ;
2. choisir le groupe ou la communauté LILMOD ;
3. vérifier et envoyer.

WhatsApp n'autorise pas les sites à publier automatiquement dans un groupe : l'envoi reste un clic manuel, sans aucun risque de blocage du compte.

## 9. Vidéos, intervenants, séries

- **Vidéos** : les nouvelles vidéos YouTube arrivent toutes seules chaque heure. Vous pouvez corriger l'intervenant ou la série, mettre une vidéo **à la une** ou la masquer.
- **Intervenants** : nom, photo, domaines, présentation. N'écrivez que des informations vérifiées.
- **Séries** : un titre, un enseignant, des mots-clés présents dans les titres des vidéos (ou une playlist YouTube).

## 10. Comptes et sécurité

- Compte principal : identifiant `admin`, mot de passe défini dans Netlify (`ADMIN_PASSWORD`).
- Paramètres → **Comptes de l'équipe** : créer des comptes **éditeur** (programme, messages, tests) ou **administrateur**.
- Paramètres → **Sauvegardes** : téléchargez une sauvegarde chaque mois.
- Les brouillons supprimés vont dans la **corbeille** (restauration possible).
