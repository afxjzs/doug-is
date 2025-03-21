import { createClient } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"
import { cookies } from "next/headers"

// This file should ONLY be imported in server components or API routes
// The service role key gives full access to your database without RLS
if (typeof window !== "undefined") {
	throw new Error("This file should not be imported on the client side")
}

// Define development mode flag
const isDev = process.env.NODE_ENV === "development"

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
export const createServiceClient = () => {
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

/**
 * Initialize the Supabase client with cookies for server components
 * This client respects Row Level Security (RLS) and uses the user's session
 */
export const getServerSupabaseClient = () => {
	const cookieStore = cookies()

	// Instead of using cookieStore directly, convert it to a string manually
	const cookieHeader = cookieStore.toString()

	return createClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			auth: {
				persistSession: false,
			},
			global: {
				fetch: fetch.bind(globalThis),
				headers: {
					cookie: cookieHeader,
				},
			},
		}
	)
}

/**
 * Post interface for consistency across components
 */
export interface Post {
	id: string
	title: string
	slug: string
	content: string
	excerpt: string
	published_at: string
	category: string
	featured_image?: string | null
	image_url?: string
	published?: boolean
	created_at?: string
	updated_at?: string
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

// Mock data for development and testing
const mockPosts = [
	{
		id: "1",
		title: "Getting Started with Next.js 13",
		slug: "getting-started-with-nextjs-13",
		content:
			"# Getting Started with Next.js 13\n\nNext.js 13 introduces several new features...",
		excerpt: "Learn how to build modern web applications with Next.js 13",
		image_url: "https://example.com/images/nextjs.jpg",
		published: true,
		published_at: new Date().toISOString(),
		created_at: new Date().toISOString(),
		category: "Development",
	},
	{
		id: "2",
		title: "Understanding TypeScript Generics",
		slug: "understanding-typescript-generics",
		content:
			"# Understanding TypeScript Generics\n\nGenerics are a powerful feature in TypeScript...",
		excerpt:
			"Deep dive into TypeScript generics and how to use them effectively",
		image_url: "https://example.com/images/typescript.jpg",
		published: true,
		published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
		created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
		category: "TypeScript",
	},
]

const mockContactSubmissions = [
	{
		id: "1",
		name: "John Doe",
		email: "john.doe@example.com",
		subject: "Collaboration Opportunity",
		message:
			"Hi there! I saw your portfolio and would love to discuss a potential collaboration on a project I'm working on.",
		is_read: false,
		created_at: new Date().toISOString(),
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane.smith@example.com",
		subject: "Speaking Engagement",
		message:
			"Hello! I'm organizing a tech conference and would be interested in having you as a speaker. Could we set up a call to discuss?",
		is_read: false,
		created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
	},
]

// ------------------------------------------------------------
// Admin functions for managing posts
// ------------------------------------------------------------

/**
 * Get all posts (published and drafts) for the admin panel
 */
export async function adminGetPosts(): Promise<Post[]> {
	console.log("Getting posts...")
	const supabase = createServiceClient()

	try {
		// Test if service role is working by checking if we can count posts
		const { count, error: testError } = await supabase
			.from("posts")
			.select("*", { count: "exact", head: true })

		if (testError) {
			console.error("Error fetching posts:", testError)

			// Return mock data during development
			if (isDev) {
				console.log("Returning mock posts due to permission error")
				return mockPosts
			}
			return []
		}

		console.log(`Found ${count} posts`)
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.order("published_at", { ascending: false })

		if (error) {
			console.error("Error fetching posts:", error)
			return []
		}

		return data || []
	} catch (err) {
		console.error("Error in adminGetPosts:", err)
		return []
	}
}

/**
 * Get all contact form submissions for the admin panel
 */
export async function adminGetContactSubmissions(): Promise<ContactMessage[]> {
	console.log("Getting contact submissions...")
	const supabase = createServiceClient()

	try {
		// Test if service role is working by checking if we can count contact_messages
		const { count, error: testError } = await supabase
			.from("contact_messages")
			.select("*", { count: "exact", head: true })

		if (testError) {
			console.error("Error fetching contact submissions:", testError)

			// Return mock data during development
			if (isDev) {
				console.log(
					"Returning mock contact submissions due to permission error"
				)
				return mockContactSubmissions
			}
			return []
		}

		console.log(`Found ${count} contact submissions`)
		const { data, error } = await supabase
			.from("contact_messages")
			.select("*")
			.order("created_at", { ascending: false })

		if (error) {
			console.error("Error fetching contact submissions:", error)
			return []
		}

		return data || []
	} catch (err) {
		console.error("Error in adminGetContactSubmissions:", err)
		return []
	}
}

/**
 * Create a new blog post
 */
export async function adminCreatePost(post: Omit<Post, "id" | "created_at">) {
	const supabase = createServiceClient()
	return await supabase
		.from("posts")
		.insert({
			title: post.title,
			slug: post.slug,
			content: post.content,
			excerpt: post.excerpt,
			image_url: post.image_url,
			published: post.published,
			published_at: post.published_at,
			category: post.category,
		})
		.select()
		.single()
}

/**
 * Update an existing blog post
 */
export async function adminUpdatePost(
	id: string,
	post: Partial<Omit<Post, "id" | "created_at">>
) {
	const supabase = createServiceClient()
	return await supabase
		.from("posts")
		.update({ ...post })
		.eq("id", id)
		.select()
		.single()
}

/**
 * Delete a blog post
 */
export async function adminDeletePost(id: string) {
	const supabase = createServiceClient()
	return await supabase.from("posts").delete().eq("id", id)
}
