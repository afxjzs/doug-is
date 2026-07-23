import { render, screen } from "@testing-library/react"
import "@/lib/test-utils"
import Header from "../Header"

jest.mock("@/lib/analytics", () => ({
	useClientEventTracking: () => ({
		trackSectionNavigation: jest.fn(),
		trackMobileMenuToggle: jest.fn(),
	}),
}))

describe("Header", () => {
	it("offers Get in Touch in both the desktop header and the mobile drawer", () => {
		render(<Header />)
		const ctas = screen.getAllByRole("link", { name: "Get in Touch" })
		expect(ctas).toHaveLength(2)
		for (const cta of ctas) {
			expect(cta).toHaveAttribute("href", "/connecting")
		}
	})

	it("labels the writing nav item with the matching /writing URL", () => {
		render(<Header />)
		const writingLinks = screen.getAllByRole("link", { name: "/writing" })
		expect(writingLinks.length).toBeGreaterThan(0)
		for (const link of writingLinks) {
			expect(link).toHaveAttribute("href", "/writing")
		}
	})
})
