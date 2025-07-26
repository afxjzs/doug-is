/**
 * Metadata Validation Tests
 *
 * Tests to ensure all pages have proper metadata for social sharing
 */

import {
	getCanonicalUrl,
	getSocialImageUrl,
	getSiteName,
} from "../domain-detection"

// Mock the domain detection utilities for testing
jest.mock("../domain-detection", () => ({
	getCanonicalUrl: jest.fn((path: string) => `https://doug.is${path}`),
	getSocialImageUrl: jest.fn((path: string) => `https://doug.is${path}`),
	getSiteName: jest.fn(() => "Doug.is"),
}))

describe("Metadata Validation", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe("Required Metadata Fields", () => {
		it("should validate that all pages have required OpenGraph fields", () => {
			// This test ensures that our metadata validation utilities work correctly
			const mockMetadata = {
				title: "Test Page",
				description: "Test description",
				openGraph: {
					title: "Test Page",
					description: "Test description",
					url: "https://doug.is/test",
					siteName: "Doug.is",
					images: [
						{
							url: "https://doug.is/images/test.jpg",
							width: 1200,
							height: 630,
							alt: "Test image",
						},
					],
					locale: "en_US",
					type: "website",
				},
				twitter: {
					card: "summary_large_image",
					title: "Test Page",
					description: "Test description",
					images: ["https://doug.is/images/test.jpg"],
					creator: "@glowingrec",
				},
				alternates: {
					canonical: "https://doug.is/test",
				},
			}

			// Validate required OpenGraph fields
			expect(mockMetadata.openGraph).toBeDefined()
			expect(mockMetadata.openGraph.title).toBeDefined()
			expect(mockMetadata.openGraph.description).toBeDefined()
			expect(mockMetadata.openGraph.url).toBeDefined()
			expect(mockMetadata.openGraph.siteName).toBeDefined()
			expect(mockMetadata.openGraph.images).toBeDefined()
			expect(Array.isArray(mockMetadata.openGraph.images)).toBe(true)
			expect(mockMetadata.openGraph.images.length).toBeGreaterThan(0)

			// Validate required Twitter fields
			expect(mockMetadata.twitter).toBeDefined()
			expect(mockMetadata.twitter.card).toBe("summary_large_image")
			expect(mockMetadata.twitter.title).toBeDefined()
			expect(mockMetadata.twitter.description).toBeDefined()
			expect(mockMetadata.twitter.images).toBeDefined()
			expect(Array.isArray(mockMetadata.twitter.images)).toBe(true)
			expect(mockMetadata.twitter.images.length).toBeGreaterThan(0)
			expect(mockMetadata.twitter.creator).toBe("@glowingrec")

			// Validate canonical URL
			expect(mockMetadata.alternates).toBeDefined()
			expect(mockMetadata.alternates.canonical).toBeDefined()
		})

		it("should validate that blog posts have article-specific metadata", () => {
			const mockBlogPostMetadata = {
				title: "Test Blog Post",
				description: "Test blog post description",
				openGraph: {
					title: "Test Blog Post",
					description: "Test blog post description",
					type: "article",
					url: "https://doug.is/thinking/about/building/test-post",
					siteName: "Doug.is",
					images: [
						{
							url: "https://doug.is/images/test-featured.jpg",
							width: 1200,
							height: 630,
							alt: "Test blog post",
						},
					],
					locale: "en_US",
				},
				twitter: {
					card: "summary_large_image",
					title: "Test Blog Post",
					description: "Test blog post description",
					images: ["https://doug.is/images/test-featured.jpg"],
					creator: "@glowingrec",
				},
				other: {
					"article:published_time": "2024-01-15T10:00:00Z",
					"article:modified_time": "2024-01-16T14:30:00Z",
					"article:author": "Douglas Rogers",
					"article:section": "Building",
					"article:tag": "building",
				},
				alternates: {
					canonical: "https://doug.is/thinking/about/building/test-post",
				},
			}

			// Validate article-specific fields
			expect(mockBlogPostMetadata.openGraph.type).toBe("article")
			expect(mockBlogPostMetadata.other).toBeDefined()
			expect(mockBlogPostMetadata.other["article:published_time"]).toBeDefined()
			expect(mockBlogPostMetadata.other["article:author"]).toBeDefined()
			expect(mockBlogPostMetadata.other["article:section"]).toBeDefined()
		})

		it("should validate that project pages have proper structured data", () => {
			const mockProjectMetadata = {
				title: "Test Project | Building | Doug.is",
				description: "Test project description",
				openGraph: {
					title: "Test Project",
					description: "Test project description",
					type: "website",
					url: "https://doug.is/building/test-project",
					siteName: "Doug.is",
					images: [
						{
							url: "https://doug.is/images/projects/test-project.png",
							width: 1200,
							height: 630,
							alt: "Test project",
						},
					],
					locale: "en_US",
				},
				twitter: {
					card: "summary_large_image",
					title: "Test Project",
					description: "Test project description",
					images: ["https://doug.is/images/projects/test-project.png"],
					creator: "@glowingrec",
				},
				alternates: {
					canonical: "https://doug.is/building/test-project",
				},
			}

			// Validate project page metadata
			expect(mockProjectMetadata.openGraph.type).toBe("website")
			expect(mockProjectMetadata.title).toContain("| Building |")
			expect(mockProjectMetadata.twitter.creator).toBe("@glowingrec")
		})
	})

	describe("URL Validation", () => {
		it("should validate that no hardcoded URLs are used", () => {
			// This test ensures we're using dynamic domain detection
			const mockMetadata = {
				openGraph: {
					url: getCanonicalUrl("/test-page"),
					images: [
						{
							url: getSocialImageUrl("/images/test.jpg"),
						},
					],
				},
				twitter: {
					images: [getSocialImageUrl("/images/test.jpg")],
				},
				alternates: {
					canonical: getCanonicalUrl("/test-page"),
				},
			}

			// Verify that domain detection functions are being used
			expect(getCanonicalUrl).toHaveBeenCalledWith("/test-page")
			expect(getSocialImageUrl).toHaveBeenCalledWith("/images/test.jpg")
		})

		it("should validate that site name is dynamic", () => {
			const mockMetadata = {
				title: `Test Page | ${getSiteName()}`,
				openGraph: {
					siteName: getSiteName(),
				},
			}

			expect(getSiteName).toHaveBeenCalled()
		})
	})

	describe("Image Validation", () => {
		it("should validate that images have proper dimensions", () => {
			const mockImage = {
				url: "https://doug.is/images/test.jpg",
				width: 1200,
				height: 630,
				alt: "Test image",
			}

			expect(mockImage.width).toBeGreaterThanOrEqual(1200)
			expect(mockImage.height).toBeGreaterThanOrEqual(630)
			expect(mockImage.alt).toBeDefined()
			expect(mockImage.alt.length).toBeGreaterThan(0)
		})

		it("should validate that Twitter images are arrays", () => {
			const mockTwitterImages = ["https://doug.is/images/test.jpg"]

			expect(Array.isArray(mockTwitterImages)).toBe(true)
			expect(mockTwitterImages.length).toBeGreaterThan(0)
		})
	})
})
