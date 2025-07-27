import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/client"

export async function GET() {
	try {
		const supabase = createClient()
		const { data, error } = await supabase
			.from("migraine_triggers")
			.select("*")
			.order("food", { ascending: true })

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
			data: data || [],
			count: data?.length || 0,
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
