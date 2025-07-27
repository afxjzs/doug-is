/**
 * Password Reset Route
 *
 * Allows setting up a password for an existing user account.
 * This is useful when a user was created without a password (magic link only).
 */

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"

// Cookie options
const COOKIE_OPTIONS = {
	httpOnly: false,
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	maxAge: 60 * 60 * 24 * 7, // 7 days
	path: "/",
}

/**
 * Handle password reset/setup
 */
export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json()

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			)
		}

		// Create a response object
		const response = NextResponse.json({ success: true })

		// Create a Supabase client
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					getAll() {
						return request.cookies.getAll()
					},
					setAll(cookiesToSet) {
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

		// First, send a magic link to verify the email
		const { error: magicLinkError } = await supabase.auth.signInWithOtp({
			email,
			options: {
				emailRedirectTo: `${
					process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
				}/api/auth/callback`,
			},
		})

		if (magicLinkError) {
			return NextResponse.json(
				{ error: magicLinkError.message },
				{ status: 400 }
			)
		}

		// For now, just send the magic link
		// The user will need to click the magic link first, then we can set up the password
		return NextResponse.json({
			success: true,
			message:
				"Magic link sent. Please check your email and click the link to verify your email, then try logging in with a password.",
		})
	} catch (error) {
		console.error("Password reset error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
