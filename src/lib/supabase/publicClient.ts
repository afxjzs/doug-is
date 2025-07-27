// src/lib/supabase/publicClient.ts
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

// This client should ONLY be used for public read-only operations
// It uses the anon key which is safe to expose to the client
// Any data mutations should use server actions instead

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
	throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
	throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

// Create a singleton instance for client-side usage
export const supabase = createClient<Database>(
	process.env.NEXT_PUBLIC_SUPABASE_URL,
	process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	{
		auth: {
			persistSession: false,
			autoRefreshToken: false,
		},
	}
)

// Export a function to get the public client
export function getPublicSupabaseClient() {
	return supabase
}

// Type definitions
export interface Post {
	id: string
	title: string
	slug: string
	content: string
	excerpt: string
	published_at: string
	category: string
	featured_image: string | null
	created_at?: string
	updated_at?: string
}

/**
 * Fetches posts from Supabase
 * @param limit Optional number of posts to fetch
 * @param category Optional category to filter by
 * @returns Array of posts
 */
export const getPosts = async (
	limit?: number,
	category?: string
): Promise<Post[]> => {
	try {
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
 * Fetches a single post by slug
 * @param slug The post slug to fetch
 * @returns The post or null if not found
 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
	try {
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("slug", slug)
			.single()

		if (error) {
			console.error("Error fetching post:", error)
			return null
		}

		return data as Post
	} catch (error) {
		console.error("Exception fetching post:", error)
		return null
	}
}

/**
 * Fetches a single post by slug and category for more precise matching
 * @param slug The post slug to fetch
 * @param category The post category to match
 * @returns The post or null if not found
 */
export const getPostBySlugAndCategory = async (
	slug: string,
	category: string
): Promise<Post | null> => {
	try {
		const normalizedCategory = normalizeCategory(category)
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("slug", slug)
			.eq("category", normalizedCategory)
			.single()

		if (error) {
			console.error("Error fetching post by slug and category:", error)
			return null
		}

		return data as Post
	} catch (error) {
		console.error("Exception fetching post by slug and category:", error)
		return null
	}
}

/**
 * Normalizes a category string for consistent comparison
 */
export function normalizeCategory(category: string): string {
	return category.toLowerCase().trim()
}

/**
 * Fetches all posts in a specific category
 */
export async function getPostsByCategory(category: string): Promise<Post[]> {
	try {
		const normalizedCategory = normalizeCategory(category)
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
