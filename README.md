# SilverWorm Media

Role-based Next.js + Supabase starter for a ride-hailing LED advertising platform.

## Included

- Public marketing pages: `/`, `/about`, `/contact`, `/join-us`
- Email-first registration flows for drivers and companies
- Supabase email link callback and post-verification detail forms
- Role-aware dashboard routes
- Admin panel with driver list, company list, and campaign creation screen
- Supabase schema with tables, triggers, and row-level security
- Admin seed script for `admin@silverworm.com` / `admin123`

## Setup

1. Copy `.env.example` to `.env.local`
2. Add your Supabase project URL, anon key, and service role key
3. Run the SQL in [supabase/schema.sql](/d:/silverworm/supabase/schema.sql)
4. Install dependencies with `npm install`
5. Seed the admin account with `npm run seed:admin`
6. Start the app with `npm run dev`

## Notes

- Set your Supabase email redirect URL to `http://localhost:3000/auth/callback` during local development.
- Driver and company signup starts with email only, then redirects to `/complete-registration` after verification.
- You can change the admin password later from Supabase Auth, or replace the auth provider entirely when you move to Clerk.

## Admin Account

To create the default admin account:

1. Make sure `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
2. Run `npm run seed:admin`
3. Sign in with `admin@silverworm.com` and password `admin123`

The seed script will create or update the user in Supabase Auth and ensure the matching `profiles.role` is `ADMIN`.
