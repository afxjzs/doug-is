/**
 * Auth Callback Handler
 *
 * Simple, standard Supabase auth callback implementation.
 * Handles magic link and OAuth redirects.
 */

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"

// Cookie options
const COOKIE_OPTIONS = {
	httpOnly: false,
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	maxAge: 60 * 60 * 24 * 7, // 7 days
	path: "/",
}

/**
 * Handle Supabase auth callback
 */
export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get("code")

	// If code is missing, redirect with error
	if (!code) {
		return NextResponse.redirect(
			new URL("/admin/login?error=Missing+code", request.url)
		)
	}

	// Create a response object
	const redirectTo = requestUrl.searchParams.get("redirect_to") || "/admin"
	const response = NextResponse.redirect(new URL(redirectTo, request.url))

	// Create a Supabase client
	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll()
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) => {
						// Apply centralized cookie options
						const cookieOptions = {
							...options,
							...COOKIE_OPTIONS,
						}
						response.cookies.set(name, value, cookieOptions)
					})
				},
			},
		}
	)

	try {
		// Exchange the code for a session
		const { error } = await supabase.auth.exchangeCodeForSession(code)

		if (error) {
			throw error
		}

		return response
	} catch (error) {
		console.error("Authentication error:", error)
		return NextResponse.redirect(
			new URL("/admin/login?error=Could+not+authenticate+user", request.url)
		)
	}
}
