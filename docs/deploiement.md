# Déploiement

Le site est une application **Next.js avec serveur Node.js** : l'administration, le formulaire de contact et la mise à jour des contenus s'exécutent côté serveur. Un hébergement mutualisé limité au PHP et au FTP vers `public_html` ne peut pas l'héberger.

> Aucun déploiement en production ne doit être fait sans relire [avant-mise-en-ligne.md](avant-mise-en-ligne.md).

## Environnements

| Environnement | Code | Base Supabase | URL |
| --- | --- | --- | --- |
| Développement | branche de travail, `npm run dev` | projet Supabase de test (ou le même projet au tout début) | http://localhost:3000 |
| Test (recommandé) | branche de pull request | **projet Supabase de test** distinct | aperçu de l'hébergeur |
| Production | branche `main` | projet Supabase de production | domaine devine-lingerie |

Les migrations se testent d'abord sur le projet de test, puis s'appliquent à la production après une sauvegarde.

## Variables à définir chez l'hébergeur

Les mêmes que dans [`.env.example`](../.env.example), avec les valeurs de production :

- `NEXT_PUBLIC_SITE_URL` : l'adresse définitive, par exemple `https://www.devine-lingerie.fr` (extension à confirmer)
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`, `CONTACT_IP_SALT` : à déclarer comme secrets, jamais exposés au navigateur

Elles doivent être présentes **pendant le build** : les variables `NEXT_PUBLIC_*` sont intégrées au code compilé.

## Version statique sur la formule Premium (en place)

La formule actuelle (Hostinger **Premium**) n'exécute pas d'application Node.js. En attendant, la partie publique est publiée en **version statique** :

```bash
npm run export:statique      # produit export-statique.zip (adresse : NEXT_PUBLIC_SITE_URL, par défaut https://devine-lingerie.fr)
```

Puis, dans hPanel : **Fichiers → Gestionnaire de fichiers → public_html**, envoyer `export-statique.zip` et l'extraire (ou utiliser l'opération « Deploy static site archive » de l'API Hostinger). Le fichier `.htaccess` fourni (`deploy/static.htaccess`) gère les adresses sans `.html`, la page 404, le HTTPS et les en-têtes de sécurité.

Limites de la version statique : pas d'administration, pas de formulaire de contact (il affiche « bientôt disponible »), contenus figés au moment de l'export. Pour tout activer : passer à la formule **Business** (ou Cloud) et suivre l'option A ci-dessous.

## Option A — Hostinger (application Node.js)

Hostinger propose l'hébergement d'applications Node.js (dont Next.js) avec déploiement depuis GitHub sur ses offres **Business** et **Cloud**. Les offres VPS le permettent aussi, mais avec une configuration manuelle. Vérifiez votre formule dans hPanel avant de commencer : l'offre « Premium » mutualisée ne suffit pas.

1. hPanel → **Sites web → Ajouter un site → Application web Node.js** (le libellé peut varier).
2. Choisissez **Importer depuis GitHub**, autorisez l'accès au dépôt `DevineLingerie/Devine` et sélectionnez la branche `main`.
3. Paramètres de build (normalement détectés automatiquement) :
   - version de Node.js : **22**
   - installation : `npm ci`
   - build : `npm run build`
   - démarrage : `npm start` (le port fourni par Hostinger via `PORT` est respecté)
4. Ajoutez les variables d'environnement de la section précédente, puis lancez le déploiement.
5. Associez le domaine **devine-lingerie** à l'application, et activez le certificat SSL (HTTPS).
6. Chaque push sur `main` redéploie le site si le déploiement automatique est activé.

Dans l'administration, menu **Coordonnées & horaires**, section **Mentions légales**, renseignez alors l'hébergeur : la dénomination et l'adresse exactes figurent dans les conditions de votre contrat Hostinger.

## Option B — Vercel

1. Sur [vercel.com](https://vercel.com), **Add New → Project**, importez le dépôt GitHub.
2. Framework détecté : Next.js. Laissez les commandes par défaut.
3. Ajoutez les variables d'environnement pour **Production**. Pour **Preview**, utilisez de préférence celles du projet Supabase de test.
4. Déployez, puis ajoutez le domaine dans **Settings → Domains**. Chez le registraire du domaine (Hostinger s'il y a été acheté), créez les enregistrements DNS indiqués par Vercel.

Chaque pull request obtient alors une URL d'aperçu ; `main` part en production.

## Option C — serveur autonome (VPS)

```bash
npm ci && npm run build
cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
PORT=3000 node .next/standalone/server.js
```

À placer derrière un proxy HTTPS (Nginx, Caddy) et un gestionnaire de processus (systemd, pm2).

## Après la mise en ligne

1. Dans Supabase → **Authentication → URL Configuration**, définissez **Site URL** sur l'adresse du site et ajoutez `https://<domaine>/admin/auth/confirm` aux URL de redirection.
2. Vérifiez `https://<domaine>/robots.txt` et `https://<domaine>/sitemap.xml`.
3. Déclarez le site dans **Google Search Console** et soumettez le sitemap.
4. Complétez la fiche **Google Business Profile** (adresse, horaires, photos, lien vers le site) : le site la renforce, il ne la remplace pas.
5. Envoyez une demande de test avec le formulaire de contact et vérifiez qu'elle apparaît dans `/admin/demandes`.

## Ancien workflow FTP

Le dépôt contenait un workflow d'envoi FTP vers `public_html`. Il a été retiré : il publiait des fichiers statiques et aurait envoyé les mauvais fichiers avec ce projet. La CI (`.github/workflows/ci.yml`) vérifie désormais le code ; le déploiement est assuré par l'hébergeur depuis GitHub.
