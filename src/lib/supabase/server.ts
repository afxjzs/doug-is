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
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "../types/supabase"
import { getDatabaseConfig } from "./environment"

/**
 * Create a Supabase client for Server Components, Server Actions, and Route Handlers
 * Automatically selects local or production database
 */
export async function createClient() {
	const cookieStore = await cookies()
	const config = getDatabaseConfig()

	return createServerClient<Database>(config.url, config.anonKey, {
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
	})
}

/**
 * Create a Supabase client with service role key for admin operations
 * This client bypasses RLS and should only be used in secure server contexts
 * Automatically selects local or production database
 */
export function createServiceRoleClient() {
	if (typeof window !== "undefined") {
		throw new Error("Service role client can only be used on the server")
	}

	const config = getDatabaseConfig()

	if (!config.serviceRoleKey) {
		throw new Error("Service role key is missing")
	}

	return createSupabaseClient(config.url, config.serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	})
}

/**
 * Create a static Supabase client (for static generation)
 * Used in data layer for static content
 * Automatically selects local or production database
 */
export function createStaticClient() {
	const config = getDatabaseConfig()

	return createServerClient<Database>(config.url, config.anonKey, {
		cookies: {
			getAll() {
				return []
			},
			setAll() {
				// No-op for static client
			},
		},
	})
}

/**
 * Get the current user from the server client
 */
export async function getUser() {
	const supabase = await createClient()
	try {
		const {
			data: { user },
		} = await supabase.auth.getUser()
		return user
	} catch (error) {
		console.error("Error getting user:", error)
		return null
	}
}

/**
 * Check if the current user is an admin
 */
export async function isAdmin() {
	const user = await getUser()
	if (!user?.email) return false

	const adminEmails = (
		process.env.ADMIN_EMAILS || "doug@doug.is"
	)
		.split(",")
		.map((email) => email.trim().toLowerCase())

	return adminEmails.includes(user.email.toLowerCase())
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
