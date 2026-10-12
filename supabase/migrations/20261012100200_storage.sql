-- DEVINE — stockage des images du site
--
-- Bucket "site-images" : images destinées au site public (photos de la
-- boutique, visuels des univers, logos de marques autorisés).
-- Il est public en lecture parce que ces images sont affichées à tous les
-- visiteurs ; aucun document privé ne doit y être déposé.
-- Envoi, remplacement et suppression : administrateurs uniquement.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  5242880, -- 5 Mo
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "site-images: liste par un administrateur"
  on storage.objects for select to authenticated
  using (bucket_id = 'site-images' and (select public.is_admin()));

create policy "site-images: envoi par un administrateur"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-images' and (select public.is_admin()));

create policy "site-images: remplacement par un administrateur"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-images' and (select public.is_admin()))
  with check (bucket_id = 'site-images' and (select public.is_admin()));

create policy "site-images: suppression par un administrateur"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-images' and (select public.is_admin()));
