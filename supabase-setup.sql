create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  first_name text,
  last_name text,
  avatar_url text,
  phone text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Users view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Service role manages profiles"
  on public.profiles for all using (auth.role() = 'service_role');

create or replace function public.handle_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.handle_updated_at();

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text,
  image_url text,
  price numeric,
  status text default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.ads enable row level security;

create policy "Anyone view active ads"
  on public.ads for select using (status = 'active');

create policy "Users manage own ads"
  on public.ads for all using (auth.uid() = user_id);

create trigger ads_updated_at
  before update on public.ads
  for each row execute function public.handle_updated_at();

-- Categories table (for category filtering)
create table if not exists public.categories (
  id serial primary key,
  name text not null,
  slug text not null unique,
  ad_count integer default 0,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "Categories are public readable"
  on public.categories for select using (true);

insert into public.categories (name, slug) values
  ('Products', 'products'),
  ('Services', 'services'),
  ('Events', 'events')
on conflict (slug) do nothing;

create trigger categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

-- Storage: create "ad-images" bucket manually in Supabase Dashboard → Storage, then run:
-- CREATE POLICY "Public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ad-images');
-- CREATE POLICY "Public read" ON storage.objects FOR SELECT USING (bucket_id = 'ad-images');
-- CREATE POLICY "Service role full access" ON storage.objects FOR ALL USING (auth.role() = 'service_role');

-- Contact messages table
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text default 'new',
  created_at timestamptz default now()
);

alter table public.contact_messages enable row level security;

create policy "Service role manages messages"
  on public.contact_messages for all
  using (auth.role() = 'service_role');
