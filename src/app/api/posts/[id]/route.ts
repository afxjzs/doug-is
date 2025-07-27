import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	try {
		// Properly await the params object to avoid Next.js warning
		const id = await params.id
		console.log("Fetching post:", id)

		// Use the server client for GET requests so anonymous users can access the post
		const supabase = await createClient()

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

		// For unpublished posts, check if user is admin using UNIFIED AUTH
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
		console.log("🔧 PATCH /api/posts/[id] - Post ID:", id)

		// Debug: Check authentication state with detailed logging
		console.log("🔍 Checking authentication...")
		const user = await getCurrentUser()
		console.log("👤 Current user:", user?.email || "none")

		// Check if user is authenticated and has admin privileges using UNIFIED AUTH
		const isAdmin = await isCurrentUserAdmin()
		console.log("🔒 Is admin:", isAdmin)

		if (!user) {
			console.error("❌ No authenticated user found")
			return NextResponse.json(
				{
					error: "Authentication required",
					debug: "No user session found",
				},
				{ status: 401 }
			)
		}

		if (!isAdmin) {
			console.error("❌ User not admin:", user.email)
			return NextResponse.json(
				{
					error: "Admin privileges required",
					debug: `User ${user.email} is not an admin`,
				},
				{ status: 401 }
			)
		}

		console.log("✅ Authentication successful for admin user:", user.email)

		// Parse the request body
		const postData = await request.json()
		console.log("📝 Updating post with data:", {
			title: postData.title,
			slug: postData.slug,
			category: postData.category,
		})

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

		// Create Supabase client with admin privileges using new simple server auth
		const supabase = await createAuthServerClient()
		console.log("📊 Created admin client for PATCH endpoint")

		// Check if the post exists and get current values for cache invalidation
		const { data: existingPost, error: fetchError } = await supabase
			.from("posts")
			.select("id, category, slug")
			.eq("id", id)
			.single()

		if (fetchError || !existingPost) {
			console.log("❌ Post not found or error:", fetchError)
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

		console.log("💾 Updating post with data:", {
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
			console.error("❌ Error updating post:", error)
			return NextResponse.json(
				{
					error: "Failed to update post",
					details: error.message,
				},
				{ status: 500 }
			)
		}

		console.log("✅ Post updated successfully:", data.id)

		// Revalidate all blog-related paths to ensure immediate cache invalidation
		try {
			// HOMEPAGE CACHE: Homepage displays latest blog post content (title, excerpt, etc.)
			revalidatePath("/")

			// Always revalidate the main blog pages
			revalidatePath("/thinking")

			// Revalidate paths for the updated post
			revalidatePath(`/thinking/${data.category.toLowerCase()}`)
			revalidatePath(`/thinking/${data.category.toLowerCase()}/${data.slug}`)
			revalidatePath(`/thinking/about/${data.category.toLowerCase()}`)
			revalidatePath(
				`/thinking/about/${data.category.toLowerCase()}/${data.slug}`
			)

			// If category or slug changed, also revalidate old paths
			if (postData.category !== data.category || postData.slug !== data.slug) {
				const oldCategory = existingPost.category?.toLowerCase()
				const oldSlug = existingPost.slug
				if (oldCategory && oldSlug) {
					revalidatePath(`/thinking/${oldCategory}`)
					revalidatePath(`/thinking/${oldCategory}/${oldSlug}`)
					revalidatePath(`/thinking/about/${oldCategory}`)
					revalidatePath(`/thinking/about/${oldCategory}/${oldSlug}`)
				}
			}

			console.log(
				"🔄 Cache revalidated for updated post (including homepage):",
				data.slug
			)
		} catch (revalidateError) {
			console.warn("⚠️ Error revalidating cache:", revalidateError)
			// Don't fail the request if revalidation fails
		}

		return NextResponse.json(data)
	} catch (error) {
		console.error("💥 Error in PATCH /api/posts/[id]:", error)
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

		// Create Supabase client with admin privileges using new simple server auth
		const supabase = await createAuthServerClient()

		// Check if the post exists and get values for cache invalidation
		const { data: existingPost, error: fetchError } = await supabase
			.from("posts")
			.select("id, category, slug")
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

		// Revalidate all blog-related paths to ensure immediate cache invalidation
		try {
			// HOMEPAGE CACHE: Deletion might change which post appears as "latest" on homepage
			revalidatePath("/")

			// Always revalidate the main blog pages
			revalidatePath("/thinking")

			// Revalidate paths for the deleted post
			const category = existingPost.category.toLowerCase()
			const slug = existingPost.slug
			revalidatePath(`/thinking/${category}`)
			revalidatePath(`/thinking/${category}/${slug}`)
			revalidatePath(`/thinking/about/${category}`)
			revalidatePath(`/thinking/about/${category}/${slug}`)

			console.log(
				"Cache revalidated for deleted post (including homepage):",
				slug
			)
		} catch (revalidateError) {
			console.warn("Error revalidating cache:", revalidateError)
			// Don't fail the request if revalidation fails
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
