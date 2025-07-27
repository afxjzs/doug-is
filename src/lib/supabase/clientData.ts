/**
 * Client-side data access layer
 *
 * This file provides client-side functions for data access using the browser client.
 * All functions use the browser client for client-side operations.
 */

import { createClient } from "./client"
import type { Database } from "../types/supabase"

// Type definitions
export interface Post {
	id: string
	title: string
	slug: string
	content: string
	excerpt: string
	published_at: string | null
	category: string
	featured_image: string | null
	created_at?: string
	updated_at?: string
}

export interface ContactMessage {
	id: string
	name: string
	email: string
	message: string
	subject?: string
	is_read?: boolean
	created_at: string
}

/**
 * Normalizes a category string for consistent comparison
 */
export function normalizeCategory(category: string): string {
	return category.toLowerCase().trim()
}

/**
 * Fetches posts from Supabase using browser client
 */
export async function getPosts(): Promise<Post[]> {
	try {
		const supabase = createClient()
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.not("published_at", "is", null)
			.order("published_at", { ascending: false })

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
 * Fetches a single post by slug and category
 */
export const getPostBySlugAndCategory = async (
	slug: string,
	category: string
): Promise<Post | null> => {
	try {
		const normalizedCategory = normalizeCategory(category)
		const supabase = createClient()
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
 * Fetches posts by category
 */
export async function getPostsByCategory(category: string): Promise<Post[]> {
	try {
		const normalizedCategory = normalizeCategory(category)
		const supabase = createClient()
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
 * Fetches a single post by slug (for backward compatibility)
 */
export const getPostBySlug = async (slug: string): Promise<Post | null> => {
	try {
		const supabase = createClient()
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("slug", slug)
			.single()

		if (error) {
			console.error("Error fetching post by slug:", error)
			return null
		}

		return data as Post
	} catch (error) {
		console.error("Exception fetching post by slug:", error)
		return null
	}
}
