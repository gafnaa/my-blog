-- Public visitors can read the library; only users explicitly marked as admins can change it.
create table if not exists public.library (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('Game', 'Book')),
  title text not null,
  creator text not null,
  image text not null,
  imagealt text not null default '',
  rating integer not null check (rating between 1 and 5),
  description text not null,
  created_at timestamptz not null default now()
);

alter table public.library enable row level security;
grant select on public.library to anon, authenticated;
grant insert, update, delete on public.library to authenticated;

drop policy if exists "Library is public to read" on public.library;
create policy "Library is public to read" on public.library for select using (true);

drop policy if exists "Admins manage library" on public.library;
create policy "Admins manage library" on public.library for all to authenticated
  using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');
