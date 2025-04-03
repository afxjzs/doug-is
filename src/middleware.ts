import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { ALLOWED_ADMIN_EMAILS } from "@/lib/auth/helpers"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

/**
 * Primary middleware function for handling Supabase authentication
 */
export async function middleware(request: NextRequest) {
	// Create a response object to modify and return
	const response = NextResponse.next()
	const { pathname } = request.nextUrl

	// Log middleware execution in development
	if (process.env.NODE_ENV === "development") {
		console.log(`Middleware running for: ${pathname}`)
	}

	// Skip middleware for static assets
	if (pathname.match(/\.(jpg|jpeg|png|gif|svg|ico|css|js)$/)) {
		return response
	}

	try {
		// Create a Supabase client with the request cookies
		const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
			cookies: {
				get(name: string) {
					return request.cookies.get(name)?.value
				},
				set(name: string, value: string, options: CookieOptions) {
					// This is used for setting cookies in the response
					response.cookies.set({
						name,
						value,
						...options,
						// Ensure cookies work in production
						domain:
							process.env.NODE_ENV === "production" ? ".doug.is" : undefined,
						secure: process.env.NODE_ENV === "production",
						sameSite: "lax",
						path: "/",
					})
				},
				remove(name: string, options: CookieOptions) {
					// This is used for removing cookies in the response
					response.cookies.set({
						name,
						value: "",
						...options,
						// Ensure cookies work in production
						domain:
							process.env.NODE_ENV === "production" ? ".doug.is" : undefined,
						secure: process.env.NODE_ENV === "production",
						sameSite: "lax",
						path: "/",
						maxAge: 0,
					})
				},
			},
		})

		// Get the user and refresh the session if needed
		const {
			data: { user },
		} = await supabase.auth.getUser()

		// Log auth status in development
		if (process.env.NODE_ENV === "development") {
			console.log(
				`Auth status for ${pathname}: ${
					user ? "Authenticated" : "Not authenticated"
				}`
			)
			if (user) {
				console.log(`User: ${user.email}`)
			}
		}

		// Handle login page - redirect authenticated users to admin dashboard
		if (pathname === "/admin/login") {
			if (user) {
				// Check if the user is an admin
				if (
					user.email &&
					ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())
				) {
					// User is authenticated and is an admin, redirect to admin dashboard
					if (process.env.NODE_ENV === "development") {
						console.log(
							`Redirecting authenticated admin from login page to dashboard`
						)
					}
					return NextResponse.redirect(new URL("/admin", request.url))
				} else {
					// User is authenticated but not an admin, force logout
					if (process.env.NODE_ENV === "development") {
						console.log(`Non-admin user at login page, clearing session`)
					}

					// Clear auth cookies
					response.cookies.set({
						name: "sb-access-token",
						value: "",
						maxAge: 0,
						path: "/",
					})
					response.cookies.set({
						name: "sb-refresh-token",
						value: "",
						maxAge: 0,
						path: "/",
					})

					// Keep them on the login page
					return response
				}
			}
		}

		// Handle admin routes - restrict access to authenticated users only
		if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
			// Check if user is authenticated
			if (!user) {
				// Redirect to login page
				const redirectUrl = new URL("/admin/login", request.url)
				redirectUrl.searchParams.set("redirect", pathname)

				// Log redirection in development
				if (process.env.NODE_ENV === "development") {
					console.log(
						`Redirecting unauthenticated user from ${pathname} to ${redirectUrl.pathname}`
					)
				}

				return NextResponse.redirect(redirectUrl)
			}

			// Check if the user is an admin
			if (
				user &&
				user.email &&
				!ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())
			) {
				// User is authenticated but not an admin
				if (process.env.NODE_ENV === "development") {
					console.log(`Access denied: ${user.email} is not an admin`)
				}

				// Clear auth cookies before redirecting
				response.cookies.set({
					name: "sb-access-token",
					value: "",
					maxAge: 0,
					path: "/",
				})
				response.cookies.set({
					name: "sb-refresh-token",
					value: "",
					maxAge: 0,
					path: "/",
				})

				return NextResponse.redirect(new URL("/admin/login", request.url))
			}
		}

		// Handle API routes in the admin namespace
		if (pathname.startsWith("/api/")) {
			// API endpoints that need authentication
			const protectedApiRoutes = [
				"/api/upload",
				"/api/posts/[id]", // Only protect individual post endpoints
				"/api/contact",
				"/api/admin",
			]

			// Check if this is a protected API route
			const isProtectedApi = protectedApiRoutes.some((route) =>
				pathname.startsWith(route)
			)

			if (isProtectedApi && !user) {
				// Return 401 Unauthorized for API routes
				// Log unauthorized API access in development
				if (process.env.NODE_ENV === "development") {
					console.log(`Unauthorized API access: ${pathname}`)
				}

				return NextResponse.json(
					{ error: "Unauthorized access" },
					{ status: 401 }
				)
			}

			// Check if the user is an admin for protected API routes
			if (
				isProtectedApi &&
				user &&
				user.email &&
				!ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())
			) {
				// User is authenticated but not an admin
				if (process.env.NODE_ENV === "development") {
					console.log(`API access denied: ${user.email} is not an admin`)
				}

				return NextResponse.json(
					{ error: "Admin privileges required" },
					{ status: 403 }
				)
			}
		}

		return response
	} catch (error) {
		// Log error and continue
		console.error("Error in middleware:", error)
		return response
	}
}

/**
 * Define which routes should be processed by this middleware
 */
export const config = {
	matcher: [
		// Admin paths
		"/admin/:path*",
		// API paths that need authentication
		"/api/upload/:path*",
		"/api/posts/:id*", // Changed to only match /api/posts/[id] routes
		"/api/contact/:path*",
		"/api/admin/:path*",
	],
}
