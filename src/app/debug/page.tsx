import { Metadata } from "next"
import { Post } from "@/lib/supabase/client"

export const metadata: Metadata = {
	title: "Debug | Doug.is",
	description: "Debug page for troubleshooting",
}

async function fetchPosts(): Promise<{
	posts: Post[]
	error: string | null
	raw: any
}> {
	try {
		// We need to use a complete URL for server components
		const protocol = process.env.NODE_ENV === "development" ? "http:" : "https:"
		const host =
			process.env.NODE_ENV === "development"
				? "localhost:3000"
				: process.env.VERCEL_URL || "doug-is.vercel.app"
		const apiUrl = `${protocol}//${host}/api/posts`

		console.log(`Debug: Fetching posts from API route: ${apiUrl}`)

		// Create a fetch request with timeout
		const controller = new AbortController()
		const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

		try {
			const response = await fetch(apiUrl, {
				cache: "no-store",
				signal: controller.signal,
				next: { revalidate: 0 },
			})

			clearTimeout(timeoutId)

			if (!response.ok) {
				const errorText = await response.text()
				console.error(
					`Debug: Error fetching posts: ${response.status} ${errorText}`
				)
				return {
					posts: [],
					error: `API error: ${response.status}`,
					raw: { status: response.status, text: errorText },
				}
			}

			const data = await response.json()
			console.log(`Debug: API returned ${data.posts?.length || 0} posts`)
			return { posts: data.posts || [], error: null, raw: data }
		} catch (err: unknown) {
			clearTimeout(timeoutId)
			if (err instanceof Error && err.name === "AbortError") {
				console.error("Debug: Fetch request timed out")
				return {
					posts: [],
					error: "Request timed out. Please try again later.",
					raw: { error: "timeout" },
				}
			}
			throw err // Re-throw other errors to be caught by the outer try/catch
		}
	} catch (err) {
		console.error("Debug: Exception fetching posts:", err)
		return {
			posts: [],
			error:
				err instanceof Error ? err.message : "Unknown error fetching posts",
			raw: { error: err },
		}
	}
}

export default async function DebugPage() {
	// Get posts from API route
	const { posts, error, raw } = await fetchPosts()

	// Get environment variables for debugging
	const envVars = {
		NODE_ENV: process.env.NODE_ENV || "not set",
		VERCEL_URL: process.env.VERCEL_URL || "not set",
		VERCEL_ENV: process.env.VERCEL_ENV || "not set",
		// Don't include the actual values of sensitive env vars
		HAS_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
		HAS_SUPABASE_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		SUPABASE_URL_LENGTH: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
		SUPABASE_KEY_LENGTH: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
	}

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="text-4xl font-bold mb-4">Debug Page</h1>
				<p className="text-xl mb-4">
					This page displays raw data from Supabase for troubleshooting.
				</p>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4">Environment</h2>
				<div className="bg-gray-100 p-4 rounded-lg mb-4">
					<pre className="whitespace-pre-wrap">
						{JSON.stringify(envVars, null, 2)}
					</pre>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4">API Response</h2>
				<div className="bg-gray-100 p-4 rounded-lg mb-4">
					<pre className="whitespace-pre-wrap">
						{JSON.stringify(raw, null, 2)}
					</pre>
				</div>
			</div>

			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4">Posts Data</h2>
				<div className="bg-gray-100 p-4 rounded-lg">
					<p className="mb-2">Post Count: {posts.length}</p>
					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
							<p className="font-bold">Error:</p>
							<p>{error}</p>
						</div>
					)}
				</div>
			</div>

			<div className="space-y-8">
				<h2 className="text-2xl font-bold mb-4">Raw Posts Data</h2>
				{posts.length === 0 ? (
					<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
						<p>No posts found.</p>
					</div>
				) : (
					posts.map((post) => (
						<div key={post.id} className="border p-4 rounded-lg">
							<h3 className="text-xl font-bold mb-2">{post.title}</h3>
							<p className="mb-2">
								<strong>ID:</strong> {post.id}
							</p>
							<p className="mb-2">
								<strong>Slug:</strong> {post.slug}
							</p>
							<p className="mb-2">
								<strong>Category:</strong> {post.category}
							</p>
							<p className="mb-2">
								<strong>Published:</strong> {post.published_at || "N/A"}
							</p>
							<p className="mb-2">
								<strong>Excerpt:</strong> {post.excerpt}
							</p>
							{post.featured_image && (
								<p className="mb-2">
									<strong>Image:</strong> {post.featured_image}
								</p>
							)}
							<details>
								<summary className="cursor-pointer text-blue-600">
									View Content
								</summary>
								<pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto max-h-40">
									{post.content}
								</pre>
							</details>
						</div>
					))
				)}
			</div>
		</div>
	)
}
