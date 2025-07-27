import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
	const headersList = await headers()
	const allHeaders: Record<string, string> = {}

	headersList.forEach((value, key) => {
		allHeaders[key] = value
	})

	return NextResponse.json({
		headers: allHeaders,
		pathname:
			headersList.get("x-pathname") ||
			headersList.get("x-invoke-path") ||
			"not found",
		url: headersList.get("x-url") || "not found",
	})
}
