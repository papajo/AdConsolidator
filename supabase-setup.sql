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
