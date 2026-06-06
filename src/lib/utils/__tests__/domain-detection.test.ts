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
			delete process.env.VERCEL_URL
			// NODE_ENV is read-only under TS; override it so the function
			// genuinely takes the development fallback branch.
			Object.defineProperty(process.env, "NODE_ENV", {
				value: "development",
				configurable: true,
				writable: true,
			})
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

		it("should self-reference the ephemeral URL in Vercel PREVIEW deployments", () => {
			delete process.env.NEXT_PUBLIC_SITE_URL
			process.env.VERCEL_ENV = "preview"
			process.env.VERCEL_URL = "doug-abc123-afxjzs-projects.vercel.app"
			expect(getSiteUrl()).toBe(
				"https://doug-abc123-afxjzs-projects.vercel.app"
			)
		})

		it("should emit the canonical domain in PRODUCTION even though VERCEL_URL is set", () => {
			delete process.env.NEXT_PUBLIC_SITE_URL
			process.env.VERCEL_ENV = "production"
			// Vercel sets VERCEL_URL in production too — it must NOT be used here.
			process.env.VERCEL_URL = "doug-xyz789-afxjzs-projects.vercel.app"
			expect(getSiteUrl()).toBe("https://doug.is")
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
