// Contenu de départ du site.
//
// Ces textes servent :
//   1. de contenu de repli tant que Supabase n'est pas configuré ;
//   2. de données initiales de la base (supabase/migrations/*_seed.sql est
//      généré à partir de ce fichier : `npm run db:seed:generate`).
//
// Règle : aucune information factuelle non confirmée (adresse, téléphone,
// horaires, noms, dates, mentions légales). Ce qui est inconnu reste null et
// se renseigne depuis l'administration.
//
// Format des textes : paragraphes séparés par une ligne vide ; une ligne qui
// commence par « - » devient un élément de liste.

import type { Category, Faq, Page, Service, SiteSettings, Brand } from "./types";

/** Version de la politique de confidentialité enregistrée avec chaque demande. */
export const PRIVACY_VERSION = "2026-10";

export const defaultSettings: SiteSettings = {
  shopName: "DEVINE",
  tagline: "Lingerie depuis 1912",
  promise: "Un lieu où l'on peut se sous-vêtir agréablement, simplement et intelligemment.",
  streetAddress: null,
  postalCode: null,
  city: null,
  countryCode: "FR",
  latitude: null,
  longitude: null,
  accessNotes: null,
  phone: null,
  email: null,
  openingHours: [],
  hoursNote: null,
  socialLinks: [],
  seoTitle: "DEVINE — Lingerie femme et homme, conseil en boutique",
  seoDescription:
    "Boutique de lingerie femme et homme en centre-ville. Conseil personnalisé, essayage, grandes profondeurs de bonnets, nuit, homewear et bain.",
  legalName: null,
  legalForm: null,
  shareCapital: null,
  siret: null,
  rcs: null,
  vatNumber: null,
  legalAddress: null,
  publicationDirector: null,
  hostName: null,
  hostAddress: null,
  hostContact: null,
};

type DefaultPage = Omit<Page, "heroImage">;

