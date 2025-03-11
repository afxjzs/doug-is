import { NextResponse } from "next/server"

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
		// Add other environment variables as needed
	}

	console.log("Environment test:", safeEnv)

	// Return the safe environment variables
	return NextResponse.json(safeEnv)
}
