// Diapositives du carrousel d'accueil. Pour en ajouter une : déposer l'image
// dans public/images/carrousel/ puis ajouter une entrée ci-dessous.
// Utiliser uniquement des images dont la boutique a les droits d'usage
// (photos de la boutique, visuels fournis par les marques à leurs revendeurs).
// Le crédit est affiché dans les mentions légales.

export type Diapositive = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Légende affichée sous les contrôles. */
  titre: string;
  marque: string;
  credit: string;
};

export const diapositives: Diapositive[] = [
  {
    src: "/images/carrousel/primadonna-jokko.avif",
    width: 1191,
    height: 1787,
    alt: "Femme portant un ensemble soutien-gorge à armatures et culotte haute en dentelle noire, PrimaDonna Jokko",
    titre: "Jokko",
    marque: "PrimaDonna",
    credit: "PrimaDonna",
  },
  {
    src: "/images/carrousel/primadonna-twist-dalli.avif",
    width: 917,
    height: 1222,
    alt: "Femme allongée portant un ensemble soutien-gorge à armatures et shorty rose poudré, PrimaDonna Twist Dalli",
    titre: "Dalli",
    marque: "PrimaDonna Twist",
    credit: "PrimaDonna",
  },
];
