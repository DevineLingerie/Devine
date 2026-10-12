-- DEVINE — schéma initial
-- Tables de contenu administrables, demandes de contact et gestion des administrateurs.
-- Toutes les tables ont la Row Level Security activée (voir 20261012100100_rls.sql).

create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- Utilitaires
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Administrateurs
-- Un compte Supabase Auth n'a aucun droit d'écriture tant qu'il n'est pas
-- inscrit ici. L'inscription se fait uniquement en SQL (éditeur Supabase ou
-- clé secrète côté serveur), jamais depuis le site.
-- ---------------------------------------------------------------------------

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admin_users is
  'Comptes Supabase Auth autorisés à administrer le site.';

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users where user_id = (select auth.uid())
  );
$$;

comment on function public.is_admin() is
  'Vrai si l''utilisateur connecté figure dans admin_users. Utilisée par les politiques RLS.';

-- ---------------------------------------------------------------------------
-- Médias (images du site, stockées dans le bucket "site-images")
-- ---------------------------------------------------------------------------

create table public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique
    check (path ~ '^[a-z0-9][a-z0-9/_.-]{0,199}$'),
  alt text not null default '' check (char_length(alt) <= 300),
  width integer check (width > 0),
  height integer check (height > 0),
  created_at timestamptz not null default now()
);

comment on column public.media.alt is
  'Texte alternatif. Vide uniquement pour une image purement décorative.';

-- ---------------------------------------------------------------------------
-- Réglages généraux (ligne unique)
-- Les informations inconnues restent NULL : le site les masque au lieu
-- d'afficher des valeurs inventées.
-- ---------------------------------------------------------------------------

create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  shop_name text not null check (char_length(shop_name) between 1 and 80),
  tagline text check (char_length(tagline) <= 120),
  promise text check (char_length(promise) <= 300),

  street_address text check (char_length(street_address) <= 200),
  postal_code text check (postal_code ~ '^[0-9]{5}$'),
  city text check (char_length(city) <= 100),
  country_code text not null default 'FR' check (country_code ~ '^[A-Z]{2}$'),
  latitude numeric(9, 6) check (latitude between -90 and 90),
  longitude numeric(9, 6) check (longitude between -180 and 180),
  access_notes text check (char_length(access_notes) <= 1000),

  phone text check (char_length(phone) <= 30),
  email text check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),

  -- [{ "day": "monday", "periods": [{ "opens": "09:30", "closes": "12:30" }] }]
  opening_hours jsonb not null default '[]'::jsonb
    check (jsonb_typeof(opening_hours) = 'array'),
  hours_note text check (char_length(hours_note) <= 300),

  -- [{ "network": "instagram", "url": "https://…" }]
  social_links jsonb not null default '[]'::jsonb
    check (jsonb_typeof(social_links) = 'array'),

  seo_title text check (char_length(seo_title) <= 70),
  seo_description text check (char_length(seo_description) <= 170),

  -- Mentions légales : à renseigner par la gérante.
  legal_name text check (char_length(legal_name) <= 150),
  legal_form text check (char_length(legal_form) <= 100),
  share_capital text check (char_length(share_capital) <= 50),
  siret text check (siret ~ '^[0-9]{14}$'),
  rcs text check (char_length(rcs) <= 100),
  vat_number text check (char_length(vat_number) <= 30),
  legal_address text check (char_length(legal_address) <= 300),
  publication_director text check (char_length(publication_director) <= 150),
  host_name text check (char_length(host_name) <= 150),
  host_address text check (char_length(host_address) <= 300),
  host_contact text check (char_length(host_contact) <= 150),

  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Pages administrables
-- La structure (sections) est définie par le code ; la gérante modifie les
-- titres et les textes de chaque section.
-- ---------------------------------------------------------------------------

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 70),
  description text not null check (char_length(description) between 1 and 170),
  heading text not null check (char_length(heading) between 1 and 120),
  intro text check (char_length(intro) <= 600),
  -- [{ "key": "conseil", "heading": "…", "body": "…" }]
  sections jsonb not null default '[]'::jsonb
    check (jsonb_typeof(sections) = 'array'),
  hero_image_id uuid references public.media (id) on delete set null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index pages_hero_image_id_idx on public.pages (hero_image_id);

create trigger pages_updated_at
  before update on public.pages
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Univers de produits
-- ---------------------------------------------------------------------------

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 80),
  audience text not null default 'mixte'
    check (audience in ('femme', 'homme', 'mixte')),
  summary text check (char_length(summary) <= 300),
  link_path text check (link_path ~ '^/[a-z0-9/-]*$'),
  image_id uuid references public.media (id) on delete set null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index categories_order_idx on public.categories (sort_order, name);
create index categories_image_id_idx on public.categories (image_id);

create trigger categories_updated_at
  before update on public.categories
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Marques
-- ---------------------------------------------------------------------------

create table public.brands (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (char_length(name) between 1 and 80),
  description text check (char_length(description) <= 600),
  website_url text check (website_url ~ '^https://'),
  logo_id uuid references public.media (id) on delete set null,
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index brands_order_idx on public.brands (sort_order, name);
create index brands_logo_id_idx on public.brands (logo_id);

create trigger brands_updated_at
  before update on public.brands
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Services
-- ---------------------------------------------------------------------------

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 1 and 100),
  summary text not null check (char_length(summary) between 1 and 400),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index services_order_idx on public.services (sort_order, title);

create trigger services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Questions fréquentes
-- ---------------------------------------------------------------------------

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (char_length(question) between 1 and 200),
  answer text not null check (char_length(answer) between 1 and 1500),
  sort_order integer not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index faqs_order_idx on public.faqs (sort_order);

create trigger faqs_updated_at
  before update on public.faqs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Demandes de contact
-- Données minimales. Aucune donnée de santé ou de morphologie n'est demandée.
-- Insertion uniquement côté serveur (clé secrète) après validation.
-- ---------------------------------------------------------------------------

create table public.contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text check (char_length(name) <= 120),
  email text check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email) <= 254),
  phone text check (char_length(phone) <= 30),
  subject text not null
    check (subject in ('conseil', 'visite', 'produit', 'autre')),
  message text not null check (char_length(message) between 10 and 2000),
  consent_at timestamptz not null,
  privacy_version text not null check (char_length(privacy_version) <= 20),
  status text not null default 'nouveau'
    check (status in ('nouveau', 'en_cours', 'traite', 'archive')),
  admin_note text check (char_length(admin_note) <= 2000),
  -- Empreinte SHA-256 salée de l'adresse IP, pour limiter les envois abusifs.
  ip_hash text check (char_length(ip_hash) = 64),
  created_at timestamptz not null default now(),
  handled_at timestamptz,
  constraint contact_requests_reply_channel check (email is not null or phone is not null)
);

create index contact_requests_status_idx on public.contact_requests (status, created_at desc);
create index contact_requests_ip_idx on public.contact_requests (ip_hash, created_at desc);

-- Suppression des demandes anciennes (durée annoncée dans la politique de
-- confidentialité). À planifier avec pg_cron ou à lancer manuellement.
create or replace function public.purge_contact_requests(retention interval default interval '12 months')
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted integer;
begin
  delete from public.contact_requests
  where created_at < now() - retention;
  get diagnostics deleted = row_count;
  return deleted;
end;
$$;

revoke execute on function public.purge_contact_requests(interval) from public, anon, authenticated;
