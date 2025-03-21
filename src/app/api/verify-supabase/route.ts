import { getPublicSupabaseClient } from "@/lib/supabase/publicClient"
import { NextResponse } from "next/server"

// Configure the route to be dynamic to ensure it's not cached
export const dynamic = "force-dynamic"

export async function GET() {
	try {
		// Get the Supabase client and check if it's connected
		const supabase = getPublicSupabaseClient()
		const isConnected = !!supabase

		// If connected, try to make a simple query to verify
		let querySuccess = false
		if (isConnected && supabase) {
			try {
				const { data, error } = await supabase
					.from("posts")
					.select("count")
					.limit(1)

				querySuccess = !error
			} catch (e) {
				console.error("Error testing Supabase query:", e)
			}
		}

		return NextResponse.json({
			success: true,
			connected: isConnected,
			querySuccess,
			url: process.env.NEXT_PUBLIC_SUPABASE_URL
				? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...`
				: "Not configured",
			hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		})
	} catch (error) {
		console.error("Error verifying Supabase connection:", error)
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		)
	}
}
