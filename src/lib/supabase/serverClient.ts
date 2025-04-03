/**
 * Supabase client for server-side components only
 * This file contains server-only functionality
 */

import { createClient as createServiceClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import type { Database } from "../types/supabase"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

// Define the Post type
export interface Post {
	id: string
	title: string
	slug: string
	content: string
	excerpt: string
	category: string
	published_at: string | null
	featured_image: string | null
	created_at: string
	updated_at: string
}

// Define the Contact Message type
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
 * Creates a Supabase client for server-side components
 * This handles the asynchronous cookie store in Next.js 15
 */
export async function createServerComponentClient() {
	const cookieStore = await cookies()

	return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll() {
				return cookieStore.getAll()
			},
			setAll(cookiesToSet) {
				try {
					cookiesToSet.forEach(({ name, value, options }) => {
						cookieStore.set(name, value, options)
					})
				} catch (error) {
					// The `set` method was called from a Server Component.
					// This can be ignored if you have middleware refreshing
					// user sessions.
					console.error("Error setting cookies:", error)
				}
			},
		},
	})
}

/**
 * Creates a Supabase client with admin privileges
 * This bypasses RLS and should ONLY be used in server-side code
 */
export function createAdminClient() {
	if (typeof window !== "undefined") {
		throw new Error("Admin client can only be used on the server")
	}

	if (!serviceRoleKey) {
		throw new Error("Service role key is missing")
	}

	console.log("Creating admin client with service role")

	return createServiceClient<Database>(supabaseUrl, serviceRoleKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
	})
}

/**
 * Fetches a single post by ID using admin privileges
 * @param id - The UUID of the post to fetch
 * @returns The post object or null if not found
 */
export async function adminGetPostById(id: string): Promise<Post | null> {
	console.log("Fetching post by ID:", id)

	try {
		// Create the admin client that bypasses RLS
		const supabase = createAdminClient()

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("id", id)
			.single()

		if (error) {
			console.error("Error fetching post by ID:", error)
			return null
		}

		if (!data) {
			console.log("Post not found with ID:", id)
			return null
		}

		console.log("Found post:", data.title)
		return data as Post
	} catch (error) {
		console.error("Exception in adminGetPostById:", error)
		return null
	}
}

/**
 * Fetches all contact submissions using admin privileges
 * This bypasses RLS and should only be used in server-side admin components
 * @returns Array of contact messages
 */
export async function adminGetContactSubmissions(): Promise<ContactMessage[]> {
	console.log("Fetching contact submissions as admin...")

	try {
		// Create the admin client that bypasses RLS
		const supabase = createAdminClient()

		const { data, error } = await supabase
			.from("contact_messages")
			.select("*")
			.order("created_at", { ascending: false })

		if (error) {
			console.error("Error fetching contact submissions:", error)
			return []
		}

		console.log(`Found ${data?.length || 0} contact submissions`)
		return data as ContactMessage[]
	} catch (error) {
		console.error("Exception in adminGetContactSubmissions:", error)
		return []
	}
}

/**
 * Gets all posts with optional filtering
 */
export async function getPosts(
	limit?: number,
	category?: string
): Promise<Post[]> {
	console.log("Getting posts...")

	try {
		// Create the admin client that bypasses RLS
		const supabase = createAdminClient()
		console.log("Created server client with service role")

		let query = supabase
			.from("posts")
			.select("*")
			.order("published_at", { ascending: false })

		// Apply category filter if provided
		if (category) {
			query = query.eq("category", category)
		}

		// Apply limit if provided
		if (limit) {
			query = query.limit(limit)
		}

		const { data, error } = await query

		if (error) {
			console.error("Error fetching posts:", error)
			return []
		}

		console.log(`Found ${data?.length || 0} posts`)
		return data || []
	} catch (error) {
		console.error("Exception in getPosts:", error)
		return []
	}
}

/**
 * Gets all contact submissions
 */
export async function getContactSubmissions(): Promise<ContactMessage[]> {
	console.log("Getting contact submissions...")

	try {
		// Create the admin client that bypasses RLS
		const supabase = createAdminClient()
		console.log("Created server client with service role")

		const { data, error } = await supabase
			.from("contact_messages")
			.select("*")
			.order("created_at", { ascending: false })

		if (error) {
			console.error("Error fetching contact submissions:", error)
			return []
		}

		console.log(`Found ${data?.length || 0} contact submissions`)
		return data || []
	} catch (error) {
		console.error("Exception in getContactSubmissions:", error)
		return []
	}
}
