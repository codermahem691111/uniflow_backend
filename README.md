# ERP backend (NestJS + Supabase)

Multi-tenant ERP API. Each company registers once and then manages **its own** people, products and finances.

| Service | Table | What it holds |
| --- | --- | --- |
| Login / company | `companies` (+ Supabase Auth) | company details, linked to the login |
| People management | `people` | customers, staff, suppliers |
| Product management | `products` (+ private `product-images` bucket) | name, details, selling price, buying price, image |
| Finance management | `finance_entries` | income (product sale) and 3 expenses (staff salary, product buying, store maintenance) |

## How each company's data stays private

One company can never see another company's data. This is enforced in three layers:

1. **The database itself (Row Level Security).** Every row carries `company_id`, which is the owner's login id. The policies say a row is visible or changeable only when `company_id = auth.uid()`. The backend talks to the database *as the signed-in user* (it forwards the user's token), so Postgres applies this rule even if application code forgot a filter.
2. **The application.** `TenantGuard` builds a `TenantScope` from the verified token. Every repository query filters on `scope.companyId`, and every insert writes it. The company id is never read from the request body, so a client cannot choose it.
3. **Image storage.** Product images live in a private bucket under `<company id>/<product id>/...`, with storage policies that only allow your own folder. Images are shown through temporary signed links.

Asking for another company's record returns `404 Not found`, exactly as if it did not exist.

## Setup

### 1. Environment
```bash
yarn install
cp .env.example .env
```

| Variable | Where to find it |
| --- | --- |
| `SUPABASE_URL` | Project Settings -> API -> **Project URL** (`https://xxxx.supabase.co`) |
| `SUPABASE_PUBLISHABLE_KEY` | Project Settings -> API Keys -> **Publishable key** (`sb_publishable_...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings -> API Keys -> **Secret key** (`sb_secret_...`). Never share it or put it in the frontend. |
| `FRONTEND_URL` | `https://unified-frontend-henna.vercel.app` in production (`http://localhost:5173` locally) |

Use real keys from the same Supabase project as `SUPABASE_URL`; do not leave example or placeholder text in `.env`. The backend accepts current `sb_publishable_...` / `sb_secret_...` keys and legacy `anon` / `service_role` JWT keys.

### 2. Create the tables (two SQL files, in this order)
Supabase -> **SQL Editor** -> New query -> paste, then **Run**:

1. `database/01_companies.sql` – skip it if you already ran the earlier `schema.sql` (same table).
2. `database/02_business_tables.sql` – creates `people`, `products`, `finance_entries`, the security policies, the monthly-totals function and the private image bucket. Safe to run more than once.

### 3. Configure Supabase Auth (dashboard)
1. **Authentication -> Sign In / Providers -> Email**: **Confirm email** ON.
2. **Authentication -> URL Configuration**: Set the production **Site URL** to `https://unified-frontend-henna.vercel.app` and add `https://unified-frontend-henna.vercel.app/email-verified` to **Redirect URLs**. For local development, also add `http://localhost:5173` and `http://localhost:5173/email-verified`.
3. **Email delivery**: Supabase's built-in sender only reaches members of your Supabase organization (2 emails/hour). For any recipient, use **Authentication -> Emails -> SMTP Settings** with Gmail (app password) or a service on your own domain (Resend, Postmark, Brevo).

### 4. Run
```bash
yarn start:dev      # http://localhost:3000/api
```

## Check that companies are really isolated
1. Register and verify **two** companies (A and B, with two different emails).
2. Sign in as A, add a person, a product (with an image) and a few finance entries.
3. Sign in as B (use a private window). People, Products and Finance must all be empty, and B's graph must show zeros.
4. Add something as B, then sign in as A again: A must still see only A's data.
5. In Supabase **Table Editor** you can see both companies' rows side by side, each with its own `company_id`. That is the administrator view; nobody using the app can see it.

## API (all `/api`)

Auth
| Method | Path | Notes |
| --- | --- | --- |
| POST | `/auth/register` | companyName, licenseNumber, email, ownerName, businessDescription, password |
| POST | `/auth/resend-verification` | email |
| POST | `/auth/login` | `{ accessToken, refreshToken, company }`; 403 `EMAIL_NOT_VERIFIED` if unverified |
| POST | `/auth/refresh` | refreshToken |
| POST | `/auth/logout`, GET `/auth/me` | need `Authorization: Bearer <accessToken>` |

Business services (all need `Authorization: Bearer <accessToken>` and a verified email)
| Method | Path | Notes |
| --- | --- | --- |
| GET | `/people` | `?page=&pageSize=&search=&type=customer\|staff\|supplier` |
| POST / PATCH `/:id` / DELETE `/:id` | `/people` | type, name, email, phone, address, details |
| GET | `/products` | `?page=&pageSize=&search=` |
| POST / PATCH `/:id` / DELETE `/:id` | `/products` | name, details, sellingPrice, buyingPrice |
| POST / DELETE | `/products/:id/image` | multipart field `image`; JPEG, PNG or WebP, max 2 MB |
| GET | `/finance` | `?page=&pageSize=&search=&type=&category=&from=&to=` |
| GET | `/finance/summary` | `?months=12` (1-24): monthly income, expense, profit and category totals for the graph |
| POST / PATCH `/:id` / DELETE `/:id` | `/finance` | category (`product_sale`, `staff_salary`, `product_purchase`, `store_maintenance`), amount, entryDate, description |

Income is always `product_sale`; the type (income or expense) is derived from the category, so the two can never disagree.

## Structure
```
database/        01_companies.sql, 02_business_tables.sql
src/
├── config/      typed, validated environment
├── supabase/    SupabaseService (clients, including one that acts as the user), SupabaseAuthService
├── tenancy/     TenantScope, TenantGuard, TenantRepository (base class for every tenant table)
├── companies/   company profile
├── auth/        register, login, refresh, logout
├── people/      controller -> service -> repository
├── products/    controller -> service -> repository, image storage + image checks
├── finance/     controller -> service -> repository (monthly totals computed in the database)
└── common/      pagination, search cleaning, decorators, exceptions
```
Every piece of logic is an injectable class that receives its dependencies through its constructor. A new service = a new table with `company_id` + the same policy, and a repository that extends `TenantRepository`.

## Troubleshooting
- **`SUPABASE_URL must be the Project URL`** – use the `https://...supabase.co` URL, not the `postgresql://` string.
- **`Invalid API key`** – replace any example or placeholder values in `.env` with the publishable and secret keys from the project identified by `SUPABASE_URL`. The application validates key formats at startup, but Supabase must still verify that each key belongs to that project.
- **`Could not find the table 'public.people'`** – run `database/02_business_tables.sql`.
- **`Email delivery is not set up for this address yet`** – set up custom SMTP (step 3).
- **Images do not show** – run `02_business_tables.sql` again (it creates the `product-images` bucket); links expire after about an hour, reload the page.
