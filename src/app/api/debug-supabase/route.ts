import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
	try {
		// Get Supabase URL and check if anon key is present
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
		const hasAnonKey = !!supabaseAnonKey

		// Get the Supabase client
		const supabase = await createClient()
		const isConnected = !!supabase

		// Use the server client for testing
		const localSupabase = supabase

		// Try to query the posts table directly
		const { data: postsData, error: postsError } = await localSupabase
			.from("posts")
			.select("count")
			.limit(1)

		return NextResponse.json({
			success: true,
			connection: {
				isConnected,
				supabaseUrl,
				hasAnonKey,
			},
			posts: {
				data: postsData,
				error: postsError
					? {
							message: postsError.message,
							code: postsError.code,
							details: postsError.details,
							hint: postsError.hint,
					  }
					: null,
			},
		})
	} catch (error) {
		console.error("Error in debug-supabase route:", error)
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		)
	}
}
