/**
 * This handler manages the exchange of an auth code for a session
 * It's the callback endpoint for Supabase auth redirects (magic links, OAuth, etc.)
 */

import { NextRequest, NextResponse } from "next/server"
import { createServerClient, type CookieOptions } from "@supabase/ssr"

export async function GET(request: NextRequest) {
	// Get the auth code from the URL
	const requestUrl = new URL(request.url)
	const code = requestUrl.searchParams.get("code")
	const origin = requestUrl.origin

	console.log("Auth callback received:", {
		code: code ? "present" : "missing",
		params: Object.fromEntries(requestUrl.searchParams.entries()),
	})

	// Get the redirect URL from the query params, defaulting to /admin
	let redirectTo = requestUrl.searchParams.get("redirect_to") || "/admin"
	console.log("Initial redirectTo:", { redirectTo })

	// If no code in URL, redirect to login page with error
	if (!code) {
		const redirectUrl = new URL("/admin/login", origin)
		redirectUrl.searchParams.set("error", "No auth code provided")
		return NextResponse.redirect(redirectUrl.toString())
	}

	// Create a response with an absolute URL for the redirect
	// NextResponse.redirect requires absolute URLs
	const absoluteRedirectUrl = new URL(redirectTo, origin).toString()
	console.log("Final redirect URL:", absoluteRedirectUrl)
	const response = NextResponse.redirect(absoluteRedirectUrl)

	// Create a Supabase client using the server component pattern
	const cookieStore = request.cookies

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL || "",
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
		{
			cookies: {
				get(name: string) {
					return cookieStore.get(name)?.value
				},
				set(name: string, value: string, options: CookieOptions) {
					response.cookies.set({
						name,
						value,
						...options,
					})
				},
				remove(name: string, options: CookieOptions) {
					response.cookies.set({
						name,
						value: "",
						...options,
						maxAge: 0,
					})
				},
			},
		}
	)

	try {
		// Exchange the code for a session
		const { error } = await supabase.auth.exchangeCodeForSession(code)

		if (error) {
			console.error("Auth callback error:", error)
			const redirectUrl = new URL("/admin/login", origin)
			redirectUrl.searchParams.set("error", error.message)
			return NextResponse.redirect(redirectUrl.toString())
		}

		// Success - redirect to the intended destination
		return response
	} catch (error) {
		console.error("Unexpected auth callback error:", error)
		const redirectUrl = new URL("/admin/login", origin)
		redirectUrl.searchParams.set(
			"error",
			"Authentication failed. Please try again."
		)
		return NextResponse.redirect(redirectUrl.toString())
	}
}
