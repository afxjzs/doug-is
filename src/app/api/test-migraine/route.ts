import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"

export async function GET() {
	try {
		// Test server-side connection
		const supabase = createClient()
		const { data, error } = await supabase
			.from("migraine_triggers")
			.select("*")
			.limit(1)

		if (error) {
			return NextResponse.json(
				{
					error: error.message,
					code: error.code,
					details: error.details,
					hint: error.hint,
				},
				{ status: 500 }
			)
		}

		return NextResponse.json({
			success: true,
			count: data?.length || 0,
			sample: data?.[0] || null,
			env: {
				hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
				hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
				urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
				keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
			},
		})
	} catch (err) {
		return NextResponse.json(
			{
				error: err instanceof Error ? err.message : "Unknown error",
				stack: err instanceof Error ? err.stack : undefined,
			},
			{ status: 500 }
		)
	}
}