export const defaultPages: DefaultPage[] = [
  {
    slug: "accueil",
    title: "DEVINE — Lingerie femme et homme, conseil en boutique",
    description:
      "Boutique de lingerie femme et homme héritière d'un commerce né en 1912. Conseil personnalisé, essayage et marques choisies pour leur tenue et leur confort.",
    heading: "La lingerie qui vous va, choisie avec vous.",
    intro:
      "DEVINE est une boutique de lingerie pour femme et pour homme, au cœur du centre-ville. On prend le temps de comprendre ce que vous cherchez, on essaie, on compare — jusqu'à trouver ce qui vous va vraiment.",
    sections: [
      {
        key: "univers",
        heading: "Un lieu pour se sous-vêtir agréablement",
        body: "Bien choisir ses dessous, ce n'est ni un luxe ni une épreuve. C'est une affaire de confort, de maintien, de plaisir aussi — et de quelques bons conseils.\n\nChez DEVINE, on retrouve du bois clair, des lignes courbes et un grand comptoir aux formes douces. On y vient pour être bien conseillé, simplement, sans se sentir pressé.",
      },
      {
        key: "univers-femme-homme",
        heading: "Deux univers, une même attention",
        body: "La lingerie féminine et la lingerie masculine ont chacune leur place en boutique, avec la même exigence de coupe, de matière et de confort.",
      },
      {
        key: "conseil",
        heading: "Le conseil, notre premier savoir-faire",
        body: "Une taille ne se devine pas sur une étiquette. Elle se trouve en observant, en essayant, en ajustant.\n\n- Comprendre vos habitudes et ce que vous attendez\n- Vous proposer plusieurs modèles et plusieurs tailles\n- Essayer en cabine, à votre rythme\n- Comparer, puis choisir — sans obligation",
      },
      {
        key: "besoins",
        heading: "Vous cherchez peut-être…",
        body: "- Un soutien-gorge qui maintient vraiment, sans serrer\n- Un grand bonnet sur un petit dos\n- Votre vraie taille, tout simplement\n- Des sous-vêtements confortables pour tous les jours\n- Un pyjama doux ou un maillot de bain qui vous ressemble\n- Une idée pour offrir, avec un conseil sur la taille",
      },
      {
        key: "marques",
        heading: "Des maisons choisies pour leur coupe",
        body: "Nous sélectionnons des marques reconnues pour la qualité de leur tenue, de leurs matières et de leurs finitions.",
      },
      {
        key: "histoire",
        heading: "Depuis 1912, un savoir-faire qui se transmet",
        body: "Le commerce que reprend DEVINE existe depuis 1912. Plus d'un siècle plus tard, nous reprenons le fil : la même attention au conseil, avec un regard d'aujourd'hui.",
      },
      {
        key: "visite",
        heading: "Passez nous voir",
        body: "La meilleure façon de découvrir DEVINE, c'est de pousser la porte. Vous pouvez aussi nous écrire pour préparer votre visite.",
      },
    ],
  },
  {
    slug: "lingerie-femme",
    title: "Lingerie femme — soutiens-gorge, grands bonnets, conseil",
    description:
      "Lingerie femme chez DEVINE : maintien, confort, grandes profondeurs de bonnets et petits dos. Conseil personnalisé et essayage en boutique.",
    heading: "Lingerie femme",
    intro:
      "Du quotidien aux grandes occasions, une sélection pensée pour la tenue, le confort et le plaisir de porter quelque chose qui vous va.",
    sections: [
      {
        key: "selection",
        heading: "Une sélection pour la tenue et le confort",
        body: "Soutiens-gorge, culottes, shortys, bodys, lingerie de tous les jours ou plus habillée : chaque modèle est choisi pour sa coupe, sa matière et sa tenue dans le temps.\n\nLes collections évoluent au fil des saisons. Si vous cherchez un modèle précis, le plus simple est de nous demander.",
      },
      {
        key: "tailles",
        heading: "Grandes profondeurs de bonnets, petits dos",
        body: "Nous accordons une attention particulière aux tailles souvent difficiles à trouver : les grandes profondeurs de bonnets et les petits dos associés à de grands bonnets.\n\nLes tailles disponibles varient selon les modèles et les collections. Pour éviter un déplacement inutile, n'hésitez pas à nous contacter avant votre visite.",
      },
      {
        key: "coupe",
        heading: "Trouver la bonne coupe",
        body: "Balconnet, emboîtant, triangle, avec ou sans armatures : chaque forme répond à une morphologie et à un usage. Une bonne coupe se reconnaît vite — la bande tient sans serrer, le bonnet enveloppe sans marquer, les bretelles ne portent pas tout le poids.",
      },
      {
        key: "essayage",
        heading: "Essayer, comparer, prendre son temps",
        body: "L'essayage est le moment où tout se joue. Nous vous proposons plusieurs modèles et plusieurs tailles, et nous vous aidons à lire ce que vous ressentez. Vous décidez, à votre rythme.",
      },
    ],
  },
  {
    slug: "lingerie-homme",
    title: "Lingerie homme — boxers, slips, confort au quotidien",
    description:
      "Lingerie homme chez DEVINE : sous-vêtements choisis pour leur coupe, leur matière et leur confort. Conseil en boutique, pour soi ou pour offrir.",
    heading: "Lingerie homme",
    intro:
      "Les hommes aussi méritent des sous-vêtements bien coupés et un vrai conseil. Chez DEVINE, l'univers masculin a toute sa place.",
    sections: [
      {
        key: "selection",
        heading: "L'essentiel, bien choisi",
        body: "Boxers, slips, caleçons, maillots de corps : des pièces du quotidien, choisies pour leur coupe, la qualité de leurs matières et leur tenue au fil des lavages.\n\nLa sélection évolue avec les collections. Demandez-nous ce qui est disponible en ce moment.",
      },
      {
        key: "confort",
        heading: "Le confort avant tout",
        body: "Une ceinture qui ne marque pas, une matière qui respire, une coupe qui ne bouge pas pendant la journée : ce sont ces détails qui font un bon sous-vêtement.",
      },
      {
        key: "conseil",
        heading: "Un conseil, sans détour",
        body: "Quelle coupe pour quelle morphologie, quelle matière pour quel usage, quelle taille entre deux : nous répondons simplement à vos questions, sans jargon.",
      },
      {
        key: "offrir",
        heading: "Vous cherchez pour quelqu'un d'autre ?",
        body: "Venez avec une idée de la taille habituelle ou du style recherché. Nous vous aidons à choisir.",
      },
    ],
  },
  {
    slug: "nuit-homewear-bain",
    title: "Nuit, homewear et bain — pyjamas, nuisettes, maillots",
    description:
      "Pyjamas, lingerie de nuit, homewear et maillots de bain chez DEVINE. Des matières douces et des coupes choisies, pour femme et pour homme.",
    heading: "Nuit, homewear et bain",
    intro:
      "Parce que le confort ne s'arrête pas aux sous-vêtements : de quoi bien dormir, bien traîner et bien nager.",
    sections: [
      {
        key: "nuit",
        heading: "Pour la nuit",
        body: "Pyjamas, chemises de nuit, nuisettes : des matières agréables et des coupes dans lesquelles on se sent bien, pour femme et pour homme.",
      },
      {
        key: "homewear",
        heading: "Homewear",
        body: "Des tenues d'intérieur confortables et soignées, pour les matins tranquilles et les soirées à la maison.",
      },
      {
        key: "bain",
        heading: "Maillots de bain",
        body: "Un maillot de bain se choisit comme un soutien-gorge : avec une bonne coupe et un vrai maintien. Nous vous aidons à trouver celui qui vous va.\n\nLa sélection varie selon la saison : renseignez-vous avant de passer.",
      },
    ],
  },
  {
    slug: "marques",
    title: "Nos marques de lingerie",
    description:
      "Les marques de lingerie sélectionnées par DEVINE pour la qualité de leur coupe, de leurs matières et de leur tenue.",
    heading: "Nos marques",
    intro:
      "Nous travaillons avec des maisons reconnues pour la qualité de leur coupe, de leurs matières et de leurs finitions.",
    sections: [
      {
        key: "selection",
        heading: "Une sélection qui évolue",
        body: "Les marques et les modèles présents en boutique évoluent au fil des collections. Si vous cherchez une référence précise, contactez-nous : nous vous dirons si elle est disponible.",
      },
    ],
  },
  {
    slug: "conseil",
    title: "Conseil en lingerie et essayage personnalisé",
    description:
      "Trouver sa taille et la bonne coupe avec un conseil personnalisé : comprendre votre besoin, essayer, comparer. Simplement, sans pression.",
    heading: "Le conseil, au cœur de DEVINE",
    intro:
      "Vous ne savez pas quelle taille choisir ? Vous avez souvent été déçue ou déçu par vos achats ? C'est très courant — et c'est précisément pour cela que le conseil existe.",
    sections: [
      {
        key: "pourquoi",
        heading: "Pourquoi un conseil change tout",
        body: "Les tailles varient d'une marque à l'autre, d'un modèle à l'autre, et notre corps évolue au fil du temps. Un regard expérimenté permet de repérer en quelques minutes ce qui ne va pas, et de trouver ce qui ira mieux.",
      },
      {
        key: "deroulement",
        heading: "Comment ça se passe",
        body: "- On échange sur vos habitudes, vos envies et ce qui vous gêne aujourd'hui\n- On vous propose plusieurs modèles et plusieurs tailles\n- Vous essayez en cabine, à votre rythme\n- On ajuste et on compare ensemble\n- Vous choisissez — ou pas : il n'y a aucune obligation d'achat",
      },
      {
        key: "taille",
        heading: "Et si votre taille n'était pas celle que vous pensez ?",
        body: "Une bande qui remonte dans le dos, des bretelles qui glissent ou qui marquent, un bonnet qui baille ou qui comprime : ce sont souvent les signes d'une taille à ajuster, pas d'un problème avec votre corps.\n\nIl n'y a pas de « bonne » taille à atteindre. Il y a celle dans laquelle vous êtes bien.",
      },
      {
        key: "approche",
        heading: "Prendre le temps, sans pression",
        body: "Le conseil n'est pas un examen. On parle simplement, on respecte votre pudeur et votre rythme, et l'on vous laisse décider.",
      },
    ],
  },
  {
    slug: "histoire",
    title: "Notre histoire — une boutique de lingerie depuis 1912",
    description:
      "Un commerce de lingerie né en 1912. DEVINE reprend ce savoir-faire et le fait évoluer, avec la même attention au conseil.",
    heading: "Depuis 1912",
    intro:
      "Plus d'un siècle de lingerie, et une histoire qui ne se regarde pas dans le rétroviseur : elle continue.",
    sections: [
      {
        key: "depuis-1912",
        heading: "Un commerce historique",
        body: "Le commerce que reprend DEVINE existe depuis 1912. Les générations se sont succédé, les modes ont changé, mais une chose est restée : l'attention portée à chaque personne qui pousse la porte.",
      },
      {
        key: "transmission",
        heading: "Un savoir-faire qui se transmet",
        body: "Savoir observer, conseiller, ajuster : ce métier s'apprend au contact des clientes et des clients, jour après jour. DEVINE reprend cet héritage avec respect.",
      },
      {
        key: "aujourdhui",
        heading: "Et aujourd'hui",
        body: "La boutique change de nom et s'ouvre davantage : à la lingerie masculine, à de nouvelles marques, à celles et ceux qui ne s'y étaient jamais arrêtés. L'expertise, elle, reste au centre.",
      },
      {
        key: "souvenirs",
        heading: "Vous avez des souvenirs de la boutique ?",
        body: "Une photo, une anecdote, un souvenir d'enfance ? Nous serions heureux de les découvrir pour enrichir l'histoire du lieu. Écrivez-nous ou passez en parler en boutique.",
      },
    ],
  },
  {
    slug: "contact",
    title: "Contact, horaires et accès",
    description:
      "Adresse, horaires, téléphone et formulaire de contact de la boutique DEVINE. Préparez votre visite ou posez-nous votre question.",
    heading: "Nous trouver, nous écrire",
    intro:
      "Une question sur une taille, une marque, un modèle ? Envie de préparer votre visite ? Nous vous répondons avec plaisir.",
    sections: [
      {
        key: "visite",
        heading: "Préparer sa visite",
        body: "- Portez le soutien-gorge que vous mettez le plus souvent : il nous aide à comprendre ce qui va et ce qui ne va pas\n- Choisissez un haut facile à enlever\n- Prévoyez un peu de temps : un bon essayage ne se fait pas en cinq minutes",
      },
      {
        key: "formulaire",
        heading: "Nous écrire",
        body: "Pour un besoin particulier, inutile de tout détailler par écrit : laissez-nous simplement vos coordonnées, nous en parlerons de vive voix ou en boutique.",
      },
    ],
  },
  {
    slug: "mentions-legales",
    title: "Mentions légales",
    description: "Mentions légales du site de la boutique DEVINE.",
    heading: "Mentions légales",
    intro: null,
    sections: [
      {
        key: "propriete",
        heading: "Propriété intellectuelle",
        body: "L'ensemble des contenus de ce site (textes, photographies, éléments graphiques) est protégé par le droit d'auteur. Toute reproduction sans autorisation préalable est interdite.\n\nLes noms et logos des marques présentées appartiennent à leurs titulaires respectifs.",
      },
      {
        key: "credits",
        heading: "Crédits",
        body: "Conception et développement du site : DEVINE.",
      },
    ],
  },
  {
    slug: "confidentialite",
    title: "Politique de confidentialité",
    description:
      "Comment DEVINE traite les données transmises via le formulaire de contact, et comment exercer vos droits.",
    heading: "Politique de confidentialité",
    intro:
      "Nous collectons le moins de données possible, uniquement pour vous répondre. Voici ce que nous en faisons.",
    sections: [
      {
        key: "donnees",
        heading: "Données collectées",
        body: "Lorsque vous utilisez le formulaire de contact, nous recueillons :\n\n- votre nom, si vous choisissez de l'indiquer ;\n- une adresse e-mail ou un numéro de téléphone, pour vous répondre ;\n- le sujet et le contenu de votre message ;\n- la date de votre demande et la version de cette politique acceptée.\n\nPour limiter les envois abusifs, nous conservons aussi une empreinte chiffrée et irréversible de votre adresse IP. Nous ne demandons aucune information sur votre santé ou votre morphologie : merci de ne pas en indiquer dans votre message.",
      },
      {
        key: "finalite",
        heading: "Pourquoi et sur quelle base",
        body: "Ces données servent uniquement à répondre à votre demande et à en assurer le suivi. Ce traitement repose sur notre intérêt légitime à répondre aux personnes qui nous contactent. Elles ne sont jamais utilisées pour vous envoyer de la publicité, ni vendues ou cédées.",
      },
      {
        key: "destinataires",
        heading: "Qui y a accès",
        body: "Seules les personnes habilitées de la boutique peuvent consulter les demandes. Les données sont hébergées par nos prestataires techniques (hébergement du site et de la base de données), qui agissent pour notre compte et sont tenus à la confidentialité.",
      },
      {
        key: "conservation",
        heading: "Durée de conservation",
        body: "Les demandes sont conservées au maximum 12 mois après leur réception, puis supprimées.",
      },
      {
        key: "droits",
        heading: "Vos droits",
        body: "Vous pouvez accéder à vos données, les faire rectifier ou supprimer, vous opposer à leur traitement ou en demander la limitation. Pour cela, contactez-nous par les moyens indiqués sur la page Contact.\n\nSi vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL (www.cnil.fr).",
      },
      {
        key: "cookies",
        heading: "Cookies",
        body: "Ce site n'utilise ni cookie publicitaire, ni outil de mesure d'audience, ni contenu tiers qui vous suivrait. Seul l'espace d'administration dépose un cookie technique, indispensable à la connexion de la gérante. Aucun consentement n'est donc requis.",
      },
    ],
  },
];

