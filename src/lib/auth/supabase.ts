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
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
				res.cookies.set({
					name,
					value,
					...options,
					sameSite: "lax",
					path: "/",
				})
			},
			remove(name: string, options: any) {
				res.cookies.set({
					name,
					value: "",
					...options,
					maxAge: 0,
					path: "/",
				})
			},
		},
	})
}
