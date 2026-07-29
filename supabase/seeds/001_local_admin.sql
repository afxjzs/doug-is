-- Local development seed: an admin user for /admin
--
-- LOCAL ONLY. scripts/reset-local-supabase.sh deletes the Docker volumes, which
-- wipes the entire cluster including the auth schema — not just the public
-- tables. Without this seed, every reset leaves auth.users and user_roles empty,
-- which means no admin login and a /admin that rejects you. This file restores
-- that automatically.
--
--   email:    admin@local.doug.is
--   password: localdev-admin
--
-- These credentials are deliberately fake and are only ever applied to the local
-- stack on 127.0.0.1:54332. Do not add real credentials here — this file is
-- committed to a public repository.
--
-- Idempotent: safe to run repeatedly. Re-running will not duplicate the user or
-- the role, and will not reset an existing password.
--
-- Notes on the auth schema, which is fussier than it looks:
--   * pgcrypto lives in the `extensions` schema on Supabase, so crypt/gen_salt
--     must be schema-qualified.
--   * auth.identities.email is GENERATED ALWAYS and cannot be inserted into.
--   * An auth.identities row is required; GoTrue will not authenticate an
--     email/password user that has none, even with a valid encrypted_password.
--   * The *_token and *_change columns must be '' and NOT NULL. GoTrue scans
--     them into non-nullable Go strings, so a NULL there fails every login with
--     a 500 "Database error querying schema" that says nothing about the cause.
--     Four of them have no default and must be set explicitly.

DO $$
DECLARE
	v_user_id  uuid;
	v_email    text := 'admin@local.doug.is';
	v_password text := 'localdev-admin';
BEGIN
	SELECT id INTO v_user_id FROM auth.users WHERE email = v_email;

	IF v_user_id IS NULL THEN
		v_user_id := gen_random_uuid();

		INSERT INTO auth.users (
			id,
			instance_id,
			aud,
			role,
			email,
			encrypted_password,
			email_confirmed_at,
			created_at,
			updated_at,
			raw_app_meta_data,
			raw_user_meta_data,
			is_sso_user,
			is_anonymous,
			confirmation_token,
			recovery_token,
			email_change_token_new,
			email_change,
			email_change_token_current,
			phone_change,
			phone_change_token,
			reauthentication_token
		) VALUES (
			v_user_id,
			'00000000-0000-0000-0000-000000000000',
			'authenticated',
			'authenticated',
			v_email,
			extensions.crypt(v_password, extensions.gen_salt('bf')),
			now(),
			now(),
			now(),
			'{"provider":"email","providers":["email"]}'::jsonb,
			'{}'::jsonb,
			false,
			false,
			'',
			'',
			'',
			'',
			'',
			'',
			'',
			''
		);

		INSERT INTO auth.identities (
			id,
			provider_id,
			user_id,
			identity_data,
			provider,
			last_sign_in_at,
			created_at,
			updated_at
		) VALUES (
			gen_random_uuid(),
			v_user_id::text,
			v_user_id,
			jsonb_build_object(
				'sub', v_user_id::text,
				'email', v_email,
				'email_verified', true
			),
			'email',
			now(),
			now(),
			now()
		);

		RAISE NOTICE 'Seed: created local admin user %', v_email;
	ELSE
		RAISE NOTICE 'Seed: local admin user % already exists', v_email;
	END IF;

	-- Repair a user created before this fix, or by any other tool that left
	-- NULLs in these columns. Without this the seed's existence check would
	-- short-circuit and a broken row would survive every re-run.
	UPDATE auth.users
	SET confirmation_token         = COALESCE(confirmation_token, ''),
	    recovery_token             = COALESCE(recovery_token, ''),
	    email_change_token_new     = COALESCE(email_change_token_new, ''),
	    email_change               = COALESCE(email_change, ''),
	    email_change_token_current = COALESCE(email_change_token_current, ''),
	    phone_change               = COALESCE(phone_change, ''),
	    phone_change_token         = COALESCE(phone_change_token, ''),
	    reauthentication_token     = COALESCE(reauthentication_token, '')
	WHERE id = v_user_id;

	INSERT INTO public.user_roles (user_id, role)
	VALUES (v_user_id, 'admin')
	ON CONFLICT (user_id, role) DO NOTHING;
END
$$;
