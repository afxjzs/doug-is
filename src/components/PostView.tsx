"use client"

import { FC, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Post } from "@/lib/supabase/data"
import { MarkdownContent } from "@/components/MarkdownContent"
import { useClientEventTracking } from "@/lib/analytics"

interface PostViewProps {
	post: Post
	isDraft?: boolean
}

/**
 * Component to display an individual blog post
 * Supports both public viewing and admin draft preview
 */
export const PostView: FC<PostViewProps> = ({ post, isDraft = false }) => {
	const { trackBlogPostView, trackBlogExternalLinkClick } =
		useClientEventTracking()

	const formattedDate = new Date(
		post.published_at || post.created_at || ""
	).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	})

	// Track blog post view on component mount
	useEffect(() => {
		if (post) {
			trackBlogPostView(post.slug, post.title, post.category)
		}
	}, [post, trackBlogPostView])

	// Custom link renderer for ReactMarkdown to track external link clicks
	const LinkRenderer = ({
		href,
		children,
		...props
	}: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
		children?: React.ReactNode
	}) => {
		const isExternal =
			href && (href.startsWith("http") || href.startsWith("https"))

		const handleExternalLinkClick = () => {
			if (isExternal && href) {
				trackBlogExternalLinkClick(href, post.slug)
			}
		}

		if (isExternal) {
			return (
				<a
					href={href}
					onClick={handleExternalLinkClick}
					target="_blank"
					rel="noopener noreferrer"
					{...props}
				>
					{children}
				</a>
			)
		}

		// Internal links or relative links
		return (
			<a href={href} {...props}>
				{children}
			</a>
		)
	}

	return (
		<div className="max-w-3xl mx-auto">
			{/* Draft Banner - Only shown in admin preview */}
			{isDraft && (
				<div className="mb-6 p-4 bg-[rgba(var(--color-accent),0.1)] border border-[rgba(var(--color-accent),0.4)] rounded-lg">
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 rounded-full bg-[rgb(var(--color-accent))]" />
						<span className="text-[rgb(var(--color-accent))] font-medium">DRAFT PREVIEW</span>
					</div>
					<p className="text-[rgba(var(--color-accent),0.7)] text-sm mt-1">
						This is an unpublished draft. Only administrators can view this
						content.
					</p>
				</div>
			)}

			<header className="mb-8">
				<h1 className="text-4xl font-bold mb-4">{post.title}</h1>
				<div className="flex items-center text-[rgba(var(--color-foreground),0.45)] mb-4">
					<time dateTime={post.published_at || post.created_at || ""}>
						{formattedDate}
					</time>
					<span className="mx-2">•</span>
					<Link
						href={`/writing/about/${post.category.toLowerCase()}`}
						className="capitalize text-[rgb(var(--color-accent))] hover:text-[rgba(var(--color-accent),0.7)] transition-colors"
					>
						{post.category}
					</Link>
				</div>
				{post.featured_image && (
					<div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
						<Image
							src={post.featured_image}
							alt={post.title}
							fill={true}
							className="object-cover"
							priority={true}
						/>
					</div>
				)}
			</header>

			<MarkdownContent
				content={post.content || ""}
				components={{ a: LinkRenderer }}
				className="mb-12"
			/>

			<footer className="pt-6 border-t border-[rgba(var(--color-border),0.08)]">
				<Link
					href="/writing"
					className="text-[rgb(var(--color-accent))] hover:text-[rgba(var(--color-accent),0.7)] transition-colors"
				>
					← Back to Writing
				</Link>
			</footer>
		</div>
	)
}
