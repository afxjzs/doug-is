// src/lib/supabase/publicClient.ts
import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"

// This client should ONLY be used for public read-only operations
// It uses the anon key which is safe to expose to the client
// Any data mutations should use server actions instead

// Ensure we have the full URL and key without any truncation or formatting issues
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Check if we're in development mode and missing Supabase credentials
const isDev = process.env.NODE_ENV === "development"
const isMissingCredentials = !supabaseUrl || !supabaseAnonKey

// Log connection status in development
if (isDev) {
	if (isMissingCredentials) {
		console.warn(
			"⚠️ Supabase credentials missing. Missing required environment variables."
		)
	} else {
		console.log(
			`🔌 Connecting to Supabase at ${supabaseUrl.substring(0, 20)}...`
		)
	}
}

// Sample mock data for development
export const mockPosts: Post[] = [
	{
		id: "1",
		title: "Getting Started with Vaporwave Design",
		slug: "getting-started-with-vaporwave-design",
		content: "Vaporwave is an aesthetic that emerged in the early 2010s...",
		excerpt:
			"An introduction to vaporwave aesthetics and how to incorporate this retro-futuristic style into your designs.",
		published_at: new Date().toISOString(),
		category: "general",
		featured_image:
			"https://images.unsplash.com/photo-1604871000636-074fa5117945?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
	},
	{
		id: "2",
		title: "Investment Strategies for 2023",
		slug: "investment-strategies-for-2023",
		content:
			"As we navigate through 2023, several investment strategies stand out...",
		excerpt:
			"Exploring effective investment approaches for navigating the current economic landscape.",
		published_at: new Date().toISOString(),
		category: "investing",
		featured_image:
			"https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
	},
	{
		id: "3",
		title: "The Role of AI in Business Advisory",
		slug: "role-of-ai-in-business-advisory",
		content:
			"Artificial Intelligence is transforming business advisory services across industries...",
		excerpt:
			"Examining how artificial intelligence is revolutionizing business advisory services and decision-making processes.",
		published_at: new Date().toISOString(),
		category: "advisory",
		featured_image:
			"https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80",
	},
]

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
 * Creates a Supabase client with the anon key for public read-only operations
 * @returns A typed Supabase client instance or null if credentials are missing
 */
export const createPublicSupabaseClient = () => {
	// Validate environment variables
	if (!supabaseUrl || !supabaseAnonKey) {
		if (isDev) {
			console.warn("⚠️ Missing Supabase credentials")
			return null
		}

		console.error("Missing Supabase credentials")
		throw new Error("Missing Supabase credentials")
	}

	try {
		// Create and return a typed Supabase client with the anon key
		return createClient<Database>(supabaseUrl, supabaseAnonKey, {
			auth: {
				persistSession: true,
				autoRefreshToken: true,
			},
		})
	} catch (error) {
		console.error("Failed to create Supabase client:", error)
		throw new Error("Failed to initialize database client")
	}
}

// Create a singleton instance for client-side usage
let publicSupabaseInstance: ReturnType<
	typeof createPublicSupabaseClient
> | null = null

/**
 * Gets a singleton public Supabase client instance
 * Use this for read-only public data access
 * @returns A typed Supabase client instance or null if in development with missing credentials
 */
export const getPublicSupabaseClient = () => {
	if (!publicSupabaseInstance) {
		publicSupabaseInstance = createPublicSupabaseClient()
	}
	return publicSupabaseInstance
}

/**
 * PUBLIC READ-ONLY OPERATIONS ONLY
 */

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
	const supabase = getPublicSupabaseClient()

	// Return empty array if no Supabase client
	if (!supabase) {
		console.error("No Supabase client available")
		return []
	}

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
	const supabase = getPublicSupabaseClient()

	// Return null if no Supabase client
	if (!supabase) {
		console.error("No Supabase client available")
		return null
	}

	try {
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
 * Fetches posts by category from Supabase
 * @param category The category to filter by
 * @returns Array of posts in the specified category
 */
export async function getPostsByCategory(category: string): Promise<Post[]> {
	const supabase = getPublicSupabaseClient()

	// Return empty array if no Supabase client
	if (!supabase) {
		console.error("No Supabase client available")
		return []
	}

	try {
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
