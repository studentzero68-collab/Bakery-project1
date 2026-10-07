-- Baker's Delight — Supabase schema
-- Run this once in: Supabase dashboard → SQL Editor → New query → Run
-- Creates the users and recipes tables required by the backend.

-- ── Users ─────────────────────────────────────────────────────────────────────

create table if not exists public.users (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null unique,
  password_hash text not null,
  role          text not null default 'user' check (role in ('user', 'admin')),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Recipes ───────────────────────────────────────────────────────────────────

create table if not exists public.recipes (
  id          uuid primary key default gen_random_uuid(),
  title       text not null unique,
  category    text not null check (category in ('dessert', 'breakfast', 'lunch')),
  description text,
  joke        text,
  meaning     text,
  prep_time   text,
  cook_time   text,
  ingredients text[] not null default '{}',
  steps       text[] not null default '{}',
  audiences   text[] not null default '{}',
  image       text,
  video       text,
  created_by  uuid references public.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
