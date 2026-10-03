/**
 * Individual blog post page
 */

import { Metadata } from "next"
import { notFound } from "next/navigation"
import {
	getPostBySlugAndCategory,
	getPostBySlugAndCategoryStatic,
	getPostsStatic,
} from "@/lib/supabase/data"
import { PostView } from "@/components/PostView"
import { postMetadata } from "@/lib/writing-metadata"

// Revalidate on-demand when posts are updated via admin
// (API routes call revalidateTag("posts") and revalidatePath on save)

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string; "primary-category": string }>
}): Promise<Metadata> {
	const paramsData = await params
	const post = await getPostBySlugAndCategoryStatic(
		paramsData.slug,
		paramsData["primary-category"]
	)

	if (!post) {
		return { title: "Post Not Found", description: "The requested blog post could not be found." }
	}

	// Legacy URL: the canonical points at /writing/about/<category>/<slug>.
	return postMetadata(post)
}

// Generate static paths for all posts
export async function generateStaticParams() {
	try {
		const posts = await getPostsStatic()

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
	params: Promise<{ slug: string; "primary-category": string }>
}) {
	const { slug, "primary-category": primaryCategory } = await params
	try {
		const post = await getPostBySlugAndCategory(slug, primaryCategory)

		if (!post) {
			notFound()
		}

		// Verify the category in the URL matches the post's category
		// This prevents duplicate content issues with SEO
		if (
			primaryCategory !== post.category.toLowerCase() &&
			process.env.NODE_ENV === "production"
		) {
			console.warn(
				`Category mismatch: URL has ${primaryCategory} but post category is ${post.category.toLowerCase()}`
			)
			notFound()
		}

		return <PostView post={post} />
	} catch (error) {
		console.error("Error fetching blog post:", error)
		notFound()
	}
}
