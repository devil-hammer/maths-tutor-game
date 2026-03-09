create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  username_normalized text not null unique,
  password_hash text not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists app_users_username_key on public.app_users (username);

create table if not exists public.app_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.app_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists app_sessions_user_id_idx on public.app_sessions (user_id);
create index if not exists app_sessions_expires_at_idx on public.app_sessions (expires_at);

create table if not exists public.user_progress (
  user_id uuid primary key references public.app_users(id) on delete cascade,
  profile jsonb not null default '{}'::jsonb,
  skills jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  active_session jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists set_app_users_updated_at on public.app_users;
create trigger set_app_users_updated_at
before update on public.app_users
for each row
execute function public.set_updated_at();

drop trigger if exists set_user_progress_updated_at on public.user_progress;
create trigger set_user_progress_updated_at
before update on public.user_progress
for each row
execute function public.set_updated_at();

alter table public.app_users enable row level security;
alter table public.app_sessions enable row level security;
alter table public.user_progress enable row level security;
