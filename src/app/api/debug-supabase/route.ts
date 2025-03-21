import { NextResponse } from "next/server"
import { getPublicSupabaseClient } from "@/lib/supabase/publicClient"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
	try {
		// Get Supabase URL and check if anon key is present
		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
		const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
		const hasAnonKey = !!supabaseAnonKey

		// Get the Supabase client
		const supabase = getPublicSupabaseClient()
		const isConnected = !!supabase

		// Create a local Supabase client to ensure it's not null
		const localSupabase = createClient(supabaseUrl, supabaseAnonKey)

		// Try to query the posts table directly
		const { data: postsData, error: postsError } = await localSupabase
			.from("posts")
			.select("count")
			.limit(1)

		// Check if the table exists by querying the information schema
		const { data: tableData, error: tableError } = await localSupabase
			.from("information_schema.tables")
			.select("table_name")
			.eq("table_schema", "public")
			.eq("table_name", "posts")

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
			table: {
				exists: tableData && tableData.length > 0,
				data: tableData,
				error: tableError
					? {
							message: tableError.message,
							code: tableError.code,
							details: tableError.details,
							hint: tableError.hint,
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
