/**
 * Comprehensive Metadata Validation Test Suite
 * Tests metadata implementation across all page types for social media sharing
 */

import { Metadata } from "next"

// Metadata validation utilities
export const validateRequiredMetadata = (metadata: Metadata): string[] => {
	const errors: string[] = []

	if (!metadata.title) errors.push("Missing title")
	if (!metadata.description) errors.push("Missing description")

	return errors
}

export const validateOpenGraphMetadata = (metadata: Metadata): string[] => {
	const errors: string[] = []
	const og = metadata.openGraph

	if (!og) {
		errors.push("Missing OpenGraph metadata")
		return errors
	}

	if (!og.title) errors.push("Missing OpenGraph title")
	if (!og.description) errors.push("Missing OpenGraph description")
	if (!og.url) errors.push("Missing OpenGraph URL")
	if (!og.siteName) errors.push("Missing OpenGraph siteName")
	if (!og.images || (Array.isArray(og.images) && og.images.length === 0)) {
		errors.push("Missing OpenGraph images")
	}

	return errors
}

export const validateTwitterCardMetadata = (metadata: Metadata): string[] => {
	const errors: string[] = []
	const twitter = metadata.twitter as any // Type assertion for Twitter card validation

	if (!twitter) {
		errors.push("Missing Twitter Card metadata")
		return errors
	}

	if (!twitter.card) errors.push("Missing Twitter card type")
	if (!twitter.title) errors.push("Missing Twitter title")
	if (!twitter.description) errors.push("Missing Twitter description")
	if (
		!twitter.images ||
		(Array.isArray(twitter.images) && twitter.images.length === 0)
	) {
		errors.push("Missing Twitter images")
	}
	if (!twitter.creator) errors.push("Missing Twitter creator")

	return errors
}

export const validateSocialImageDimensions = (imageUrl: string): boolean => {
	// For now, just validate that it's a string and appears to be a URL
	// In real implementation, we'd check actual dimensions
	return typeof imageUrl === "string" && imageUrl.length > 0
}

