/**
 * Unified Authentication System
 *
 * This module provides a single, secure authentication implementation
 * following Next.js 15 and Supabase SSR best practices.
 *
 * SECURITY: Uses getUser() instead of insecure getSession()
 * ARCHITECTURE: Consolidates 8+ fragmented client implementations
 * CONSISTENCY: Single source of truth for all authentication
 */

import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { CookieOptions } from "@supabase/ssr"
import type { Database } from "../types/supabase"

// Environment variables with validation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error("Missing required Supabase environment variables")
}

// Admin email configuration
export const ADMIN_EMAILS = ["douglas.rogers@gmail.com"] as const

// Centralized cookie configuration
const COOKIE_OPTIONS: CookieOptions = {
	httpOnly: false,
	sameSite: "lax",
	secure: process.env.NODE_ENV === "production",
	maxAge: 60 * 60 * 24 * 7, // 7 days
	path: "/",
}

/**
 * Browser Client - For client-side components
 * Uses createBrowserClient with proper cookie handling
 */
export function createBrowserSupabaseClient() {
	return createBrowserClient<Database>(supabaseUrl!, supabaseAnonKey!, {
		cookieOptions: COOKIE_OPTIONS,
	})
}

/**
 * Server Client - For server components, API routes, middleware
 * Uses createServerClient with proper cookie handling
 */
export async function createServerSupabaseClient() {
	const cookieStore = await cookies()

	return createServerClient<Database>(supabaseUrl!, supabaseAnonKey!, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value
			},
			set(name: string, value: string, options: CookieOptions) {
				try {
					cookieStore.set({
						name,
						value,
						...COOKIE_OPTIONS,
						...options,
					})
				} catch (error) {
					// Handle server component limitations
					console.warn("Cannot set cookie in server component:", name)
				}
			},
			remove(name: string, options: CookieOptions) {
				try {
					cookieStore.set({
						name,
						value: "",
						...COOKIE_OPTIONS,
						...options,
						maxAge: 0,
					})
				} catch (error) {
					// Handle server component limitations
					console.warn("Cannot remove cookie in server component:", name)
				}
			},
		},
	})
}

/**
 * Admin Client - For administrative operations requiring service role
 * Only use when explicitly needed for admin operations
 */
export function createAdminSupabaseClient() {
	if (!supabaseServiceKey) {
		throw new Error("Service role key required for admin operations")
	}

	return createBrowserClient<Database>(supabaseUrl!, supabaseServiceKey, {
		auth: {
			persistSession: false,
		},
	})
}

/**
 * SECURE User Authentication - Server Side
 * Uses getUser() instead of insecure getSession()
 */
export async function getCurrentUser() {
	try {
		const supabase = await createServerSupabaseClient()

		// Use SECURE getUser() method that validates with auth server
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()

		if (error) {
			console.warn("Authentication error:", error.message)
			return null
		}

		return user
	} catch (error) {
		console.error("Error getting current user:", error)
		return null
	}
}

/**
 * SECURITY FIX: Removed getCurrentSession function - it was unused and contained getSession() calls
 * Session data is not needed for security decisions and was causing warnings
 */

/**
 * Admin Check - Secure validation
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
 * Admin User Check with detailed response
 */
export async function getAdminUserStatus() {
	try {
		const user = await getCurrentUser()
		const isAdmin = await isCurrentUserAdmin()

		return {
			user,
			isAdmin,
			isAuthenticated: !!user,
		}
	} catch (error) {
		console.error("Error getting admin user status:", error)
		return {
			user: null,
			isAdmin: false,
			isAuthenticated: false,
		}
	}
}
