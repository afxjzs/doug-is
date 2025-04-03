import { User } from "@supabase/supabase-js"
import { ALLOWED_ADMIN_EMAILS } from "./supabase"

/**
 * Shared auth utility functions for both client and server
 */

// List of allowed admin emails
export const ALLOWED_ADMIN_EMAILS_LIST = [
	"afxjzs@gmail.com",
	"doug@doug.is",
].map((email) => email.toLowerCase())

// Cookie domain handling
export function getCookieDomain(): string | undefined {
	// In development (localhost), don't set the domain at all
	if (process.env.NODE_ENV !== "production") {
		return undefined
	}

	// In production, use the root domain
	return ".doug.is"
}

// Get Supabase project reference from URL for cookie naming
export function getSupabaseStorageKey(): string {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
	const PROJECT_REF = supabaseUrl.match(/https:\/\/(.*?)\.supabase/)?.[1] || ""

	// Supabase uses this format for cookie names
	return PROJECT_REF ? `sb-${PROJECT_REF}-auth-token` : "sb-auth-token"
}

// Cookie expiration time - 7 days in seconds
export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

/**
 * Check if a user is an admin based on their email
 * This can be used in both server and client components
 */
export function isAdminUser(user: User | null): boolean {
	if (!user || !user.email) return false
	return ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())
}
