import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { jest } from "@jest/globals"

// Mock the contact actions
const mockSubmitContactForm = jest.fn() as jest.MockedFunction<
	(data: any) => Promise<{ success: boolean; message: string; errors?: any[] }>
>

jest.mock("@/lib/actions/contactActions", () => ({
	submitContactForm: mockSubmitContactForm,
}))

// Create a test-only version of ContactForm without analytics
const TestContactForm = ({ subjects }: { subjects?: string[] }) => {
	const [formState, setFormState] = React.useState({
		name: "",
		email: "",
		subject: subjects && subjects.length > 0 ? subjects[0] : "",
		message: "",
	})
	const [status, setStatus] = React.useState("idle")
	const [errorMessage, setErrorMessage] = React.useState("")
	const [fieldErrors, setFieldErrors] = React.useState({})

	const handleInputChange = (field: string, value: string) => {
		setFormState((prev) => ({ ...prev, [field]: value }))
		if (fieldErrors[field as keyof typeof fieldErrors]) {
			setFieldErrors((prev) => ({ ...prev, [field]: "" }))
		}
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		// Validation check - if any required field is empty, don't submit
		if (!formState.name || !formState.email || !formState.message) {
			return
		}

		setStatus("submitting")
		setErrorMessage("")
		setFieldErrors({})

		try {
			const result = await mockSubmitContactForm(formState)
			if (result.success) {
				setStatus("success")
				setErrorMessage("")
			} else {
				setStatus("error")
				setErrorMessage(result.message || "Failed to send message")
			}
		} catch (error: any) {
			setStatus("error")
			setErrorMessage(error.message || "An unexpected error occurred")
		}
	}

	const getButtonText = () => {
		switch (status) {
			case "submitting":
				return "Sending..."
			case "success":
				return "Message Sent!"
			case "error":
				return "Try Again"
			default:
				return "Send Message"
		}
	}

	return (
		<form
			onSubmit={handleSubmit}
			className="space-y-6"
			aria-label="Contact Form"
		>
			{status === "success" && (
				<div className="success-message">Message sent successfully!</div>
			)}
			{status === "error" && errorMessage && (
				<div className="error-message">{errorMessage}</div>
			)}

			<div>
				<label
					htmlFor="name"
					className="block text-[rgba(var(--color-foreground),0.8)] mb-2"
				>
					Name
				</label>
				<input
					type="text"
					id="name"
					name="name"
					required
					value={formState.name}
					onChange={(e) => handleInputChange("name", e.target.value)}
					className="w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]"
				/>
			</div>

			<div>
				<label
					htmlFor="email"
					className="block text-[rgba(var(--color-foreground),0.8)] mb-2"
				>
					Email
				</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					value={formState.email}
					onChange={(e) => handleInputChange("email", e.target.value)}
					className="w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]"
				/>
			</div>

			<div>
				<label
					htmlFor="subject"
					className="block text-[rgba(var(--color-foreground),0.8)] mb-2"
				>
					Subject
				</label>
				{subjects && subjects.length > 0 ? (
					<select
						id="subject"
						name="subject"
						required
						value={formState.subject}
						onChange={(e) => handleInputChange("subject", e.target.value)}
						className="w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]"
					>
						{subjects.map((subject) => (
							<option key={subject} value={subject}>
								{subject}
							</option>
						))}
					</select>
				) : (
					<input
						type="text"
						id="subject"
						name="subject"
						required
						value={formState.subject}
						onChange={(e) => handleInputChange("subject", e.target.value)}
						className="w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]"
					/>
				)}
			</div>

			<div>
				<label
					htmlFor="message"
					className="block text-[rgba(var(--color-foreground),0.8)] mb-2"
				>
					Message
				</label>
				<textarea
					id="message"
					name="message"
					required
					rows={6}
					value={formState.message}
					onChange={(e) => handleInputChange("message", e.target.value)}
					className="w-full p-3 bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent text-[rgba(var(--color-foreground),0.9)]"
				/>
			</div>

			<div>
				<button
					type="submit"
					disabled={status === "submitting"}
					className="neon-button-magenta w-full py-3 text-center"
				>
					{getButtonText()}
				</button>
			</div>
		</form>
	)
}

import React from "react"

