/**
 * Individual blog post page
 */

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlug, getPosts } from "@/lib/supabase/publicClient"
import { PostView } from "@/components/PostView"
import {
	getCanonicalUrl,
	getSocialImageUrl,
	getSiteName,
} from "@/lib/utils/domain-detection"
import { generateBlogPostStructuredData } from "@/lib/utils/structured-data"
import Script from "next/script"

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
				title: "Post Not Found | doug.is",
				description: "The requested blog post could not be found.",
			}
		}

		// Create canonical URL with dynamic domain
		const canonicalUrl = getCanonicalUrl(
			`/thinking/about/${post.category.toLowerCase()}/${post.slug}`
		)

		// Create social sharing image URL with dynamic domain
		const socialImageUrl = post.featured_image
			? getSocialImageUrl(post.featured_image)
			: getSocialImageUrl("/images/doug-2024-cropped.png")

		// Format category for display
		const categoryDisplay =
			post.category.charAt(0).toUpperCase() + post.category.slice(1)

		return {
			title: `${post.title} | ${getSiteName()}`,
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
				siteName: getSiteName(),
				locale: "en_US",
			},
			twitter: {
				card: "summary_large_image",
				title: post.title,
				description: post.excerpt,
				images: [socialImageUrl],
				creator: "@glowingrec",
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
			title: `Blog Post | ${getSiteName()}`,
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

		const structuredData = generateBlogPostStructuredData(post)

		return (
			<>
				<Script
					id="blog-post-structured-data"
					type="application/ld+json"
					dangerouslySetInnerHTML={{
						__html: JSON.stringify(structuredData),
					}}
				/>
				<PostView post={post} />
			</>
		)
	} catch (error) {
		console.error("Error fetching blog post:", error)
		notFound()
	}
}
