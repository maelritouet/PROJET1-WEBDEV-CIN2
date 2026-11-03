# PROJET1-WEBDEV-CIN2

Application backend TypeScript / Node.js / Express / MongoDB pour la vie associative et la gestion d'événements.

## Fonctionnalités implémentées

- Authentification par session (`register`, `login`, `logout`, `me`)
- CRUD Utilisateurs (admin uniquement)
- CRUD Associations (droits admin + responsable sur sa propre association)
- CRUD Événements (droits admin + responsable sur sa propre association)
- Inscriptions aux événements avec règles métier :
  - interdiction de double inscription
  - respect de la capacité maximale
  - annulation par l'étudiant concerné, un responsable de l'association, ou un admin
- Filtrage/recherche des événements (`categorie`, `associationId`, `q`, `publishedOnly`)

## Lancer le projet

1. Installer les dépendances :
   ```bash
   npm install
   ```
2. Créer votre fichier d'environnement :
   ```bash
   cp .env.example .env
   ```
3. Démarrer en développement :
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` : lancement en mode développement
- `npm run build` : compilation TypeScript
- `npm run start` : démarrage depuis `dist`
- `npm run test` : exécution des tests ciblés

## API principale

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `GET|POST|PUT|DELETE /api/users`
- `GET|POST|PUT|DELETE /api/associations`
- `GET|POST|PUT|DELETE /api/events`
- `GET|POST /api/registrations`
- `PATCH /api/registrations/:id/cancel`
