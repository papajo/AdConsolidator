-- Supabase setup for XYZT Ad Consolidator
-- Run this entire script in Supabase Dashboard → SQL Editor
-- Safe to re-run — uses IF NOT EXISTS and DROP POLICY IF EXISTS

-- ============================================
-- Profiles table (synced from Clerk via webhook)
-- ============================================
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

drop policy if exists "Users view own profile" on public.profiles;
create policy "Users view own profile"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update using (auth.uid() = id);

drop policy if exists "Service role manages profiles" on public.profiles;
create policy "Service role manages profiles"
  on public.profiles for all using (auth.role() = 'service_role');

-- ============================================
-- Categories table
-- ============================================
create table if not exists public.categories (
  id serial primary key,
  name text not null,
  slug text not null unique,
  ad_count integer default 0,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

drop policy if exists "Categories are public readable" on public.categories;
create policy "Categories are public readable"
  on public.categories for select using (true);

insert into public.categories (name, slug) values
  ('Products', 'products'),
  ('Services', 'services'),
  ('Events', 'events')
on conflict (slug) do nothing;

-- ============================================
-- Ads table
-- ============================================
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  category text,
  category_id integer references public.categories(id),
  image_url text,
  price numeric,
  status text default 'active',
  views integer default 0,
  is_sponsored boolean default false,
  contact_email text,
  contact_phone text,
  contact_website text,
  tags text[],
  location text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.ads enable row level security;

drop policy if exists "Anyone view active ads" on public.ads;
create policy "Anyone view active ads"
  on public.ads for select using (status = 'active');

drop policy if exists "Users manage own ads" on public.ads;
create policy "Users manage own ads"
  on public.ads for all using (auth.uid() = user_id);

-- ============================================
-- Contact messages table
-- ============================================
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

drop policy if exists "Service role manages messages" on public.contact_messages;
create policy "Service role manages messages"
  on public.contact_messages for all using (auth.role() = 'service_role');

-- ============================================
-- Reviews table
-- ============================================
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid references public.ads(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  rating integer check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(ad_id, user_id)
);

alter table public.reviews enable row level security;

drop policy if exists "Anyone view reviews" on public.reviews;
create policy "Anyone view reviews"
  on public.reviews for select using (true);

drop policy if exists "Users create reviews" on public.reviews;
create policy "Users create reviews"
  on public.reviews for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own reviews" on public.reviews;
create policy "Users update own reviews"
  on public.reviews for update using (auth.uid() = user_id);

-- ============================================
-- Timestamps trigger
-- ============================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.handle_updated_at();

drop trigger if exists ads_updated_at on public.ads;
create trigger ads_updated_at before update on public.ads for each row execute function public.handle_updated_at();

drop trigger if exists reviews_updated_at on public.reviews;
create trigger reviews_updated_at before update on public.reviews for each row execute function public.handle_updated_at();

-- ============================================
-- Storage bucket (manual step in Supabase → Storage)
-- ============================================
-- 1. Go to Supabase Dashboard → Storage → New bucket → name: "ad-images", Public: ON
-- 2. Then run these 3 policies:
--
-- CREATE POLICY "Public uploads" ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'ad-images');
--
-- CREATE POLICY "Public read" ON storage.objects FOR SELECT
--   USING (bucket_id = 'ad-images');
--
-- CREATE POLICY "Service role full access" ON storage.objects FOR ALL
--   USING (auth.role() = 'service_role');
