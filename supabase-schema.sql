-- ============================================
-- XYZT Ad Consolidator — Supabase Schema
-- ============================================
-- ⚠️  NOTE: This schema references auth.users (Supabase Auth).
--    The app now uses Clerk for authentication.
--    Use supabase-setup.sql instead, which uses a custom `clerk_id` column.
--    This file is kept for reference only.
-- ============================================

-- Profiles table (linked to Clerk users)
create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  email text,
  full_name text,
  avatar_url text,
  phone text,
  plan text default 'starter' check (plan in ('starter', 'pro', 'business')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  subscription_status text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Categories table
create table if not exists public.categories (
  id serial primary key,
  name text unique not null,
  slug text unique not null,
  description text,
  icon text,
  ad_count int default 0,
  created_at timestamptz default now()
);

-- Ads table
create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text not null,
  category_id int references public.categories(id),
  price numeric(10, 2),
  currency text default 'USD',
  location text,
  images jsonb default '[]',
  contact_email text,
  contact_phone text,
  contact_website text,
  tags text[] default '{}',
  status text default 'pending' check (status in ('pending', 'approved', 'rejected', 'expired')),
  sponsored boolean default false,
  sponsored_until timestamptz,
  priority int default 0,
  views int default 0,
  expires_at timestamptz default (now() + interval '30 days'),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Reviews table
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  ad_id uuid references public.ads(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  rating int not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(ad_id, user_id)
);

-- Saved searches table
create table if not exists public.saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  query text,
  category_id int,
  filters jsonb default '{}',
  created_at timestamptz default now()
);

-- Alerts table
create table if not exists public.alerts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  ad_id uuid references public.ads(id) on delete cascade,
  type text check (type in ('new_ad', 'price_drop', 'reply', 'subscription')),
  message text,
  read boolean default false,
  created_at timestamptz default now()
);

-- Indexes for performance
create index idx_ads_status on public.ads(status);
create index idx_ads_category on public.ads(category_id);
create index idx_ads_user on public.ads(user_id);
create index idx_ads_created on public.ads(created_at desc);
create index idx_reviews_ad on public.reviews(ad_id);
create index idx_alerts_user on public.alerts(user_id, read);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed categories
insert into public.categories (name, slug, description) values
  ('Products', 'products', 'Physical and digital products'),
  ('Services', 'services', 'Professional and personal services'),
  ('Events', 'events', 'Local and online events'),
  ('Jobs', 'jobs', 'Employment opportunities'),
  ('Real Estate', 'real-estate', 'Homes, apartments, and commercial space'),
  ('Vehicles', 'vehicles', 'Cars, motorcycles, boats, and more')
on conflict (slug) do nothing;
