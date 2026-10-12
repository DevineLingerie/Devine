// Contrôle des images envoyées depuis l'administration. Le bucket Supabase
// applique les mêmes limites (type et taille) : double vérification.

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
} as const;

export type ImageType = keyof typeof IMAGE_TYPES;

/** Reconnaît le format réel d'après les premiers octets (le type annoncé n'est pas fiable). */
export function detectImageType(bytes: Uint8Array): ImageType | null {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.slice(start, end));
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "image/jpeg";
  if (bytes[0] === 0x89 && ascii(1, 4) === "PNG") return "image/png";
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(4, 8) === "ftyp" && ["avif", "avis"].includes(ascii(8, 12))) return "image/avif";
  return null;
}

/** Nom de fichier propre : minuscules, sans accents ni espaces. */
export function slugifyFileName(name: string): string {
  const fileName = name.split(/[\\/]/).pop() ?? "";
  const base = fileName.replace(/\.[^.]*$/, "");
  const slug = base
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return slug || "image";
}

/** Chemin de stockage unique : 2026/10/comptoir-de-la-boutique-a1b2c3.jpg */
export function buildStoragePath(fileName: string, type: ImageType, date: Date, randomSuffix: string): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}/${month}/${slugifyFileName(fileName)}-${randomSuffix}.${IMAGE_TYPES[type]}`;
}

export type ImageCheck = { ok: true; type: ImageType } | { ok: false; message: string };

export function checkImage(size: number, header: Uint8Array): ImageCheck {
  if (size === 0) return { ok: false, message: "Choisissez une image." };
  if (size > MAX_IMAGE_BYTES) return { ok: false, message: "L'image dépasse 5 Mo. Réduisez-la avant de l'envoyer." };
  const type = detectImageType(header);
  if (!type) return { ok: false, message: "Format non accepté. Utilisez une image JPEG, PNG, WebP ou AVIF." };
  return { ok: true, type };
}
