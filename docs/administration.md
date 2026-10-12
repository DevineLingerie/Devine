# Guide de l'administration

L'administration se trouve à l'adresse **/admin** du site (par exemple `https://www.devine-lingerie.fr/admin`). Elle permet de tout mettre à jour sans toucher au code.

## Premier accès

Le premier compte est créé une seule fois, depuis Supabase : voir le [README, section 10](../README.md#10-création-du-premier-administrateur). Ensuite :

1. Ouvrez `/admin/connexion`, saisissez votre e-mail et votre mot de passe.
2. Le **tableau de bord** liste les informations qui manquent encore avant la mise en ligne.

## Ce que vous pouvez modifier

| Menu | Usage |
| --- | --- |
| **Coordonnées & horaires** | adresse, téléphone, e-mail, horaires (deux créneaux par jour), accès, réseaux sociaux, référencement, mentions légales |
| **Pages & textes** | titre principal, introduction, texte de chaque section, image principale, titre et description pour Google, publication |
| **Univers** | lingerie femme, homme, nuit, bain, chaussettes, accessoires : nom, résumé, ordre, affichage |
| **Marques** | nom, description, site, logo (uniquement avec l'accord de la marque), publication |
| **Services** | services présentés sur la page Conseil. Ne publiez que les services confirmés : « Commandes particulières » est préparé mais **non publié** |
| **Questions fréquentes** | questions et réponses de la page Conseil |
| **Images** | photothèque : ajout, texte alternatif, suppression |
| **Demandes de contact** | messages reçus : statut (nouvelle, en cours, traitée, archivée), note interne, suppression |
| **Mon compte** | changement de mot de passe |

Chaque enregistrement met le site à jour immédiatement.

### Écrire les textes

- Une **ligne vide** sépare deux paragraphes.
- Une ligne qui commence par **« - »** devient un élément de liste.
- Pas besoin de mise en forme : le site s'occupe de la typographie.

### Ajouter des photos

1. **Images → Ajouter une image** : choisissez le fichier (JPEG, PNG, WebP ou AVIF, 5 Mo maximum).
2. Décrivez l'image en une phrase dans **Texte alternatif** (par exemple « Le comptoir en bois clair de la boutique »). Ce texte est lu aux personnes malvoyantes et aide le référencement.
3. Associez ensuite l'image à une page (**Pages & textes → Image principale**) ou à un univers.

Utilisez uniquement des photos dont vous détenez les droits : les vôtres, ou des visuels de marques dont l'usage est autorisé.

Conseil : des photos horizontales ou verticales d'au moins 1600 px de large, bien éclairées. Les images sont recadrées en arche sur les pages.

### Demandes de contact

Répondez directement depuis votre messagerie ou votre téléphone : les adresses et les numéros sont cliquables. Les demandes sont à supprimer au bout de 12 mois au maximum (engagement de la politique de confidentialité).

## Réinitialisation du mot de passe

Sur la page de connexion, **Mot de passe oublié ?** envoie un lien par e-mail. Pour que ce lien fonctionne, une configuration unique est nécessaire dans Supabase :

1. **Authentication → URL Configuration** : **Site URL** = adresse du site ; ajoutez `https://<domaine>/admin/auth/confirm` aux **Redirect URLs**.
2. **Authentication → Emails → Reset Password** : remplacez le lien du modèle par :

   ```html
   <a href="{{ .SiteURL }}/admin/auth/confirm?token_hash={{ .TokenHash }}&type=recovery">Choisir un nouveau mot de passe</a>
   ```

Après avoir cliqué, vous arrivez sur **Mon compte** pour choisir un nouveau mot de passe.

L'envoi d'e-mails par défaut de Supabase est limité à quelques messages par heure. Pour un usage régulier, configurez un service d'envoi (SMTP) dans **Authentication → Emails → SMTP Settings**.

## Ajouter ou retirer une personne

- **Ajouter** : créez son compte dans Supabase (**Authentication → Users → Add user**), puis ajoutez-la à `admin_users` (même requête SQL que pour le premier compte).
- **Retirer** : `delete from public.admin_users where user_id = '<identifiant>';` dans **SQL Editor**, ou supprimez son compte dans **Authentication → Users**.
