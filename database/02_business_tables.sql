-- STEP 2 of 2. Run in the Supabase SQL Editor after 01_companies.sql.
-- Safe to run more than once.
--
-- Three tables, one per service:
--   people           customers, staff and suppliers   (People management)
--   products         products with prices and image   (Product management)
--   finance_entries  income and expenses              (Finance management)
--
-- DATA ISOLATION (each company only ever sees its own data)
-- Every row carries `company_id`, which is the owner's auth user id. Row Level
-- Security policies below say: a row is visible/changeable only when
-- company_id = auth.uid(). The backend talks to the database *as the signed-in user*
-- (it forwards the user's token), so Postgres itself enforces this, even if a bug in
-- the application code forgot a filter.

-- ---------------------------------------------------------------------------
-- people
-- ---------------------------------------------------------------------------
create table if not exists public.people (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid        not null references public.companies (id) on delete cascade,
  type        text        not null,
  name        text        not null,
  email       text,
  phone       text,
  address     text,
  details     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),

  constraint people_type_check      check (type in ('customer', 'staff', 'supplier')),
  constraint people_name_not_blank  check (length(trim(name)) > 0)
);

create index if not exists people_company_type_name_idx on public.people (company_id, type, name);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table if not exists public.products (
  id             uuid primary key default gen_random_uuid(),
  company_id     uuid          not null references public.companies (id) on delete cascade,
  name           text          not null,
  details        text,
  selling_price  numeric(12,2) not null default 0,
  buying_price   numeric(12,2) not null default 0,
  image_path     text,
  created_at     timestamptz   not null default now(),
  updated_at     timestamptz   not null default now(),

  constraint products_name_not_blank     check (length(trim(name)) > 0),
  constraint products_selling_price_check check (selling_price >= 0),
  constraint products_buying_price_check  check (buying_price >= 0)
);

create index if not exists products_company_name_idx on public.products (company_id, name);

-- ---------------------------------------------------------------------------
-- finance_entries
--   income : product_sale
--   expense: staff_salary, product_purchase, store_maintenance
-- ---------------------------------------------------------------------------
create table if not exists public.finance_entries (
  id           uuid primary key default gen_random_uuid(),
  company_id   uuid          not null references public.companies (id) on delete cascade,
  type         text          not null,
  category     text          not null,
  amount       numeric(14,2) not null,
  entry_date   date          not null default current_date,
  description  text,
  created_at   timestamptz   not null default now(),
  updated_at   timestamptz   not null default now(),

  constraint finance_amount_positive check (amount > 0),
  constraint finance_type_check      check (type in ('income', 'expense')),
  constraint finance_category_check  check (category in ('product_sale', 'staff_salary', 'product_purchase', 'store_maintenance')),
  constraint finance_type_matches_category check (
    (type = 'income'  and category = 'product_sale') or
    (type = 'expense' and category in ('staff_salary', 'product_purchase', 'store_maintenance'))
  )
);

create index if not exists finance_company_date_idx on public.finance_entries (company_id, entry_date desc);

-- ---------------------------------------------------------------------------
-- updated_at triggers (function created in 01_companies.sql)
-- ---------------------------------------------------------------------------
drop trigger if exists people_set_updated_at on public.people;
create trigger people_set_updated_at
  before update on public.people
  for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

drop trigger if exists finance_entries_set_updated_at on public.finance_entries;
create trigger finance_entries_set_updated_at
  before update on public.finance_entries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security: the tenant isolation rule
-- ---------------------------------------------------------------------------
alter table public.people          enable row level security;
alter table public.products        enable row level security;
alter table public.finance_entries enable row level security;

drop policy if exists people_tenant_isolation on public.people;
create policy people_tenant_isolation on public.people
  for all to authenticated
  using      (company_id = (select auth.uid()))
  with check (company_id = (select auth.uid()));

drop policy if exists products_tenant_isolation on public.products;
create policy products_tenant_isolation on public.products
  for all to authenticated
  using      (company_id = (select auth.uid()))
  with check (company_id = (select auth.uid()));

drop policy if exists finance_tenant_isolation on public.finance_entries;
create policy finance_tenant_isolation on public.finance_entries
  for all to authenticated
  using      (company_id = (select auth.uid()))
  with check (company_id = (select auth.uid()));

-- Anonymous (not signed in) visitors get nothing at all.
revoke all on public.people          from anon;
revoke all on public.products        from anon;
revoke all on public.finance_entries from anon;

grant select, insert, update, delete on public.people          to authenticated;
grant select, insert, update, delete on public.products        to authenticated;
grant select, insert, update, delete on public.finance_entries to authenticated;

-- ---------------------------------------------------------------------------
-- Monthly income / expense totals for the finance graph.
-- `security invoker` means it runs with the caller's rights, so Row Level Security
-- applies and a company can only ever total its own entries.
-- Always returns one row per month (zeros for empty months), oldest first.
-- ---------------------------------------------------------------------------
create or replace function public.finance_monthly_summary(p_months integer default 12)
returns table (
  month_start        date,
  income             numeric,
  staff_salary       numeric,
  product_purchase   numeric,
  store_maintenance  numeric
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    m.month::date                                                                      as month_start,
    coalesce(sum(e.amount) filter (where e.category = 'product_sale'),       0)        as income,
    coalesce(sum(e.amount) filter (where e.category = 'staff_salary'),       0)        as staff_salary,
    coalesce(sum(e.amount) filter (where e.category = 'product_purchase'),   0)        as product_purchase,
    coalesce(sum(e.amount) filter (where e.category = 'store_maintenance'),  0)        as store_maintenance
  from generate_series(
         date_trunc('month', current_date) - make_interval(months => greatest(least(p_months, 24), 1) - 1),
         date_trunc('month', current_date),
         interval '1 month'
       ) as m(month)
  left join public.finance_entries e
    on  e.company_id = (select auth.uid())
    and e.entry_date >= m.month::date
    and e.entry_date <  (m.month + interval '1 month')::date
  group by m.month
  order by m.month;
$$;

revoke all on function public.finance_monthly_summary(integer) from public, anon;
grant execute on function public.finance_monthly_summary(integer) to authenticated;

-- ---------------------------------------------------------------------------
-- Product images: a PRIVATE storage bucket. Each company can only touch files in
-- its own folder: product-images/<company_id>/...
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', false, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public             = false,
      file_size_limit    = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists product_images_select on storage.objects;
create policy product_images_select on storage.objects
  for select to authenticated
  using (bucket_id = 'product-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists product_images_insert on storage.objects;
create policy product_images_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists product_images_update on storage.objects;
create policy product_images_update on storage.objects
  for update to authenticated
  using      (bucket_id = 'product-images' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'product-images' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists product_images_delete on storage.objects;
create policy product_images_delete on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and (storage.foldername(name))[1] = (select auth.uid())::text);