type Seed<T> = Omit<T, "id" | "image" | "logo">;

export const defaultCategories: (Seed<Category> & { isActive: boolean })[] = [
  {
    slug: "lingerie-femme",
    name: "Lingerie femme",
    audience: "femme",
    summary: "Soutiens-gorge, culottes, bodys : maintien, confort et grandes profondeurs de bonnets.",
    linkPath: "/lingerie-femme",
    sortOrder: 10,
    isActive: true,
  },
  {
    slug: "lingerie-homme",
    name: "Lingerie homme",
    audience: "homme",
    summary: "Boxers, slips, caleçons : des essentiels bien coupés, pour tous les jours.",
    linkPath: "/lingerie-homme",
    sortOrder: 20,
    isActive: true,
  },
  {
    slug: "nuit-homewear",
    name: "Nuit et homewear",
    audience: "mixte",
    summary: "Pyjamas, nuisettes et tenues d'intérieur dans des matières douces.",
    linkPath: "/nuit-homewear-bain",
    sortOrder: 30,
    isActive: true,
  },
  {
    slug: "bain",
    name: "Bain",
    audience: "mixte",
    summary: "Des maillots de bain choisis pour leur coupe et leur maintien.",
    linkPath: "/nuit-homewear-bain",
    sortOrder: 40,
    isActive: true,
  },
  {
    slug: "chaussettes",
    name: "Chaussettes",
    audience: "mixte",
    summary: "Pour elle et pour lui, des chaussettes de qualité.",
    linkPath: null,
    sortOrder: 50,
    isActive: true,
  },
  {
    slug: "accessoires",
    name: "Accessoires",
    audience: "mixte",
    summary: "Les petites choses qui complètent une tenue ou facilitent l'entretien.",
    linkPath: null,
    sortOrder: 60,
    isActive: true,
  },
];

