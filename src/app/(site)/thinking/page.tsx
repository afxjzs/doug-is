"use client"

import Link from "next/link"
import { formatDate } from "@/lib/utils"
import SafeImage from "@/components/SafeImage"
import { Post } from "@/lib/supabase/data"
import { useState, useEffect } from "react"
import { Metadata } from "next"
import { getPosts } from "@/lib/supabase/data"
import Image from "next/image"
import StatusMessage from "@/components/StatusMessage"

async function fetchPosts(): Promise<{ posts: Post[]; error: string | null }> {
	try {
		// Simple direct API call
		const response = await fetch("/api/posts", {
			cache: "no-store",
		})

		if (!response.ok) {
			console.error(`Error fetching posts: ${response.status}`)
			return { posts: [], error: `API error: ${response.status}` }
		}

		const data = await response.json()
		return { posts: data.posts || [], error: null }
	} catch (err) {
		console.error("Exception fetching posts:", err)
		return {
			posts: [],
			error:
				err instanceof Error ? err.message : "Unknown error fetching posts",
		}
	}
}

export default function ThinkingPage() {
	const [posts, setPosts] = useState<Post[]>([])
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function loadPosts() {
			const result = await fetchPosts()
			setPosts(result.posts)
			setError(result.error)
			setLoading(false)
		}

		loadPosts()
	}, [])

	// Sort all posts by date
	const sortedPosts = [...posts].sort(
		(a, b) =>
			new Date(b.published_at || "").getTime() -
			new Date(a.published_at || "").getTime()
	)

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					doug.is/thinking
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					Thoughts, ideas, and insights on various topics.
				</p>
			</div>

			{loading && <StatusMessage type="loading" message="Loading posts..." />}

			{error && !loading && (
				<StatusMessage
					type="error"
					message="There was an error loading posts. Please try again later."
					details={error}
				/>
			)}

			{sortedPosts.length === 0 && !error && !loading ? (
				<StatusMessage
					type="info"
					message="No posts found. Check back later for new content."
				/>
			) : (
				<div className="space-y-8">
					{sortedPosts.map((post) => (
						<article
							key={post.id}
							className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 bg-[rgba(var(--color-background-alt),0.5)] border border-[rgba(var(--color-foreground),0.1)]"
						>
							<div className="group">
								{post.featured_image ? (
									<Link
										href={`/thinking/about/${post.category.toLowerCase()}/${
											post.slug
										}`}
										className="block relative w-full h-64 overflow-hidden"
									>
										<Image
											src={post.featured_image}
											alt={post.title}
											fill
											priority
											sizes="(max-width: 768px) 100vw, 800px"
											className="object-cover group-hover:scale-105 transition-transform duration-500"
											unoptimized={post.featured_image.includes("supabase")}
										/>
									</Link>
								) : (
									<div className="relative h-64 w-full bg-gradient-to-br from-[rgba(var(--color-violet),0.2)] to-[rgba(var(--color-cyan),0.2)]"></div>
								)}
								<div className="p-6">
									<div className="flex items-center mb-3">
										<Link
											href={`/thinking/about/${post.category.toLowerCase()}`}
											className="text-xs font-medium px-2.5 py-1 rounded-full bg-[rgba(var(--color-violet),0.1)] text-[rgba(var(--color-violet),0.8)] hover:bg-[rgba(var(--color-violet),0.2)] transition-colors"
										>
											{post.category}
										</Link>
										<span className="mx-2 text-[rgba(var(--color-foreground),0.3)]">
											•
										</span>
										<time className="text-sm text-[rgba(var(--color-foreground),0.6)]">
											{post.published_at ? formatDate(post.published_at) : ""}
										</time>
									</div>
									<Link
										href={`/thinking/about/${post.category.toLowerCase()}/${
											post.slug
										}`}
										className="block"
									>
										<h2 className="text-2xl font-bold text-[rgba(var(--color-foreground),0.9)] mb-3 group-hover:text-[rgb(var(--color-violet))] transition-colors">
											{post.title}
										</h2>
										<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
											{post.excerpt}
										</p>
										<div className="neon-link inline-flex items-center">
											Read more
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
									</Link>
								</div>
							</div>
						</article>
					))}
				</div>
			)}
		</div>
	)
}
