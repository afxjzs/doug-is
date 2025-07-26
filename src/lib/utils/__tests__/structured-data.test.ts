/**
 * Structured Data (JSON-LD) Tests
 *
 * Tests for generating structured data for SEO and rich snippets
 */

import {
	generateBlogPostStructuredData,
	generateProjectPageStructuredData,
} from "../structured-data"

describe("Structured Data Generation", () => {
	const mockBlogPost = {
		id: "test-post-1",
		title: "Test Blog Post",
		slug: "test-blog-post",
		excerpt: "This is a test blog post excerpt for testing structured data.",
		content: "Full blog post content with markdown...",
		category: "building",
		featured_image: "/images/test-featured.jpg",
		published_at: "2024-01-15T10:00:00Z",
		updated_at: "2024-01-16T14:30:00Z",
		author: "Douglas Rogers",
		tags: ["test", "metadata", "blog"],
		reading_time: 5,
	}

	const mockProject = {
		title: "Oil Price Ticker",
		description:
			"A real-time oil price ticker that displays current oil prices with live updates.",
		url: "/building/oil-price-ticker",
		image: "/images/projects/oil-price-ticker/oil-price-icon.png",
		technologies: ["React", "TypeScript", "Next.js"],
		github_url: "https://github.com/douglasrogers/oil-price-ticker",
		live_url: "https://oil-price-ticker.vercel.app",
		created_at: "2024-01-10T09:00:00Z",
		updated_at: "2024-01-15T16:30:00Z",
	}

	beforeEach(() => {
		process.env.NEXT_PUBLIC_SITE_URL = "https://doug.is"
	})

	afterEach(() => {
		delete process.env.NEXT_PUBLIC_SITE_URL
	})

	describe("Blog Post Structured Data", () => {
		it("should generate Article structured data", () => {
			const structuredData = generateBlogPostStructuredData(mockBlogPost)

			expect(structuredData).toBeDefined()
			expect(structuredData["@type"]).toBe("Article")
			expect(structuredData.headline).toBe("Test Blog Post")
			expect(structuredData.description).toBe(mockBlogPost.excerpt)
			expect(structuredData.author).toEqual({
				"@type": "Person",
				name: "Douglas Rogers",
			})
			expect(structuredData.publisher).toEqual({
				"@type": "Organization",
				name: "doug.is",
				url: "https://doug.is",
			})
			expect(structuredData.datePublished).toBe("2024-01-15T10:00:00Z")
			expect(structuredData.dateModified).toBe("2024-01-16T14:30:00Z")
			expect(structuredData.mainEntityOfPage).toBe(
				"https://doug.is/thinking/about/building/test-blog-post"
			)
			expect(structuredData.image).toBe(
				"https://doug.is/images/test-featured.jpg"
			)
		})

		it("should handle missing featured image", () => {
			const postWithoutImage = { ...mockBlogPost, featured_image: null }
			const structuredData = generateBlogPostStructuredData(postWithoutImage)

			expect(structuredData.image).toBe(
				"https://doug.is/images/doug-2024-cropped.png"
			)
		})

		it("should handle missing updated_at", () => {
			const postWithoutUpdate = { ...mockBlogPost, updated_at: null }
			const structuredData = generateBlogPostStructuredData(postWithoutUpdate)

			expect(structuredData.dateModified).toBe("2024-01-15T10:00:00Z")
		})
	})

	describe("Project Page Structured Data", () => {
		it("should generate SoftwareApplication structured data", () => {
			const structuredData = generateProjectPageStructuredData(mockProject)

			expect(structuredData).toBeDefined()
			expect(structuredData["@type"]).toBe("SoftwareApplication")
			expect(structuredData.name).toBe("Oil Price Ticker")
			expect(structuredData.description).toBe(mockProject.description)
			expect(structuredData.url).toBe(
				"https://doug.is/building/oil-price-ticker"
			)
			expect(structuredData.image).toBe(
				"https://doug.is/images/projects/oil-price-ticker/oil-price-icon.png"
			)
			expect(structuredData.author).toEqual({
				"@type": "Person",
				name: "Douglas Rogers",
			})
			expect(structuredData.dateCreated).toBe("2024-01-10T09:00:00Z")
			expect(structuredData.dateModified).toBe("2024-01-15T16:30:00Z")
		})

		it("should handle missing optional fields", () => {
			const minimalProject = {
				title: "Simple Project",
				description: "A simple project description",
				url: "/building/simple-project",
				image: "/images/projects/simple-project.png",
				technologies: [],
				created_at: "2024-01-10T09:00:00Z",
				updated_at: null,
			}
			const structuredData = generateProjectPageStructuredData(minimalProject)

			expect(structuredData.name).toBe("Simple Project")
			expect(structuredData.dateModified).toBe("2024-01-10T09:00:00Z")
			expect(structuredData).not.toHaveProperty("github_url")
			expect(structuredData).not.toHaveProperty("live_url")
		})
	})
})
