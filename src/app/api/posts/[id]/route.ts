import { NextRequest, NextResponse } from "next/server"
import { getCurrentUser, isCurrentUserAdmin } from "@/lib/supabase/auth"
import { createAdminClient } from "@/lib/supabase/serverClient"
import { getPublicSupabaseClient } from "@/lib/supabase/publicClient"

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		// Properly await the params object to avoid Next.js warning
		const id = await params.id
		console.log("Fetching post:", id)

		// Use the public client for GET requests so anonymous users can access the post
		const supabase = getPublicSupabaseClient()

		if (!supabase) {
			console.error("Could not create Supabase client")
			return NextResponse.json(
				{ error: "Database connection error" },
				{ status: 500 }
			)
		}

		// Query the post either by ID or slug
		let query = supabase.from("posts").select("*")

		// Check if the id looks like a slug rather than an ID
		if (id.length > 30) {
			// Likely an ID (nanoid is typically longer)
			query = query.eq("id", id)
		} else {
			// Likely a slug
			query = query.eq("slug", id)
		}

		const { data, error } = await query.maybeSingle()

		if (error) {
			console.error("Error fetching post:", error)
			return NextResponse.json(
				{ error: "Failed to fetch post" },
				{ status: 500 }
			)
		}

		if (!data) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 })
		}

		// For published posts, return directly
		if (data.published_at) {
			return NextResponse.json(data)
		}

		// For unpublished posts, check if user is admin
		const isAdmin = await isCurrentUserAdmin()
		if (!isAdmin) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 })
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error("Exception in GET /api/posts/[id]:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		// Properly await the params object to avoid Next.js warning
		const id = await params.id

		// Check if user is authenticated and has admin privileges
		const isAdmin = await isCurrentUserAdmin()

		if (!isAdmin) {
			console.error("Unauthorized access attempt to PATCH /api/posts/[id]")
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Parse the request body
		const postData = await request.json()

		// Validate required fields - only check fields that exist in the actual database
		const requiredFields = ["title", "slug", "content", "excerpt", "category"]
		for (const field of requiredFields) {
			if (!postData[field]) {
				return NextResponse.json(
					{ error: `Missing required field: ${field}` },
					{ status: 400 }
				)
			}
		}

		// Create Supabase client with admin privileges
		const supabase = createAdminClient()
		console.log("Created admin client for PATCH endpoint")

		// Check if the post exists
		const { data: existingPost, error: fetchError } = await supabase
			.from("posts")
			.select("id")
			.eq("id", id)
			.single()

		if (fetchError || !existingPost) {
			console.log("Post not found or error:", fetchError)
			return NextResponse.json({ error: "Post not found" }, { status: 404 })
		}

		// Check if the slug is already in use by another post
		if (postData.slug) {
			const { data: slugCheck } = await supabase
				.from("posts")
				.select("id")
				.eq("slug", postData.slug)
				.neq("id", id)
				.maybeSingle()

			if (slugCheck) {
				return NextResponse.json(
					{ error: "A post with this slug already exists" },
					{ status: 400 }
				)
			}
		}

		// Update the post with all fields
		const updateData = {
			title: postData.title,
			slug: postData.slug,
			content: postData.content,
			excerpt: postData.excerpt,
			category: postData.category,
			featured_image: postData.featured_image || null,
			published_at:
				postData.published_at ||
				(postData.published ? new Date().toISOString() : null),
			updated_at: new Date().toISOString(),
		}

		console.log("Updating post with data:", {
			id,
			title: updateData.title,
			slug: updateData.slug,
			category: updateData.category,
		})

		// Update the post with all columns
		const { data, error } = await supabase
			.from("posts")
			.update(updateData as any)
			.eq("id", id)
			.select()
			.single()

		if (error) {
			console.error("Error updating post:", error)
			return NextResponse.json(
				{
					error: "Failed to update post",
					details: error.message,
				},
				{ status: 500 }
			)
		}

		console.log("Post updated successfully:", data.id)
		return NextResponse.json(data)
	} catch (error) {
		console.error("Error in PATCH /api/posts/[id]:", error)
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		)
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		// Properly await the params object to avoid Next.js warning
		const id = await params.id

		// Check if user is authenticated and has admin privileges
		const isAdmin = await isCurrentUserAdmin()

		if (!isAdmin) {
			console.error("Unauthorized access attempt to DELETE /api/posts/[id]")
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
		}

		// Create Supabase client with admin privileges
		const supabase = createAdminClient()

		// Check if the post exists
		const { data: existingPost, error: fetchError } = await supabase
			.from("posts")
			.select("id")
			.eq("id", id)
			.single()

		if (fetchError || !existingPost) {
			return NextResponse.json({ error: "Post not found" }, { status: 404 })
		}

		// Delete the post
		const { error } = await supabase.from("posts").delete().eq("id", id)

		if (error) {
			console.error("Error deleting post:", error)
			return NextResponse.json(
				{ error: "Failed to delete post" },
				{ status: 500 }
			)
		}

		return NextResponse.json(
			{ message: "Post deleted successfully" },
			{ status: 200 }
		)
	} catch (error) {
		console.error("Error in DELETE /api/posts/[id]:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
