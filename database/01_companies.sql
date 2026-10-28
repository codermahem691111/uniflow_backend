-- STEP 1 of 2. Run in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query).
-- Safe to run more than once. If you already ran this file before (it used to be
-- called schema.sql), you can skip it and run only 02_business_tables.sql.
--
-- Logins (email, password, verification status) live in Supabase Auth (auth.users).
-- This table holds the company details and is linked 1-to-1 to the auth user:
-- companies.id IS the auth user id, and it is the tenant id used by every other table.

create table if not exists public.companies (
  id                    uuid primary key references auth.users (id) on delete cascade,
  company_name          text        not null,
  license_number        text        not null,
  owner_name            text        not null,
  business_description  text        not null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),

  constraint companies_license_number_key unique (license_number)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists companies_set_updated_at on public.companies;
create trigger companies_set_updated_at
  before update on public.companies
  for each row execute function public.set_updated_at();

-- Lock the table down: with RLS enabled and no policies, the public (publishable)
-- key cannot read or write it. Only the backend, using the secret key, can.
alter table public.companies enable row level security;
