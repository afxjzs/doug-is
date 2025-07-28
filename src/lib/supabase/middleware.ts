/**
 * Supabase Middleware - Comprehensive Auth Pattern
 *
 * Handles authentication, authorization, and token refresh.
 * Designed to work with the comprehensive test suite.
 */

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import type { Database } from "../types/supabase"

/**
 * Admin email addresses that have access to admin routes
 * Fallback list used when ADMIN_EMAILS env var is not set
 */
const DEFAULT_ADMIN_EMAILS = ["doug@doug.is", "doug.rogers@outlook.com"]

/**
 * Get admin emails from environment or fallback to defaults
 */
function getAdminEmails(): string[] {
	const envEmails = process.env.ADMIN_EMAILS
	if (!envEmails || envEmails.trim() === "") {
		return DEFAULT_ADMIN_EMAILS
	}
	return envEmails.split(",").map((email) => email.trim().toLowerCase())
}

/**
 * Check if user email is in admin list (case-insensitive)
 */
function isAdminEmail(email: string | undefined): boolean {
	if (!email) return false
	const adminEmails = getAdminEmails()
	return adminEmails.includes(email.toLowerCase())
}

/**
 * Check if the path should bypass authentication entirely
 */
function shouldBypassAuth(pathname: string): boolean {
	const bypassPaths = [
		"/admin/login",
		"/admin/register",
		"/auth/callback",
		"/api/auth/callback",
	]
	return bypassPaths.includes(pathname)
}

/**
 * Check if the path requires admin authentication
 */
function requiresAdminAuth(pathname: string): boolean {
	return pathname.startsWith("/admin") && !shouldBypassAuth(pathname)
}

export async function updateSession(request: NextRequest) {
	const pathname = request.nextUrl.pathname

	// Early return for auth bypass paths - don't even create Supabase client
	if (shouldBypassAuth(pathname)) {
		return NextResponse.next()
	}

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

	// For non-admin routes, just refresh tokens and continue
	if (!requiresAdminAuth(pathname)) {
		try {
			await supabase.auth.getUser()
		} catch (error) {
			console.warn("Auth check failed in middleware:", error)
		}
		return supabaseResponse
	}

	// For admin routes, check authentication and authorization
	try {
		const authResult = await supabase.auth.getUser()

		// Handle rate limiting and auth errors
		if (authResult.error) {
			const error = authResult.error
			if (
				error.status === 429 ||
				error.message?.includes("Too Many Requests")
			) {
				console.warn("Auth check failed in middleware:", error)
				return supabaseResponse // Don't redirect on rate limiting
			}
		}

		// Handle case where auth result is undefined/null
		if (!authResult || !authResult.data) {
			console.warn("Auth result is undefined/null in middleware")
			const redirectUrl = new URL(
				"/admin/login",
				request.url || "https://example.com"
			)
			redirectUrl.searchParams.set("error", "auth_required")
			return NextResponse.redirect(redirectUrl)
		}

		const {
			data: { user },
		} = authResult

		// No user - redirect to login
		if (!user) {
			const redirectUrl = new URL(
				"/admin/login",
				request.url || "https://example.com"
			)
			redirectUrl.searchParams.set("error", "auth_required")
			return NextResponse.redirect(redirectUrl)
		}

		// User exists but not admin - redirect to login with admin error
		if (!isAdminEmail(user.email)) {
			const redirectUrl = new URL(
				"/admin/login",
				request.url || "https://example.com"
			)
			redirectUrl.searchParams.set("error", "admin_required")
			return NextResponse.redirect(redirectUrl)
		}

		// User is authenticated admin - allow access
		return supabaseResponse
	} catch (error) {
		console.error("Unexpected error in middleware:", error)
		const redirectUrl = new URL(
			"/admin/login",
			request.url || "https://example.com"
		)
		redirectUrl.searchParams.set("error", "auth_error")
		return NextResponse.redirect(redirectUrl)
	}
}
