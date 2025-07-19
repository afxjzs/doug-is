/**
 * Best practice logout API route
 * Uses Supabase SSR client for proper session management
 */

import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { COOKIE_OPTIONS } from "@/lib/auth/supabase"

export async function GET() {
	// Get cookie store
	const cookieStore = await cookies()

	// Create Supabase SSR client for proper session management
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value
				},
				set(name: string, value: string, options: any) {
					// Apply centralized cookie options
					const cookieOptions = {
						...options,
						...COOKIE_OPTIONS,
					}
					cookieStore.set({ name, value, ...cookieOptions })
				},
				remove(name: string, options: any) {
					// Apply centralized cookie options when removing
					const cookieOptions = {
						...options,
						...COOKIE_OPTIONS,
						maxAge: 0, // Override maxAge for cookie removal
					}
					cookieStore.set({ name, value: "", ...cookieOptions })
				},
			},
		}
	)

	// SECURITY FIX: Use getUser() instead of getSession() for logging
	const {
		data: { user },
	} = await supabase.auth.getUser()

	console.log("🚪 Logout initiated:", {
		hasUser: !!user,
		user: user?.email || "none",
		environment: process.env.NODE_ENV,
	})

	// Sign out from Supabase (this handles token invalidation)
	const { error } = await supabase.auth.signOut({
		scope: "global", // Sign out from all tabs/windows
	})

	if (error) {
		console.error("❌ Supabase logout error:", error)
		// Continue with cookie cleanup even if Supabase logout fails
	}

	// Clear all auth-related cookies comprehensively
	const authCookies = [
		"sb-access-token",
		"sb-refresh-token",
		"supabase-auth-token",
		"sb:token",
		"supabase.auth.token",
		"sb-tzffjzocrazemvtgqavg-auth-token", // Project-specific token
	]

	// Delete each cookie with proper expiration
	for (const name of authCookies) {
		cookieStore.delete(name)

		// Also set to expired for maximum compatibility
		cookieStore.set({
			name,
			value: "",
			expires: new Date(0),
			path: "/",
			maxAge: 0,
		})
	}

	console.log("✅ Logout completed successfully")

	// Determine redirect URL based on environment
	const baseUrl =
		process.env.NEXT_PUBLIC_SITE_URL ||
		(process.env.NODE_ENV === "production"
			? "https://www.doug.is"
			: "http://localhost:3000")

	// Redirect to login page
	return NextResponse.redirect(new URL("/admin/login", baseUrl))
}
