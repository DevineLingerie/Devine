-- Reproduction minimale de l'environnement Supabase pour tester les
-- migrations et les politiques RLS sur un PostgreSQL local (tests/db).
-- Elle ne remplace pas un test sur un vrai projet Supabase.

create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;

create schema if not exists extensions;
create schema auth;
create schema storage;

create table auth.users (
  id uuid primary key,
  email text
);

-- Comme dans Supabase : l'identifiant de l'utilisateur provient du JWT.
create function auth.uid() returns uuid
language sql stable
as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;

create table storage.buckets (
  id text primary key,
  name text not null,
  public boolean default false,
  file_size_limit bigint,
  allowed_mime_types text[]
);

create table storage.objects (
  id uuid primary key default gen_random_uuid(),
  bucket_id text references storage.buckets (id),
  name text not null,
  owner uuid
);

alter table storage.objects enable row level security;

grant usage on schema auth, storage to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;
grant select, insert, update, delete on storage.objects to anon, authenticated;
grant select on storage.buckets to anon, authenticated;

-- Privilèges par défaut de Supabase sur le schéma public.
grant usage on schema public to service_role;
alter default privileges in schema public grant all on tables to service_role;
alter default privileges in schema public grant all on functions to service_role;
