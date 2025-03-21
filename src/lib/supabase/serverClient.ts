import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

// This file should ONLY be imported in server components or API routes
// The service role key gives full access to your database without RLS
if (typeof window !== "undefined") {
	throw new Error("This file should not be imported on the client side")
}

// Define development mode flag
const isDev = process.env.NODE_ENV === "development"

// Mock data for development and testing
const mockContactSubmissions = [
	{
		id: "mock-id-1",
		name: "Mock User",
		email: "mock@example.com",
		subject: "Mock Subject",
		message:
			"This is mock data because of a permission issue with your Supabase setup.",
		is_read: false,
		created_at: new Date().toISOString(),
	},
]

const mockPosts = [
	{
		id: "mock-id-1",
		title: "Mock Post",
		slug: "mock-post",
		content:
			"This is mock content because of a permission issue with your Supabase setup.",
		excerpt: "Mock excerpt",
		published_at: new Date().toISOString(),
		category: "general",
		created_at: new Date().toISOString(),
		updated_at: new Date().toISOString(),
	},
]

// Use the service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

if (!supabaseUrl || !supabaseServiceKey) {
	throw new Error("Missing Supabase server credentials")
} else {
	// Log key info for debugging (only first/last 5 chars for security)
	console.log("Supabase URL available:", Boolean(supabaseUrl))
	console.log(
		"Service key available:",
		Boolean(supabaseServiceKey),
		`${supabaseServiceKey.substring(0, 5)}...${supabaseServiceKey.substring(
			supabaseServiceKey.length - 5
		)}`
	)
}

/**
 * Creates a Supabase admin client with service role key
 * This client bypasses Row Level Security (RLS) and should
 * only be used in server contexts (API routes, server components)
 */
export const createServerSupabaseClient = () => {
	try {
		// Create a direct client with the service key
		// Don't use any additional auth configuration that might interfere
		const client = createClient<Database>(supabaseUrl, supabaseServiceKey, {
			db: {
				schema: "public",
			},
			auth: {
				autoRefreshToken: false,
				persistSession: false,
			},
		})

		console.log("Created server client with service role")

		return client
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

	// Return mock data if no Supabase client
	if (!supabase || isDev) {
		console.log("Returning mock data in development mode")
		return mockContactSubmissions
	}

	try {
		// Test if service role access is working
		console.log(
			"Attempting to fetch contact submissions with service role client"
		)
		const { count, error: testError } = await supabase
			.from("contact_messages")
			.select("*", { count: "exact", head: true })

		console.log("SQL test result:", { count, error: testError })

		const { data, error } = await supabase
			.from("contact_messages")
			.select("*")
			.order("created_at", { ascending: false })

		if (error) {
			console.error("Error fetching contact submissions:", error)

			// Return empty array with more detailed console log about permissions
			if (error.code === "42501") {
				console.log(
					"PERMISSION DENIED fetching contact messages. This is a server-side issue with your Supabase configuration."
				)

				// Return mock data to prevent UI errors in development
				if (process.env.NODE_ENV === "development") {
					console.log("Returning mock data in development mode")
					// Return some mock data in development
					return [
						{
							id: "mock-id-1",
							name: "Mock User",
							email: "mock@example.com",
							subject: "Mock Subject",
							message:
								"This is mock data because of a permission issue with your Supabase setup.",
							is_read: false,
							created_at: new Date().toISOString(),
						},
					]
				}
			}

			return []
		}

		return (data as ContactMessage[]) || []
	} catch (error) {
		console.error("Exception fetching contact submissions:", error)
		return []
	}
}

/**
 * Get all posts (published and drafts)
 * ONLY FOR SERVER-SIDE USE
 */
export async function adminGetPosts(): Promise<Post[]> {
	const supabase = getServerSupabaseClient()

	if (!supabase || isDev) {
		console.warn("Using mock posts in development mode")
		return mockPosts
	}

	try {
		// Test if service role access is working
		console.log("Attempting to fetch posts with service role client")
		const { count, error: testError } = await supabase
			.from("posts")
			.select("*", { count: "exact", head: true })

		console.log("SQL test result:", { count, error: testError })

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.order("published_at", { ascending: false })

		if (error) {
			console.error("Error fetching posts:", error)

			// Return empty array with more detailed console log about permissions
			if (error.code === "42501") {
				console.log(
					"PERMISSION DENIED fetching posts. This is a server-side issue with your Supabase configuration."
				)

				// Return mock data to prevent UI errors in development
				if (process.env.NODE_ENV === "development") {
					console.log("Returning mock data in development mode")
					// Return some mock data in development
					return [
						{
							id: "mock-id-1",
							title: "Mock Post",
							slug: "mock-post",
							content:
								"This is mock content because of a permission issue with your Supabase setup.",
							excerpt: "Mock excerpt",
							published_at: new Date().toISOString(),
							category: "general",
							created_at: new Date().toISOString(),
							updated_at: new Date().toISOString(),
						},
					]
				}
			}

			return []
		}

		return (data as Post[]) || []
	} catch (error) {
		console.error("Error fetching posts:", error)
		return []
	}
}
