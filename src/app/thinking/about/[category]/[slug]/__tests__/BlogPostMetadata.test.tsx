import { Metadata } from "next"
import { getPostBySlug } from "@/lib/supabase/publicClient"

// Mock the Supabase client
jest.mock("@/lib/supabase/publicClient", () => ({
	getPostBySlug: jest.fn(),
	getPosts: jest.fn(),
}))

// Mock the PostView component to avoid Jest issues
jest.mock("@/components/PostView", () => ({
	PostView: () => <div>Mock PostView</div>,
}))

// Import the generateMetadata function directly
const { generateMetadata } = require("../page")

describe("Blog Post Metadata", () => {
	const mockPost = {
		id: 1,
		title: "Test Blog Post",
		slug: "test-blog-post",
		excerpt: "This is a test blog post excerpt",
		content: "This is the full content of the test blog post.",
		category: "technology",
		published_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-02T00:00:00Z",
		featured_image: "/images/posts/test-post-image.jpg",
	}

	beforeEach(() => {
		jest.clearAllMocks()
		;(getPostBySlug as jest.Mock).mockResolvedValue(mockPost)
	})

	it("should generate comprehensive metadata with OpenGraph tags", async () => {
		const metadata = await generateMetadata({
			params: { slug: "test-blog-post" },
		})

		expect(metadata.openGraph).toBeDefined()
		expect(metadata.openGraph?.title).toBe("Test Blog Post")
		expect(metadata.openGraph?.description).toBe(
			"This is a test blog post excerpt"
		)
		expect(metadata.openGraph?.url).toBe(
			"https://doug.is/thinking/about/technology/test-blog-post"
		)
		expect(metadata.openGraph?.siteName).toBe("Doug.is")
		expect(metadata.openGraph?.images).toBeDefined()

		// Handle array or single image
		const ogImages = Array.isArray(metadata.openGraph?.images)
			? metadata.openGraph?.images
			: [metadata.openGraph?.images]
		expect(ogImages?.[0]).toMatchObject({
			url: "https://doug.is/images/posts/test-post-image.jpg",
			width: 1200,
			height: 630,
			alt: "Test Blog Post",
		})
	})

	it("should generate comprehensive metadata with Twitter card tags", async () => {
		const metadata = await generateMetadata({
			params: { slug: "test-blog-post" },
		})

		expect(metadata.twitter).toBeDefined()
		expect(metadata.twitter?.title).toBe("Test Blog Post")
		expect(metadata.twitter?.description).toBe(
			"This is a test blog post excerpt"
		)
		expect(metadata.twitter?.images).toBeDefined()

		// Handle array or single image
		const twitterImages = Array.isArray(metadata.twitter?.images)
			? metadata.twitter?.images
			: [metadata.twitter?.images]
		expect(twitterImages?.[0]).toBe(
			"https://doug.is/images/posts/test-post-image.jpg"
		)
		expect(metadata.twitter?.creator).toBe("@douglasrogers")
	})

	it("should generate structured data for rich snippets", async () => {
		const metadata = await generateMetadata({
			params: { slug: "test-blog-post" },
		})

		expect(metadata.other).toBeDefined()
		expect(metadata.other?.["article:published_time"]).toBe(
			"2024-01-01T00:00:00Z"
		)
		expect(metadata.other?.["article:modified_time"]).toBe(
			"2024-01-02T00:00:00Z"
		)
		expect(metadata.other?.["article:author"]).toBe("Douglas Rogers")
		expect(metadata.other?.["article:section"]).toBe("Technology")
		expect(metadata.other?.["article:tag"]).toBe("technology")
	})

	it("should use post featured image when available", async () => {
		const metadata = await generateMetadata({
			params: { slug: "test-blog-post" },
		})

		// Check that the featured image is used in OpenGraph
		const ogImages = Array.isArray(metadata.openGraph?.images)
			? metadata.openGraph?.images
			: [metadata.openGraph?.images]
		expect(ogImages?.[0]?.url).toBe(
			"https://doug.is/images/posts/test-post-image.jpg"
		)
		expect(ogImages?.[0]?.alt).toBe("Test Blog Post")

		// Check that the featured image is used in Twitter
		const twitterImages = Array.isArray(metadata.twitter?.images)
			? metadata.twitter?.images
			: [metadata.twitter?.images]
		expect(twitterImages?.[0]).toBe(
			"https://doug.is/images/posts/test-post-image.jpg"
		)
	})

	it("should fallback to generic image when no featured image is available", async () => {
		const postWithoutImage = { ...mockPost, featured_image: null }
		;(getPostBySlug as jest.Mock).mockResolvedValue(postWithoutImage)

		const metadata = await generateMetadata({
			params: { slug: "test-blog-post" },
		})

		// Check that fallback image is used
		const ogImages = Array.isArray(metadata.openGraph?.images)
			? metadata.openGraph?.images
			: [metadata.openGraph?.images]
		expect(ogImages?.[0]?.url).toBe(
			"https://doug.is/images/doug-2024-cropped.png"
		)

		const twitterImages = Array.isArray(metadata.twitter?.images)
			? metadata.twitter?.images
			: [metadata.twitter?.images]
		expect(twitterImages?.[0]).toBe(
			"https://doug.is/images/doug-2024-cropped.png"
		)
	})

	it("should have proper canonical URL", async () => {
		const metadata = await generateMetadata({
			params: { slug: "test-blog-post" },
		})

		expect(metadata.alternates?.canonical).toBe(
			"https://doug.is/thinking/about/technology/test-blog-post"
		)
	})
})
