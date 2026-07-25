import { render, screen } from "@testing-library/react"
import { mockMatchMedia } from "@/lib/test-utils"

jest.mock("@/lib/supabase/data", () => ({
	getPublishedPosts: jest.fn().mockResolvedValue([]),
}))

import Home from "@/app/page"

describe("Home with no published posts", () => {
	it("shows an empty state instead of a bare Writing grid", async () => {
		mockMatchMedia(true)
		const ui = await Home()
		render(ui)
		expect(screen.getByText("Writing")).toBeInTheDocument()
		expect(screen.getByText(/no posts right now/i)).toBeInTheDocument()
	})
})
