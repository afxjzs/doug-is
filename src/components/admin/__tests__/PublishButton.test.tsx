import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import PublishButton from "../PublishButton"

// Mock the publishPost server action
jest.mock("@/lib/actions/postActions", () => ({
	publishPost: jest.fn(),
}))

const mockPublishPost = require("@/lib/actions/postActions").publishPost

describe("PublishButton", () => {
	const defaultProps = {
		postId: "test-post-id",
		postTitle: "Test Post Title",
		redirectUrl: "/admin/posts",
	}

	beforeEach(() => {
		jest.clearAllMocks()
		// Mock window.confirm to return true by default
		window.confirm = jest.fn(() => true)
		// Mock window.alert
		window.alert = jest.fn()
		// Mock window.location.href
		Object.defineProperty(window, "location", {
			value: {
				href: "",
			},
			writable: true,
		})
	})

	it("renders publish button with correct styling", () => {
		render(<PublishButton {...defaultProps} />)

		const button = screen.getByRole("button", { name: /publish now/i })
		expect(button).toBeInTheDocument()
		expect(button).toHaveClass("text-[rgba(var(--color-green),1)]")
	})

	it("shows loading spinner when publishing", async () => {
		mockPublishPost.mockImplementation(
			() =>
				new Promise((resolve) =>
					setTimeout(() => resolve({ success: true }), 100)
				)
		)

		render(<PublishButton {...defaultProps} />)

		const button = screen.getByRole("button", { name: /publish now/i })
		fireEvent.click(button)

		// Should show loading spinner
		await waitFor(() => {
			expect(screen.getByRole("button")).toBeDisabled()
		})

		// Should have spinner class
		const spinner = screen.getByRole("button").querySelector("svg")
		expect(spinner).toHaveClass("animate-spin")
	})

	it("calls publishPost when clicked", async () => {
		mockPublishPost.mockResolvedValue({ success: true })

		render(<PublishButton {...defaultProps} />)

		const button = screen.getByRole("button", { name: /publish now/i })
		fireEvent.click(button)

		await waitFor(() => {
			expect(mockPublishPost).toHaveBeenCalledWith("test-post-id")
		})
	})

	it("shows confirmation dialog before publishing", async () => {
		mockPublishPost.mockResolvedValue({ success: true })

		render(<PublishButton {...defaultProps} />)

		const button = screen.getByRole("button", { name: /publish now/i })
		fireEvent.click(button)

		expect(window.confirm).toHaveBeenCalledWith(
			'Are you sure you want to publish "Test Post Title"?'
		)
	})

	it("does not publish if user cancels confirmation", async () => {
		;(window.confirm as jest.Mock).mockReturnValue(false)

		render(<PublishButton {...defaultProps} />)

		const button = screen.getByRole("button", { name: /publish now/i })
		fireEvent.click(button)

		expect(mockPublishPost).not.toHaveBeenCalled()
	})

	it("shows success alert and redirects when publish succeeds", async () => {
		mockPublishPost.mockResolvedValue({ success: true })

		render(<PublishButton {...defaultProps} />)

		const button = screen.getByRole("button", { name: /publish now/i })
		fireEvent.click(button)

		await waitFor(() => {
			expect(window.alert).toHaveBeenCalledWith(
				'Successfully published "Test Post Title"!'
			)
			expect(window.location.href).toBe("/admin/posts")
		})
	})

	it("shows error message when publish fails", async () => {
		mockPublishPost.mockResolvedValue({
			success: false,
			error: "Database error",
		})

		render(<PublishButton {...defaultProps} />)

		const button = screen.getByRole("button", { name: /publish now/i })
		fireEvent.click(button)

		await waitFor(() => {
			expect(screen.getByText("Database error")).toBeInTheDocument()
		})

		// Should not redirect on error
		expect(window.location.href).toBe("")
	})

	it("shows generic error when publish throws exception", async () => {
		mockPublishPost.mockRejectedValue(new Error("Network error"))

		render(<PublishButton {...defaultProps} />)

		const button = screen.getByRole("button", { name: /publish now/i })
		fireEvent.click(button)

		await waitFor(() => {
			expect(
				screen.getByText("An unexpected error occurred")
			).toBeInTheDocument()
		})

		// Wait for the async operation to complete and ensure no redirect
		await waitFor(
			() => {
				expect(window.location.href).toBe("")
			},
			{ timeout: 2000 }
		)
	})

	it("handles missing error message gracefully", async () => {
		mockPublishPost.mockResolvedValue({ success: false })

		render(<PublishButton {...defaultProps} />)

		const button = screen.getByRole("button", { name: /publish now/i })
		fireEvent.click(button)

		await waitFor(() => {
			expect(screen.getByText("Failed to publish post")).toBeInTheDocument()
		})
	})

	it("is disabled during publishing", async () => {
		mockPublishPost.mockImplementation(
			() =>
				new Promise((resolve) =>
					setTimeout(() => resolve({ success: true }), 100)
				)
		)

		render(<PublishButton {...defaultProps} />)

		const button = screen.getByRole("button", { name: /publish now/i })
		fireEvent.click(button)

		await waitFor(() => {
			expect(button).toBeDisabled()
		})

		// Should not be clickable while disabled
		fireEvent.click(button)
		expect(mockPublishPost).toHaveBeenCalledTimes(1) // Only called once
	})

	it("clears error message on new publish attempt", async () => {
		// First attempt fails
		mockPublishPost.mockResolvedValueOnce({
			success: false,
			error: "First error",
		})
		// Second attempt succeeds
		mockPublishPost.mockResolvedValueOnce({ success: true })

		render(<PublishButton {...defaultProps} />)

		const button = screen.getByRole("button", { name: /publish now/i })

		// First click - should show error
		fireEvent.click(button)
		await waitFor(() => {
			expect(screen.getByText("First error")).toBeInTheDocument()
		})

		// Second click - error should be cleared
		fireEvent.click(button)
		await waitFor(() => {
			expect(screen.queryByText("First error")).not.toBeInTheDocument()
		})
	})

	it("redirects to default URL when no redirectUrl is provided", async () => {
		mockPublishPost.mockResolvedValue({ success: true })

		render(<PublishButton postId="test-id" postTitle="Test Title" />)

		const button = screen.getByRole("button", { name: /publish now/i })
		fireEvent.click(button)

		await waitFor(() => {
			expect(window.location.href).toBe("/admin/posts")
		})
	})

	it("redirects to custom URL when redirectUrl is provided", async () => {
		mockPublishPost.mockResolvedValue({ success: true })

		render(
			<PublishButton
				postId="test-id"
				postTitle="Test Title"
				redirectUrl="/custom/url"
			/>
		)

		const button = screen.getByRole("button", { name: /publish now/i })
		fireEvent.click(button)

		await waitFor(() => {
			expect(window.location.href).toBe("/custom/url")
		})
	})
})
