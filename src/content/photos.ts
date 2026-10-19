// Photos d'illustration provisoires (banques d'images libres de droits), en
// attendant les photos de la boutique. Chaque photo garde son crédit, affiché
// sur la page Mentions légales. Une photo ajoutée dans l'administration est
// toujours prioritaire.
//
// Pour ajouter une photo : déposer le fichier dans public/images/photos/ puis
// renseigner l'emplacement ci-dessous. Un emplacement vide affiche
// l'illustration « Vitrine ».

export const PHOTO_SLOTS = [
  "accueil-principale",
  "accueil-secondaire",
  "accueil-detail",
  "lingerie-femme",
  "lingerie-homme",
  "nuit-homewear",
  "bain",
  "chaussettes",
  "accessoires",
  "conseil",
  "histoire",
] as const;

export type PhotoSlot = (typeof PHOTO_SLOTS)[number];

export type StockPhoto = {
  /** Chemin dans public/, par exemple /images/photos/accueil.jpg */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Auteur ou autrice de la photo. */
  author: string;
  /** Banque d'images et page d'origine (licence permettant l'usage commercial). */
  source: string;
  url: string;
};

export const stockPhotos: Partial<Record<PhotoSlot, StockPhoto>> = {};

export function getStockPhoto(slot: PhotoSlot): StockPhoto | null {
  return stockPhotos[slot] ?? null;
}
