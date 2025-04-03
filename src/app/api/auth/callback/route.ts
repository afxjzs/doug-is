/**
 * This handler manages the exchange of an auth code for a session
 * It's the callback endpoint for Supabase auth redirects (magic links, OAuth, etc.)
 */

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"

/**
 * Handle Supabase auth callback
 * This route is called by Supabase after a user signs in with OAuth or magic link
 */
export async function GET(request: NextRequest) {
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get("code")

	// Debug logging
	console.log("Auth callback received:", {
		url: requestUrl.toString(),
		code: !!code,
		params: Object.fromEntries(requestUrl.searchParams.entries()),
	})

	// If code is missing, redirect with error
	if (!code) {
		console.error("No code in auth callback request")
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
					cookiesToSet.forEach(({ name, value }) =>
						request.cookies.set(name, value)
					)
					// We need to create a new response with the updated request object
					// This ensures we're not modifying the original response
					cookiesToSet.forEach(({ name, value, options }) =>
						response.cookies.set(name, value, options)
					)
				},
			},
		}
	)

	try {
		// Exchange the code for a session
		console.log("Exchanging code for session...")
		const { error } = await supabase.auth.exchangeCodeForSession(code)

		if (error) {
			console.error("Error exchanging code for session:", error)
			throw error
		}

		console.log(
			"Successfully exchanged code for session, redirecting to:",
			redirectTo
		)
		return response
	} catch (error) {
		console.error("Authentication error:", error)
		return NextResponse.redirect(
			new URL("/admin/login?error=Could+not+authenticate+user", request.url)
		)
	}
}

// Helper function to get a parameter with a default value
function requestParams(
	params: URLSearchParams,
	name: string,
	defaultValue: string
): string {
	const value = params.get(name)
	return value || defaultValue
}
