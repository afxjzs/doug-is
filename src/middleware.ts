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
	// Update session (token refresh only)
	return updateSession(request)
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
