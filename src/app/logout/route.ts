/**
 * Simple logout API route
 */

import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
	// Get cookie store
	const cookieStore = await cookies()

	// Clear all auth cookies with simple approach
	const authCookies = [
		"sb-access-token",
		"sb-refresh-token",
		"supabase-auth-token",
	]

	authCookies.forEach((name) => {
		cookieStore.delete(name)
	})

	// Redirect to login page immediately
	return NextResponse.redirect(
		new URL(
			"/admin/login",
			process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
		)
	)
}
