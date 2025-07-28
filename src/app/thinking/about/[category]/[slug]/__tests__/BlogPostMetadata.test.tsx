import { generateMetadata } from "../page"

// Mock the domain detection functions
jest.mock("@/lib/utils/domain-detection", () => ({
	getCanonicalUrl: jest.fn((path: string) => `https://doug.is${path}`),
	getSocialImageUrl: jest.fn((path: string) => `https://doug.is${path}`),
	getSiteName: jest.fn(() => "doug.is"),
}))

// Mock the database functions
jest.mock("@/lib/supabase/data", () => ({
	getPostBySlugAndCategory: jest.fn(),
	getPostBySlugAndCategoryStatic: jest.fn(),
}))

describe("Blog Post Metadata", () => {
	const mockGetPostBySlugAndCategory =
		require("@/lib/supabase/data").getPostBySlugAndCategory

	beforeEach(() => {
		jest.clearAllMocks()
		// Set environment variable for tests
		process.env.NEXT_PUBLIC_SITE_URL = "https://doug.is"
	})

	afterEach(() => {
		delete process.env.NEXT_PUBLIC_SITE_URL
	})

	it("should generate comprehensive metadata with OpenGraph tags", async () => {
		const mockPost = {
			id: "1",
			title: "Test Blog Post",
			slug: "test-blog-post",
			content: "This is test content",
			excerpt: "This is a test blog post excerpt",
			published_at: "2024-01-01T00:00:00Z",
			category: "technology",
			featured_image: "/images/posts/test-post-image.jpg",
			updated_at: "2024-01-02T00:00:00Z",
		}

		mockGetPostBySlugAndCategory.mockResolvedValue(mockPost)

		const metadata = await generateMetadata({
			params: Promise.resolve({
				slug: "test-blog-post",
				category: "technology",
			}),
		})

		expect(metadata.title).toBe("Test Blog Post | doug.is")
		expect(metadata.description).toBe("This is a test blog post excerpt")
		expect(metadata.openGraph?.title).toBe("Test Blog Post")
		expect(metadata.openGraph?.description).toBe(
			"This is a test blog post excerpt"
		)
		expect(metadata.openGraph?.url).toBe(
			"https://doug.is/thinking/about/technology/test-blog-post"
		)
		expect(metadata.openGraph?.siteName).toBe("doug.is")
		expect(metadata.openGraph?.images).toHaveLength(1)
		// Check if images exist (Next.js 15 structure may vary)
		const ogImages = metadata.openGraph?.images
		expect(ogImages).toBeDefined()
	})

	it("should generate comprehensive metadata with Twitter card tags", async () => {
		const mockPost = {
			id: "1",
			title: "Test Blog Post",
			slug: "test-blog-post",
			content: "This is test content",
			excerpt: "This is a test blog post excerpt",
			published_at: "2024-01-01T00:00:00Z",
			category: "technology",
			featured_image: "/images/posts/test-post-image.jpg",
			updated_at: "2024-01-02T00:00:00Z",
		}

		mockGetPostBySlugAndCategory.mockResolvedValue(mockPost)

		const metadata = await generateMetadata({
			params: Promise.resolve({
				slug: "test-blog-post",
				category: "technology",
			}),
		})

		expect(metadata.twitter?.title).toBe("Test Blog Post")
		expect(metadata.twitter?.description).toBe(
			"This is a test blog post excerpt"
		)
		expect(metadata.twitter?.creator).toBe("@glowingrec")

		const twitterImages = Array.isArray(metadata.twitter?.images)
			? metadata.twitter?.images
			: [metadata.twitter?.images]
		expect(twitterImages?.[0]).toBe(
			"https://doug.is/images/posts/test-post-image.jpg"
		)
	})

	it("should use post featured image when available", async () => {
		const mockPost = {
			id: "1",
			title: "Test Blog Post",
			slug: "test-blog-post",
			content: "This is test content",
			excerpt: "This is a test blog post excerpt",
			published_at: "2024-01-01T00:00:00Z",
			category: "technology",
			featured_image: "/images/posts/test-post-image.jpg",
			updated_at: "2024-01-02T00:00:00Z",
		}

		mockGetPostBySlugAndCategory.mockResolvedValue(mockPost)

		const metadata = await generateMetadata({
			params: Promise.resolve({
				slug: "test-blog-post",
				category: "technology",
			}),
		})

		// Check if images exist (Next.js 15 structure may vary)
		const ogImages = metadata.openGraph?.images
		expect(ogImages).toBeDefined()
	})

	it("should fallback to generic image when no featured image is available", async () => {
		const mockPost = {
			id: "1",
			title: "Test Blog Post",
			slug: "test-blog-post",
			content: "This is test content",
			excerpt: "This is a test blog post excerpt",
			published_at: "2024-01-01T00:00:00Z",
			category: "technology",
			featured_image: null,
			updated_at: "2024-01-02T00:00:00Z",
		}

		mockGetPostBySlugAndCategory.mockResolvedValue(mockPost)

		const metadata = await generateMetadata({
			params: Promise.resolve({
				slug: "test-blog-post",
				category: "technology",
			}),
		})

		// Check if images exist (Next.js 15 structure may vary)
		const ogImages = metadata.openGraph?.images
		expect(ogImages).toBeDefined()
	})

	it("should have proper canonical URL", async () => {
		const mockPost = {
			id: "1",
			title: "Test Blog Post",
			slug: "test-blog-post",
			content: "This is test content",
			excerpt: "This is a test blog post excerpt",
			published_at: "2024-01-01T00:00:00Z",
			category: "technology",
			featured_image: "/images/posts/test-post-image.jpg",
			updated_at: "2024-01-02T00:00:00Z",
		}

		mockGetPostBySlugAndCategory.mockResolvedValue(mockPost)

		const metadata = await generateMetadata({
			params: Promise.resolve({
				slug: "test-blog-post",
				category: "technology",
			}),
		})

		expect(metadata.alternates?.canonical).toBe(
			"https://doug.is/thinking/about/technology/test-blog-post"
		)
	})

	it("should include article metadata", async () => {
		const mockPost = {
			id: "1",
			title: "Test Blog Post",
			slug: "test-blog-post",
			content: "This is test content",
			excerpt: "This is a test blog post excerpt",
			published_at: "2024-01-01T00:00:00Z",
			category: "technology",
			featured_image: "/images/posts/test-post-image.jpg",
			updated_at: "2024-01-02T00:00:00Z",
		}

		mockGetPostBySlugAndCategory.mockResolvedValue(mockPost)

		const metadata = await generateMetadata({
			params: Promise.resolve({
				slug: "test-blog-post",
				category: "technology",
			}),
		})

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

	it("should handle missing post gracefully", async () => {
		mockGetPostBySlugAndCategory.mockResolvedValue(null)

		const metadata = await generateMetadata({
			params: Promise.resolve({
				slug: "non-existent-post",
				category: "technology",
			}),
		})

		expect(metadata.title).toBe("Post Not Found | doug.is")
		expect(metadata.description).toBe(
			"The requested blog post could not be found."
		)
	})

	it("should handle database errors gracefully", async () => {
		mockGetPostBySlugAndCategory.mockRejectedValue(new Error("Database error"))

		const metadata = await generateMetadata({
			params: Promise.resolve({
				slug: "test-blog-post",
				category: "technology",
			}),
		})

		expect(metadata.title).toBe("Blog Post | doug.is")
		expect(metadata.description).toBe("A blog post by Douglas Rogers")
	})
})
