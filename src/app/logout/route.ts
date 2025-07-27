/**
 * Logout Route
 *
 * Handles user logout using standard Supabase patterns.
 */

import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
	try {
		const supabase = await createClient()
		await supabase.auth.signOut()

		// Redirect to login page after successful logout
		return NextResponse.redirect(
			new URL(
				"/admin/login",
				process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
			)
		)
	} catch (error) {
		// Even if logout fails, redirect to login page
		return NextResponse.redirect(
			new URL(
				"/admin/login",
				process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
			)
		)
	}
}

export async function POST() {
	try {
		const supabase = await createClient()
		await supabase.auth.signOut()

		return NextResponse.json({ success: true })
	} catch (error) {
		return NextResponse.json({ error: "Failed to sign out" }, { status: 500 })
	}
}
