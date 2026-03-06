-- Local development baseline schema for doug.is
-- NOTE: intentionally scoped to public schema only. We do not mirror extra
-- production schemas (for example, pickem) in local development.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- POSTS
CREATE TABLE IF NOT EXISTS public.posts (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title TEXT NOT NULL,
	slug TEXT NOT NULL UNIQUE,
	content TEXT NOT NULL,
	excerpt TEXT NOT NULL DEFAULT '',
	category TEXT NOT NULL DEFAULT '',
	published_at TIMESTAMPTZ,
	featured_image TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS posts_published_at_idx ON public.posts (published_at);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON public.posts (slug);
CREATE INDEX IF NOT EXISTS posts_category_idx ON public.posts (category);

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS posts_public_read_policy ON public.posts;
CREATE POLICY posts_public_read_policy
ON public.posts
FOR SELECT
TO public
USING (published_at IS NOT NULL AND published_at <= now());

DROP POLICY IF EXISTS posts_admin_all_policy ON public.posts;
CREATE POLICY posts_admin_all_policy
ON public.posts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS public.contact_messages (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	name TEXT NOT NULL,
	email TEXT NOT NULL,
	subject TEXT NOT NULL DEFAULT '',
	message TEXT NOT NULL,
	is_read BOOLEAN NOT NULL DEFAULT false,
	read_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contact_messages_created_at_idx
	ON public.contact_messages (created_at);
CREATE INDEX IF NOT EXISTS contact_messages_read_at_idx
	ON public.contact_messages (read_at);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS contact_messages_public_insert_policy ON public.contact_messages;
CREATE POLICY contact_messages_public_insert_policy
ON public.contact_messages
FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS contact_messages_admin_select_policy ON public.contact_messages;
CREATE POLICY contact_messages_admin_select_policy
ON public.contact_messages
FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS contact_messages_admin_update_policy ON public.contact_messages;
CREATE POLICY contact_messages_admin_update_policy
ON public.contact_messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- USER ROLES
CREATE TABLE IF NOT EXISTS public.user_roles (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
	role TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	CONSTRAINT user_roles_role_check CHECK (role IN ('admin', 'editor', 'viewer')),
	CONSTRAINT user_roles_user_id_role_key UNIQUE (user_id, role)
);

CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON public.user_roles (user_id);
CREATE INDEX IF NOT EXISTS user_roles_role_idx ON public.user_roles (role);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS user_roles_admin_all_policy ON public.user_roles;
CREATE POLICY user_roles_admin_all_policy
ON public.user_roles
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- MIGRAINE TRIGGERS
CREATE TABLE IF NOT EXISTS public.migraine_triggers (
	id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
	food TEXT NOT NULL,
	trigger TEXT NOT NULL,
	reason TEXT,
	categories TEXT[],
	chemical_triggers TEXT[],
	source TEXT,
	notes TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS migraine_triggers_food_idx
	ON public.migraine_triggers (food);

ALTER TABLE public.migraine_triggers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS migraine_triggers_public_read_policy ON public.migraine_triggers;
CREATE POLICY migraine_triggers_public_read_policy
ON public.migraine_triggers
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS migraine_triggers_admin_all_policy ON public.migraine_triggers;
CREATE POLICY migraine_triggers_admin_all_policy
ON public.migraine_triggers
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- SHARED UPDATE TIMESTAMP TRIGGER
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = now();
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_posts_updated_at ON public.posts;
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON public.contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_user_roles_updated_at ON public.user_roles;
CREATE TRIGGER update_user_roles_updated_at
BEFORE UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_migraine_triggers_updated_at ON public.migraine_triggers;
CREATE TRIGGER update_migraine_triggers_updated_at
BEFORE UPDATE ON public.migraine_triggers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.posts TO anon;
GRANT SELECT ON public.migraine_triggers TO anon;
GRANT INSERT ON public.contact_messages TO anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.posts TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contact_messages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.migraine_triggers TO authenticated;

