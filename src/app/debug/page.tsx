import { Metadata } from "next"
import { getPosts, Post } from "@/lib/supabase/client"

export const metadata: Metadata = {
	title: "Debug | Doug.is",
	description: "Debug page for troubleshooting",
}

export default async function DebugPage() {
	// Get posts from Supabase with error handling
	let posts: Post[] = []
	let error: Error | null = null

	try {
		console.log("Debug page: Fetching posts...")
		posts = await getPosts()
		console.log(`Debug page: Fetched ${posts.length} posts`)
	} catch (err) {
		console.error("Debug page: Error fetching posts:", err)
		error = err instanceof Error ? err : new Error(String(err))
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
				<h2 className="text-2xl font-bold mb-4">Posts Data</h2>
				<div className="bg-gray-100 p-4 rounded-lg">
					<p className="mb-2">Post Count: {posts.length}</p>
					{error && (
						<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
							<p className="font-bold">Error:</p>
							<p>{error.message}</p>
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
