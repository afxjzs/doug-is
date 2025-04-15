"use server"

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
 * Creates a read-only Supabase client for server-side components
 * Important: This version ONLY reads cookies, it doesn't try to set or remove them
 * which would cause errors in server components
 */
export async function createSupabaseServerClient() {
	// Get cookie store with await for Next.js 15 compatibility
	const cookieStore = await cookies()

	// Create a cookie handler that works with the createServerClient API
	// This is a READ-ONLY version that doesn't try to modify cookies
	const cookieHandler = {
		get(name: string) {
			try {
				return cookieStore.get(name)?.value
			} catch (e) {
				console.error("Error getting cookie:", e)
				return undefined
			}
		},
		// These functions do nothing in server components to prevent errors
		set(name: string, value: string, options: any) {
			// Do nothing - can't set cookies in server components
			// This prevents errors, but means auth state changes won't be saved
			// This is OK for read-only operations like checking auth status
		},
		remove(name: string, options: any) {
			// Do nothing - can't remove cookies in server components
			// This prevents errors, but means auth state changes won't be saved
			// This is OK for read-only operations like checking auth status
		},
	}

	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: cookieHandler,
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
 * Uses getSession() instead of getUser() to avoid authentication errors
 */
export async function getServerUser() {
	const supabase = await createSupabaseServerClient()

	try {
		// Use getSession instead of getUser to avoid authentication errors
		// getUser requires an active connection to Supabase's auth server
		const { data } = await supabase.auth.getSession()

		return data.session?.user || null
	} catch (error) {
		console.error("Unexpected error getting user:", error)
		return null
	}
}

/**
 * Checks if the current user is an admin
 * Uses an allowlist of specific admin email addresses
 * This avoids querying the user_roles table, which can cause permission issues
 */
export async function isAdminUser() {
	const user = await getServerUser()

	if (!user || !user.email) return false

	// Check against the specific allowlist of admin emails
	return ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())
}
