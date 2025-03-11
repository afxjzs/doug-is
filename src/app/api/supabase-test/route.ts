import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Disable dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET() {
	// Get environment variables
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	// Create a safe version of the environment variables for logging
	const safeEnv = {
		NODE_ENV: process.env.NODE_ENV,
		VERCEL_ENV: process.env.VERCEL_ENV,
		HAS_SUPABASE_URL: !!supabaseUrl,
		HAS_SUPABASE_KEY: !!supabaseAnonKey,
		SUPABASE_URL_LENGTH: supabaseUrl?.length || 0,
		SUPABASE_KEY_LENGTH: supabaseAnonKey?.length || 0,
		SUPABASE_URL_FIRST_10: supabaseUrl?.substring(0, 10) || "",
		SUPABASE_KEY_FIRST_10: supabaseAnonKey?.substring(0, 10) || "",
		SUPABASE_KEY_LAST_10:
			supabaseAnonKey?.substring((supabaseAnonKey?.length || 0) - 10) || "",
	}

	console.log("Supabase test:", safeEnv)

	if (!supabaseUrl || !supabaseAnonKey) {
		return NextResponse.json(
			{
				error: "Missing Supabase credentials",
				env: safeEnv,
			},
			{ status: 500 }
		)
	}

	try {
		// Try to create a Supabase client
		console.log(
			`Creating Supabase client with URL: ${supabaseUrl.substring(0, 20)}...`
		)

		// Create Supabase client with minimal configuration
		const supabase = createClient(supabaseUrl, supabaseAnonKey)

		// Try a simple query to test the connection
		console.log("Testing Supabase connection...")
		const { data, error } = await supabase
			.from("posts")
			.select("count")
			.limit(1)

		if (error) {
			console.error("Supabase connection error:", error)
			return NextResponse.json(
				{
					error: "Supabase connection error",
					details: error,
					env: safeEnv,
				},
				{ status: 500 }
			)
		}

		console.log("Supabase connection successful:", data)
		return NextResponse.json({
			success: true,
			data,
			env: safeEnv,
		})
	} catch (err) {
		console.error("Exception testing Supabase:", err)
		return NextResponse.json(
			{
				error: "Exception testing Supabase",
				details: err instanceof Error ? err.message : String(err),
				env: safeEnv,
			},
			{ status: 500 }
		)
	}
}
