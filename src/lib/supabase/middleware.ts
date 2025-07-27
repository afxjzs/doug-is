/**
 * Supabase Middleware Client
 *
 * Creates a Supabase client for use in middleware.
 * Uses the official @supabase/ssr package for proper SSR support.
 */

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "../types/supabase"

// Admin emails
const ADMIN_EMAILS = ["douglas.rogers@gmail.com", "test@testing.com"] as const

/**
 * Check if user is admin
 */
function isAdmin(email?: string): boolean {
	if (!email) return false
	return ADMIN_EMAILS.includes(
		email.toLowerCase() as (typeof ADMIN_EMAILS)[number]
	)
}

/**
 * Update session in middleware
 */
export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	})

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

	// Do not run code between createServerClient and
	// supabase.auth.getClaims(). A simple mistake could make it very hard to debug
	// issues with users being randomly logged out.
	// IMPORTANT: If you remove getClaims() and you use server-side rendering
	// with the Supabase client, your users may be randomly logged out.
	const { data } = await supabase.auth.getClaims()
	const user = data?.claims

	// Check if user is admin for admin routes (excluding login page)
	if (
		request.nextUrl.pathname.startsWith("/admin") &&
		!request.nextUrl.pathname.startsWith("/admin/login")
	) {
		if (!user || !isAdmin(user.email)) {
			// Redirect to login if not admin
			const url = request.nextUrl.clone()
			url.pathname = "/admin/login"
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
