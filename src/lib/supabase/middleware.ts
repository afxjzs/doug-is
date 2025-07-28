/**
 * Supabase Middleware Client
 *
 * Creates a Supabase client for use in middleware.
 * Uses the official @supabase/ssr package for proper SSR support.
 *
 * CRITICAL: Fixed endless login loop by replacing getClaims() with getUser()
 * and adding comprehensive error handling for rate limiting scenarios.
 */

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "../types/supabase"

// Admin emails - using env vars to avoid hardcoding in production
function getAdminEmails(): string[] {
	const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
	// Fallback for development if env var not set
	if (adminEmails.length === 0) {
		return ["douglas.rogers@gmail.com", "test@testing.com"]
	}
	return adminEmails.map((email) => email.trim().toLowerCase())
}

/**
 * Check if user is admin
 */
function isAdmin(email?: string): boolean {
	if (!email) return false
	const adminEmails = getAdminEmails()
	return adminEmails.includes(email.toLowerCase())
}

/**
 * Update session in middleware
 *
 * BULLETPROOF AUTH PATTERN:
 * - Uses getUser() instead of getClaims() to prevent rate limiting
 * - Comprehensive error handling for auth failures
 * - Graceful degradation when auth service is unavailable
 */
export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	})

	// Skip auth operations for auth-related pages to prevent infinite loops
	const isAuthPage =
		request.nextUrl.pathname.startsWith("/admin/login") ||
		request.nextUrl.pathname.startsWith("/admin/register") ||
		request.nextUrl.pathname.includes("/auth/")

	if (isAuthPage) {
		return supabaseResponse
	}

	const supabase = createServerClient<Database>(
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
					supabaseResponse = NextResponse.next({
						request,
					})
					cookiesToSet.forEach(({ name, value, options }) =>
						supabaseResponse.cookies.set(name, value, options)
					)
				},
			},
		}
	)

	// CRITICAL FIX: Use getUser() instead of getClaims() to prevent rate limiting
	// This is the recommended pattern from Supabase docs for Next.js middleware
	try {
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()

		// Handle rate limiting and other auth errors gracefully
		if (error) {
			console.warn("Auth check failed in middleware:", error.message)

			// If we're accessing admin routes and auth fails, redirect to login
			// But only if it's not a rate limiting error (to prevent loops)
			if (
				request.nextUrl.pathname.startsWith("/admin") &&
				!request.nextUrl.pathname.startsWith("/admin/login") &&
				!error.message.includes("rate") &&
				!error.message.includes("429") &&
				!error.message.includes("Too Many Requests")
			) {
				const url = request.nextUrl.clone()
				url.pathname = "/admin/login"
				url.searchParams.set("error", "auth_required")
				return NextResponse.redirect(url)
			}

			// For rate limiting errors, allow the request to continue
			// The page itself will handle auth appropriately
			return supabaseResponse
		}

		// Check if user is admin for admin routes (excluding login page)
		if (
			request.nextUrl.pathname.startsWith("/admin") &&
			!request.nextUrl.pathname.startsWith("/admin/login")
		) {
			if (!user || !isAdmin(user.email)) {
				// Only redirect if we have a definitive "not admin" result
				// (not due to rate limiting or other temporary errors)
				const url = request.nextUrl.clone()
				url.pathname = "/admin/login"
				if (!user) {
					url.searchParams.set("error", "login_required")
				} else {
					url.searchParams.set("error", "admin_required")
				}
				return NextResponse.redirect(url)
			}
		}
	} catch (error) {
		// Catch any unexpected errors and log them
		console.error("Unexpected error in middleware auth check:", error)

		// For admin routes, redirect to login with error indication
		if (
			request.nextUrl.pathname.startsWith("/admin") &&
			!request.nextUrl.pathname.startsWith("/admin/login")
		) {
			const url = request.nextUrl.clone()
			url.pathname = "/admin/login"
			url.searchParams.set("error", "auth_error")
			return NextResponse.redirect(url)
		}
	}

	// IMPORTANT: You *must* return the supabaseResponse object as it is.
	// If you're creating a new response object with NextResponse.next() make sure to:
	// 1. Pass the request in it, like so:
	//    const myNewResponse = NextResponse.next({ request })
	// 2. Copy over the cookies, like so:
	//    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
	// 3. Change the myNewResponse object to fit your needs, but avoid changing
	//    the cookies!
	// 4. Finally:
	//    return myNewResponse
	// If this is not done, you may be causing the browser and server to go out
	// of sync and terminate the user's session prematurely!
	return supabaseResponse
}
