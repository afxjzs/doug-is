/**
 * Test Login Route
 *
 * Simple route to test login credentials without rate limiting issues.
 */

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
	try {
		const { email, password } = await request.json()

		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			)
		}

		// Create a Supabase client
		const supabase = createServerClient(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					getAll() {
						return request.cookies.getAll()
					},
					setAll() {
						// No-op for this test
					},
				},
			}
		)

		// Test the login
		const { data, error } = await supabase.auth.signInWithPassword({
			email,
			password,
		})

		if (error) {
			return NextResponse.json(
				{
					success: false,
					error: error.message,
					code: error.status,
				},
				{ status: 400 }
			)
		}

		return NextResponse.json({
			success: true,
			user: {
				id: data.user?.id,
				email: data.user?.email,
			},
		})
	} catch (error) {
		console.error("Test login error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
