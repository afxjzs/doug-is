import { render, screen } from "@testing-library/react"
import OilPriceTickerPage from "../page"

// Mock Next.js Image component
jest.mock("next/image", () => {
	return function MockImage({ src, alt }: { src: string; alt: string }) {
		return <img src={src} alt={alt} />
	}
})

// Mock Next.js Link component
jest.mock("next/link", () => {
	return function MockLink({ href, children, ...props }: any) {
		return (
			<a href={href} {...props}>
				{children}
			</a>
		)
	}
})

describe("OilPriceTickerPage", () => {
	beforeEach(() => {
		render(<OilPriceTickerPage />)
	})

	describe("Page Structure and Metadata", () => {
		it("displays the correct page title", () => {
			expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
				"Oil Price Ticker"
			)
		})

		it("shows the project description", () => {
			expect(
				screen.getByText(
					/A macOS menu bar app that displays live oil price updates/
				)
			).toBeInTheDocument()
		})

		it("displays the main project image", () => {
			const allImages = screen.getAllByAltText(/Oil Price Ticker Screenshot/)
			// Get the first/main screenshot (hero section)
			const mainImage = allImages[0]
			expect(mainImage).toBeInTheDocument()
		})
	})

	describe("Call-to-Action Buttons", () => {
		it("has a download button with correct styling and link", () => {
			const downloadButtons = screen.getAllByRole("link", {
				name: /download for macOS/i,
			})
			expect(downloadButtons.length).toBeGreaterThan(0)
			// Test the first download button
			expect(downloadButtons[0]).toHaveAttribute(
				"href",
				"/files/OilPriceTicker.zip"
			)
			expect(downloadButtons[0]).toHaveAttribute("download")
			expect(downloadButtons[0]).toHaveClass("neon-button-orange")
		})

		it("has a GitHub link", () => {
			const githubLink = screen.getByRole("link", {
				name: /view source/i,
			})
			expect(githubLink).toBeInTheDocument()
			expect(githubLink).toHaveAttribute(
				"href",
				"https://github.com/afxjzs/oil-price-ticker"
			)
			expect(githubLink).toHaveAttribute("target", "_blank")
		})

		it("includes download icon in the download button", () => {
			const downloadButtons = screen.getAllByRole("link", {
				name: /download for macOS/i,
			})
			expect(downloadButtons[0].querySelector("svg")).toBeInTheDocument()
		})
	})

	describe("Content Sections", () => {
		it("displays key features section", () => {
			expect(screen.getByText(/features|what it does/i)).toBeInTheDocument()
		})

		it("shows live updates feature", () => {
			const liveUpdateElements = screen.getAllByText(
				/live.*updates|real.*time.*data/i
			)
			expect(liveUpdateElements.length).toBeGreaterThan(0)
		})

		it("mentions menu bar integration", () => {
			const menuBarElements = screen.getAllByText(/menu bar|status bar/i)
			expect(menuBarElements.length).toBeGreaterThan(0)
		})

		it("describes customizable preferences", () => {
			const preferenceElements = screen.getAllByText(
				/preferences|customizable|settings/i
			)
			expect(preferenceElements.length).toBeGreaterThan(0)
		})

		it("shows technical details section", () => {
			expect(screen.getByText(/technical requirements/i)).toBeInTheDocument()
		})

		it("mentions macOS compatibility", () => {
			const macOSReferences = screen.getAllByText(/macOS|Mac|Apple/i)
			expect(macOSReferences.length).toBeGreaterThan(0)
		})
	})

	describe("Screenshots Section", () => {
		it("displays main app screenshot", () => {
			const screenshots = screen.getAllByAltText(
				/Oil Price Ticker Screenshot|Main Screenshot/
			)
			expect(screenshots.length).toBeGreaterThan(0)
			expect(screenshots[0]).toHaveAttribute(
				"src",
				expect.stringContaining("oil-price-ticker-screenshot")
			)
		})

		it("displays preferences screenshot", () => {
			const prefsScreenshot = screen.getByAltText(/Preferences Screenshot/)
			expect(prefsScreenshot).toBeInTheDocument()
			expect(prefsScreenshot).toHaveAttribute(
				"src",
				expect.stringContaining("pref")
			)
		})
	})

	describe("Navigation", () => {
		it("has a back to building link or breadcrumb", () => {
			const backLink = screen.getByRole("link", {
				name: /back|building|projects/i,
			})
			expect(backLink).toBeInTheDocument()
			expect(backLink).toHaveAttribute("href", "/building")
		})
	})

	describe("Orange Theme Consistency", () => {
		it("applies orange styling to the main download button", () => {
			const downloadButtons = screen.getAllByRole("link", {
				name: /download for macOS/i,
			})
			expect(downloadButtons[0]).toHaveClass("neon-button-orange")
		})

		it("uses orange color theme throughout the page", () => {
			// Check for orange accent elements
			const orangeElements = document.querySelectorAll('[class*="orange"]')
			expect(orangeElements.length).toBeGreaterThan(0)
		})
	})

	describe("SEO and Accessibility", () => {
		it("has proper heading hierarchy", () => {
			const h1 = screen.getByRole("heading", { level: 1 })
			const h2s = screen.getAllByRole("heading", { level: 2 })

			expect(h1).toBeInTheDocument()
			expect(h2s.length).toBeGreaterThan(0)
		})

		it("has descriptive alt text for all images", () => {
			const images = screen.getAllByRole("img")
			images.forEach((img) => {
				expect(img).toHaveAttribute("alt")
				expect(img.getAttribute("alt")).not.toBe("")
			})
		})

		it("has external links with proper security attributes", () => {
			const externalLinks = screen
				.getAllByRole("link")
				.filter((link) => link.getAttribute("href")?.startsWith("http"))

			externalLinks.forEach((link) => {
				expect(link).toHaveAttribute("target", "_blank")
				expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"))
			})
		})
	})

	describe("Responsive Design", () => {
		it("structures content for mobile and desktop", () => {
			// Check for responsive layout classes
			const responsiveElements = document.querySelectorAll(
				'[class*="md:"], [class*="sm:"], [class*="lg:"]'
			)
			expect(responsiveElements.length).toBeGreaterThan(0)
		})
	})
})
