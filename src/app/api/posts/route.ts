import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Set a timeout for the API route
export const maxDuration = 60 // 60 seconds timeout

// Disable dynamic rendering for this route
export const dynamic = "force-dynamic"

export async function GET() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	// Log environment information for debugging
	console.log("API route environment:", {
		NODE_ENV: process.env.NODE_ENV,
		VERCEL_ENV: process.env.VERCEL_ENV,
		HAS_SUPABASE_URL: !!supabaseUrl,
		HAS_SUPABASE_KEY: !!supabaseAnonKey,
		SUPABASE_URL_LENGTH: supabaseUrl?.length || 0,
		SUPABASE_KEY_LENGTH: supabaseAnonKey?.length || 0,
	})

	if (!supabaseUrl || !supabaseAnonKey) {
		console.error("Missing Supabase credentials in API route")
		return NextResponse.json(
			{
				error: "Database configuration error",
				details: {
					hasUrl: !!supabaseUrl,
					hasKey: !!supabaseAnonKey,
				},
			},
			{ status: 500 }
		)
	}

	try {
		console.log(
			`API route: Connecting to Supabase at ${supabaseUrl.substring(0, 20)}...`
		)

		// Create Supabase client with timeout options
		const supabase = createClient(supabaseUrl, supabaseAnonKey, {
			auth: {
				persistSession: false,
				autoRefreshToken: false,
			},
			global: {
				fetch: (url, options) => {
					return fetch(url, {
						...options,
						signal: AbortSignal.timeout(10000), // 10 second timeout
					})
				},
			},
		})

		console.log("API route: Fetching posts...")

		// Use a Promise with timeout for the query
		const fetchWithTimeout = async () => {
			const controller = new AbortController()
			const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

			try {
				const { data, error } = await supabase
					.from("posts")
					.select("*")
					.order("published_at", { ascending: false })

				clearTimeout(timeoutId)
				return { data, error }
			} catch (err) {
				clearTimeout(timeoutId)
				throw err
			}
		}

		const { data, error } = await fetchWithTimeout()

		if (error) {
			console.error("API route: Error fetching posts:", error)
			return NextResponse.json(
				{
					error: error.message,
					details: {
						code: error.code,
						hint: error.hint,
						details: error.details,
					},
				},
				{ status: 500 }
			)
		}

		console.log(`API route: Successfully fetched ${data?.length || 0} posts`)
		if (data && data.length > 0) {
			console.log("API route: First post:", JSON.stringify(data[0], null, 2))
		} else {
			console.log("API route: No posts found")
		}

		return NextResponse.json({ posts: data || [] })
	} catch (err) {
		console.error("API route: Exception fetching posts:", err)
		return NextResponse.json(
			{
				error: err instanceof Error ? err.message : "Unknown error",
				stack: err instanceof Error ? err.stack : undefined,
			},
			{ status: 500 }
		)
	}
}
