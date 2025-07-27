/**
 * Auth Test Route
 *
 * Simple route to test if authentication is working.
 */

import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
	try {
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

		// Get user from session
		const {
			data: { user },
			error,
		} = await supabase.auth.getUser()

		if (error) {
			return NextResponse.json(
				{
					success: false,
					error: error.message,
					user: null,
				},
				{ status: 500 }
			)
		}

		return NextResponse.json({
			success: true,
			user: user
				? {
						id: user.id,
						email: user.email,
				  }
				: null,
		})
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
				user: null,
			},
			{ status: 500 }
		)
	}
}
