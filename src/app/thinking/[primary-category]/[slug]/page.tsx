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
		const post = await getPostBySlug(params.slug)

		if (!post) {
			return {
				title: "Post Not Found | Doug.is",
				description: "The requested blog post could not be found.",
				openGraph: {
					title: "Post Not Found | Doug.is",
					description: "The requested blog post could not be found.",
					url: `https://doug.is/thinking/${params.slug}`,
					siteName: "Doug.is",
					type: "article",
				},
				twitter: {
					card: "summary_large_image",
					title: "Post Not Found | Doug.is",
					description: "The requested blog post could not be found.",
					creator: "@afxjzs",
				},
			}
		}

		const postUrl = `https://doug.is/thinking/${post.category.toLowerCase()}/${
			post.slug
		}`
		const socialImage = post.featured_image

		return {
			title: `${post.title} | Doug.is`,
			description:
				post.excerpt || `A blog post about ${post.title} by Douglas Rogers`,
			openGraph: {
				title: post.title,
				description:
					post.excerpt || `A blog post about ${post.title} by Douglas Rogers`,
				url: postUrl,
				siteName: "Doug.is",
				type: "article",
				publishedTime: post.published_at,
				authors: ["Douglas Rogers"],
				section: post.category,
				...(socialImage && {
					images: [
						{
							url: socialImage,
							width: 1200,
							height: 630,
							alt: post.title,
						},
					],
				}),
			},
			twitter: {
				card: "summary_large_image",
				title: post.title,
				description:
					post.excerpt || `A blog post about ${post.title} by Douglas Rogers`,
				...(socialImage && { images: [socialImage] }),
				creator: "@afxjzs",
			},
			alternates: {
				canonical: postUrl,
			},
		}
	} catch (error) {
		console.error("Error generating metadata for post:", error)
		return {
			title: "Post Not Found | Doug.is",
			description: "The requested blog post could not be found.",
			openGraph: {
				title: "Post Not Found | Doug.is",
				description: "The requested blog post could not be found.",
				url: `https://doug.is/thinking/${params.slug}`,
				siteName: "Doug.is",
				type: "article",
			},
			twitter: {
				card: "summary_large_image",
				title: "Post Not Found | Doug.is",
				description: "The requested blog post could not be found.",
				creator: "@afxjzs",
			},
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
			"primary-category": post.category.toLowerCase(),
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
	params: { slug: string; "primary-category": string }
}) {
	try {
		const post = await getPostBySlug(params.slug)

		if (!post) {
			notFound()
		}

		// Verify the category in the URL matches the post's category
		// This prevents duplicate content issues with SEO
		if (
			params["primary-category"] !== post.category.toLowerCase() &&
			process.env.NODE_ENV === "production"
		) {
			console.warn(
				`Category mismatch: URL has ${
					params["primary-category"]
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
