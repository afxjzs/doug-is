"use client"

import { useState, useEffect } from "react"
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
				<div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-8">
					<p className="text-blue-700">Loading data...</p>
				</div>
			) : (
				<>
					<div className="mb-8">
						<h2 className="text-xl font-semibold mb-2">Status:</h2>
						{result.error ? (
							<div className="bg-red-50 border-l-4 border-red-500 p-4">
								<p className="text-red-700">Error: {result.error}</p>
							</div>
						) : (
							<div className="bg-green-50 border-l-4 border-green-500 p-4">
								<p className="text-green-700">
									Success! Found {result.posts.length} posts.
								</p>
							</div>
						)}
					</div>

					<div className="mb-8">
						<h2 className="text-xl font-semibold mb-2">Posts:</h2>
						{result.posts.length === 0 ? (
							<p>No posts found.</p>
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
						<pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-96 text-sm">
							{JSON.stringify(result.raw, null, 2)}
						</pre>
					</div>
				</>
			)}
		</div>
	)
}
