#!/usr/bin/env bash
# Produit la version statique du site public (formule d'hébergement sans
# Node.js, comme Hostinger Premium) dans ./export-statique et ./export-statique.zip.
# Sans serveur Node : ni administration, ni formulaire de contact (qui affiche
# alors « bientôt disponible »), ni lecture des contenus Supabase en direct.
set -euo pipefail
cd "$(dirname "$0")/.."

SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://devine-lingerie.fr}"
NEXT_PUBLIC_SITE_URL="$SITE_URL" npx next build

OUT=export-statique
A=.next/server/app
rm -rf "$OUT" "$OUT.zip"
mkdir -p "$OUT/_next"
for page in index lingerie-femme lingerie-homme nuit-homewear-bain marques conseil histoire contact mentions-legales confidentialite; do
  cp "$A/$page.html" "$OUT/$page.html"
done
cp "$A/_not-found.html" "$OUT/404.html"
cp "$A/robots.txt.body" "$OUT/robots.txt"
cp "$A/sitemap.xml.body" "$OUT/sitemap.xml"
cp "$A/icon.svg.body" "$OUT/icon.svg"
cp -r .next/static "$OUT/_next/static"
cp -r public/. "$OUT/"
cp deploy/static.htaccess "$OUT/.htaccess"
(cd "$OUT" && python3 -I -c "
import os, zipfile
with zipfile.ZipFile('../$OUT.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for root, _, files in os.walk('.'):
        for name in files:
            path = os.path.join(root, name)
            z.write(path, os.path.relpath(path, '.'))
")
echo "Archive prête : $OUT.zip"
