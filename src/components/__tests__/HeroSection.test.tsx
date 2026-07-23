import { render, screen } from "@testing-library/react"
import { mockMatchMedia } from "@/lib/test-utils"
import HeroSection from "../HeroSection"

describe("HeroSection", () => {
	it("renders identity (h1) before the terminal so mobile reads who-first", () => {
		mockMatchMedia(true)
		render(<HeroSection />)
		const h1 = screen.getByRole("heading", { level: 1 })
		const terminalTitle = screen.getByText("~/doug-rogers")
		expect(
			h1.compareDocumentPosition(terminalTitle) &
				Node.DOCUMENT_POSITION_FOLLOWING
		).toBeTruthy()
	})
})
