// Types de la base Supabase, au format produit par `supabase gen types typescript`.
// Rédigés à partir des migrations de supabase/migrations. Après une évolution du
// schéma, régénérer avec `npm run db:types` (projet lié) et vérifier le diff.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type Timestamps = { created_at: string; updated_at: string };

type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type SiteSettingsRow = {
  id: number;
  shop_name: string;
  tagline: string | null;
  promise: string | null;
  street_address: string | null;
  postal_code: string | null;
  city: string | null;
  country_code: string;
  latitude: number | null;
  longitude: number | null;
  access_notes: string | null;
  phone: string | null;
  email: string | null;
  opening_hours: Json;
  hours_note: string | null;
  social_links: Json;
  seo_title: string | null;
  seo_description: string | null;
  legal_name: string | null;
  legal_form: string | null;
  share_capital: string | null;
  siret: string | null;
  rcs: string | null;
  vat_number: string | null;
  legal_address: string | null;
  publication_director: string | null;
  host_name: string | null;
  host_address: string | null;
  host_contact: string | null;
  updated_at: string;
};

type MediaRow = {
  id: string;
  path: string;
  alt: string;
  width: number | null;
  height: number | null;
  created_at: string;
};

type PagesRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  heading: string;
  intro: string | null;
  sections: Json;
  hero_image_id: string | null;
  is_published: boolean;
} & Timestamps;

type CategoriesRow = {
  id: string;
  slug: string;
  name: string;
  audience: "femme" | "homme" | "mixte";
  summary: string | null;
  link_path: string | null;
  image_id: string | null;
  sort_order: number;
  is_active: boolean;
} & Timestamps;

type BrandsRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  website_url: string | null;
  logo_id: string | null;
  sort_order: number;
  is_published: boolean;
} & Timestamps;

type ServicesRow = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  sort_order: number;
  is_published: boolean;
} & Timestamps;

type FaqsRow = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
} & Timestamps;

type ContactRequestsRow = {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: "conseil" | "visite" | "produit" | "autre";
  message: string;
  consent_at: string;
  privacy_version: string;
  status: "nouveau" | "en_cours" | "traite" | "archive";
  admin_note: string | null;
  ip_hash: string | null;
  created_at: string;
  handled_at: string | null;
};

type AdminUsersRow = { user_id: string; created_at: string };

type Table<Row, Insert, Relationships extends unknown[] = []> = {
  Row: Row;
  Insert: Insert;
  Update: Partial<Insert>;
  Relationships: Relationships;
};

type MediaRelationship<Column extends string, Name extends string> = {
  foreignKeyName: Name;
  columns: [Column];
  isOneToOne: false;
  referencedRelation: "media";
  referencedColumns: ["id"];
};

export type Database = {
  public: {
    Tables: {
      admin_users: Table<AdminUsersRow, WithOptional<AdminUsersRow, "created_at">>;
      site_settings: Table<
        SiteSettingsRow,
        WithOptional<SiteSettingsRow, "id" | "country_code" | "opening_hours" | "social_links" | "updated_at">
      >;
      media: Table<MediaRow, WithOptional<MediaRow, "id" | "alt" | "width" | "height" | "created_at">>;
      pages: Table<
        PagesRow,
        WithOptional<PagesRow, "id" | "intro" | "sections" | "hero_image_id" | "is_published" | "created_at" | "updated_at">,
        [MediaRelationship<"hero_image_id", "pages_hero_image_id_fkey">]
      >;
      categories: Table<
        CategoriesRow,
        WithOptional<
          CategoriesRow,
          "id" | "audience" | "summary" | "link_path" | "image_id" | "sort_order" | "is_active" | "created_at" | "updated_at"
        >,
        [MediaRelationship<"image_id", "categories_image_id_fkey">]
      >;
      brands: Table<
        BrandsRow,
        WithOptional<
          BrandsRow,
          "id" | "description" | "website_url" | "logo_id" | "sort_order" | "is_published" | "created_at" | "updated_at"
        >,
        [MediaRelationship<"logo_id", "brands_logo_id_fkey">]
      >;
      services: Table<
        ServicesRow,
        WithOptional<ServicesRow, "id" | "sort_order" | "is_published" | "created_at" | "updated_at">
      >;
      faqs: Table<FaqsRow, WithOptional<FaqsRow, "id" | "sort_order" | "is_published" | "created_at" | "updated_at">>;
      contact_requests: Table<
        ContactRequestsRow,
        WithOptional<
          ContactRequestsRow,
          "id" | "name" | "email" | "phone" | "status" | "admin_note" | "ip_hash" | "created_at" | "handled_at"
        >
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type TableName = keyof Database["public"]["Tables"];
export type Row<T extends TableName> = Database["public"]["Tables"][T]["Row"];
export type Insert<T extends TableName> = Database["public"]["Tables"][T]["Insert"];
