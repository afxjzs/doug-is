import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { getPublishedPosts } from "@/lib/supabase/data"
import Image from "next/image"
import StatusMessage from "@/components/StatusMessage"

export { metadata } from "./metadata"

export default async function ThinkingPage() {
	const posts = await getPublishedPosts()

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

			{posts.length === 0 ? (
				<StatusMessage
					type="info"
					message="No posts found. Check back later for new content."
				/>
			) : (
				<div className="space-y-8">
					{posts.map((post) => (
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
											&bull;
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
										<div className="text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-accent-secondary))] transition-colors inline-flex items-center">
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