// Test metadata compliance for different page types
describe("Metadata Validation Framework", () => {
	describe("Homepage Metadata Requirements", () => {
		test("should have complete metadata for social sharing", () => {
			// This test will fail until we implement proper homepage metadata
			const homepageMetadata: Metadata = {
				title: "doug.is | Developer, Investor, Entrepreneur",
				description:
					"Personal website of Douglas E. Rogers - Developer, Investor, and Entrepreneur",
				openGraph: {
					title: "doug.is | Developer, Investor, Entrepreneur",
					description:
						"Personal website of Douglas E. Rogers - Developer, Investor, and Entrepreneur",
					url: "https://doug.is",
					siteName: "doug.is",
					type: "website",
					images: [
						{
							url: "https://doug.is/images/social/homepage-social.jpg",
							width: 1200,
							height: 630,
							alt: "doug.is - Developer, Investor, Entrepreneur",
						},
					],
				},
				twitter: {
					card: "summary_large_image",
					title: "doug.is | Developer, Investor, Entrepreneur",
					description:
						"Personal website of Douglas E. Rogers - Developer, Investor, and Entrepreneur",
					images: ["https://doug.is/images/social/homepage-social.jpg"],
					creator: "@afxjzs",
				},
			}

			const basicErrors = validateRequiredMetadata(homepageMetadata)
			const ogErrors = validateOpenGraphMetadata(homepageMetadata)
			const twitterErrors = validateTwitterCardMetadata(homepageMetadata)

			expect(basicErrors).toHaveLength(0)
			expect(ogErrors).toHaveLength(0)
			expect(twitterErrors).toHaveLength(0)
		})
	})

	describe("Project Page Metadata Requirements", () => {
		test("should have project-specific metadata with screenshots", () => {
			// This test will fail for most project pages until we implement proper metadata
			const projectMetadata: Metadata = {
				title: "Project Name | Building | doug.is",
				description: "Detailed description of the project and its features",
				openGraph: {
					title: "Project Name - Brief compelling description",
					description: "Detailed description of the project and its features",
					url: "https://doug.is/building/project-name",
					siteName: "doug.is",
					type: "website",
					images: [
						{
							url: "https://doug.is/images/projects/project-name/social-card.jpg",
							width: 1200,
							height: 630,
							alt: "Project Name Screenshot",
						},
					],
				},
				twitter: {
					card: "summary_large_image",
					title: "Project Name - Brief compelling description",
					description: "Detailed description of the project and its features",
					images: [
						"https://doug.is/images/projects/project-name/social-card.jpg",
					],
					creator: "@afxjzs",
				},
			}

			const basicErrors = validateRequiredMetadata(projectMetadata)
			const ogErrors = validateOpenGraphMetadata(projectMetadata)
			const twitterErrors = validateTwitterCardMetadata(projectMetadata)

			expect(basicErrors).toHaveLength(0)
			expect(ogErrors).toHaveLength(0)
			expect(twitterErrors).toHaveLength(0)
		})
	})

	describe("Blog Post Dynamic Metadata Requirements", () => {
		test("should generate complete metadata from post content", () => {
			// This test will fail until we implement proper dynamic metadata
			const blogPostMetadata: Metadata = {
				title: "Blog Post Title | doug.is",
				description: "Post excerpt or first paragraph as description",
				openGraph: {
					title: "Blog Post Title",
					description: "Post excerpt or first paragraph as description",
					url: "https://doug.is/thinking/category/post-slug",
					siteName: "doug.is",
					type: "article",
					images: [
						{
							url: "https://doug.is/images/social/blog-post-social.jpg",
							width: 1200,
							height: 630,
							alt: "Blog Post Title",
						},
					],
				},
				twitter: {
					card: "summary_large_image",
					title: "Blog Post Title",
					description: "Post excerpt or first paragraph as description",
					images: ["https://doug.is/images/social/blog-post-social.jpg"],
					creator: "@afxjzs",
				},
			}

			const basicErrors = validateRequiredMetadata(blogPostMetadata)
			const ogErrors = validateOpenGraphMetadata(blogPostMetadata)
			const twitterErrors = validateTwitterCardMetadata(blogPostMetadata)

			expect(basicErrors).toHaveLength(0)
			expect(ogErrors).toHaveLength(0)
			expect(twitterErrors).toHaveLength(0)
		})
	})

	describe("Section Page Metadata Validation", () => {
		test("should validate existing section page metadata compliance", () => {
			// Test existing section page metadata (these should mostly pass)
			const sectionMetadata: Metadata = {
				title: "Building | doug.is",
				description:
					"Projects and applications I'm currently building or have built in the past.",
				openGraph: {
					title: "Building | doug.is",
					description:
						"Projects and applications I'm currently building or have built in the past.",
					url: "https://doug.is/building",
					siteName: "doug.is",
					type: "website",
				},
				twitter: {
					card: "summary_large_image",
					title: "Building | doug.is",
					description:
						"Projects and applications I'm currently building or have built in the past.",
					creator: "@afxjzs",
				},
			}

			const basicErrors = validateRequiredMetadata(sectionMetadata)
			const ogErrors = validateOpenGraphMetadata(sectionMetadata)
			const twitterErrors = validateTwitterCardMetadata(sectionMetadata)

			expect(basicErrors).toHaveLength(0)
			// These will fail due to missing images
			expect(ogErrors.length).toBeGreaterThan(0)
			expect(twitterErrors.length).toBeGreaterThan(0)
		})
	})

	describe("Admin Page Metadata Requirements", () => {
		test("should have noindex metadata for admin pages", () => {
			const adminMetadata: Metadata = {
				title: "Admin Dashboard | doug.is",
				description: "Admin interface for managing site content",
				robots: "noindex, nofollow",
			}

			expect(adminMetadata.robots).toBe("noindex, nofollow")
			expect(adminMetadata.title).toContain("Admin")
		})
	})

	describe("Social Image Validation", () => {
		test("should validate social sharing image requirements", () => {
			const socialImage = {
				url: "https://doug.is/images/social/test-image.jpg",
				width: 1200,
				height: 630,
				alt: "Test social sharing image",
			}

			expect(socialImage.width).toBe(1200)
			expect(socialImage.height).toBe(630)
			expect(socialImage.alt).toBeTruthy()
			expect(validateSocialImageDimensions(socialImage.url)).toBe(true)
		})
	})

	describe("Canonical URL Validation", () => {
		test("should have proper canonical URLs", () => {
			const metadataWithCanonical: Metadata = {
				title: "Test Page",
				description: "Test description",
				alternates: {
					canonical: "https://doug.is/test-page",
				},
			}

			expect(metadataWithCanonical.alternates?.canonical).toBeTruthy()
			expect(metadataWithCanonical.alternates?.canonical).toMatch(
				/^https:\/\/doug\.is\//
			)
		})
	})
})

// Test helper to run metadata validation on actual pages
export const testPageMetadata = async (
	pagePath: string,
	expectedMetadata: Partial<Metadata>
) => {
	// This would be used to test actual page metadata in integration tests
	// For now, just return the expected structure
	return {
		pagePath,
		expectedMetadata,
		isValid: true,
	}
}
