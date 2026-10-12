# Devine Lingerie

Site du domaine devine-lingerie, hébergé chez Hostinger.

## Déploiement

Chaque push sur `main` envoie le contenu du dossier `public/` dans `public_html`
de l'hébergement Hostinger via FTPS (workflow `.github/workflows/deploy-hostinger.yml`).
Le déploiement peut aussi être lancé à la main depuis l'onglet **Actions**.

### Configuration (une seule fois)

1. hPanel Hostinger → **Sites web** → devine-lingerie → **Fichiers → Comptes FTP** :
   noter l'hôte FTP, l'identifiant et le mot de passe (ou en créer un).
2. GitHub → dépôt → **Settings → Secrets and variables → Actions** → ajouter :
   - `HOSTINGER_FTP_SERVER` : hôte FTP (ex. `ftp.devine-lingerie.com` ou l'IP indiquée)
   - `HOSTINGER_FTP_USERNAME` : identifiant FTP (ex. `u123456789`)
   - `HOSTINGER_FTP_PASSWORD` : mot de passe FTP
   - `HOSTINGER_FTP_DIR` *(facultatif)* : dossier cible, `/public_html/` par défaut
     (mettre `/` si le compte FTP pointe déjà sur `public_html`).
