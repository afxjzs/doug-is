/**
 * This file contains server-side utilities for Supabase authentication.
 * It handles creating authenticated clients and managing sessions
 * from server components and API routes.
 */

import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "../types/supabase"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Specific admin email - only this account has admin access
const ALLOWED_ADMIN_EMAILS = ["douglas.rogers@gmail.com"]

/**
 * Creates a Supabase client for server-side authentication
 * using the built-in cookies() function from Next.js
 */
export async function createSupabaseServerClient() {
	const cookieStore = await cookies()

	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name) {
				return cookieStore.get(name)?.value
			},
			set(name, value, options) {
				cookieStore.set({ name, value, ...options })
			},
			remove(name, options) {
				cookieStore.set({ name, value: "", ...options, maxAge: 0 })
			},
		},
	})
}

/**
 * Gets the current session from the server
 * Used in server components and API routes
 */
export async function getServerSession() {
	const supabase = await createSupabaseServerClient()

	try {
		const {
			data: { session },
		} = await supabase.auth.getSession()
		return session
	} catch (error) {
		console.error("Error getting session:", error)
		return null
	}
}

/**
 * Gets the current user from the server
 * Used in server components and API routes
 * Uses getUser() which authenticates with the Supabase Auth server
 */
export async function getServerUser() {
	const supabase = await createSupabaseServerClient()

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
 * Checks if the current user is an admin
 * Uses an allowlist of specific admin email addresses
 */
export async function isAdminUser() {
	const user = await getServerUser()

	if (!user || !user.email) return false

	// Check against the specific allowlist of admin emails
	return ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())
}
