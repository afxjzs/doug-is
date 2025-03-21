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
 * Creates a Supabase client for server-side authentication
 * using the built-in cookies() function from Next.js
 *
 * In Next.js 15, cookies() is an async function, and we properly
 * handle that here by using it with await.
 */
export async function createSupabaseServerClient() {
	// Get cookie store with await for Next.js 15 compatibility
	const cookieStore = await cookies()

	// Create a cookie handler that works with the createServerClient API
	const cookieHandler = {
		get(name: string) {
			try {
				return cookieStore.get(name)?.value
			} catch (e) {
				console.error("Error getting cookie:", e)
				return undefined
			}
		},
		set(name: string, value: string, options: any) {
			try {
				cookieStore.set({ name, value, ...options })
			} catch (e) {
				console.error("Error setting cookie:", e)
			}
		},
		remove(name: string, options: any) {
			try {
				cookieStore.set({ name, value: "", ...options, maxAge: 0 })
			} catch (e) {
				console.error("Error removing cookie:", e)
			}
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
 * Uses getUser() which authenticates with the Supabase Auth server
 */
export async function getServerUser() {
	const supabase = await createSupabaseServerClient()

	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()

		if (error) {
			console.error("Auth error getting user:", error.message)
			return null
		}

		return user
	} catch (error) {
		console.error("Unexpected error getting user:", error)
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
