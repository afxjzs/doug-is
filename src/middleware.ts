/**
 * Next.js Middleware - Official Supabase Pattern
 *
 * Following the official Supabase Next.js guide:
 * https://supabase.com/docs/guides/auth/server-side/nextjs
 *
 * ONLY responsible for refreshing auth tokens.
 * Authentication/authorization logic belongs in components, not middleware.
 */

import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
	// Add pathname to headers so layouts can access it
	const requestHeaders = new Headers(request.headers)
	requestHeaders.set("x-pathname", request.nextUrl.pathname)

	// Update session (token refresh only)
	const response = await updateSession(request)

	// Copy the pathname header to the response
	response.headers.set("x-pathname", request.nextUrl.pathname)

	return response
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
	],
}
