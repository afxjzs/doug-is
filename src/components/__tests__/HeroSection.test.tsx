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

	it("headlines the domain sentence with every rotating verb present", () => {
		mockMatchMedia(true)
		render(<HeroSection />)
		const h1 = screen.getByRole("heading", { level: 1 })
		expect(h1.textContent).toContain("doug.is")
		for (const word of ["building.", "advising.", "investing.", "writing."]) {
			expect(h1.textContent).toContain(word)
		}
	})

	it("gives the h1 a stable accessible name instead of the rotating text", () => {
		mockMatchMedia(true)
		render(<HeroSection />)
		const h1 = screen.getByRole("heading", { level: 1 })
		expect(h1.getAttribute("aria-label")).toContain("doug.is")
	})
})
