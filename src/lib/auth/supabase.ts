/**
 * Centralized Supabase client creation
 */
import { createBrowserClient } from "@supabase/ssr"
import { createServerClient } from "@supabase/ssr"
import { NextRequest, NextResponse } from "next/server"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// List of admin emails
export const ALLOWED_ADMIN_EMAILS = ["douglas.rogers@gmail.com"]

/**
 * Centralized cookie settings to maintain consistency
 */
export const COOKIE_OPTIONS = {
	// Set more permissive SameSite attribute to help with redirects
	sameSite: "lax" as const,
	// Secure in production
	secure: process.env.NODE_ENV === "production",
	// Extended max age to 30 days
	maxAge: 60 * 60 * 24 * 30, // 30 days
	// Ensure cookies work across the entire domain
	path: "/",
	// Set domain for production environments
	...(process.env.NODE_ENV === "production" && {
		domain: ".doug.is",
	}),
}

/**
 * Check if a user has admin privileges
 */
export function isAdmin(email?: string | null): boolean {
	if (!email) return false
	return ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase())
}

/**
 * Create a Supabase client for browser usage
 */
export function createClient() {
	return createBrowserClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookieOptions: COOKIE_OPTIONS,
		}
	)
}

/**
 * Create a Supabase client for use in middleware
 */
export function createMiddlewareClient(req: NextRequest, res: NextResponse) {
	return createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			get(name: string) {
				return req.cookies.get(name)?.value
			},
			set(name: string, value: string, options: any) {
				// Apply centralized cookie options
				const cookieOptions = {
					...options,
					...COOKIE_OPTIONS,
				}
				res.cookies.set({
					name,
					value,
					...cookieOptions,
				})
			},
			remove(name: string, options: any) {
				// Apply centralized cookie options when removing
				const cookieOptions = {
					...options,
					...COOKIE_OPTIONS,
					maxAge: 0, // Override maxAge for cookie removal
				}
				res.cookies.set({
					name,
					value: "",
					...cookieOptions,
				})
			},
		},
	})
}
