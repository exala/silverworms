create extension if not exists "pgcrypto";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  role text not null check (role in ('ADMIN', 'DRIVER', 'COMPANY')),
  full_name text,
  phone text,
  city text,
  country text default 'Pakistan',
  registration_completed boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.driver_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  cnic text,
  license_number text,
  ride_hailing_platform text,
  car_make text,
  car_model text,
  car_year integer,
  plate_number text,
  led_screen_serial text,
  city text,
  status text not null default 'ACTIVE',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.driver_profiles
  alter column status set default 'ACTIVE';

update public.driver_profiles
set status = 'ACTIVE'
where status = 'PENDING_REVIEW';

create table if not exists public.company_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  company_name text,
  contact_person text,
  phone text,
  website text,
  industry text,
  address text,
  country text default 'Pakistan',
  tax_identifier text,
  ntn text,
  fbr_registration text,
  marketing_budget numeric(12,2),
  verification_status text not null default 'VERIFIED',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.company_profiles
  alter column verification_status set default 'VERIFIED';

update public.company_profiles
set verification_status = 'VERIFIED'
where verification_status = 'PENDING_REVIEW';

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.company_profiles(user_id) on delete cascade,
  campaign_name text not null,
  status text not null default 'DRAFT',
  ad_format text not null default 'STATIC',
  start_at timestamptz,
  end_at timestamptz,
  budget numeric(12,2),
  rate_amount numeric(12,2) not null,
  rate_unit text not null check (rate_unit in ('minute', 'hour', 'day', 'week')),
  rate_value integer not null check (rate_value between 1 and 20),
  creative_url text,
  creative_file_id text,
  target_cities text[] default '{}',
  notes text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.campaigns
  drop column if exists headline;

alter table public.campaigns
  add column if not exists creative_file_id text;

create table if not exists public.driver_payout_methods (
  user_id uuid primary key references public.driver_profiles(user_id) on delete cascade,
  method_type text,
  account_title text,
  account_number text,
  bank_name text,
  notes text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.driver_earnings (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid not null references public.driver_profiles(user_id) on delete cascade,
  campaign_id uuid references public.campaigns(id) on delete set null,
  amount numeric(12,2) not null default 0,
  earned_at timestamptz not null default timezone('utc'::text, now()),
  notes text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  requested_role text;
begin
  requested_role := upper(coalesce(new.raw_user_meta_data ->> 'pending_role', 'DRIVER'));

  if requested_role not in ('ADMIN', 'DRIVER', 'COMPANY') then
    requested_role := 'DRIVER';
  end if;

  insert into public.profiles (id, email, role)
  values (new.id, new.email, requested_role)
  on conflict (id) do update
    set email = excluded.email,
        role = excluded.role,
        updated_at = timezone('utc'::text, now());

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_driver_profiles_updated_at on public.driver_profiles;
create trigger set_driver_profiles_updated_at
  before update on public.driver_profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_company_profiles_updated_at on public.company_profiles;
create trigger set_company_profiles_updated_at
  before update on public.company_profiles
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_campaigns_updated_at on public.campaigns;
create trigger set_campaigns_updated_at
  before update on public.campaigns
  for each row execute procedure public.set_updated_at();

drop trigger if exists set_driver_payout_methods_updated_at on public.driver_payout_methods;
create trigger set_driver_payout_methods_updated_at
  before update on public.driver_payout_methods
  for each row execute procedure public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.driver_profiles enable row level security;
alter table public.company_profiles enable row level security;
alter table public.campaigns enable row level security;
alter table public.driver_payout_methods enable row level security;
alter table public.driver_earnings enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'ADMIN'
  );
$$;

drop policy if exists "profiles own select" on public.profiles;
create policy "profiles own select"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles own update" on public.profiles;
create policy "profiles own update"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

drop policy if exists "driver own access" on public.driver_profiles;
create policy "driver own access"
  on public.driver_profiles for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "company own access" on public.company_profiles;
create policy "company own access"
  on public.company_profiles for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "campaign admin and owner access" on public.campaigns;
create policy "campaign admin and owner access"
  on public.campaigns for all
  using (
    public.is_admin()
    or exists (
      select 1
      from public.company_profiles
      where user_id = auth.uid() and user_id = company_id
    )
  )
  with check (
    public.is_admin()
    or exists (
      select 1
      from public.company_profiles
      where user_id = auth.uid() and user_id = company_id
    )
  );

drop policy if exists "driver payout own access" on public.driver_payout_methods;
create policy "driver payout own access"
  on public.driver_payout_methods for all
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());

drop policy if exists "driver earnings access" on public.driver_earnings;
create policy "driver earnings access"
  on public.driver_earnings for select
  using (
    auth.uid() = driver_id
    or public.is_admin()
    or exists (
      select 1
      from public.campaigns
      where campaigns.id = driver_earnings.campaign_id
        and campaigns.company_id = auth.uid()
    )
  );

drop policy if exists "driver earnings admin write" on public.driver_earnings;
create policy "driver earnings admin write"
  on public.driver_earnings for all
  using (public.is_admin())
  with check (public.is_admin());
