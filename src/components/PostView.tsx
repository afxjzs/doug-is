"use client"

import Image from "next/image"
import Link from "next/link"
import { Post } from "@/lib/supabase/publicClient"

/**
 * Component to display an individual blog post
 */
export default function PostView({ post }: { post: Post }) {
	// Simple function to convert newlines to <br> tags
	const formatContent = (content: string) => {
		return content
			.split("\n\n")
			.map((paragraph) => `<p>${paragraph.replace(/\n/g, "<br>")}</p>`)
			.join("")
	}

	const content = formatContent(post.content)

	return (
		<article className="max-w-3xl mx-auto">
			{/* Header */}
			<div className="mb-8 text-center">
				<Link
					href="/thinking"
					className="inline-flex items-center text-[rgba(var(--color-foreground),0.6)] hover:text-[rgba(var(--color-foreground),1)] mb-6 transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Back to Thinking
				</Link>

				<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 gradient-heading">
					{post.title}
				</h1>

				<div className="flex items-center justify-center space-x-4 text-[rgba(var(--color-foreground),0.6)] text-sm">
					<span>
						{new Date(post.published_at || "").toLocaleDateString("en-US", {
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
					<span>•</span>
					<Link
						href={`/thinking/about/${post.category.toLowerCase()}`}
						className="uppercase tracking-wider hover:text-[rgba(var(--color-foreground),1)] transition-colors"
					>
						{post.category}
					</Link>
				</div>
			</div>

			{/* Featured Image */}
			{post.featured_image && (
				<div className="relative h-64 md:h-96 mb-8 rounded-xl overflow-hidden">
					<Image
						src={post.featured_image}
						alt={post.title}
						fill
						className="object-cover"
						priority
					/>
				</div>
			)}

			{/* Content */}
			<div className="prose prose-invert prose-lg max-w-none prose-headings:gradient-text-violet prose-a:text-[rgba(var(--color-cyan),0.9)] prose-a:no-underline hover:prose-a:text-[rgba(var(--color-cyan),1)] prose-a:transition-colors prose-img:rounded-xl">
				<div dangerouslySetInnerHTML={{ __html: content }} />
			</div>

			{/* Footer */}
			<div className="mt-12 pt-8 border-t border-[rgba(var(--color-foreground),0.1)]">
				<Link
					href="/thinking"
					className="inline-flex items-center text-[rgba(var(--color-foreground),0.6)] hover:text-[rgba(var(--color-foreground),1)] transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-4 w-4 mr-2"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 19l-7-7 7-7"
						/>
					</svg>
					Back to Thinking
				</Link>
			</div>
		</article>
	)
}
