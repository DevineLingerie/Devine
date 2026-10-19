# Direction artistique

## Intention

Le site dialogue avec la boutique réelle : bois clair des placards et du comptoir, lignes courbes, plafond sombre, rails d'éclairage, vitrines sur la rue. L'expérience doit être élégante, chaleureuse et un peu complice, sans clichés de lingerie : pas de rose omniprésent, pas de silhouettes, pas de cœurs ni de noir et or.

## Palette

Toutes les couleurs sont définies une seule fois dans `src/app/globals.css` (`@theme`) et utilisées sous forme de classes Tailwind (`bg-sable`, `text-nuit`…). Direction lumineuse et chaleureuse, inspirée des sites de lingerie accessibles, ancrée dans les matières de la boutique.

| Nom (jeton) | Valeur | Rôle |
| --- | --- | --- |
| Lin (`lin`) | `#ffffff` | fond général |
| Sable (`sable`) | `#f8eee7` | grands aplats chaleureux, en-têtes de page |
| Nude (`nude`) | `#ecd3c3` | ton peau et tissu : bandeau d'invitation, sélection de texte |
| Bois (`bois`, `bois-fonce`) | `#c99d6e`, `#7a5532` | bois blond des placards : détails, chiffres |
| Sauge (`sauge`, `sauge-pale`) | `#3d5845`, `#e5eee7` | touche végétale : sur-titres, bandeau du haut, univers homme |
| Prune (`argile`) | `#6b2d5c` | accent : liens, mots en italique, focus, survol des boutons |
| Nuit (`nuit`) | `#1a1f22` | texte, boutons principaux, pied de page |

Contrastes vérifiés (WCAG AA) : nuit/lin 16,3:1 · encre/lin 7,1:1 · sauge/lin 7,7:1 · prune/lin 9,5:1 · bois foncé/lin 6,5:1. Le contrôle axe-core des tests de bout en bout le vérifie à chaque build.

Si une charte graphique validée arrive, il suffit de remplacer ces valeurs : aucun composant ne contient de couleur en dur.

## Typographie

- **Hanken Grotesk** (titres en gras, texte, boutons, formulaires) : sans-serif franche, moderne et accessible, dans l'esprit des marques de lingerie « bien dans son corps ».
- **Instrument Serif** italique : uniquement pour les touches éditoriales (fin du titre d'accueil, mot mis en valeur avec `<em>`, citation, « 1912 », sceau, noms de marques).

Les deux polices sont sous licence SIL Open Font License (usage commercial libre) et auto-hébergées par `next/font` : aucune requête vers Google côté visiteur.

## Éléments graphiques

- **Mot-symbole** : « devine. » en très grand en tête de l'accueil, l'élément mémorable de la page ; tout le reste reste sobre (pas de capitales espacées, pas de flèches décoratives).
- **Cadres photo** (`components/site/PhotoFrame.tsx`) : affichent, par ordre de priorité, la photo ajoutée dans l'administration, une photo d'illustration provisoire déclarée dans `src/content/photos.ts` (avec crédit, affiché dans les mentions légales), sinon l'illustration Vitrine.
- **Vitrine** (`src/components/brand/Vitrine.tsx`) : illustration originale, non photographique. La boutique vue comme une vitrine en arche : plafond sombre, rail d'éclairage et ses faisceaux, comptoir courbe en bois, trame de tulle. Elle tient la place des photos ; une photo ajoutée dans l'administration la remplace dans le même cadre en arche.
- **Sceau** (`Sceau.tsx`) : médaillon circulaire « Lingerie · depuis 1912 · femme & homme ».
- **Trame de tulle** (classe `.tulle`) : texture hexagonale très légère, propre à la lingerie, sur les grands aplats.
- **Logotype provisoire** : « devine. » en minuscules grasses avec un point prune, signature en petites capitales.
- **Outil « Trouvez votre taille »** (`components/site/SizeFinder.tsx`, calcul dans `lib/sizing.ts`) : estimation indicative à partir de deux mesures, calculée dans le navigateur, sans envoi de données.
- **Icônes** (`components/ui/Icon.tsx`) : dessinées pour le site, au trait.
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
