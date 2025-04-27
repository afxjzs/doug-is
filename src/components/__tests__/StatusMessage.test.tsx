import { render, screen } from "@testing-library/react"
import StatusMessage from "../StatusMessage"

describe("StatusMessage", () => {
	it("renders the message correctly", () => {
		render(<StatusMessage type="info" message="Test message" />)
		expect(screen.getByText("Test message")).toBeInTheDocument()
	})

	it("renders different status types with correct styles", () => {
		const { rerender } = render(
			<StatusMessage type="success" message="Success message" />
		)
		expect(
			screen.getByText("Success message").parentElement?.parentElement
		).toHaveClass("bg-[rgba(var(--color-emerald),0.05)]")

		rerender(<StatusMessage type="error" message="Error message" />)
		expect(
			screen.getByText("Error message").parentElement?.parentElement
		).toHaveClass("bg-[rgba(var(--color-magenta),0.05)]")
	})

	it("shows details when showDetails is true", () => {
		render(
			<StatusMessage
				type="info"
				message="Info message"
				details="Additional details"
				showDetails={true}
			/>
		)
		expect(screen.getByText("Additional details")).toBeInTheDocument()
	})

	it("hides details when showDetails is false", () => {
		render(
			<StatusMessage
				type="info"
				message="Info message"
				details="Additional details"
				showDetails={false}
			/>
		)
		expect(screen.queryByText("Additional details")).not.toBeInTheDocument()
	})

	it("renders loading animation for loading type", () => {
		render(<StatusMessage type="loading" message="Loading..." />)
		expect(
			screen
				.getByText("Loading...")
				.parentElement?.parentElement?.querySelector(".animate-pulse-slide")
		).toBeInTheDocument()
	})
})
