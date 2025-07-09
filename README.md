# Frontend - BELDIZ 🍔

Interface utilisateur du projet BELDIZ : application de gestion de restaurant rapide avec visualisation du menu, commande en ligne, compte client et back-office administrateur.

---

## Fonctionnalités

- Client :
  - Navigation par catégories de produits
  - Ajout au panier avec modificateurs (options, sauces, suppléments)
  - Paiement en ligne via Stripe (mode test)
  - Historique des commandes
  - Gestion du compte utilisateur
  - Interface responsive et accessible

- Back-office admin :
  - CRUD complet sur :
    - Catégories de produits
    - Produits (avec image et modificateurs)
    - Modificateurs
  - Suivi et mise à jour du statut des commandes en temps réel


- Sécurité :
  - Authentification JWT
  - Routes protégées pour l'administration

---

## Technologies utilisées

- React + Vite
- SCSS (design responsive + thème personnalisé)
- React Router (navigation)
- Axios (requêtes API)
- Context API (authentification, panier, données)
- Stripe (paiement en ligne)
- Déploiement :  
  - Front : [Netlify](https://zidleb.netlify.app/)  
  - Back : [Railway](https://projetback-production-d8bd.up.railway.app)

---

## Installation locale



git clone https://github.com/ton-compte/projet_front
npm install
Créer un fichier .env à la racine en suivant le .env.exemple
npm run dev

## Structure du projet
src/

components/ → composants généraux (boutons, cartes, modales…)

pages/ → pages (Menu, Commander, Profil, Admin…)

context/ → Auth, Panier, Produits, etc.

styles/ → SCSS global + pages

utils/ → routes protégées

## Remarques
Stripe fonctionne uniquement en mode test
En cas de problème d’accès direct aux routes (ex: /admin), un fichier _redirects est présent dans public/
Les images sont servies depuis le backend Railway

