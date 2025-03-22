/**
 * Logout API route that handles clearing authentication state
 * and redirecting the user to the login page.
 */

import { createServerComponentClient } from "@/lib/supabase/serverClient"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		// Get cookies
		const cookieStore = await cookies()

		// Create a Supabase client
		const supabase = await createServerComponentClient()

		// Sign out on the server side
		await supabase.auth.signOut()

		// Clear auth cookies
		cookieStore.set("sb-access-token", "", { maxAge: 0, path: "/" })
		cookieStore.set("sb-refresh-token", "", { maxAge: 0, path: "/" })

		// Redirect to login page
		return NextResponse.redirect(
			new URL(
				"/admin/login",
				process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
			)
		)
	} catch (error) {
		console.error("Error during logout:", error)

		// Even if there's an error, try to redirect to login
		return NextResponse.redirect(
			new URL(
				"/admin/login",
				process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
			)
		)
	}
}
