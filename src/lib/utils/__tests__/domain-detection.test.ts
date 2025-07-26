import {
	getSiteUrl,
	getCanonicalUrl,
	getSocialImageUrl,
} from "../domain-detection"

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
	jest.resetModules()
	process.env = { ...originalEnv }
})

afterAll(() => {
	process.env = originalEnv
})

describe("Domain Detection", () => {
	describe("getSiteUrl", () => {
		it("should use NEXT_PUBLIC_SITE_URL environment variable when set", () => {
			process.env.NEXT_PUBLIC_SITE_URL = "https://example.com"
			expect(getSiteUrl()).toBe("https://example.com")
		})

		it("should fallback to localhost for development when env var not set", () => {
			delete process.env.NEXT_PUBLIC_SITE_URL
			expect(getSiteUrl()).toBe("http://localhost:3000")
		})

		it("should handle trailing slashes correctly", () => {
			process.env.NEXT_PUBLIC_SITE_URL = "https://example.com/"
			expect(getSiteUrl()).toBe("https://example.com")
		})

		it("should handle protocol variations", () => {
			process.env.NEXT_PUBLIC_SITE_URL = "https://www.example.com"
			expect(getSiteUrl()).toBe("https://www.example.com")
		})
	})

	describe("getCanonicalUrl", () => {
		beforeEach(() => {
			process.env.NEXT_PUBLIC_SITE_URL = "https://example.com"
		})

		it("should generate canonical URL with dynamic domain", () => {
			const canonicalUrl = getCanonicalUrl(
				"/thinking/about/technology/ai-slop-will-eat-itself"
			)
			expect(canonicalUrl).toBe(
				"https://example.com/thinking/about/technology/ai-slop-will-eat-itself"
			)
		})

		it("should handle paths without leading slash", () => {
			const canonicalUrl = getCanonicalUrl(
				"thinking/about/technology/ai-slop-will-eat-itself"
			)
			expect(canonicalUrl).toBe(
				"https://example.com/thinking/about/technology/ai-slop-will-eat-itself"
			)
		})

		it("should handle root path", () => {
			const canonicalUrl = getCanonicalUrl("/")
			expect(canonicalUrl).toBe("https://example.com/")
		})

		it("should handle empty path", () => {
			const canonicalUrl = getCanonicalUrl("")
			expect(canonicalUrl).toBe("https://example.com/")
		})
	})

	describe("getSocialImageUrl", () => {
		beforeEach(() => {
			process.env.NEXT_PUBLIC_SITE_URL = "https://example.com"
		})

		it("should generate social image URL with dynamic domain", () => {
			const imageUrl = getSocialImageUrl(
				"/images/projects/oil-price-ticker.png"
			)
			expect(imageUrl).toBe(
				"https://example.com/images/projects/oil-price-ticker.png"
			)
		})

		it("should handle absolute URLs", () => {
			const imageUrl = getSocialImageUrl("https://external.com/image.jpg")
			expect(imageUrl).toBe("https://external.com/image.jpg")
		})

		it("should handle relative paths without leading slash", () => {
			const imageUrl = getSocialImageUrl("images/projects/oil-price-ticker.png")
			expect(imageUrl).toBe(
				"https://example.com/images/projects/oil-price-ticker.png"
			)
		})
	})
})
