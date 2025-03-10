import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
	const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

	if (!supabaseUrl || !supabaseAnonKey) {
		console.error("Missing Supabase credentials in API route")
		return NextResponse.json(
			{ error: "Database configuration error" },
			{ status: 500 }
		)
	}

	try {
		console.log(
			`API route: Connecting to Supabase at ${supabaseUrl.substring(0, 20)}...`
		)
		const supabase = createClient(supabaseUrl, supabaseAnonKey)

		console.log("API route: Fetching posts...")
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.order("published_at", { ascending: false })

		if (error) {
			console.error("API route: Error fetching posts:", error)
			return NextResponse.json({ error: error.message }, { status: 500 })
		}

		console.log(`API route: Successfully fetched ${data?.length || 0} posts`)
		if (data && data.length > 0) {
			console.log("API route: First post:", JSON.stringify(data[0], null, 2))
		}

		return NextResponse.json({ posts: data || [] })
	} catch (err) {
		console.error("API route: Exception fetching posts:", err)
		return NextResponse.json(
			{ error: err instanceof Error ? err.message : "Unknown error" },
			{ status: 500 }
		)
	}
}
