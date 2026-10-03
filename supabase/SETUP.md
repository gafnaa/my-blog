# Library admin setup

The admin uses Supabase Auth and PostgREST. The public Library page is read-only; inserts, edits, and deletes require an authenticated account whose Supabase `app_metadata.role` is `admin`.

1. Create a Supabase project and run `supabase/library-schema.sql` in its SQL Editor.
2. In **Authentication → Users**, create your own user. Disable public sign-ups in **Authentication → Providers → Email**.
3. Mark that user as an admin from the SQL Editor (replace the email):

   ```sql
   update auth.users
   set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
   where email = 'you@example.com';
   ```

   Sign out and sign in again after changing metadata so the new role is in the access token.
4. Copy the project URL and anon/publishable key from **Project Settings → API** into `.env` locally and the matching Vercel environment variables. Never use a Supabase `service_role` key in the browser.
5. Request a RAWG API key at https://rawg.io/apidocs and set `PUBLIC_RAWG_API_KEY` locally and in Vercel. This enables game lookup. Book lookup uses the public Open Library Search API and needs no key.
6. Redeploy the site. Sign in at `/admin/login`; manage entries at `/admin`. Public changes appear at `/library` after refresh.

The included starter examples remain visible until at least one entry has been added to the Supabase table. After adding your own library entries, the database contents become the source for both sections.