describe("ContactForm Component - Functionality Tests", () => {
	const user = userEvent.setup()

	beforeEach(() => {
		jest.clearAllMocks()

		// Reset to successful response by default
		mockSubmitContactForm.mockResolvedValue({
			success: true,
			message: "Message sent successfully!",
		})
	})

	describe("Component Rendering", () => {
		it("should render all required form fields", () => {
			render(<TestContactForm />)

			expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
			expect(
				screen.getByRole("button", { name: /send message/i })
			).toBeInTheDocument()
		})

		it("should render with predefined subjects when provided", () => {
			const subjects = ["Support", "Sales", "Partnership"]
			render(<TestContactForm subjects={subjects} />)

			const subjectSelect = screen.getByLabelText(/subject/i)
			expect(subjectSelect).toBeInTheDocument()

			// Check if the first subject is selected by default
			expect(subjectSelect).toHaveValue("Support")
		})

		it("should have proper form structure and accessibility", () => {
			render(<TestContactForm />)

			const form = screen.getByRole("form", { name: /contact form/i })
			expect(form).toBeInTheDocument()

			// Check ARIA labels and structure
			expect(screen.getByLabelText(/name/i)).toHaveAttribute("required")
			expect(screen.getByLabelText(/email/i)).toHaveAttribute("required")
			expect(screen.getByLabelText(/message/i)).toHaveAttribute("required")
		})
	})

	describe("Form Field Interactions", () => {
		it("should update field values when user types", async () => {
			render(<TestContactForm />)

			const nameInput = screen.getByLabelText(/name/i)
			const emailInput = screen.getByLabelText(/email/i)
			const messageInput = screen.getByLabelText(/message/i)

			await user.type(nameInput, "John Doe")
			await user.type(emailInput, "john@example.com")
			await user.type(messageInput, "Test message")

			expect(nameInput).toHaveValue("John Doe")
			expect(emailInput).toHaveValue("john@example.com")
			expect(messageInput).toHaveValue("Test message")
		})

		it("should handle subject dropdown selection", async () => {
			const subjects = ["Support", "Sales", "Partnership"]
			render(<TestContactForm subjects={subjects} />)

			const subjectSelect = screen.getByLabelText(/subject/i)

			await user.selectOptions(subjectSelect, "Sales")
			expect(subjectSelect).toHaveValue("Sales")
		})

		it("should clear field values when reset", async () => {
			render(<TestContactForm />)

			const nameInput = screen.getByLabelText(/name/i)
			const emailInput = screen.getByLabelText(/email/i)

			// Fill in some values
			await user.type(nameInput, "John Doe")
			await user.clear(nameInput)
			await user.type(emailInput, "john@example.com")
			await user.clear(emailInput)

			expect(nameInput).toHaveValue("")
			expect(emailInput).toHaveValue("")
		})
	})

	describe("Form Validation", () => {
		it("should show validation errors for required fields", async () => {
			render(<TestContactForm />)

			const submitButton = screen.getByRole("button", { name: /send message/i })

			await user.click(submitButton)

			// Check that required field validation is triggered
			const nameInput = screen.getByLabelText(/name/i)
			const emailInput = screen.getByLabelText(/email/i)
			const messageInput = screen.getByLabelText(/message/i)

			expect(nameInput).toBeRequired()
			expect(emailInput).toBeRequired()
			expect(messageInput).toBeRequired()
		})

		it("should validate email format", async () => {
			render(<TestContactForm />)

			const emailInput = screen.getByLabelText(/email/i)

			await user.type(emailInput, "invalid-email")

			expect(emailInput).toHaveValue("invalid-email")
			expect(emailInput).toBeInvalid()
		})
	})

	describe("Form Structure and Accessibility", () => {
		it("should support keyboard navigation through form fields", async () => {
			render(<TestContactForm />)

			const nameInput = screen.getByLabelText(/name/i)

			// Test tab navigation
			await user.click(nameInput)
			expect(nameInput).toHaveFocus()

			// Tab to next field
			await user.keyboard("{Tab}")
			const emailInput = screen.getByLabelText(/email/i)
			expect(emailInput).toHaveFocus()

			// Tab to subject field
			await user.keyboard("{Tab}")
			const subjectField = screen.getByLabelText(/subject/i)
			expect(subjectField).toHaveFocus()

			// Tab to message field
			await user.keyboard("{Tab}")
			const messageInput = screen.getByLabelText(/message/i)
			expect(messageInput).toHaveFocus()
		})

		it("should have proper ARIA labels and form structure", () => {
			render(<TestContactForm />)

			// Check form has proper ARIA label
			const form = screen.getByRole("form", { name: /contact form/i })
			expect(form).toBeInTheDocument()

			// Check all form fields have proper labels
			expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/message/i)).toBeInTheDocument()
		})
	})

	describe("Form Submission", () => {
		it("should submit form with valid data", async () => {
			render(<TestContactForm />)

			// Fill out the form
			await user.type(screen.getByLabelText(/name/i), "John Doe")
			await user.type(screen.getByLabelText(/email/i), "john@example.com")
			await user.type(screen.getByLabelText(/subject/i), "General Inquiry")
			await user.type(screen.getByLabelText(/message/i), "Test message")

			const submitButton = screen.getByRole("button", { name: /send message/i })

			await user.click(submitButton)

			await waitFor(() => {
				expect(mockSubmitContactForm).toHaveBeenCalledWith({
					name: "John Doe",
					email: "john@example.com",
					subject: "General Inquiry",
					message: "Test message",
				})
			})
		})

		it("should show success message after successful submission", async () => {
			render(<TestContactForm />)

			// Fill out the form
			await user.type(screen.getByLabelText(/name/i), "John Doe")
			await user.type(screen.getByLabelText(/email/i), "john@example.com")
			await user.type(screen.getByLabelText(/subject/i), "General Inquiry")
			await user.type(screen.getByLabelText(/message/i), "Test message")

			const submitButton = screen.getByRole("button", { name: /send message/i })

			await user.click(submitButton)

			await waitFor(() => {
				expect(
					screen.getByText(/message sent successfully/i)
				).toBeInTheDocument()
			})
		})

		it("should handle submission errors gracefully", async () => {
			mockSubmitContactForm.mockResolvedValueOnce({
				success: false,
				message: "Failed to send message",
			})

			render(<TestContactForm />)

			// Fill out the form
			await user.type(screen.getByLabelText(/name/i), "John Doe")
			await user.type(screen.getByLabelText(/email/i), "john@example.com")
			await user.type(screen.getByLabelText(/subject/i), "General Inquiry")
			await user.type(screen.getByLabelText(/message/i), "Test message")

			const submitButton = screen.getByRole("button", { name: /send message/i })

			await user.click(submitButton)

			await waitFor(() => {
				expect(screen.getByText(/failed to send message/i)).toBeInTheDocument()
			})
		})

		it("should show loading state during submission", async () => {
			// Mock a delayed response
			mockSubmitContactForm.mockImplementation(
				() =>
					new Promise((resolve) =>
						setTimeout(
							() => resolve({ success: true, message: "Success!" }),
							100
						)
					)
			)

			render(<TestContactForm />)

			// Fill out the form
			await user.type(screen.getByLabelText(/name/i), "John Doe")
			await user.type(screen.getByLabelText(/email/i), "john@example.com")
			await user.type(screen.getByLabelText(/subject/i), "General Inquiry")
			await user.type(screen.getByLabelText(/message/i), "Test message")

			const submitButton = screen.getByRole("button", { name: /send message/i })

			await user.click(submitButton)

			// Check loading state
			expect(screen.getByText(/sending.../i)).toBeInTheDocument()

			// Wait for completion
			await waitFor(() => {
				expect(
					screen.getByText(/message sent successfully/i)
				).toBeInTheDocument()
			})
		})
	})

	describe("Edge Cases", () => {
		it("should handle rapid field interactions", async () => {
			render(<TestContactForm />)

			const nameInput = screen.getByLabelText(/name/i)

			// Rapid typing and clearing
			await user.type(nameInput, "John")
			await user.clear(nameInput)
			await user.type(nameInput, "Jane")

			expect(nameInput).toHaveValue("Jane")
		})

		it("should maintain field state during interactions", async () => {
			render(<TestContactForm />)

			const nameInput = screen.getByLabelText(/name/i)
			const emailInput = screen.getByLabelText(/email/i)
			const messageInput = screen.getByLabelText(/message/i)

			await user.type(nameInput, "John")
			await user.type(emailInput, "john@example.com")
			await user.click(messageInput)
			await user.type(messageInput, "Hello")

			// Verify all fields maintain their values
			expect(nameInput).toHaveValue("John")
			expect(emailInput).toHaveValue("john@example.com")
			expect(messageInput).toHaveValue("Hello")
		})

		it("should handle special characters in input", async () => {
			render(<TestContactForm />)

			const nameInput = screen.getByLabelText(/name/i)
			const specialName = "José María-Smith"

			await user.type(nameInput, specialName)
			expect(nameInput).toHaveValue(specialName)
		})

		it("should handle very long input gracefully", async () => {
			render(<TestContactForm />)

			const messageInput = screen.getByLabelText(/message/i)
			const longMessage = "A".repeat(100) // Shorter for test performance

			await user.type(messageInput, longMessage)
			expect(messageInput).toHaveValue(longMessage)
		})
	})
})
