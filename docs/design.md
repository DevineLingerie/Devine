# Direction artistique

## Intention

Le site dialogue avec la boutique réelle : bois clair des placards et du comptoir, lignes courbes, plafond sombre, rails d'éclairage, vitrines sur la rue. L'expérience doit être élégante, chaleureuse et un peu complice, sans clichés de lingerie : pas de rose omniprésent, pas de silhouettes, pas de cœurs ni de noir et or.

## Palette

Toutes les couleurs sont définies une seule fois dans `src/app/globals.css` (`@theme`) et utilisées sous forme de classes Tailwind (`bg-lin`, `text-nuit`…).

| Nom | Valeur | Rôle |
| --- | --- | --- |
| Lin | `#f7f2ea` | fond général, chaud |
| Sable | `#ede3d3` | surfaces, cartes |
| Bois | `#c9a57e` | bois blond des placards (décor uniquement sur fond clair) |
| Bois foncé | `#7a5634` | chiffres, détails éditoriaux |
| Nuit | `#1e2427` | texte, plafond : pied de page, bandeaux d'invitation |
| Encre | `#4a5054` | texte secondaire |
| Sauge | `#4e5d48` | touche végétale (sur-titres) ; sauge pâle `#dfe5d7` pour les fonds de section |
| Argile | `#a44a2a` | accent : boutons, liens, focus |

Contrastes vérifiés (WCAG AA) : nuit/lin 14,1:1 · encre/lin 7,3:1 · sauge/lin 6,3:1 · argile/lin 5,3:1 · texte lin sur argile 5,3:1. Le contrôle axe-core des tests de bout en bout le vérifie à chaque build.

Si une charte graphique validée arrive, il suffit de remplacer ces valeurs : aucun composant ne contient de couleur en dur.

## Typographie

- **Fraunces** (titres) : serif aux courbes douces, avec un axe « SOFT » qui rappelle les formes organiques du lieu ; l'italique sert aux détails éditoriaux (signature, citations).
- **Instrument Sans** (texte, boutons, formulaires) : sans-serif lisible et contemporaine.

Les deux polices sont sous licence SIL Open Font License (usage commercial libre) et auto-hébergées par `next/font` : aucune requête vers Google côté visiteur.

La calligraphie est réservée à un trait unique (`Trait`), sous le logotype et en séparateur : elle ne touche jamais aux textes ni aux boutons.

## Éléments graphiques

- **Arche** (`src/components/brand/Arche.tsx`) : illustration originale, non photographique. Elle reprend les courbes du lieu, le bois clair, le rail d'éclairage et une courbe de comptoir, avec des formes organiques en galets. Elle tient la place des photos ; une photo ajoutée dans l'administration la remplace et s'affiche dans le même cadre en arche.
- **Logotype provisoire** : « DEVINE » en capitales espacées et un trait calligraphique.
- **Animations** : une simple apparition au défilement, uniquement si le navigateur la gère et si l'utilisateur n'a pas demandé à réduire les animations. Le contenu reste lisible à tout moment.

## Composants

| Composant | Fichier |
| --- | --- |
| Boutons (principal, secondaire, sur fond sombre) | `components/ui/Button.tsx` |
| Conteneur, titres de section, texte riche, étapes | `components/ui/*` |
| En-tête, menu mobile, pied de page, lien d'évitement | `components/layout/*` |
| En-tête de page, cartes d'univers, marques, services, FAQ, bandeau d'invitation, infos pratiques | `components/site/*` |
| Formulaire de contact | `components/contact/ContactForm.tsx` |

## Ton éditorial

Simple, chaleureux, complice, rassurant, jamais culpabilisant. On parle de confort, de maintien, de plaisir et de confiance en soi. Les appels à l'action invitent à venir en boutique : « Préparer ma visite », « Trouver ce qui vous va », « Découvrir la lingerie homme ».
