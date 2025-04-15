"use server"

import { createServerComponentClient, Post } from "@/lib/supabase/serverClient"
import { normalizeCategory } from "@/lib/supabase/publicClient"

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
			query = query.eq("category", normalizedCategory)
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
			.eq("category", normalizedCategory)
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
