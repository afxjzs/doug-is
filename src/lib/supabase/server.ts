/**
 * Supabase Server Client - Official Pattern
 *
 * Server client following official Supabase Next.js guide:
 * https://supabase.com/docs/guides/auth/server-side/nextjs
 *
 * Creates a Supabase client for use in:
 * - Server Components
 * - Server Actions
 * - Route Handlers
 */

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "../types/supabase"

/**
 * Create a Supabase client for Server Components, Server Actions, and Route Handlers
 * Following official Next.js Supabase patterns
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
						cookiesToSet.forEach(({ name, value, options }) => {
							cookieStore.set(name, value, options)
						})
					} catch (error) {
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
 * Create a Supabase client with Service Role key for admin operations
 * Use only for admin operations that need to bypass RLS
 */
export async function createServiceRoleClient() {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_ROLE_KEY!,
		{
			cookies: {
				getAll() {
					return []
				},
				setAll() {
					// No-op for service role client
				},
			},
		}
	)
}

/**
 * Create a static Supabase client (for static generation)
 * Used in data layer for static content
 */
export function createStaticClient() {
	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return []
				},
				setAll() {
					// No-op for static client
				},
			},
		}
	)
}

/**
 * Get the current user using the official pattern
 */
export async function getUser() {
	const supabase = await createClient()
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	if (error) {
		console.error("Error getting user:", error)
		return null
	}

	return user
}

/**
 * Check if the current user is an admin
 * Uses simple environment-based admin check for now
 */
export async function isAdmin() {
	const user = await getUser()
	if (!user) return false

	// Simple admin check - later can be database-based
	const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
	return adminEmails.includes(user.email || "")
}

/**
 * Require admin access - use in Server Components that need admin auth
 * This follows the official pattern of checking auth in the component itself
 */
export async function requireAdmin() {
	const user = await getUser()
	const adminCheck = await isAdmin()

	if (!user || !adminCheck) {
		throw new Error("Admin access required")
	}

	return user
}