// Les descriptions sont laissées vides : à rédiger par la gérante.
export const defaultBrands: (Seed<Brand> & { isPublished: boolean })[] = [
  { slug: "primadonna", name: "PrimaDonna", description: null, websiteUrl: null, sortOrder: 10, isPublished: true },
  { slug: "lise-charmel", name: "Lise Charmel", description: null, websiteUrl: null, sortOrder: 20, isPublished: true },
  { slug: "antigel", name: "Antigel", description: null, websiteUrl: null, sortOrder: 30, isPublished: true },
  { slug: "elomi", name: "Elomi", description: null, websiteUrl: null, sortOrder: 40, isPublished: true },
  { slug: "labonal", name: "Labonal", description: null, websiteUrl: null, sortOrder: 50, isPublished: true },
];

export const defaultServices: (Seed<Service> & { isPublished: boolean })[] = [
  {
    slug: "conseil-personnalise",
    title: "Conseil personnalisé",
    summary: "Nous prenons le temps de comprendre vos habitudes, vos envies et ce qui vous gêne, pour vous orienter vers les bons modèles.",
    sortOrder: 10,
    isPublished: true,
  },
  {
    slug: "choix-des-tailles",
    title: "Accompagnement au choix des tailles",
    summary: "Les tailles varient d'une marque à l'autre : nous vous aidons à trouver la vôtre, modèle par modèle.",
    sortOrder: 20,
    isPublished: true,
  },
  {
    slug: "essayage",
    title: "Essayage",
    summary: "Essayer plusieurs modèles et plusieurs tailles, comparer, prendre son temps : c'est en cabine que tout se joue.",
    sortOrder: 30,
    isPublished: true,
  },
  {
    slug: "solutions-morphologie",
    title: "Des solutions adaptées à votre morphologie",
    summary: "Grands bonnets, petits dos, besoin de maintien ou de légèreté : nous cherchons avec vous les coupes qui vous conviennent.",
    sortOrder: 40,
    isPublished: true,
  },
  {
    slug: "commandes-particulieres",
    title: "Commandes particulières",
    summary: "Un modèle ou une taille absent du stock ? Nous pouvons étudier une commande auprès de la marque.",
    sortOrder: 50,
    // À confirmer par la gérante avant publication.
    isPublished: false,
  },
];

