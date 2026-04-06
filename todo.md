# NKC Night Ultimate - TODO

## Phase 1 : Base de Données et Modèles ✅
- [x] Configurer le schéma Drizzle avec tables : menus, réservations, avis, horaires
- [x] Créer les types TypeScript pour menu (FR/AR), réservations, avis clients
- [x] Générer les migrations SQL
- [ ] Appliquer les migrations SQL à la base de données

## Phase 2 : Backend (tRPC Routers) ✅
- [x] Router menu : getMenuItems (avec filtrage par catégorie)
- [x] Router réservations : createReservation, getReservations, updateReservationStatus
- [x] Router avis : getReviews, createReview, approveReview
- [x] Router horaires : getHours, updateOperatingHours
- [x] Authentification admin avec role-based access control
- [x] Database query helpers pour toutes les entités

## Phase 3 : Frontend - Design Dark Mode Premium ✅
- [x] Configurer Tailwind CSS avec thème Dark Mode (Amber/Slate premium)
- [x] Créer composants avec shadcn/ui : Button, Card, Input, Textarea, Tabs
- [x] Implémenter animations fluides (CSS animations)
- [x] Créer layout responsive mobile-first

## Phase 4 : Pages Frontend ✅
- [x] Page d'accueil : Présentation ambiance nocturne + piscine, CTA réservation
- [x] Page Menu : Affichage multilingue (FR/AR/EN), catégories, images, prix
- [x] Page Réservation : Formulaire date/heure/personnes, confirmation
- [x] Page Avis : Affichage avis clients avec notation
- [x] Page Horaires : Affichage horaires dynamiques intégré à l'accueil
- [x] Contact : Informations WhatsApp et email intégrées
- [x] Dashboard Admin : Gestion réservations, modération avis

## Phase 5 : Fonctionnalités Interactives ✅
- [x] Système de réservation avec validation date/heure
- [x] Gestion des statuts réservation (en attente, confirmée, annulée)
- [x] Système d'avis avec notation par étoiles
- [x] Authentification admin pour dashboard (Manus OAuth)
- [x] Animations et transitions fluides

## Phase 6 : Optimisation et Déploiement
- [ ] Optimisation mobile (responsive, touch-friendly)
- [ ] Tests fonctionnels (réservation, avis, admin)
- [ ] Exécuter migrations SQL pour créer les tables
- [ ] Exécuter seed-db.mjs pour données initiales
- [ ] Déploiement sur Vercel
- [ ] Vérification SEO et performance

## Données à Intégrer
- [x] Menu complet (Pâtes, Desserts, Milkshakes) avec images - prêt dans seed-db.mjs
- [x] Avis clients de test - prêt dans seed-db.mjs
- [x] Horaires d'ouverture (17h-2h semaine, 17h-3h jeudi) - prêt dans seed-db.mjs
- [x] Informations contact (WhatsApp 43207257, email rimoraweb@gmail.com) - intégrées
