/**
 * Simple Server-Side Authentication
 *
 * A clean, simple server-side authentication implementation using standard Supabase patterns.
 * Replaces the complex unified-auth.ts system that was causing issues.
 *
 * Features:
 * - Standard Supabase server client patterns
 * - Simple admin email validation
 * - No complex token refresh logic
 * - Clear error handling
 */

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { User } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

// Admin emails (same as before)
export const ADMIN_EMAILS = [
	"douglas.rogers@gmail.com",
	"test@testing.com",
] as const

// Cookie options
const COOKIE_OPTIONS = {
	httpOnly: false,
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	maxAge: 60 * 60 * 24 * 7, // 7 days
	path: "/",
}

/**
 * Create server client for authentication
 */
export async function createAuthServerClient() {
	const cookieStore = await cookies()

	return createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value
				},
				set(name: string, value: string, options: any) {
					try {
						cookieStore.set({ name, value, ...options })
					} catch (error) {
						// Handle cookie setting errors gracefully
						console.warn("Failed to set cookie:", error)
					}
				},
				remove(name: string, options: any) {
					try {
						cookieStore.set({ name, value: "", ...options })
					} catch (error) {
						// Handle cookie removal errors gracefully
						console.warn("Failed to remove cookie:", error)
					}
				},
			},
		}
	)
}

/**
 * Get current user from server-side session
 */
export async function getCurrentUser(): Promise<User | null> {
	try {
		const supabase = await createAuthServerClient()
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()

		if (error) {
			console.error("Error getting current user:", error)
			return null
		}

		return user
	} catch (error) {
		console.error("Error in getCurrentUser:", error)
		return null
	}
}

/**
 * Check if current user is admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
	try {
		const user = await getCurrentUser()

		if (!user?.email) {
			return false
		}

		return ADMIN_EMAILS.includes(
			user.email.toLowerCase() as (typeof ADMIN_EMAILS)[number]
		)
	} catch (error) {
		console.error("Error checking admin status:", error)
		return false
	}
}

/**
 * Get user session from server-side
 */
export async function getSession() {
	try {
		const supabase = await createAuthServerClient()
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession()

		if (error) {
			console.error("Error getting session:", error)
			return null
		}

		return session
	} catch (error) {
		console.error("Error in getSession:", error)
		return null
	}
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
	const user = await getCurrentUser()
	return user !== null
}

/**
 * Check if user is authenticated and admin
 */
export async function isAuthenticatedAdmin(): Promise<boolean> {
	const isAdmin = await isCurrentUserAdmin()
	return isAdmin
}
