import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/serverClient"
import { getPublicSupabaseClient } from "@/lib/supabase/publicClient"
import { nanoid } from "nanoid"
import { isCurrentUserAdmin } from "@/lib/supabase/auth"

// Use force-dynamic to ensure fresh data on each request
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
	try {
		console.log("Fetching public posts...")

		// Use the public client for GET requests so anonymous users can access posts
		const supabase = getPublicSupabaseClient()

		if (!supabase) {
			console.error("Could not create Supabase client")
			return NextResponse.json(
				{ error: "Database connection error" },
				{ status: 500 }
			)
		}

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.not("published_at", "is", null) // Only return published posts
			.order("published_at", { ascending: false })

		if (error) {
			console.error("Error fetching posts:", error)
			return NextResponse.json(
				{ error: "Failed to fetch posts" },
				{ status: 500 }
			)
		}

		return NextResponse.json({ posts: data })
	} catch (error) {
		console.error("Exception in GET /api/posts:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}

export async function POST(request: Request) {
	try {
		console.log("Creating a new post...")

		// Check if user is authenticated and has admin privileges
		const isAdmin = await isCurrentUserAdmin()

		if (!isAdmin) {
			console.error("Unauthorized access attempt to POST /api/posts")
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		const supabase = createAdminClient()

		// Get post data from request
		const json = await request.json()
		console.log("Post data received:", {
			title: json.title,
			slug: json.slug,
			content: json.content?.substring(0, 50) + "...",
		})

		// First check if the slug exists
		console.log("Checking if slug exists:", json.slug)
		const { data: slugCheckData, error: slugCheckError } = await supabase
			.from("posts")
			.select("id")
			.eq("slug", json.slug)
			.maybeSingle()

		if (slugCheckError) {
			console.error("Error checking slug:", slugCheckError)
			return NextResponse.json(
				{ error: "Failed to check slug" },
				{ status: 500 }
			)
		}

		if (slugCheckData) {
			console.log("Slug already exists:", json.slug)
			return NextResponse.json(
				{ error: "A post with this slug already exists" },
				{ status: 400 }
			)
		}

		// Prepare post data with all fields
		const postData = {
			id: nanoid(),
			title: json.title,
			slug: json.slug,
			content: json.content,
			excerpt: json.excerpt,
			category: json.category,
			featured_image: json.featured_image || null,
			published_at:
				json.published_at || (json.published ? new Date().toISOString() : null),
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		}

		console.log("Inserting with data:", postData)

		// Cast to any to bypass type checking
		const { data, error } = await supabase
			.from("posts")
			.insert(postData as any)
			.select()
			.single()

		if (error) {
			console.error("Error creating post:", error)
			return NextResponse.json(
				{
					error: "Failed to create post",
					details: error.message,
				},
				{ status: 500 }
			)
		}

		console.log("Post created successfully:", data.id)
		return NextResponse.json(data, { status: 201 })
	} catch (error) {
		console.error("Exception in POST /api/posts:", error)
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		)
	}
}
