/**
 * Environment Test Route
 *
 * Simple route to test if environment variables are loaded correctly.
 */

import { NextResponse } from "next/server"

export async function GET() {
	try {
		const envCheck = {
			supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
			supabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
			supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
			siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "not set",
			nodeEnv: process.env.NODE_ENV,
		}

		return NextResponse.json({
			success: true,
			envCheck,
		})
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		)
	}
}
