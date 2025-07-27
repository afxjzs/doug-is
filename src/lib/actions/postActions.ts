"use server"

import { createServerComponentClient, Post } from "@/lib/supabase/serverClient"
import { normalizeCategory } from "@/lib/supabase/data"
import { createAdminClient } from "@/lib/supabase/serverClient"

/**
 * Server action to fetch all posts with optional filtering
 * This uses the server-side Supabase client
 */
export async function fetchPosts(
	limit?: number,
	category?: string
): Promise<Post[]> {
	try {
		const supabase = await createServerComponentClient()

		// Build query with proper type safety
		let query = supabase
			.from("posts")
			.select("*")
			.order("published_at", { ascending: false })

		// Apply optional filters
		if (category) {
			const normalizedCategory = normalizeCategory(category)
			query = query.ilike("category", normalizedCategory)
		}

		if (limit) {
			query = query.limit(limit)
		}

		// Execute query with proper error handling
		const { data, error } = await query

		if (error) {
			console.error("Error fetching posts:", error)
			return []
		}

		return data as Post[]
	} catch (error) {
		console.error("Exception fetching posts:", error)
		return []
	}
}

/**
 * Server action to fetch a post by ID
 */
export async function fetchPostById(id: string): Promise<Post | null> {
	try {
		const supabase = await createServerComponentClient()

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("id", id)
			.maybeSingle()

		if (error) {
			console.error("Error fetching post by ID:", error)
			return null
		}

		return data as Post
	} catch (error) {
		console.error("Exception fetching post by ID:", error)
		return null
	}
}

/**
 * Server action to fetch a single post by slug
 */
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
	try {
		const supabase = await createServerComponentClient()

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("slug", slug)
			.single()

		if (error) {
			if (error.code === "PGRST116") {
				// Not found error
				return null
			}
			console.error("Error fetching post by slug:", error)
			return null
		}

		return data as Post
	} catch (error) {
		console.error("Exception fetching post by slug:", error)
		return null
	}
}

/**
 * Server action to fetch posts by category
 */
export async function fetchPostsByCategory(category: string): Promise<Post[]> {
	try {
		const supabase = await createServerComponentClient()
		const normalizedCategory = normalizeCategory(category)

		console.log(
			`Fetching posts for normalized category: '${normalizedCategory}'`
		)

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.ilike("category", normalizedCategory)
			.order("published_at", { ascending: false })

		if (error) {
			console.error("Error fetching posts by category:", error)
			return []
		}

		return data as Post[]
	} catch (error) {
		console.error("Exception fetching posts by category:", error)
		return []
	}
}

/**
 * Server action to publish a draft post
 * This uses the admin client to bypass RLS and update the post
 */
export async function publishPost(
	postId: string
): Promise<{ success: boolean; error?: string }> {
	try {
		const supabase = createAdminClient()

		const { data, error } = await supabase
			.from("posts")
			.update({
				published_at: new Date().toISOString(),
			})
			.eq("id", postId)
			.select()
			.single()

		if (error) {
			console.error("Error publishing post:", error)
			return { success: false, error: error.message }
		}

		if (!data) {
			return { success: false, error: "Post not found" }
		}

		console.log(`Successfully published post: ${data.title}`)
		return { success: true }
	} catch (error) {
		console.error("Exception publishing post:", error)
		return { success: false, error: "Failed to publish post" }
	}
}
