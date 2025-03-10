import Link from "next/link"
import { Metadata } from "next"
import { formatDate } from "@/lib/utils"
import SafeImage from "@/components/SafeImage"
import { Post } from "@/lib/supabase/client"

export const metadata: Metadata = {
	title: "Thinking | Doug.is",
	description: "Thoughts, ideas, and insights on various topics",
}

async function fetchPosts(): Promise<{ posts: Post[]; error: string | null }> {
	try {
		// Use relative URL in production, absolute URL in development for better error messages
		const baseUrl = process.env.VERCEL_URL
			? `https://${process.env.VERCEL_URL}`
			: process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: ""

		console.log(`Fetching posts from API route: ${baseUrl}/api/posts`)
		const response = await fetch(`${baseUrl}/api/posts`, {
			cache: "no-store",
			next: { revalidate: 60 }, // Revalidate every minute
		})

		if (!response.ok) {
			const errorText = await response.text()
			console.error(`Error fetching posts: ${response.status} ${errorText}`)
			return { posts: [], error: `API error: ${response.status}` }
		}

		const data = await response.json()
		console.log(`API returned ${data.posts?.length || 0} posts`)
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

export default async function ThinkingPage() {
	// Get posts from API route
	const { posts, error } = await fetchPosts()

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

			{error && (
				<div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
					<p className="text-red-700">
						There was an error loading posts. Please try again later.
					</p>
					{process.env.NODE_ENV === "development" && (
						<p className="text-red-500 text-sm mt-2">{error}</p>
					)}
				</div>
			)}

			{sortedPosts.length === 0 && !error ? (
				<div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
					<p>No posts found. Check back later for new content.</p>
				</div>
			) : (
				<div className="space-y-12">
					{sortedPosts.map((post) => (
						<article
							key={post.id}
							className="border-b border-[rgba(var(--color-foreground),0.1)] pb-12 last:border-0"
						>
							<Link href={`/thinking/${post.category}/${post.slug}`}>
								<div className="group">
									{post.featured_image && (
										<div className="relative h-64 w-full mb-6 overflow-hidden rounded-lg">
											<SafeImage
												src={post.featured_image}
												alt={post.title}
												fill
												className="object-cover group-hover:scale-105 transition-transform duration-300"
											/>
										</div>
									)}
									<div>
										<p className="text-sm text-[rgba(var(--color-foreground),0.6)] mb-2">
											{post.published_at ? formatDate(post.published_at) : ""} •{" "}
											<Link
												href={`/thinking/${post.category}`}
												className="hover:text-[rgba(var(--color-foreground),0.9)] transition-colors"
											>
												{post.category}
											</Link>
										</p>
										<h2 className="text-2xl font-bold text-[rgba(var(--color-foreground),0.9)] mb-3 group-hover:text-[rgb(var(--color-violet))] transition-colors">
											{post.title}
										</h2>
										<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
											{post.excerpt}
										</p>
										<span className="neon-link">
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
										</span>
									</div>
								</div>
							</Link>
						</article>
					))}
				</div>
			)}
		</div>
	)
}
