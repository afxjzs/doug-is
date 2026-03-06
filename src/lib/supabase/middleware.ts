/**
 * Supabase Middleware - Comprehensive Auth Pattern
 *
 * Handles authentication, authorization, and token refresh.
 * Designed to work with the comprehensive test suite.
 */

import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { getDatabaseConfig } from "./environment"

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({
		request,
	})
	const config = getDatabaseConfig()

	const supabase = createServerClient(
		config.url,
		config.anonKey,
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

	// IMPORTANT: In order to refresh expired Auth tokens and store them for
	// Server Components to use, you must call:
	await supabase.auth.getUser()

	return supabaseResponse
}
