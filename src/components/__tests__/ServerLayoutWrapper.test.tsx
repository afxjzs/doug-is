import { render, screen } from "@testing-library/react"
import "@/lib/test-utils"
import ServerLayoutWrapper from "../ServerLayoutWrapper"

jest.mock("@/lib/analytics", () => ({
	useClientEventTracking: () => ({
		trackSectionNavigation: jest.fn(),
		trackMobileMenuToggle: jest.fn(),
	}),
}))

describe("ServerLayoutWrapper", () => {
	it("renders a skip link targeting the main content region", () => {
		render(
			<ServerLayoutWrapper>
				<div>content</div>
			</ServerLayoutWrapper>
		)
		const skipLink = screen.getByRole("link", { name: "Skip to content" })
		expect(skipLink).toHaveAttribute("href", "#main-content")
		expect(screen.getByRole("main")).toHaveAttribute("id", "main-content")
	})
})
