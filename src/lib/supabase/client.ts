import { createClient } from "@supabase/supabase-js"

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
			"⚠️ Supabase credentials missing. Using mock data for development."
		)
	} else {
		console.log(
			`🔌 Connecting to Supabase at ${supabaseUrl.substring(0, 20)}...`
		)
	}
}

// Sample mock data for development
const mockPosts: Post[] = [
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

// Create a Supabase client with error handling
export const supabase = isMissingCredentials
	? null
	: createClient(supabaseUrl, supabaseAnonKey, {
			auth: {
				persistSession: false, // Don't persist session in SSR context
				autoRefreshToken: false,
			},
	  })

// Function to verify Supabase connection
export async function verifySupabaseConnection(): Promise<boolean> {
	if (isMissingCredentials || !supabase) {
		console.warn("⚠️ Supabase client not initialized - missing credentials")
		return false
	}

	try {
		console.log("Attempting to verify Supabase connection...")
		console.log(`URL: ${supabaseUrl}`)
		console.log(`Anon key present: ${!!supabaseAnonKey}`)
		console.log(`Anon key length: ${supabaseAnonKey.length}`)
		console.log(`Anon key first 10 chars: ${supabaseAnonKey.substring(0, 10)}`)
		console.log(
			`Anon key last 10 chars: ${supabaseAnonKey.substring(
				supabaseAnonKey.length - 10
			)}`
		)

		const { data, error } = await supabase.from("posts").select("id").limit(1)

		if (error) {
			console.error("Supabase connection error:", error)
			return false
		}

		console.log("Supabase connection successful, data:", data)
		return true
	} catch (err) {
		console.error("Failed to verify Supabase connection:", err)
		return false
	}
}

export interface Post {
	id: string
	title: string
	slug: string
	content: string
	excerpt: string
	published_at?: string
	category: string
	featured_image?: string
}

export async function getPosts(): Promise<Post[]> {
	// If in development with missing credentials, return mock data
	if (isMissingCredentials || !supabase) {
		if (isDev) {
			console.warn(
				"Using mock data for posts - Supabase client not initialized"
			)
			return mockPosts
		}
		console.warn(
			"Missing Supabase credentials in production - returning empty array"
		)
		return []
	}

	try {
		console.log("Fetching posts from Supabase...")
		console.log(`Using Supabase URL: ${supabaseUrl.substring(0, 20)}...`)

		// Simple direct query without timeout
		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.order("published_at", { ascending: false })

		if (error) {
			console.error("Error fetching posts:", error)
			// Log more details about the error
			console.error("Error details:", JSON.stringify(error, null, 2))

			// Fallback to mock data in development
			if (isDev) {
				console.warn("Falling back to mock data in development")
				return mockPosts
			}
			return []
		}

		if (!data) {
			console.warn("No data returned from Supabase")
			return isDev ? mockPosts : []
		}

		console.log(`Successfully fetched ${data.length} posts`)
		// Log the first post for debugging
		if (data.length > 0) {
			console.log("First post:", JSON.stringify(data[0], null, 2))
		}

		return data
	} catch (error) {
		console.error("Exception fetching posts:", error)
		return isDev ? mockPosts : []
	}
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
	// If in development with missing credentials, return mock data
	if (isMissingCredentials || !supabase) {
		if (isDev) {
			console.warn(
				"Using mock data for post by slug - Supabase client not initialized"
			)
			const post = mockPosts.find((p) => p.slug === slug)
			return post || null
		}
		return null
	}

	try {
		console.log(`Fetching post with slug: ${slug}`)

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("slug", slug)
			.single()

		if (error) {
			console.error(`Error fetching post with slug ${slug}:`, error)
			if (isDev) {
				const mockPost = mockPosts.find((p) => p.slug === slug)
				if (mockPost) return mockPost
			}
			return null
		}

		console.log(`Successfully fetched post: ${data?.title}`)
		return data
	} catch (error) {
		console.error(`Error fetching post with slug ${slug}:`, error)
		if (isDev) {
			const mockPost = mockPosts.find((p) => p.slug === slug)
			if (mockPost) return mockPost
		}
		return null
	}
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
	// If in development with missing credentials, return mock data
	if (isMissingCredentials || !supabase) {
		if (isDev) {
			console.warn(
				"Using mock data for posts - Supabase client not initialized"
			)
			return mockPosts.filter((post) => post.category === category)
		}
		return []
	}

	try {
		console.log(`Fetching posts in category: ${category}`)

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.eq("category", category)
			.order("published_at", { ascending: false })

		if (error) {
			console.error(`Error fetching posts in category ${category}:`, error)
			// Fallback to mock data in development
			if (isDev) {
				return mockPosts.filter((post) => post.category === category)
			}
			return []
		}

		console.log(
			`Successfully fetched ${data?.length || 0} posts in category ${category}`
		)
		return data || []
	} catch (error) {
		console.error(`Error fetching posts in category ${category}:`, error)
		if (isDev) {
			return mockPosts.filter((post) => post.category === category)
		}
		return []
	}
}

export async function createPost(post: Omit<Post, "id">): Promise<Post | null> {
	// If in development with missing credentials, return mock data
	if (isMissingCredentials || !supabase) {
		if (isDev) {
			console.warn(
				"Using mock data for creating post - Supabase client not initialized"
			)
			const newPost = {
				id: Math.random().toString(36).substring(2, 15),
				...post,
				published_at: post.published_at || new Date().toISOString(),
			}
			mockPosts.push(newPost as Post)
			return newPost as Post
		}
		return null
	}

	try {
		// Set published_at to current date if not provided
		const postWithDate = {
			...post,
			published_at: post.published_at || new Date().toISOString(),
		}

		console.log("Creating new post:", postWithDate.title)
		const { data, error } = await supabase
			.from("posts")
			.insert([postWithDate])
			.select()
			.single()

		if (error) {
			// If the error is about the relation not existing, use mock data
			if (error.code === "42P01") {
				console.warn(
					"Table 'posts' does not exist in Supabase. Using mock data instead."
				)
				const newPost = {
					id: Math.random().toString(36).substring(2, 15),
					...post,
					published_at: post.published_at || new Date().toISOString(),
				}
				mockPosts.push(newPost as Post)
				return newPost as Post
			}

			throw error
		}

		console.log(`Successfully created post: ${data.title}`)
		return data
	} catch (err) {
		console.error("Error creating post:", err)
		throw err
	}
}

export async function updatePost(
	id: string,
	post: Partial<Post>
): Promise<Post | null> {
	// If in development with missing credentials, return mock data
	if (isMissingCredentials || !supabase) {
		if (isDev) {
			console.warn(
				"Using mock data for updating post - Supabase client not initialized"
			)
			const index = mockPosts.findIndex((p) => p.id === id)
			if (index !== -1) {
				mockPosts[index] = { ...mockPosts[index], ...post }
				return mockPosts[index] as Post
			}
			return null
		}
		return null
	}

	try {
		console.log(`Updating post with ID: ${id}`)
		const { data, error } = await supabase
			.from("posts")
			.update(post)
			.eq("id", id)
			.select()
			.single()

		if (error) {
			// If the error is about the relation not existing, use mock data
			if (error.code === "42P01") {
				console.warn(
					"Table 'posts' does not exist in Supabase. Using mock data instead."
				)
				const index = mockPosts.findIndex((p) => p.id === id)
				if (index !== -1) {
					mockPosts[index] = { ...mockPosts[index], ...post }
					return mockPosts[index] as Post
				}
				return null
			}

			throw error
		}

		console.log(`Successfully updated post: ${data.title}`)
		return data
	} catch (err) {
		console.error(`Error updating post ${id}:`, err)
		throw err
	}
}

export async function deletePost(id: string): Promise<boolean> {
	// If in development with missing credentials, return mock data
	if (isMissingCredentials || !supabase) {
		if (isDev) {
			console.warn(
				"Using mock data for deleting post - Supabase client not initialized"
			)
			const index = mockPosts.findIndex((p) => p.id === id)
			if (index !== -1) {
				mockPosts.splice(index, 1)
				return true
			}
			return false
		}
		return false
	}

	try {
		console.log(`Deleting post with ID: ${id}`)
		const { error } = await supabase.from("posts").delete().eq("id", id)

		if (error) {
			// If the error is about the relation not existing, use mock data
			if (error.code === "42P01") {
				console.warn(
					"Table 'posts' does not exist in Supabase. Using mock data instead."
				)
				const index = mockPosts.findIndex((p) => p.id === id)
				if (index !== -1) {
					mockPosts.splice(index, 1)
					return true
				}
				return false
			}

			throw error
		}

		console.log(`Successfully deleted post with ID: ${id}`)
		return true
	} catch (err) {
		console.error(`Error deleting post ${id}:`, err)
		throw err
	}
}
