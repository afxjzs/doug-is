import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"
import { ADMIN_EMAILS } from "@/lib/auth/unified-auth"

// Centralized cookie configuration
const COOKIE_OPTIONS = {
	httpOnly: false,
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	maxAge: 60 * 60 * 24 * 7, // 7 days
	path: "/",
}

// Admin check function
function isAdmin(email?: string): boolean {
	if (!email) return false
	return ADMIN_EMAILS.includes(
		email.toLowerCase() as (typeof ADMIN_EMAILS)[number]
	)
}

/**
 * Middleware to handle authentication and authorization
 * Uses SECURE authentication validation
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

	// Use SECURE authentication validation - getUser() instead of getSession()
	const {
		data: { user },
		error,
	} = await supabase.auth.getUser()

	const { pathname } = request.nextUrl
	console.log(
		`Middleware path: ${pathname}, Session: ${!!user}, User: ${
			user?.email || "none"
		}`
	)

	// Log authentication validation method for debugging
	if (error) {
		console.log("⚠️ User validation failed:", error.message)
	}

	// Handle blog post URL canonicalization
	// Redirect old blog URLs (/thinking/[category]/[slug]) to canonical URLs (/thinking/about/[category]/[slug])
	if (
		pathname.startsWith("/thinking/") &&
		!pathname.startsWith("/thinking/about/")
	) {
		// Extract the category and slug from the old URL pattern
		const pathParts = pathname.split("/")
		if (pathParts.length === 4 && pathParts[1] === "thinking") {
			const category = pathParts[2]
			const slug = pathParts[3]

			// Only redirect if this looks like a blog post URL (not /thinking/about/...)
			if (category && slug && category !== "about") {
				const canonicalUrl = `/thinking/about/${category}/${slug}`
				console.log(
					`Redirecting old blog URL ${pathname} to canonical URL ${canonicalUrl}`
				)
				return NextResponse.redirect(new URL(canonicalUrl, request.url), 301)
			}
		}
	}

	// Handle admin routes
	if (pathname.startsWith("/admin")) {
		// Special handling for root admin page - needs to redirect to login if not authenticated
		if (pathname === "/admin" || pathname === "/admin/") {
			if (!user || !isAdmin(user.email)) {
				console.log("Root admin access denied - redirecting to login")
				return NextResponse.redirect(new URL("/admin/login", request.url))
			}
		}

		// If at login page and already authenticated as admin, redirect to admin dashboard
		if (pathname === "/admin/login" && user) {
			if (isAdmin(user.email)) {
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
		if (pathname !== "/admin/login" && (!user || !isAdmin(user.email))) {
			console.log("Access denied - redirecting to login")
			return NextResponse.redirect(new URL("/admin/login", request.url))
		}
	}

	return response
}

// Configure which routes the middleware runs on
export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - logout/force-logout (logout routes)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|logout|force-logout).*)",
	],
}
