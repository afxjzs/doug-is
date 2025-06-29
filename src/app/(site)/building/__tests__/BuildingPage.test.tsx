import { render, screen } from "@testing-library/react"
import BuildingPage from "../page"

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

describe("BuildingPage - Oil Price Ticker", () => {
	beforeEach(() => {
		render(<BuildingPage />)
	})

	it("displays Oil Price Ticker project in the projects section", () => {
		expect(screen.getByText("Oil Price Ticker")).toBeInTheDocument()
	})

	it("shows correct Oil Price Ticker description", () => {
		expect(
			screen.getByText(
				"A macOS menu bar app that displays live oil price updates with customizable preferences."
			)
		).toBeInTheDocument()
	})

	it("displays correct Oil Price Ticker tags", () => {
		expect(screen.getByText("macOS")).toBeInTheDocument()
		expect(screen.getByText("Swift")).toBeInTheDocument()
		expect(screen.getByText("Menu Bar")).toBeInTheDocument()
		expect(screen.getByText("Live Data")).toBeInTheDocument()
		expect(screen.getByText("Objective-C")).toBeInTheDocument()
	})

	it("has a project details link for Oil Price Ticker", () => {
		const allProjectDetailLinks = screen.getAllByRole("link", {
			name: /view project details/i,
		})
		const oilPriceLink = allProjectDetailLinks.find(
			(link) => link.getAttribute("href") === "/building/oil-price-ticker"
		)
		expect(oilPriceLink).toBeInTheDocument()
	})

	it("has a GitHub link for Oil Price Ticker", () => {
		const allGitHubLinks = screen.getAllByRole("link", {
			name: /github/i,
		})
		const oilPriceGitHubLink = allGitHubLinks.find(
			(link) =>
				link.getAttribute("href") ===
				"https://github.com/afxjzs/oil-price-ticker"
		)
		expect(oilPriceGitHubLink).toBeInTheDocument()
		expect(oilPriceGitHubLink).toHaveAttribute("target", "_blank")
		expect(oilPriceGitHubLink).toHaveAttribute("rel", "noopener noreferrer")
	})

	it("displays Oil Price Ticker image with correct alt text", () => {
		const oilPriceImage = screen.getByAltText("Oil Price Ticker")
		expect(oilPriceImage).toBeInTheDocument()
		expect(oilPriceImage).toHaveAttribute(
			"src",
			"/images/projects/oil-price-ticker/oil-price-icon.png"
		)
	})

	it("applies orange neon button styling to Oil Price Ticker project details button", () => {
		const allProjectDetailButtons = screen.getAllByRole("link", {
			name: /view project details/i,
		})
		const oilPriceProjectDetailButton = allProjectDetailButtons.find(
			(link) => link.getAttribute("href") === "/building/oil-price-ticker"
		)

		expect(oilPriceProjectDetailButton).toHaveClass("neon-button-orange")
	})

	it("positions Oil Price Ticker after Hopping List project", () => {
		const projectTitles = screen.getAllByRole("heading", { level: 2 })
		const projectNames = projectTitles.map((title) => title.textContent)

		const hoppingListIndex = projectNames.indexOf("Hopping List")
		const oilPriceIndex = projectNames.indexOf("Oil Price Ticker")

		expect(hoppingListIndex).toBeGreaterThan(-1)
		expect(oilPriceIndex).toBeGreaterThan(-1)
		expect(oilPriceIndex).toBeGreaterThan(hoppingListIndex)
	})

	it("maintains Inn Ruby Gem project with correct button", () => {
		expect(screen.getByText("Inn Ruby Gem")).toBeInTheDocument()

		// Check that Inn Ruby Gem still has its View Project Details button
		const innButtons = screen.getAllByRole("link", {
			name: /view project details/i,
		})
		expect(innButtons.length).toBeGreaterThanOrEqual(3) // hopping-list, oil-price-ticker, inn
	})

	it("does not include download button on building page", () => {
		// Download button should only be on the detail page, not on the building page
		const downloadButtons = screen.queryAllByRole("link", {
			name: /download for macOS/i,
		})
		expect(downloadButtons).toHaveLength(0)
	})
})
