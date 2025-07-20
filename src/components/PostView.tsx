"use client"

import { FC, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Post } from "@/lib/supabase/publicClient"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { useEventTracking } from "@/lib/analytics"

interface PostViewProps {
	post: Post
	isDraft?: boolean
}

/**
 * Component to display an individual blog post
 * Supports both public viewing and admin draft preview
 */
export const PostView: FC<PostViewProps> = ({ post, isDraft = false }) => {
	const { trackBlogPostView, trackBlogExternalLinkClick } = useEventTracking()

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
		<div className="max-w-3xl mx-auto p-6">
			{/* Draft Banner - Only shown in admin preview */}
			{isDraft && (
				<div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-600/50 rounded-lg">
					<div className="flex items-center gap-2">
						<div className="h-2 w-2 rounded-full bg-yellow-500" />
						<span className="text-yellow-400 font-medium">DRAFT PREVIEW</span>
					</div>
					<p className="text-yellow-300/80 text-sm mt-1">
						This is an unpublished draft. Only administrators can view this
						content.
					</p>
				</div>
			)}

			<header className="mb-8">
				<h1 className="text-4xl font-bold mb-4">{post.title}</h1>
				<div className="flex items-center text-gray-500 mb-4">
					<time dateTime={post.published_at || post.created_at || ""}>
						{formattedDate}
					</time>
					<span className="mx-2">•</span>
					<Link
						href={`/thinking/about/${post.category.toLowerCase()}`}
						className="capitalize text-blue-500 hover:text-blue-600 transition-colors"
					>
						{post.category}
					</Link>
				</div>
				{post.featured_image && (
					<div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
						<Image
							src={post.featured_image}
							alt={post.title}
							fill
							className="object-cover"
							priority
						/>
					</div>
				)}
			</header>

			<article className="prose dark:prose-invert lg:prose-lg max-w-none mb-12 prose-headings:text-gray-800 dark:prose-headings:text-gray-100 prose-headings:font-bold prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-pre:bg-gray-800 dark:prose-pre:bg-gray-900 prose-pre:text-gray-200 prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-700 prose-blockquote:pl-4 prose-blockquote:italic prose-p:my-6">
				<div className="[&>p]:mb-8">
					<ReactMarkdown
						remarkPlugins={[remarkGfm]}
						components={{
							a: LinkRenderer,
						}}
					>
						{post.content || ""}
					</ReactMarkdown>
				</div>
			</article>

			<footer className="pt-6 border-t border-gray-200 dark:border-gray-700">
				<Link
					href="/thinking"
					className="text-blue-500 hover:text-blue-600 transition-colors"
				>
					← Back to Thinking
				</Link>
			</footer>
		</div>
	)
}
