# Avant la mise en ligne

Ce qu'il reste à fournir, à décider ou à vérifier. Rien de ce qui suit n'a été inventé dans le site : ces éléments restent vides ou non publiés tant qu'ils ne sont pas confirmés.

## Informations à fournir (dans l'administration)

- [ ] Adresse complète de la boutique, et coordonnées GPS (latitude, longitude)
- [ ] Téléphone, et e-mail public si vous souhaitez en afficher un
- [ ] Horaires d'ouverture, et précisions éventuelles (fermetures, horaires d'été)
- [ ] Informations d'accès (stationnement, transports)
- [ ] Réseaux sociaux réellement actifs
- [ ] Mentions légales : dénomination, forme juridique, capital, SIRET, RCS, n° de TVA, siège, responsable de la publication
- [ ] Hébergeur du site (nom, adresse, contact), une fois l'hébergement choisi
- [ ] Descriptions des marques (laissées vides), et confirmation que la liste est complète
- [ ] Logos des marques : uniquement si chaque marque en autorise l'usage
- [ ] Service « Commandes particulières » : à publier seulement s'il est confirmé

## Contenus à valider

- [ ] **Relire tous les textes** proposés (pages, services, questions fréquentes), en particulier :
  - la page **Histoire** : elle parle d'un commerce né en 1912 et repris par DEVINE, sans aucun nom, date ni événement. Ajoutez les faits vérifiés dont vous disposez ;
  - l'accueil, qui évoque le bois clair, les lignes courbes et le comptoir de la boutique ;
  - la mention « aucune obligation d'achat » (page Conseil et FAQ).
- [ ] Signature **« Lingerie depuis 1912 »** : confirmer son usage.
- [ ] **Photos de la boutique** : à ajouter dans **Images**, puis à associer aux pages. Les arches illustrées actuelles sont des visuels provisoires, pas des photos.
- [ ] **Logo** : le logotype actuel (nom en capitales et trait calligraphique) est provisoire. À remplacer par le logo définitif s'il existe.
- [ ] **Politique de confidentialité** : à faire relire. Elle annonce une conservation des demandes de 12 mois, des prestataires d'hébergement (à nommer si vous le souhaitez) et l'absence de cookies de suivi.

## Décisions techniques

- [ ] **Hébergement** : offre Hostinger compatible Node.js (Business ou Cloud) ou Vercel. Voir [deploiement.md](deploiement.md)
- [ ] **Nom de domaine** exact (extension : .fr, .com…) pour `NEXT_PUBLIC_SITE_URL`
- [ ] **Projet Supabase** de production : à créer (région UE), migrations à appliquer, inscriptions publiques désactivées
- [ ] Premier compte administrateur
- [ ] Modèle d'e-mail de réinitialisation du mot de passe ([administration.md](administration.md#réinitialisation-du-mot-de-passe))
- [ ] Purge automatique des demandes de plus de 12 mois ([base-de-donnees.md](base-de-donnees.md#purge-des-demandes-de-contact))
- [ ] Sauvegarde régulière de la base

## Vérifications le jour J

- [ ] `npm run check`, `npm run test:db` et `npm run test:e2e` au vert (CI GitHub)
- [ ] Toutes les pages en HTTPS, sans erreur, sur téléphone et sur ordinateur
- [ ] Demande de test via le formulaire, reçue dans l'administration
- [ ] Connexion à l'administration ; refus d'accès vérifié avec un compte non autorisé
- [ ] Search Console : sitemap soumis ; Google Business Profile : lien vers le site

## Ce qui n'est pas dans cette première version

Prévu pour plus tard si vous le souhaitez, et non développé sans votre accord : panier, paiement, commandes en ligne, comptes clients, stock en temps réel, catalogue complet, livraison, lien avec le logiciel de caisse, newsletter (qui demanderait un consentement spécifique), prise de rendez-vous en ligne.
