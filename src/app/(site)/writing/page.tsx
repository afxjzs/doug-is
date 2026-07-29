import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { getPublishedPosts } from "@/lib/supabase/data"
import Image from "next/image"

export { metadata } from "./metadata"

export default async function WritingPage() {
	const posts = await getPublishedPosts()

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<div className="font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-accent),0.75)] mb-2">
					doug.is/writing
				</div>
				<h1 className="text-4xl font-bold display-heading mb-4">Writing</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					Writing about startups, code, investing, and whatever else is on my
					mind.
				</p>
			</div>

			{posts.length === 0 ? (
				<div className="py-12">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						No posts right now. Check back soon.
					</p>
					<Link
						href="/"
						className="font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-accent),0.75)] hover:text-[rgb(var(--color-accent))] transition-colors"
					>
						&larr; Back to doug.is
					</Link>
				</div>
			) : (
				<div className="space-y-8">
					{posts.map((post, i) => (
						<Link
							key={post.id}
							href={`/writing/about/${post.category.toLowerCase()}/${
								post.slug
							}`}
							className="group block overflow-hidden rounded-lg bg-[rgb(var(--color-background-alt))] border border-[rgba(var(--color-border),0.06)] hover:border-[rgba(var(--color-border),0.2)] hover:-translate-y-1"
							style={{
								transition:
									"border-color var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out)",
							}}
						>
							{post.featured_image && (
								<div className="relative w-full h-64 overflow-hidden">
									<Image
										src={post.featured_image}
										alt=""
										fill
										priority={i === 0}
										sizes="(max-width: 768px) 100vw, 800px"
										className="object-cover group-hover:scale-[1.04]"
										style={{
											transition: "transform var(--dur-slow) var(--ease-out)",
										}}
										unoptimized={post.featured_image.includes("supabase")}
									/>
								</div>
							)}
							<div className="p-8">
								<div className="flex items-baseline gap-3 mb-3">
									<span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.15em] text-[rgba(var(--color-accent),0.75)]">
										{post.category}
									</span>
									<time className="font-[family-name:var(--font-mono)] text-xs text-[rgba(var(--color-foreground),0.65)]">
										{post.published_at ? formatDate(post.published_at) : ""}
									</time>
								</div>
								<h2
									className="font-[family-name:var(--font-display)] text-2xl font-bold leading-snug group-hover:text-[rgb(var(--color-accent))]"
									style={{
										transition: "color var(--dur-base) var(--ease-out)",
									}}
								>
									{post.title}
								</h2>
								<p className="text-[rgba(var(--color-foreground),0.7)] leading-relaxed mt-3">
									{post.excerpt}
								</p>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
