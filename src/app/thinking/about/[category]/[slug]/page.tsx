/**
 * Individual blog post page
 */

import { Metadata } from "next"
import { getPostBySlug, getPosts } from "@/lib/supabase/publicClient"
import { notFound } from "next/navigation"
import { PostView } from "@/components/PostView"

// Set a reasonable fallback for cache revalidation
export const revalidate = 3600 // 1 hour

// Generate metadata for the post
export async function generateMetadata({
	params,
}: {
	params: { slug: string }
}): Promise<Metadata> {
	try {
		// Await params before accessing properties
		const paramsData = await params
		const post = await getPostBySlug(paramsData.slug)

		if (!post) {
			return {
				title: "Post Not Found | Doug.is",
				description: "The requested blog post could not be found.",
			}
		}

		// Create canonical URL
		const canonicalUrl = `https://doug.is/thinking/about/${post.category.toLowerCase()}/${
			post.slug
		}`

		// Create social sharing image URL - use post featured image if available
		const socialImageUrl = post.featured_image
			? `https://doug.is${post.featured_image}`
			: "https://doug.is/images/doug-2024-cropped.png"

		// Format category for display
		const categoryDisplay =
			post.category.charAt(0).toUpperCase() + post.category.slice(1)

		return {
			title: `${post.title} | Doug.is`,
			description: post.excerpt,
			openGraph: {
				title: post.title,
				description: post.excerpt,
				type: "article",
				url: canonicalUrl,
				images: [
					{
						url: socialImageUrl,
						width: 1200,
						height: 630,
						alt: post.title,
					},
				],
				siteName: "Doug.is",
				locale: "en_US",
			},
			twitter: {
				card: "summary_large_image",
				title: post.title,
				description: post.excerpt,
				images: [socialImageUrl],
				creator: "@douglasrogers",
			},
			other: {
				"article:published_time": post.published_at,
				"article:modified_time": post.updated_at || post.published_at,
				"article:author": "Douglas Rogers",
				"article:section": categoryDisplay,
				"article:tag": post.category,
			},
			alternates: {
				canonical: canonicalUrl,
			},
		}
	} catch (error) {
		console.error("Error generating metadata for post:", error)
		return {
			title: "Blog Post | Doug.is",
			description: "A blog post by Douglas Rogers",
		}
	}
}

// Generate static paths for all posts
export async function generateStaticParams() {
	try {
		const posts = await getPosts()

		// Handle case where posts can't be fetched
		if (!posts || !Array.isArray(posts)) {
			console.warn("Failed to fetch posts for static generation, posts:", posts)
			return []
		}

		return posts.map((post) => ({
			category: post.category.toLowerCase(),
			slug: post.slug,
		}))
	} catch (error) {
		console.error("Error generating static params for posts:", error)
		// Return empty array to allow fallback
		return []
	}
}

export default async function BlogPostPage({
	params,
}: {
	params: { slug: string; category: string }
}) {
	try {
		// Await params before accessing properties
		const paramsData = await params
		const post = await getPostBySlug(paramsData.slug)

		if (!post) {
			notFound()
		}

		// Verify the category in the URL matches the post's category
		// This prevents duplicate content issues with SEO
		if (
			paramsData.category !== post.category.toLowerCase() &&
			process.env.NODE_ENV === "production"
		) {
			console.warn(
				`Category mismatch: URL has ${
					paramsData.category
				} but post category is ${post.category.toLowerCase()}`
			)
			notFound()
		}

		return <PostView post={post} />
	} catch (error) {
		console.error("Error fetching blog post:", error)
		notFound()
	}
}
