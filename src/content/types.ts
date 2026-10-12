// Types du contenu du site. Ils correspondent aux tables Supabase
// (voir supabase/migrations) après validation par les schémas Zod.

export const WEEK_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

export type OpeningPeriod = { opens: string; closes: string };

export type OpeningDay = { day: WeekDay; periods: OpeningPeriod[] };

export const SOCIAL_NETWORKS = ["instagram", "facebook", "pinterest", "tiktok", "linkedin"] as const;

export type SocialNetwork = (typeof SOCIAL_NETWORKS)[number];

export type SocialLink = { network: SocialNetwork; url: string };

export type Media = {
  id: string;
  path: string;
  alt: string;
  width: number | null;
  height: number | null;
};

export type SiteSettings = {
  shopName: string;
  tagline: string | null;
  promise: string | null;
  streetAddress: string | null;
  postalCode: string | null;
  city: string | null;
  countryCode: string;
  latitude: number | null;
  longitude: number | null;
  accessNotes: string | null;
  phone: string | null;
  email: string | null;
  openingHours: OpeningDay[];
  hoursNote: string | null;
  socialLinks: SocialLink[];
  seoTitle: string | null;
  seoDescription: string | null;
  legalName: string | null;
  legalForm: string | null;
  shareCapital: string | null;
  siret: string | null;
  rcs: string | null;
  vatNumber: string | null;
  legalAddress: string | null;
  publicationDirector: string | null;
  hostName: string | null;
  hostAddress: string | null;
  hostContact: string | null;
};

export type PageSection = { key: string; heading: string; body: string };

export type Page = {
  slug: string;
  title: string;
  description: string;
  heading: string;
  intro: string | null;
  sections: PageSection[];
  heroImage: Media | null;
};

export const AUDIENCES = ["femme", "homme", "mixte"] as const;

export type Audience = (typeof AUDIENCES)[number];

export type Category = {
  id: string;
  slug: string;
  name: string;
  audience: Audience;
  summary: string | null;
  linkPath: string | null;
  image: Media | null;
  sortOrder: number;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  websiteUrl: string | null;
  logo: Media | null;
  sortOrder: number;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  sortOrder: number;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
};
