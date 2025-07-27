/**
 * Server-side data access layer
 *
 * This file provides server-side functions for data access using the official
 * Next.js Supabase SSR patterns. All functions use the server client for
 * proper authentication and security.
 */

import { createClient, createStaticClient } from "./server"
import type { Database } from "../types/supabase"

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
 * Normalizes a category string for consistent comparison
 */
export function normalizeCategory(category: string): string {
	return category.toLowerCase().trim()
}

/**
 * Fetches posts from Supabase using server client
 * @param limit Optional number of posts to fetch
 * @param category Optional category to filter by
 * @returns Array of posts
 */
export const getPosts = async (
	limit?: number,
	category?: string
): Promise<Post[]> => {
	try {
		const supabase = await createClient()

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
 * Fetches all posts using static client (for build-time operations)
 * @param limit Optional limit on number of posts to fetch
 * @param category Optional category filter
 * @returns Array of posts
 */
export const getPostsStatic = async (
	limit?: number,
	category?: string
): Promise<Post[]> => {
	try {
		const supabase = await createStaticClient()

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
			console.error("Error fetching posts (static):", error)
			return []
		}

		return data as Post[]
	} catch (error) {
		console.error("Exception fetching posts (static):", error)
		return []
	}
}

/**
 * Fetches a single post by slug using server client
 * @param slug The post slug to fetch
 * @returns The post or null if not found
 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
	try {
		const supabase = await createClient()

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
		const supabase = await createClient()
		const normalizedCategory = normalizeCategory(category)

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("slug", slug)
			.ilike("category", normalizedCategory)
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
 * Fetches a single post by slug and category using static client (for build-time operations)
 * @param slug The post slug to fetch
 * @param category The post category to match
 * @returns The post or null if not found
 */
export const getPostBySlugAndCategoryStatic = async (
	slug: string,
	category: string
): Promise<Post | null> => {
	try {
		const supabase = await createStaticClient()
		const normalizedCategory = normalizeCategory(category)

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("slug", slug)
			.ilike("category", normalizedCategory)
			.single()

		if (error) {
			console.error("Error fetching post by slug and category (static):", error)
			return null
		}

		return data as Post
	} catch (error) {
		console.error(
			"Exception fetching post by slug and category (static):",
			error
		)
		return null
	}
}

/**
 * Fetches all posts in a specific category
 */
export async function getPostsByCategory(category: string): Promise<Post[]> {
	try {
		const supabase = await createClient()
		const normalizedCategory = normalizeCategory(category)

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
