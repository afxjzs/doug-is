import { verifySupabaseConnection } from "@/lib/supabase/client"
import { NextResponse } from "next/server"

// Configure the route to be dynamic to ensure it's not cached
export const dynamic = "force-dynamic"

export async function GET() {
	try {
		const isConnected = await verifySupabaseConnection()

		return NextResponse.json({
			success: true,
			connected: isConnected,
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
