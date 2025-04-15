import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { isAdmin, COOKIE_OPTIONS } from "@/lib/auth/supabase"

/**
 * Middleware to handle authentication and authorization
 */
export async function middleware(request: NextRequest) {
	// Create a response object that we'll modify
	let response = NextResponse.next({
		request: {
			headers: request.headers,
		},
	})

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
					response = NextResponse.next({
						request: {
							headers: request.headers,
						},
					})
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

	// Refresh the auth session
	const {
		data: { session },
	} = await supabase.auth.getSession()

	const { pathname } = request.nextUrl
	console.log(
		`Middleware path: ${pathname}, Session: ${!!session}, User: ${
			session?.user?.email || "none"
		}`
	)

	// Handle admin routes
	if (pathname.startsWith("/admin")) {
		// Special handling for root admin page - needs to redirect to login if not authenticated
		if (pathname === "/admin" || pathname === "/admin/") {
			if (!session || !isAdmin(session.user.email)) {
				console.log("Root admin access denied - redirecting to login")
				return NextResponse.redirect(new URL("/admin/login", request.url))
			}
		}

		// If at login page and already authenticated as admin, redirect to admin dashboard
		if (pathname === "/admin/login" && session?.user) {
			if (isAdmin(session.user.email)) {
				console.log("Admin already authenticated, redirecting to dashboard")
				return NextResponse.redirect(new URL("/admin", request.url))
			} else {
				console.log("User authenticated but not an admin")
				return NextResponse.redirect(
					new URL("/admin/login?error=Not+authorized+as+admin", request.url)
				)
			}
		}

		// For other admin routes, require authentication
		if (
			pathname !== "/admin/login" &&
			(!session || !isAdmin(session.user.email))
		) {
			console.log("Access denied - redirecting to login")
			return NextResponse.redirect(new URL("/admin/login", request.url))
		}
	}

	return response
}

/**
 * Define which routes this middleware should run on
 */
export const config = {
	matcher: ["/admin", "/admin/:path*", "/api/auth/callback"],
}
