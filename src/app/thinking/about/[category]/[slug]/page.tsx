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

		return {
			title: `${post.title} | Doug.is`,
			description: post.excerpt,
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
