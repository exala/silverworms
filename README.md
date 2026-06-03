# SilverWorm Media

Role-based Next.js + Supabase starter for a ride-hailing LED advertising platform.

## Included

- Public marketing pages: `/`, `/about`, `/contact`, `/join-us`
- Email-first registration flows for drivers and companies
- Supabase email link callback and post-verification detail forms
- Role-aware dashboard routes
- Admin panel with driver list, company list, and campaign creation screen
- Supabase schema with tables, triggers, and row-level security
- Admin seed script for `admin@silverworms.com` / `admin123`

## Setup

1. Copy `.env.example` to `.env.local`
2. Add your Supabase project URL, anon key, and service role key
3. Run the SQL in [supabase/schema.sql](/d:/silverworm/supabase/schema.sql)
4. Install dependencies with `npm install`
5. Seed the admin account with `npm run seed:admin`
6. Start the app with `npm run dev`

## Notes

- Set your Supabase email redirect URL to `http://localhost:3000/auth/callback` during local development.
- In Vercel, set `NEXT_PUBLIC_SITE_URL` to your production origin, for example `https://your-domain.com`, without a trailing slash.
- In Supabase Auth URL Configuration: add `https://your-domain.com` to SITE URL & add both `http://localhost:3000/**` and your production callback URL, for example `https://your-domain.com/**`, to the allowed Redirect URLs.
- Driver and company signup starts with email only, then redirects to `/complete-registration` after verification.
- You can change the admin password later from Supabase Auth, or replace the auth provider entirely when you move to Clerk.

## Admin Account

To create the default admin account:

1. Make sure `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
2. Run `npm run seed:admin`
3. Sign in with `admin@silverworms.com` and password `admin123`

## Google Drive creative uploads

Campaign creative files upload directly to Google Drive through OAuth, so files use
the connected Google account's Drive storage quota.

1. Create a Google Cloud project.
2. Enable the Google Drive API.
3. Configure the OAuth consent screen.
4. Create an OAuth client ID for a web application.
5. Add this redirect URI: `http://localhost:3000/api/google-drive/callback`.
6. Create a Google Drive folder for campaign creatives and copy its folder ID.
7. Add `GOOGLE_OAUTH_CLIENT_ID`, `GOOGLE_OAUTH_CLIENT_SECRET`, and `GOOGLE_DRIVE_FOLDER_ID` to `.env`.
8. Start the app and visit `http://localhost:3000/api/google-drive/connect`.
9. Sign in with the Google account that should own uploaded files.
10. Copy the returned `GOOGLE_OAUTH_REFRESH_TOKEN` into `.env`, then restart the app.

Uploads are stored inside company-named folders under `GOOGLE_DRIVE_FOLDER_ID`.
When a campaign creative is replaced during edit, the existing Google Drive file is
updated in place using the saved `creative_file_id`.

The seed script will create or update the user in Supabase Auth and ensure the matching `profiles.role` is `ADMIN`.
