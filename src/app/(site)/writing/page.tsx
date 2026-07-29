import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { getPublishedPosts } from "@/lib/supabase/data"
import Image from "next/image"
import StatusMessage from "@/components/StatusMessage"

export { metadata } from "./metadata"

export default async function WritingPage() {
	const posts = await getPublishedPosts()

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="text-4xl font-bold display-heading mb-4">
					doug.is/writing
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					Writing about startups, code, investing, and whatever else is on my mind.
				</p>
			</div>

			{posts.length === 0 ? (
				<StatusMessage
					type="info"
					message="No posts found. Check back later for new content."
				/>
			) : (
				<div className="space-y-8">
					{posts.map((post, i) => (
						<article
							key={post.id}
							className="flex flex-col overflow-hidden rounded-xl shadow-lg hover:shadow-xl bg-[rgba(var(--color-background-alt),0.5)] border border-[rgba(var(--color-foreground),0.1)]"
							style={{
								transition:
									"box-shadow var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out)",
							}}
						>
							<div className="group">
								{post.featured_image ? (
									<Link
										href={`/writing/about/${post.category.toLowerCase()}/${
											post.slug
										}`}
										className="block relative w-full h-64 overflow-hidden"
									>
										<Image
											src={post.featured_image}
											alt={post.title}
											fill
											priority={i === 0}
											sizes="(max-width: 768px) 100vw, 800px"
											className="object-cover group-hover:scale-[1.04]"
											style={{ transition: "transform var(--dur-slow) var(--ease-out)" }}
											unoptimized={post.featured_image.includes("supabase")}
										/>
									</Link>
								) : (
									<div className="relative h-64 w-full bg-[rgba(var(--color-accent),0.08)]"></div>
								)}
								<div className="p-6">
									<div className="flex items-center mb-3">
										<Link
											href={`/writing/about/${post.category.toLowerCase()}`}
											className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[rgba(var(--color-accent),0.75)] hover:text-[rgb(var(--color-accent))]"
											style={{ transition: "color var(--dur-base) var(--ease-out)" }}
										>
											{post.category}
										</Link>
										<span className="mx-2 text-[rgba(var(--color-foreground),0.3)]">
											&bull;
										</span>
										<time className="text-sm text-[rgba(var(--color-foreground),0.65)]">
											{post.published_at ? formatDate(post.published_at) : ""}
										</time>
									</div>
									<Link
										href={`/writing/about/${post.category.toLowerCase()}/${
											post.slug
										}`}
										className="block"
									>
										<h2
											className="text-2xl font-bold text-[rgba(var(--color-foreground),0.9)] mb-3 group-hover:text-[rgb(var(--color-accent))]"
											style={{ transition: "color var(--dur-slow) var(--ease-out)" }}
										>
											{post.title}
										</h2>
										<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
											{post.excerpt}
										</p>
										<div
											className="text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-accent-secondary))] inline-flex items-center"
											style={{ transition: "color var(--dur-base) var(--ease-out)" }}
										>
											Read more
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 ml-1 group-hover:translate-x-1"
												style={{ transition: "transform var(--dur-slow) var(--ease-out)" }}
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
