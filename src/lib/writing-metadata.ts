import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"

/**
 * Metadata for /writing posts and categories. Both the canonical URLs
 * (/writing/about/...) and the legacy ones (/writing/<category>/...) use
 * these, so a legacy URL always points search engines at the canonical one.
 */

interface PostForMetadata {
	title: string
	slug: string
	category: string
	excerpt?: string | null
	content?: string | null
	featured_image?: string | null
	published_at?: string | null
	updated_at?: string | null
}

export function formatCategory(category: string): string {
	return category
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

export function postMetadata(post: PostForMetadata): Metadata {
	const category = post.category.toLowerCase()
	return pageMetadata({
		trail: ["writing", post.title],
		description: post.excerpt || post.content?.substring(0, 160) || "",
		path: `/writing/about/${category}/${post.slug}`,
		// No featured image: pageMetadata's site default.
		image: post.featured_image
			? { url: post.featured_image, width: 1200, height: 630, alt: post.title }
			: undefined,
		article: {
			publishedTime: post.published_at,
			modifiedTime: post.updated_at,
			section: formatCategory(category),
			tags: [category],
		},
	})
}

export function categoryMetadata(category: string): Metadata {
	const slug = category.toLowerCase()
	const name = formatCategory(slug)
	return pageMetadata({
		trail: ["writing", name],
		description: `Thoughts, ideas, and insights on ${name.toLowerCase()}.`,
		path: `/writing/about/${slug}`,
	})
}
