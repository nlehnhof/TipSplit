-- ============================================================================
-- TipSplit — initial schema
-- Tables: profiles, staff, presets, shifts
-- RLS on all four tables, scoped to auth.uid(). A trigger on auth.users
-- creates the matching profile row on first sign-up so profiles always exist.
-- ============================================================================

-- gen_random_uuid() is built into Postgres 13+; kept for older/managed hosts.
create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- profiles
-- ----------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- staff
-- ----------------------------------------------------------------------------
create table public.staff (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  role text not null,
  point_weight numeric not null default 1.0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- presets
-- ----------------------------------------------------------------------------
create table public.presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  method text not null check (method in ('hours', 'sales', 'points')),
  house_pct numeric not null default 0,
  role_weights jsonb,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- shifts
-- ----------------------------------------------------------------------------
create table public.shifts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  date date not null,
  pool_cents integer not null,
  method text not null check (method in ('hours', 'sales', 'points')),
  house_pct numeric not null default 0,
  snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- updated_at trigger for staff
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists staff_set_updated_at on public.staff;
create trigger staff_set_updated_at
  before update on public.staff
  for each row
  execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- Row level security
-- ----------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.staff enable row level security;
alter table public.presets enable row level security;
alter table public.shifts enable row level security;

-- profiles: a user can read/update their own row; the insert policy lets the
-- app create a profile row defensively on first login (with check
-- auth.uid() = id guarantees a user can only insert their own profile).
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- staff / presets / shifts: full CRUD scoped to the owner.
create policy "staff_select_own"
  on public.staff for select
  using (auth.uid() = user_id);

create policy "staff_insert_own"
  on public.staff for insert
  with check (auth.uid() = user_id);

create policy "staff_update_own"
  on public.staff for update
  using (auth.uid() = user_id);

create policy "staff_delete_own"
  on public.staff for delete
  using (auth.uid() = user_id);

create policy "presets_select_own"
  on public.presets for select
  using (auth.uid() = user_id);

create policy "presets_insert_own"
  on public.presets for insert
  with check (auth.uid() = user_id);

create policy "presets_update_own"
  on public.presets for update
  using (auth.uid() = user_id);

create policy "presets_delete_own"
  on public.presets for delete
  using (auth.uid() = user_id);

create policy "shifts_select_own"
  on public.shifts for select
  using (auth.uid() = user_id);

create policy "shifts_insert_own"
  on public.shifts for insert
  with check (auth.uid() = user_id);

create policy "shifts_update_own"
  on public.shifts for update
  using (auth.uid() = user_id);

create policy "shifts_delete_own"
  on public.shifts for delete
  using (auth.uid() = user_id);

-- ----------------------------------------------------------------------------
-- Profile auto-creation on sign-up
-- ----------------------------------------------------------------------------
-- A trigger on auth.users guarantees every auth user gets a profiles row.
-- security definer + search_path pins the schema. ON CONFLICT keeps the
-- function idempotent, so it is safe alongside a defensive app-side upsert
-- (which will be added when the /app routes are built).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, plan)
  values (new.id, new.email, 'free')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
