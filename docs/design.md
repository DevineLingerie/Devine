# Direction artistique

## Intention : « Velours »

La boutique la nuit, vitrine allumée. Le velours bordeaux profond évoque le plafond sombre ; les spots du rail d'éclairage s'allument sur le nom ; les matières (satin, dentelle) remplacent les photos tant qu'elles ne sont pas disponibles. Élégant, sensuel sans être racoleur, et sans clichés : pas de noir et or, pas de rose bonbon, pas de silhouettes.

## Palette

Toutes les couleurs sont définies une seule fois dans `src/app/globals.css` (`@theme`). Les noms de jetons historiques sont conservés pour ne pas toucher aux composants.

| Jeton | Valeur | Rôle |
| --- | --- | --- |
| `nuit` (velours) | `#2a0f1c` | en-tête, grandes sections sombres, texte principal |
| `lin` (crème) | `#fbf5ef` | fond clair, texte sur velours |
| `sable` (chair) | `#f5e3da` | aplats clairs |
| `nude` | `#ebc8ba` | pastilles, détails |
| `argile` (bordeaux) | `#8a2846` | boutons principaux, liens, focus |
| `argile-clair` (pêche) | `#f4b79c` | lumière des spots, accents sur velours |
| `bois` | `#d29a7c` | rail et spots |
| `encre`, `sauge` | `#5e4a52`, `#6e4a55` | textes secondaires |

Contrastes vérifiés (WCAG AA) : velours/crème 16,4:1 · encre/crème 7,5:1 · bordeaux/crème 7,9:1 · pêche/velours 10,2:1. Le contrôle axe-core des tests de bout en bout le vérifie à chaque build.

## Typographie

- **Bodoni Moda** (titres, nom « Devine » en italique) : didone de mode, très contrastée, réglée en optique (axe `opsz`).
- **Hanken Grotesk** (texte, boutons, formulaires) : sans-serif claire et lisible.

Licence SIL Open Font License (usage commercial libre), auto-hébergées par `next/font`.

## Mise en page

Pleine page : sections de bord à bord (`Container size="full"`), accroche et en-têtes de pages en plein écran, en-tête transparent qui devient velours au défilement.

## Mouvement

Règle : tout reste lisible sans JavaScript et avec « réduire les animations » (vérifié par `tests/e2e/mouvement.spec.ts`).

| Effet | Où | Fichier |
| --- | --- | --- |
| Lettres du nom qui se posent, spots qui s'allument | accueil | `components/site/HeroAccueil.tsx` |
| Halo qui suit le pointeur (dérive seul sur mobile) | accroches, invitation finale | `components/motion/Projecteur.tsx` |
| Révélation au défilement (classe `.reveal`, délai `--d`) | tout le site | `components/motion/MotionObserver.tsx` |
| Bandeau défilant (pause au survol) | engagements, marques | `components/motion/Bandeau.tsx` |
| Promesse qui s'éclaire mot à mot | accueil | `components/motion/TexteEclaire.tsx` |
| Étapes en cartes qui s'empilent | accueil | `components/site/EtapesEmpilees.tsx` |
| Parallaxe des visuels, « 1912 » qui grandit | accueil | classes `.parallaxe`, `.grandit` |

Les effets liés au défilement (parallaxe, mot à mot, 1912) utilisent les animations CSS pilotées par le défilement : les navigateurs qui ne les gèrent pas affichent simplement le contenu.

## Éléments graphiques

- **Satin** (`components/brand/Satin.tsx`, classes `.satin-*`) : reflets de tissu avec monogramme brodé, en attendant les photos.
- **Dentelle** (classe `.dentelle`) : semis de petits jours sur le velours. **Lisière** (`Lisiere.tsx`) : festons ajourés entre les sections.
- **Cadres photo** (`components/site/PhotoFrame.tsx`) : photo de l'administration, sinon photo d'illustration créditée (`src/content/photos.ts`), sinon satin.
- **Sceau** (`Sceau.tsx`) : médaillon « Lingerie · depuis 1912 · femme & homme ».
- **Outil « Trouvez votre taille »** (`components/site/SizeFinder.tsx`) : estimation indicative calculée dans le navigateur.
- **Logotype provisoire** : « Devine » en Bodoni italique.

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
