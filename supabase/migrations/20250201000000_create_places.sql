-- Places table for VungTauTravel
create table if not exists public.places (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text not null,
  image text not null,
  category text not null check (category in ('place', 'food', 'checkin')),
  address text,
  tags text[] default '{}',
  featured boolean default false,
  "order" smallint default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists places_category_idx on public.places (category);
create index if not exists places_slug_idx on public.places (slug);
create index if not exists places_order_idx on public.places ("order");

alter table public.places enable row level security;

create policy "Allow public read access on places"
  on public.places for select
  using (true);

create policy "Allow public insert for anon"
  on public.places for insert
  with check (true);

create policy "Allow public update for anon"
  on public.places for update
  using (true);

create policy "Allow public delete for anon"
  on public.places for delete
  using (true);

comment on table public.places is 'Places to visit, food & coffee, check-in spots in Vũng Tàu';
