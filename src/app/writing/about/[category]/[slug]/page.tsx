/**
 * Individual Blog Post Page for /writing/about/[category]/[slug]
 *
 * Displays individual blog posts from the "about" section
 */

import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPostBySlugAndCategory } from "@/lib/supabase/data"
import { PostView } from "@/components/PostView"
import { postMetadata } from "@/lib/writing-metadata"

// Revalidate on-demand when posts are updated via admin
// (API routes call revalidateTag("posts") and revalidatePath on save)

interface PageProps {
	params: Promise<{ slug: string; category: string }>
}

/**
 * Generate metadata for the blog post
 */
export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug, category } = await params
	const post = await getPostBySlugAndCategory(slug, category)

	if (!post) {
		return { title: "Post Not Found", description: "The requested blog post could not be found." }
	}

	return postMetadata(post)
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
