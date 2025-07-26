/**
 * Structured Data (JSON-LD) Utilities
 *
 * Generates structured data for SEO and rich snippets
 * Uses domain detection for dynamic URL generation
 */

import { getCanonicalUrl, getSocialImageUrl } from "./domain-detection"

/**
 * Blog post data interface
 */
interface BlogPost {
	id: string
	title: string
	slug: string
	excerpt: string
	content: string
	category: string
	featured_image?: string | null
	published_at: string
	updated_at?: string | null
	author?: string
	tags?: string[]
	reading_time?: number
}

/**
 * Project page data interface
 */
interface ProjectPage {
	title: string
	description: string
	url: string
	image: string
	technologies?: string[]
	github_url?: string
	live_url?: string
	created_at: string
	updated_at?: string | null
}

/**
 * Generate Article structured data for blog posts
 *
 * @param post - Blog post data
 * @returns JSON-LD structured data object
 */
export function generateBlogPostStructuredData(post: BlogPost) {
	const canonicalUrl = getCanonicalUrl(
		`/thinking/about/${post.category.toLowerCase()}/${post.slug}`
	)
	const imageUrl = post.featured_image
		? getSocialImageUrl(post.featured_image)
		: getSocialImageUrl("/images/doug-2024-cropped.png")
	const modifiedDate = post.updated_at || post.published_at

	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: post.title,
		description: post.excerpt,
		image: imageUrl,
		author: {
			"@type": "Person",
			name: post.author || "Douglas Rogers",
		},
		publisher: {
			"@type": "Organization",
			name: "Doug.is",
			url: "https://doug.is",
		},
		datePublished: post.published_at,
		dateModified: modifiedDate,
		mainEntityOfPage: canonicalUrl,
		articleSection:
			post.category.charAt(0).toUpperCase() + post.category.slice(1),
		...(post.tags &&
			post.tags.length > 0 && {
				keywords: post.tags.join(", "),
			}),
		...(post.reading_time && {
			wordCount: post.reading_time * 200, // Rough estimate
		}),
	}
}

/**
 * Generate SoftwareApplication structured data for project pages
 *
 * @param project - Project page data
 * @returns JSON-LD structured data object
 */
export function generateProjectPageStructuredData(project: ProjectPage) {
	const canonicalUrl = getCanonicalUrl(project.url)
	const imageUrl = getSocialImageUrl(project.image)
	const modifiedDate = project.updated_at || project.created_at

	const structuredData: any = {
		"@context": "https://schema.org",
		"@type": "SoftwareApplication",
		name: project.title,
		description: project.description,
		url: canonicalUrl,
		image: imageUrl,
		author: {
			"@type": "Person",
			name: "Douglas Rogers",
		},
		dateCreated: project.created_at,
		dateModified: modifiedDate,
		...(project.technologies &&
			project.technologies.length > 0 && {
				applicationCategory: "WebApplication",
				operatingSystem: "Web Browser",
				softwareVersion: "1.0",
			}),
	}

	// Add optional fields if they exist
	if (project.github_url) {
		structuredData.codeRepository = project.github_url
	}

	if (project.live_url) {
		structuredData.installUrl = project.live_url
	}

	return structuredData
}

/**
 * Generate Organization structured data for the site
 *
 * @returns JSON-LD structured data object
 */
export function generateSiteStructuredData() {
	return {
		"@context": "https://schema.org",
		"@type": "Organization",
		name: "Doug.is",
		url: "https://doug.is",
		description: "Developer, Investor, Entrepreneur",
		sameAs: [
			"https://twitter.com/douglasrogers",
			"https://github.com/douglasrogers",
			"https://linkedin.com/in/douglasrogers",
		],
		logo: "https://doug.is/images/doug-2024-cropped.png",
	}
}
