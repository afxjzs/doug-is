import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

// This file should ONLY be imported in server components or API routes
// The service role key gives full access to your database without RLS
if (typeof window !== "undefined") {
	throw new Error("This file should not be imported on the client side")
}

// Use the service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseUrl || !supabaseServiceKey) {
	throw new Error("Missing Supabase server credentials")
}

/**
 * Creates a Supabase admin client with service role key
 * This client bypasses Row Level Security (RLS) and should
 * only be used in server contexts (API routes, server components)
 */
export const createServerSupabaseClient = () => {
	try {
		return createClient<Database>(supabaseUrl, supabaseServiceKey, {
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		})
	} catch (error) {
		console.error("Failed to create server Supabase client:", error)
		throw new Error("Failed to initialize server database client")
	}
}

// Create a singleton instance for server-side usage
let serverSupabaseInstance: ReturnType<
	typeof createServerSupabaseClient
> | null = null

/**
 * Gets a singleton server Supabase client instance
 * ONLY FOR SERVER-SIDE USE
 */
export const getServerSupabaseClient = () => {
	if (!serverSupabaseInstance) {
		serverSupabaseInstance = createServerSupabaseClient()
	}
	return serverSupabaseInstance
}

/**
 * Re-export Post interface from the public client for consistency
 */
export interface Post {
	id: string
	title: string
	slug: string
	content: string
	excerpt: string
	published_at: string
	category: string
	featured_image?: string
	created_at?: string
	updated_at?: string
}

/**
 * Administrator operations for managing posts
 * These functions bypass RLS and should only be used in server contexts
 */

export async function adminCreatePost(
	post: Omit<Post, "id">
): Promise<Post | null> {
	const supabase = getServerSupabaseClient()

	try {
		const { data, error } = await supabase
			.from("posts")
			.insert(post)
			.select()
			.single()

		if (error) {
			console.error("Error creating post:", error)
			return null
		}

		return data as Post
	} catch (error) {
		console.error("Exception creating post:", error)
		return null
	}
}

export async function adminUpdatePost(
	id: string,
	post: Partial<Post>
): Promise<Post | null> {
	const supabase = getServerSupabaseClient()

	try {
		const { data, error } = await supabase
			.from("posts")
			.update(post)
			.eq("id", id)
			.select()
			.single()

		if (error) {
			console.error("Error updating post:", error)
			return null
		}

		return data as Post
	} catch (error) {
		console.error("Exception updating post:", error)
		return null
	}
}

export async function adminDeletePost(id: string): Promise<boolean> {
	const supabase = getServerSupabaseClient()

	try {
		const { error } = await supabase.from("posts").delete().eq("id", id)

		if (error) {
			console.error("Error deleting post:", error)
			return false
		}

		return true
	} catch (error) {
		console.error("Exception deleting post:", error)
		return false
	}
}

/**
 * Contact message interface for consistency
 */
export interface ContactMessage {
	id: string
	name: string
	email: string
	subject: string
	message: string
	is_read: boolean
	created_at: string
}

/**
 * Get all contact form submissions
 * ONLY FOR SERVER-SIDE USE
 */
export async function adminGetContactSubmissions(): Promise<ContactMessage[]> {
	const supabase = getServerSupabaseClient()

	try {
		const { data, error } = await supabase
			.from("contact_messages")
			.select("*")
			.order("created_at", { ascending: false })

		if (error) {
			console.error("Error fetching contact submissions:", error)
			return []
		}

		return data as ContactMessage[]
	} catch (error) {
		console.error("Exception fetching contact submissions:", error)
		return []
	}
}
