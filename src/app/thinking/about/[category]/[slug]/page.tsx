/**
 * Individual Blog Post Page for /thinking/about/[category]/[slug]
 *
 * Displays individual blog posts from the "about" section
 */

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlugAndCategory } from "@/lib/supabase/data"
import { PostView } from "@/components/PostView"
import {
	getCanonicalUrl,
	getSocialImageUrl,
	getSiteName,
} from "@/lib/utils/domain-detection"

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic"

interface PageProps {
	params: Promise<{ slug: string; category: string }>
}

/**
 * Generate metadata for the blog post
 */
export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	try {
		const { slug, category } = await params
		const post = await getPostBySlugAndCategory(slug, category)

		if (!post) {
			return {
				title: `Post Not Found | ${getSiteName()}`,
				description: "The requested blog post could not be found.",
			}
		}

		const canonicalUrl = getCanonicalUrl(`/thinking/about/${category}/${slug}`)
		const socialImageUrl = getSocialImageUrl(post.title)

		return {
			title: `${post.title} | ${getSiteName()}`,
			description: post.excerpt || post.content?.substring(0, 160) || "",
			keywords: undefined,
			authors: [{ name: "Douglas Rogers" }],
			openGraph: {
				title: post.title,
				description: post.excerpt || post.content?.substring(0, 160) || "",
				url: canonicalUrl,
				siteName: getSiteName(),
				images: [socialImageUrl],
				type: "article",
				publishedTime: post.published_at,
				modifiedTime: post.updated_at || post.published_at,
				authors: ["Douglas Rogers"],
				section: category,
				tags: undefined,
			},
			twitter: {
				card: "summary_large_image",
				title: post.title,
				description: post.excerpt || post.content?.substring(0, 160) || "",
				images: [socialImageUrl],
				creator: "@glowingrec",
			},
			other: {
				"article:published_time": post.published_at,
				"article:modified_time": post.updated_at || post.published_at,
				"article:author": "Douglas Rogers",
				"article:section": category,
				"article:tag": post.category,
			},
			alternates: {
				canonical: canonicalUrl,
			},
		}
	} catch (error) {
		console.error("Error generating metadata for blog post:", error)
		return {
			title: `Blog Post | ${getSiteName()}`,
			description: "A blog post by Douglas Rogers",
		}
	}
}

/**
 * Individual Blog Post Page Component
 */
export default async function BlogPostPage({ params }: PageProps) {
	const { slug, category } = await params

	try {
		const post = await getPostBySlugAndCategory(slug, category)

		if (!post) {
			console.log(`Post not found: ${slug} in category ${category}`)
			notFound()
		}

		// Verify the category in the URL matches the post's category (case-insensitive)
		if (
			category.toLowerCase() !== post.category.toLowerCase() &&
			process.env.NODE_ENV === "production"
		) {
			console.warn(
				`Category mismatch: URL has ${category} but post category is ${post.category}`
			)
			notFound()
		}

		console.log(`Found post: ${post.title}`)

		return <PostView post={post} />
	} catch (error) {
		console.error("Error loading blog post:", error)
		notFound()
	}
}
