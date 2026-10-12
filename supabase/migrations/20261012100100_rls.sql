-- DEVINE — droits d'accès et politiques Row Level Security
--
-- Principes :
--   * visiteur anonyme : lecture des seuls contenus publiés ;
--   * compte connecté non administrateur : mêmes droits qu'un visiteur ;
--   * administrateur (public.admin_users) : lecture et écriture des contenus,
--     lecture et suivi des demandes de contact ;
--   * demandes de contact : jamais lisibles publiquement, insérées côté serveur
--     avec la clé secrète (qui contourne la RLS) après validation.

-- ---------------------------------------------------------------------------
-- Privilèges de base (la RLS filtre ensuite ligne par ligne)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;

grant select on
  public.site_settings, public.pages, public.categories, public.brands,
  public.services, public.faqs, public.media
to anon, authenticated;

grant insert, update, delete on
  public.pages, public.categories, public.brands,
  public.services, public.faqs, public.media
to authenticated;

grant update on public.site_settings to authenticated;

revoke all on public.contact_requests from anon;
revoke insert on public.contact_requests from authenticated;
grant select, update, delete on public.contact_requests to authenticated;

revoke all on public.admin_users from anon;
grant select on public.admin_users to authenticated;

revoke execute on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Activation de la RLS
-- ---------------------------------------------------------------------------

alter table public.admin_users enable row level security;
alter table public.site_settings enable row level security;
alter table public.pages enable row level security;
alter table public.categories enable row level security;
alter table public.brands enable row level security;
alter table public.services enable row level security;
alter table public.faqs enable row level security;
alter table public.media enable row level security;
alter table public.contact_requests enable row level security;

-- ---------------------------------------------------------------------------
-- admin_users : chacun peut seulement vérifier sa propre inscription.
-- Aucune politique d'écriture : l'ajout d'un administrateur passe par SQL.
-- ---------------------------------------------------------------------------

create policy "admin_users: lecture de sa propre ligne"
  on public.admin_users for select to authenticated
  using (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------------
-- site_settings
-- ---------------------------------------------------------------------------

create policy "site_settings: lecture publique"
  on public.site_settings for select to anon, authenticated
  using (true);

create policy "site_settings: modification par un administrateur"
  on public.site_settings for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- Contenus avec statut de publication
-- ---------------------------------------------------------------------------

create policy "pages: lecture des pages publiées"
  on public.pages for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy "pages: création par un administrateur"
  on public.pages for insert to authenticated
  with check ((select public.is_admin()));
create policy "pages: modification par un administrateur"
  on public.pages for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "pages: suppression par un administrateur"
  on public.pages for delete to authenticated
  using ((select public.is_admin()));

create policy "categories: lecture des univers actifs"
  on public.categories for select to anon, authenticated
  using (is_active or (select public.is_admin()));
create policy "categories: création par un administrateur"
  on public.categories for insert to authenticated
  with check ((select public.is_admin()));
create policy "categories: modification par un administrateur"
  on public.categories for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "categories: suppression par un administrateur"
  on public.categories for delete to authenticated
  using ((select public.is_admin()));

create policy "brands: lecture des marques publiées"
  on public.brands for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy "brands: création par un administrateur"
  on public.brands for insert to authenticated
  with check ((select public.is_admin()));
create policy "brands: modification par un administrateur"
  on public.brands for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "brands: suppression par un administrateur"
  on public.brands for delete to authenticated
  using ((select public.is_admin()));

create policy "services: lecture des services publiés"
  on public.services for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy "services: création par un administrateur"
  on public.services for insert to authenticated
  with check ((select public.is_admin()));
create policy "services: modification par un administrateur"
  on public.services for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "services: suppression par un administrateur"
  on public.services for delete to authenticated
  using ((select public.is_admin()));

create policy "faqs: lecture des questions publiées"
  on public.faqs for select to anon, authenticated
  using (is_published or (select public.is_admin()));
create policy "faqs: création par un administrateur"
  on public.faqs for insert to authenticated
  with check ((select public.is_admin()));
create policy "faqs: modification par un administrateur"
  on public.faqs for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "faqs: suppression par un administrateur"
  on public.faqs for delete to authenticated
  using ((select public.is_admin()));

-- Les métadonnées d'images (chemin, texte alternatif) sont publiques :
-- elles ne décrivent que des images destinées au site public.
create policy "media: lecture publique"
  on public.media for select to anon, authenticated
  using (true);
create policy "media: création par un administrateur"
  on public.media for insert to authenticated
  with check ((select public.is_admin()));
create policy "media: modification par un administrateur"
  on public.media for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "media: suppression par un administrateur"
  on public.media for delete to authenticated
  using ((select public.is_admin()));

-- ---------------------------------------------------------------------------
-- contact_requests : administrateurs uniquement. Pas de politique INSERT :
-- les visiteurs ne peuvent pas écrire directement dans la table.
-- ---------------------------------------------------------------------------

create policy "contact_requests: lecture par un administrateur"
  on public.contact_requests for select to authenticated
  using ((select public.is_admin()));
create policy "contact_requests: suivi par un administrateur"
  on public.contact_requests for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "contact_requests: suppression par un administrateur"
  on public.contact_requests for delete to authenticated
  using ((select public.is_admin()));
