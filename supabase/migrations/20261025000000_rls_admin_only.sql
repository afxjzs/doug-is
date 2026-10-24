-- Admin-only database access.
--
-- The anon key is public, so these policies are the only thing between the
-- Data API and the data. Before this migration production carried policies
-- left over from deleted migrations and dashboard edits, and every
-- "authenticated" policy was USING (true): any signed-in account could read
-- every lead, read drafts, edit or delete posts, and write user_roles. Two
-- leftover anon policies also exposed future-scheduled posts and user_roles.
--
-- After it:
--   anon            read live published posts and migraine triggers, insert a
--                   contact message. Nothing else.
--   authenticated   the same, plus whatever public.is_admin() allows.
--   admin           a user_roles row (role 'admin') for auth.uid(). Only the
--                   service role can write user_roles, so no user can grant it.
--   service_role    bypasses RLS (server code uses it for lead capture and
--                   admin pages).
--
-- Every DROP uses IF EXISTS: local databases start from the baseline only,
-- while production has the extra legacy names listed below.

-- Admin check used by every write/private-read policy. SECURITY INVOKER: it
-- reads the caller's own user_roles row through the self-read policy below.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = ''
AS $$
	SELECT EXISTS (
		SELECT 1 FROM public.user_roles
		WHERE user_id = auth.uid() AND role = 'admin'
	);
$$;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;

-- ---------------------------------------------------------------- posts
DROP POLICY IF EXISTS "Admins can manage all posts" ON public.posts;
DROP POLICY IF EXISTS "Allow anonymous read access to published posts" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated users to read all posts" ON public.posts;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.posts;
DROP POLICY IF EXISTS "Public can view published posts" ON public.posts;
DROP POLICY IF EXISTS "Allow public read access to published posts" ON public.posts;
DROP POLICY IF EXISTS "Allow authenticated users to manage posts" ON public.posts;
DROP POLICY IF EXISTS "service_role can do anything" ON public.posts;
DROP POLICY IF EXISTS posts_admin_all_policy ON public.posts;
DROP POLICY IF EXISTS posts_public_read_policy ON public.posts;

CREATE POLICY posts_public_read_policy ON public.posts
	FOR SELECT TO anon, authenticated
	USING (published_at IS NOT NULL AND published_at <= now());

CREATE POLICY posts_admin_all_policy ON public.posts
	FOR ALL TO authenticated
	USING (public.is_admin())
	WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------- contact_messages
DROP POLICY IF EXISTS "Allow admins to insert contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow admins to select contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated users to read contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Anyone can insert contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only authenticated users can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only authenticated users can update contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "service_role can do anything" ON public.contact_messages;
DROP POLICY IF EXISTS contact_messages_admin_read_policy ON public.contact_messages;
DROP POLICY IF EXISTS contact_messages_admin_select_policy ON public.contact_messages;
DROP POLICY IF EXISTS contact_messages_admin_update_policy ON public.contact_messages;
DROP POLICY IF EXISTS contact_messages_public_insert_policy ON public.contact_messages;

CREATE POLICY contact_messages_public_insert_policy ON public.contact_messages
	FOR INSERT TO anon, authenticated
	WITH CHECK (true);

CREATE POLICY contact_messages_admin_select_policy ON public.contact_messages
	FOR SELECT TO authenticated
	USING (public.is_admin());

CREATE POLICY contact_messages_admin_update_policy ON public.contact_messages
	FOR UPDATE TO authenticated
	USING (public.is_admin())
	WITH CHECK (public.is_admin());

-- ---------------------------------------------------------------- user_roles
DROP POLICY IF EXISTS "Allow anonymous read access to user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Allow authenticated users to read all roles" ON public.user_roles;
DROP POLICY IF EXISTS user_roles_admin_all_policy ON public.user_roles;
DROP POLICY IF EXISTS user_roles_self_read_policy ON public.user_roles;

-- A user may read only their own roles (is_admin() needs this). No write
-- policy at all: only the service role (which bypasses RLS) can grant roles.
CREATE POLICY user_roles_self_read_policy ON public.user_roles
	FOR SELECT TO authenticated
	USING (user_id = auth.uid());

REVOKE ALL ON public.user_roles FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.user_roles FROM authenticated;

-- ---------------------------------------------------------------- migraine_triggers
DROP POLICY IF EXISTS "Allow public read access to migraine_triggers" ON public.migraine_triggers;
DROP POLICY IF EXISTS migraine_triggers_public_read ON public.migraine_triggers;
DROP POLICY IF EXISTS migraine_triggers_public_read_policy ON public.migraine_triggers;
DROP POLICY IF EXISTS migraine_triggers_admin_all_policy ON public.migraine_triggers;

CREATE POLICY migraine_triggers_public_read_policy ON public.migraine_triggers
	FOR SELECT TO anon, authenticated
	USING (true);

CREATE POLICY migraine_triggers_admin_all_policy ON public.migraine_triggers
	FOR ALL TO authenticated
	USING (public.is_admin())
	WITH CHECK (public.is_admin());
