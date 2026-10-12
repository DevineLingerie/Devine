# DEVINE — site officiel

Site de la boutique **DEVINE**, lingerie femme et homme, héritière d'un commerce né en 1912.
Site de présentation et de conversion locale : faire connaître la boutique, rendre le conseil visible, donner envie de venir. Il n'y a ni panier ni paiement dans cette première version.

| Documentation | Contenu |
| --- | --- |
| [docs/avant-mise-en-ligne.md](docs/avant-mise-en-ligne.md) | Ce qu'il reste à fournir ou à décider avant la publication |
| [docs/administration.md](docs/administration.md) | Guide de la gérante : créer le premier compte et utiliser `/admin` |
| [docs/base-de-donnees.md](docs/base-de-donnees.md) | Schéma Supabase, politiques RLS, stockage, sauvegardes |
| [docs/deploiement.md](docs/deploiement.md) | Mise en ligne (Hostinger Node.js ou Vercel), domaine, environnements |
| [docs/design.md](docs/design.md) | Direction artistique, palette, typographies, composants |

## 1. Présentation technique

- **Next.js 16** (App Router, Cache Components) avec **React 19** et **TypeScript** en mode strict
- **Tailwind CSS 4** : toutes les couleurs et polices sont centralisées dans `src/app/globals.css`
- **Supabase** : PostgreSQL, authentification de la gérante, stockage des images
- **Zod** : validation de toutes les données côté serveur
- **Vitest**, **Playwright** et **axe-core** pour les tests

```
src/
  app/(site)/        pages publiques (accueil, femme, homme, conseil…)
  app/admin/         administration protégée (/admin)
  components/        composants réutilisables (ui, site, layout, admin, brand)
  content/           types du contenu et textes par défaut
  lib/               accès aux données, validation, SEO, sécurité
  proxy.ts           rafraîchissement de session sur /admin uniquement
supabase/migrations/ schéma, RLS, stockage, données initiales (SQL versionné)
tests/               unit/ (Vitest), db/ (permissions PostgreSQL), e2e/ (Playwright)
```

**Sans Supabase**, le site fonctionne déjà avec les textes par défaut de `src/content/defaults.ts`. Le formulaire de contact et l'administration indiquent alors clairement qu'ils ne sont pas encore actifs : rien n'est simulé.

## 2. Prérequis

