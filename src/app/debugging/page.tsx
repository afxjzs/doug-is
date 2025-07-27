"use client"

import { useState, useEffect } from "react"
import { Post } from "@/lib/supabase/data"
import StatusMessage from "@/components/StatusMessage"

async function fetchPosts(): Promise<{
	posts: Post[]
	error: string | null
	raw: any
}> {
	try {
		// Simple direct API call
		const response = await fetch("/api/posts", {
			cache: "no-store",
		})

		if (!response.ok) {
			console.error(`Debug: Error fetching posts: ${response.status}`)
			return {
				posts: [],
				error: `API error: ${response.status}`,
				raw: { status: response.status },
			}
		}

		const data = await response.json()
		return { posts: data.posts || [], error: null, raw: data }
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

export default function DebugPage() {
	const [result, setResult] = useState<{
		posts: Post[]
		error: string | null
		raw: any
	}>({ posts: [], error: null, raw: null })
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function loadData() {
			const data = await fetchPosts()
			setResult(data)
			setLoading(false)
		}

		loadData()
	}, [])

	return (
		<div className="max-w-4xl mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">Debug Page</h1>

			{loading ? (
				<StatusMessage type="loading" message="Loading data..." />
			) : (
				<>
					<div className="mb-8">
						<h2 className="text-xl font-semibold mb-2">Status:</h2>
						{result.error ? (
							<StatusMessage type="error" message={`Error: ${result.error}`} />
						) : (
							<StatusMessage
								type="success"
								message={`Success! Found ${result.posts.length} posts.`}
							/>
						)}
					</div>

					<div className="mb-8">
						<h2 className="text-xl font-semibold mb-2">Posts:</h2>
						{result.posts.length === 0 ? (
							<StatusMessage type="info" message="No posts found." />
						) : (
							<div className="space-y-4">
								{result.posts.map((post) => (
									<div
										key={post.id}
										className="border border-gray-200 rounded-lg p-4"
									>
										<h3 className="font-medium text-lg">{post.title}</h3>
										<p className="text-sm text-gray-500 mb-2">
											{post.category} • {post.published_at}
										</p>
										<p className="mb-2">{post.excerpt}</p>
										<div className="text-sm text-gray-500">
											Featured Image: {post.featured_image}
										</div>
									</div>
								))}
							</div>
						)}
					</div>

					<div>
						<h2 className="text-xl font-semibold mb-2">Raw Response:</h2>
						<pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm text-gray-900">
							{JSON.stringify(result.raw, null, 2)}
						</pre>
					</div>
				</>
			)}
		</div>
	)
}
