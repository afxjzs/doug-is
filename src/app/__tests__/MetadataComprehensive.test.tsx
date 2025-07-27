import { Metadata } from "next"

// Mock Next.js modules
jest.mock("next/navigation", () => ({
	notFound: jest.fn(),
}))

jest.mock("@/lib/supabase/data", () => ({
	getPosts: jest.fn(),
	getPostBySlug: jest.fn(),
}))

// Set environment variable for tests to get production URLs
process.env.NEXT_PUBLIC_SITE_URL = "https://doug.is"

// Import metadata functions from various pages
const { metadata: homeMetadata } = require("../page")
const { metadata: buildingMetadata } = require("../building/metadata")
const { metadata: advisingMetadata } = require("../advising/metadata")
const { metadata: investingMetadata } = require("../investing/metadata")
const { metadata: thinkingMetadata } = require("../thinking/metadata")
const {
	metadata: connectingMetadata,
} = require("../(site)/connecting/metadata")
const { metadata: hustlingMetadata } = require("../(site)/hustling/metadata")

describe("Comprehensive Metadata Testing", () => {
	describe("Home Page Metadata", () => {
		it("should have comprehensive metadata", () => {
			expect(homeMetadata).toBeDefined()
			expect(homeMetadata.title).toBe(
				"doug.is | Developer, Investor, Entrepreneur"
			)
			expect(homeMetadata.description).toContain("Douglas E. Rogers")
			expect(homeMetadata.openGraph).toBeDefined()
			expect(homeMetadata.twitter).toBeDefined()
			expect(homeMetadata.alternates?.canonical).toBe("https://doug.is/")
		})

		it("should have proper OpenGraph metadata", () => {
			const og = homeMetadata.openGraph
			expect(og?.title).toBe("doug.is | Developer, Investor, Entrepreneur")
			expect(og?.description).toContain("Douglas E. Rogers")
			expect(og?.url).toBe("https://doug.is/")
			expect(og?.siteName).toBe("doug.is")
			expect(og?.type).toBe("website")
			expect(og?.images).toBeDefined()
			expect(Array.isArray(og?.images)).toBe(true)
		})

		it("should have proper Twitter card metadata", () => {
			const twitter = homeMetadata.twitter
			expect(twitter?.card).toBe("summary_large_image")
			expect(twitter?.title).toBe("doug.is | Developer, Investor, Entrepreneur")
			expect(twitter?.description).toContain("Douglas E. Rogers")
			expect(twitter?.images).toBeDefined()
			expect(twitter?.creator).toBe("@glowingrec")
		})
	})

	describe("Section Pages Metadata", () => {
		const sectionPages = [
			{ name: "Building", metadata: buildingMetadata },
			{ name: "Advising", metadata: advisingMetadata },
			{ name: "Investing", metadata: investingMetadata },
			{ name: "Thinking", metadata: thinkingMetadata },
		]

		sectionPages.forEach(({ name, metadata }) => {
			describe(`${name} Page`, () => {
				it("should have comprehensive metadata", () => {
					expect(metadata).toBeDefined()
					expect(metadata.title).toContain(`doug.is / ${name}`)
					expect(metadata.description).toBeDefined()
					expect(metadata.openGraph).toBeDefined()
					expect(metadata.twitter).toBeDefined()
					expect(metadata.alternates?.canonical).toBeDefined()
				})

				it("should have proper OpenGraph metadata", () => {
					const og = metadata.openGraph
					expect(og?.title).toContain(`doug.is / ${name}`)
					expect(og?.description).toBeDefined()
					expect(og?.url).toBe(`https://doug.is/${name.toLowerCase()}`)
					expect(og?.siteName).toBe("doug.is")
					expect(og?.type).toBe("website")
					expect(og?.images).toBeDefined()
				})

				it("should have proper Twitter card metadata", () => {
					const twitter = metadata.twitter
					expect(twitter?.card).toBe("summary_large_image")
					expect(twitter?.title).toContain(`doug.is / ${name}`)
					expect(twitter?.description).toBeDefined()
					expect(twitter?.images).toBeDefined()
					expect(twitter?.creator).toBe("@glowingrec")
				})
			})
		})
	})

	describe("Other Pages Metadata", () => {
		const otherPages = [
			{ name: "Connecting", metadata: connectingMetadata },
			{ name: "Hustling", metadata: hustlingMetadata },
		]

		otherPages.forEach(({ name, metadata }) => {
			describe(`${name} Page`, () => {
				it("should have comprehensive metadata", () => {
					expect(metadata).toBeDefined()
					expect(metadata.title).toContain(`doug.is / ${name}`)
					expect(metadata.description).toBeDefined()
					expect(metadata.openGraph).toBeDefined()
					expect(metadata.twitter).toBeDefined()
					expect(metadata.alternates?.canonical).toBeDefined()
				})

				it("should have proper OpenGraph metadata", () => {
					const og = metadata.openGraph
					expect(og?.title).toContain(`doug.is / ${name}`)
					expect(og?.description).toBeDefined()
					expect(og?.url).toBe(`https://doug.is/${name.toLowerCase()}`)
					expect(og?.siteName).toBe("doug.is")
					expect(og?.type).toBe("website")
					expect(og?.images).toBeDefined()
				})

				it("should have proper Twitter card metadata", () => {
					const twitter = metadata.twitter
					expect(twitter?.card).toBe("summary_large_image")
					expect(twitter?.title).toContain(`doug.is / ${name}`)
					expect(twitter?.description).toBeDefined()
					expect(twitter?.images).toBeDefined()
					expect(twitter?.creator).toBe("@glowingrec")
				})
			})
		})
	})
})