- Node.js 22 (LTS) et npm
- Un projet Supabase (offre gratuite suffisante pour démarrer)
- Pour les tests de base de données : PostgreSQL 15 ou plus installé en local (`initdb`, `psql`)
- Facultatif : la [CLI Supabase](https://supabase.com/docs/guides/local-development/cli/getting-started) pour appliquer les migrations depuis le terminal

## 3. Installation locale

```bash
git clone https://github.com/DevineLingerie/Devine.git
cd Devine
npm ci
cp .env.example .env.local   # puis compléter les valeurs
```

## 4. Variables d'environnement

Elles sont décrites dans [`.env.example`](.env.example). Elles ne doivent **jamais** être committées : `.gitignore` exclut tous les fichiers `.env*`.

| Variable | Où | Rôle |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | URL du site (canoniques, sitemap, Open Graph) |
| `NEXT_PUBLIC_SUPABASE_URL` | public | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | public | Clé publiable (lecture des contenus publiés, connexion). `NEXT_PUBLIC_SUPABASE_ANON_KEY` est aussi accepté |
| `SUPABASE_SECRET_KEY` | **serveur uniquement** | Clé secrète, utilisée seulement pour enregistrer les demandes de contact. `SUPABASE_SERVICE_ROLE_KEY` est aussi accepté |
| `CONTACT_IP_SALT` | **serveur uniquement** | Sel de l'empreinte IP utilisée pour limiter les envois (`openssl rand -hex 32`) |

Les variables `NEXT_PUBLIC_*` sont intégrées **au moment du build** : après une modification, relancez `npm run build`.

## 5. Connexion à Supabase

1. Créez un projet sur [supabase.com](https://supabase.com), dans une région de l'Union européenne (par exemple Paris ou Francfort).
2. Dans **Project Settings → API Keys**, copiez l'URL du projet, la clé publiable et la clé secrète dans `.env.local`.
3. Dans **Authentication → Sign In / Providers**, désactivez **Allow new users to sign up** : seuls les comptes créés par vous pourront se connecter.
4. Appliquez les migrations (section suivante), puis créez le premier administrateur (section 10).

## 6. Application des migrations

Les migrations SQL de `supabase/migrations/` s'appliquent **dans l'ordre** :

| Fichier | Contenu |
| --- | --- |
| `20261012100000_schema.sql` | tables, contraintes, index, fonctions |
| `20261012100100_rls.sql` | droits et politiques Row Level Security |
| `20261012100200_storage.sql` | bucket `site-images` et ses politiques |
| `20261012100300_seed.sql` | contenus initiaux (généré, voir plus bas) |

**Avec la CLI Supabase** :

```bash
npx supabase login
npx supabase link --project-ref <identifiant-du-projet>
npx supabase db push
```

**Sans la CLI** : ouvrez **SQL Editor** dans Supabase et exécutez le contenu de chaque fichier, dans l'ordre.

La migration des données initiales utilise `on conflict do nothing` : la rejouer n'écrase jamais les modifications faites dans l'administration. Si vous modifiez `src/content/defaults.ts`, régénérez-la avec `npm run db:seed:generate` (un test vérifie qu'elle est à jour).

Après une évolution du schéma, mettez à jour `src/lib/supabase/database.types.ts`. Avec un projet lié, `npm run db:types` produit le fichier généré officiel pour comparaison.

## 7. Serveur de développement

```bash
npm run dev
```

Puis ouvrez http://localhost:3000 (site) et http://localhost:3000/admin (administration).

## 8. Tests

| Commande | Ce qui est vérifié |
| --- | --- |
| `npm run lint` | ESLint (règles Next.js, React, accessibilité JSX) |
| `npm run typecheck` | TypeScript strict |
| `npm test` | tests unitaires : validation, formulaire de contact, horaires, SEO, administration, images |
| `npm run test:db` | lance un PostgreSQL jetable, applique toutes les migrations et teste les permissions avec trois profils : visiteur, compte non autorisé, administrateur |
| `npm run test:e2e` | sur le build de production : routes, 404, métadonnées, sitemap, navigation mobile, accès à l'administration, accessibilité WCAG 2.2 AA (axe-core) |
| `npm run check` | lint + types + unitaires + build |

`npm run test:e2e` nécessite un build préalable (`npm run build`). En local, Playwright utilise le Chromium installé ; sinon : `npx playwright install chromium`.

`npm run test:db` utilise une reproduction minimale des rôles Supabase (`supabase/tests/supabase-stub.sql`). Elle valide la logique des politiques, mais ne remplace pas une vérification sur le vrai projet. Voir [docs/base-de-donnees.md](docs/base-de-donnees.md#vérifier-sur-le-projet-réel).

La CI GitHub (`.github/workflows/ci.yml`) exécute tous ces contrôles à chaque pull request.

## 9. Build de production

```bash
npm run build
npm start          # sert le build sur le port 3000
```

La configuration `output: "standalone"` produit aussi un serveur autonome dans `.next/standalone` (voir [docs/deploiement.md](docs/deploiement.md)).

## 10. Création du premier administrateur

Aucun mot de passe n'est écrit dans le code et aucun compte de démonstration n'existe.

1. Supabase → **Authentication → Users → Add user → Create new user** : saisissez l'e-mail de la gérante et un mot de passe solide (12 caractères ou plus), cochez **Auto Confirm User**.
2. Supabase → **SQL Editor**, exécutez (en remplaçant l'adresse) :

   ```sql
   insert into public.admin_users (user_id)
   select id from auth.users where email = 'gerante@exemple.fr';
   ```

3. Connectez-vous sur `/admin/connexion`, puis changez le mot de passe dans **Mon compte** si besoin.

Un compte qui n'est pas dans `admin_users` peut se connecter mais n'a accès à rien : la vérification est faite côté serveur et par la base (RLS). Pour retirer un accès : `delete from public.admin_users where user_id = '…';`.

Pour que « Mot de passe oublié » fonctionne, configurez le modèle d'e-mail décrit dans [docs/administration.md](docs/administration.md#réinitialisation-du-mot-de-passe).

## 11. Déploiement

Le site est une application Node.js : un hébergement mutualisé « classique » (FTP vers `public_html`) **ne suffit pas**, à cause de l'administration et du formulaire de contact.

- **Hostinger** : offres permettant les applications Node.js (Business, Cloud…), avec import depuis GitHub
- **Vercel** : intégration native avec Next.js et GitHub, offre gratuite possible

La procédure pas à pas, le branchement du domaine et la séparation des environnements sont dans [docs/deploiement.md](docs/deploiement.md). Aucune mise en production ne doit se faire sans relire [docs/avant-mise-en-ligne.md](docs/avant-mise-en-ligne.md).

## 12. Synchronisation avec GitHub

Le dépôt GitHub est la référence du code.

```bash
git checkout main && git pull            # partir de la dernière version
git checkout -b ma-modification          # une branche par changement
# … modifications …
npm run check                            # vérifier avant de committer
git add -A && git commit -m "Décrit la modification"
git push -u origin ma-modification       # puis ouvrir une pull request
```

- Ne jamais committer de fichier `.env*` ni de clé.
- Ne pas forcer un push (`--force`) sur une branche partagée.
- La branche `main` correspond à la production : on y fusionne une pull request une fois la CI au vert.

## 13. Sauvegardes et précautions

- **Les contenus et les demandes vivent dans Supabase**, pas dans Git. Les sauvegardes automatiques dépendent de l'offre Supabase : sur l'offre gratuite, faites un export régulier (**Database → Backups**, ou `npx supabase db dump --data-only > sauvegarde.sql`, à conserver hors du dépôt car il contient des données personnelles).
- Les images sont dans le bucket `site-images` : conservez aussi les originaux de vos photos.
- Avant toute migration sur la production, faites une sauvegarde et testez sur un projet de test (voir [docs/deploiement.md](docs/deploiement.md#environnements)).
- Les demandes de contact doivent être supprimées après 12 mois (durée annoncée dans la politique de confidentialité) : voir [docs/base-de-donnees.md](docs/base-de-donnees.md#purge-des-demandes-de-contact).
- Ne partagez jamais la clé secrète. En cas de fuite, régénérez-la dans Supabase et mettez à jour l'hébergeur.

## 14. Dépannage

| Symptôme | Cause probable et solution |
| --- | --- |
| Le site affiche les textes par défaut alors que Supabase est configuré | Variables `NEXT_PUBLIC_SUPABASE_*` absentes **au moment du build** : ajoutez-les puis relancez le build. Vérifiez aussi les journaux serveur (`[contenu] Lecture impossible…`) |
| « Supabase n'est pas encore configuré » sur `/admin/connexion` | Même cause : variables publiques manquantes |
| Connexion acceptée mais « ce compte n'a pas accès » | L'utilisateur n'est pas dans `admin_users` (section 10) |
| « Le formulaire en ligne sera bientôt disponible » | `SUPABASE_SECRET_KEY` ou `CONTACT_IP_SALT` (16 caractères minimum) manquant au build |
| « Nous avons reçu plusieurs messages à la suite » | Limitation anti-spam : 3 envois par adresse IP sur 10 minutes, 40 par heure au total (`src/lib/contact/submit.ts`) |
| Une modification dans l'admin n'apparaît pas | Rechargez la page. Le cache est invalidé à chaque enregistrement ; s'il y a plusieurs instances serveur, l'actualisation peut prendre jusqu'à une heure |
| Les images ne s'affichent pas | Migration `…_storage.sql` non appliquée, ou `NEXT_PUBLIC_SUPABASE_URL` différente au build (elle autorise le domaine des images) |
| Le lien « mot de passe oublié » renvoie « lien plus valable » | Modèle d'e-mail Supabase non configuré, ou lien déjà utilisé ou expiré |
| `npm run test:db` : « initdb introuvable » | Installez PostgreSQL (`sudo apt install postgresql`) |
| `Error: Cannot find module` après une mise à jour | `rm -rf node_modules .next && npm ci` |
