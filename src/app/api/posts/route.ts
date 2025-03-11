import { NextResponse } from "next/server"
import { getPosts } from "@/lib/supabase/client"

// Use force-dynamic to ensure fresh data on each request
// Consider using ISR (revalidate) for production if data doesn't change frequently
export const dynamic = "force-dynamic"

/**
 * GET handler for fetching posts
 * Supports query parameters:
 * - limit: number of posts to return
 * - category: filter by category
 */
export async function GET(request: Request) {
	// Get URL to parse query parameters
	const url = new URL(request.url)
	const limit = url.searchParams.get("limit")
		? parseInt(url.searchParams.get("limit") as string, 10)
		: undefined
	const category = url.searchParams.get("category") || undefined

	try {
		// Log request information in development
		if (process.env.NODE_ENV === "development") {
			console.log("API route: Fetching posts...", { limit, category })
		}

		// Fetch posts with the updated client function
		const posts = await getPosts(limit, category)

		// Log success in development
		if (process.env.NODE_ENV === "development") {
			console.log(`API route: Successfully fetched ${posts?.length || 0} posts`)
			if (posts && posts.length > 0) {
				console.log("API route: First post:", JSON.stringify(posts[0], null, 2))
			}
		}

		// Return successful response with posts
		return NextResponse.json({
			posts,
			meta: {
				count: posts.length,
				limit,
				category,
			},
		})
	} catch (err) {
		// Log detailed error information
		console.error("API route: Exception fetching posts:", err)

		// Return appropriate error response
		return NextResponse.json(
			{
				error: err instanceof Error ? err.message : "Unknown error",
				code:
					err instanceof Error && "code" in err ? (err as any).code : undefined,
			},
			{ status: 500 }
		)
	}
}
