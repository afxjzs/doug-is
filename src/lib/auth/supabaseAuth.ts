/**
 * This file contains utilities for Supabase authentication.
 * It handles creating authenticated clients and managing sessions.
 */

import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import type { Database } from "../types/supabase"

/**
 * Environment variables for Supabase authentication
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Single admin email - only this account has admin access
const ALLOWED_ADMIN_EMAILS = ["douglas.rogers@gmail.com"]

/**
 * Creates a Supabase client for server-side authentication operations
 * This client includes proper cookie handling for auth persistence
 */
export async function createServerSupabaseAuthClient() {
	const cookieStore = await cookies()

	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return cookieStore.get(name)?.value
			},
			set(name: string, value: string, options: CookieOptions) {
				cookieStore.set({ name, value, ...options })
			},
			remove(name: string, options: CookieOptions) {
				cookieStore.set({ name, value: "", ...options, maxAge: 0 })
			},
		},
	})
}

/**
 * Creates a Supabase auth client specifically for middleware operations
 * This is needed because middleware has a different context for cookies
 */
export function createMiddlewareSupabaseAuthClient(request: NextRequest) {
	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return request.cookies.get(name)?.value
			},
			set(name: string, value: string, options: CookieOptions) {
				// In middleware, we need to use the NextResponse to set cookies
				// This will be handled in the middleware function
			},
			remove(name: string, options: CookieOptions) {
				// In middleware, we need to use the NextResponse to remove cookies
				// This will be handled in the middleware function
			},
		},
	})
}

/**
 * Gets the current user session from the Supabase auth client
 * Returns null if not authenticated
 * @deprecated Use getUser() instead which is more secure
 */
export async function getSession() {
	const supabase = await createServerSupabaseAuthClient()
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
 * Checks if a user is authenticated and returns user data if they are
 * Returns null if not authenticated
 * Uses getUser() which authenticates with the auth server instead of
 * relying on potentially insecure session data
 */
export async function getUser() {
	const supabase = await createServerSupabaseAuthClient()
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
export async function isAdmin() {
	const user = await getUser()

	if (!user || !user.email) return false

	// Check against the specific allowlist of admin emails
	return ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())
}
