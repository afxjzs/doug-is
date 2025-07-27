/**
 * Supabase Server Client
 *
 * Creates a Supabase client for use in server components, server actions, and API routes.
 * Uses the official @supabase/ssr package for proper SSR support.
 */

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "../types/supabase"

/**
 * Create a Supabase client for server-side operations
 */
export async function createClient() {
	const cookieStore = await cookies()

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return cookieStore.getAll()
				},
				setAll(cookiesToSet) {
					try {
						cookiesToSet.forEach(({ name, value, options }) =>
							cookieStore.set(name, value, options)
						)
					} catch {
						// The `setAll` method was called from a Server Component.
						// This can be ignored if you have middleware refreshing
						// user sessions.
					}
				},
			},
		}
	)
}

/**
 * Create a Supabase client for static generation (no cookies)
 * Use this for generateStaticParams and other build-time operations
 */
export async function createStaticClient() {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return []
				},
				setAll() {
					// No-op for static generation
				},
			},
		}
	)
}

/**
 * Create a Supabase client with service role privileges.
 * Use this for admin operations that require bypassing RLS.
 * WARNING: This should only be used in trusted server-side code.
 */
export function createServiceRoleClient() {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			cookies: {
				getAll() {
					return []
				},
				setAll() {
					// No-op
				},
			},
		}
	)
}
