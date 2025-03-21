"use server"

import { getServerSupabaseClient, Post } from "@/lib/supabase/serverClient"

/**
 * Server action to fetch all posts with optional filtering
 * This uses the server-side Supabase client
 */
export async function fetchPosts(
	limit?: number,
	category?: string
): Promise<Post[]> {
	try {
		const supabase = getServerSupabaseClient()

		// Build query with proper type safety
		let query = supabase
			.from("posts")
			.select("*")
			.order("published_at", { ascending: false })

		// Apply optional filters
		if (category) {
			query = query.eq("category", category)
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
 * Server action to fetch a single post by slug
 */
export async function fetchPostBySlug(slug: string): Promise<Post | null> {
	try {
		const supabase = getServerSupabaseClient()

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
		const supabase = getServerSupabaseClient()

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("category", category)
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
