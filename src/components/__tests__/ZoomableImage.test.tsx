import { render, screen, fireEvent } from "@testing-library/react"
import ZoomableImage from "../ZoomableImage"

describe("ZoomableImage", () => {
	function setup() {
		render(<ZoomableImage src="/images/example.png" alt="Example screenshot" width={800} height={600} />)
		return screen.getByRole("button", { name: /view full size: example screenshot/i })
	}

	it("opens the image full size when clicked", () => {
		const trigger = setup()
		expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

		fireEvent.click(trigger)

		const dialog = screen.getByRole("dialog", { name: /example screenshot/i })
		const full = dialog.querySelector("img")
		expect(full).toHaveAttribute("src", "/images/example.png")
	})

	it("closes on Escape and returns focus to the image", () => {
		const trigger = setup()
		fireEvent.click(trigger)

		fireEvent.keyDown(document, { key: "Escape" })

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
		expect(trigger).toHaveFocus()
	})

	it("closes with the close button", () => {
		const trigger = setup()
		fireEvent.click(trigger)

		fireEvent.click(screen.getByRole("button", { name: /close/i }))

		expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
	})
})