export const defaultFaqs: (Seed<Faq> & { isPublished: boolean })[] = [
  {
    question: "Comment préparer ma visite ?",
    answer: "Portez le soutien-gorge que vous mettez le plus souvent, même s'il ne vous convient plus tout à fait : il nous aide à comprendre ce qui va et ce qui ne va pas. Choisissez un haut facile à enlever, et prévoyez un peu de temps.",
    sortOrder: 10,
    isPublished: true,
  },
  {
    question: "Comment savoir quelle est ma taille ?",
    answer: "La taille indiquée sur une étiquette ne dit pas tout : elle varie selon les marques, les modèles et l'évolution de votre corps. Le plus fiable est d'essayer, avec quelqu'un qui sait observer la tenue d'une bande et d'un bonnet. C'est exactement ce que nous faisons en boutique.",
    sortOrder: 20,
    isPublished: true,
  },
  {
    question: "Comment se déroule un conseil personnalisé ?",
    answer: "On commence par échanger sur vos habitudes et ce que vous recherchez. Nous vous proposons ensuite plusieurs modèles et plusieurs tailles à essayer en cabine, à votre rythme. On ajuste, on compare, et vous décidez. Il n'y a aucune obligation d'achat.",
    sortOrder: 30,
    isPublished: true,
  },
  {
    question: "Quels univers trouve-t-on en boutique ?",
    answer: "Lingerie femme, lingerie homme, nuit et homewear, maillots de bain, chaussettes et accessoires. La sélection évolue au fil des collections et des saisons.",
    sortOrder: 40,
    isPublished: true,
  },
  {
    question: "Y a-t-il de la lingerie pour homme ?",
    answer: "Oui. L'univers masculin a toute sa place chez DEVINE, avec des sous-vêtements choisis pour leur coupe, leurs matières et leur confort.",
    sortOrder: 50,
    isPublished: true,
  },
  {
    question: "Comment contacter la boutique ?",
    answer: "Par téléphone aux horaires d'ouverture, avec le formulaire de la page Contact, ou tout simplement en passant nous voir.",
    sortOrder: 60,
    isPublished: true,
  },
];
