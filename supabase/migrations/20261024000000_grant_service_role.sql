-- The server's service-role client (createServiceRoleClient / createAdminClient)
-- writes posts and saves leads. Production has these grants already (leads
-- save there), but a fresh local database built by a recent Supabase CLI gives
-- service_role only REFERENCES/TRIGGER/TRUNCATE, so every service-role read or
-- write fails locally with "permission denied". Granting is a no-op where the
-- grant already exists.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.migraine_triggers TO service_role;
