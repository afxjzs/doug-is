// Mock must be at the very top for Jest hoisting
const mockSubmitContactForm = jest.fn() as jest.MockedFunction<
	(data: any) => Promise<{ success: boolean; message: string; errors?: any[] }>
>

jest.mock("@/lib/actions/contactActions", () => ({
	submitContactForm: mockSubmitContactForm,
}))

import { render, screen, fireEvent, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { jest } from "@jest/globals"
import ContactForm from "@/components/ContactForm"

// Helper function to mock field validation errors
const mockFieldValidationErrors = (
	fieldErrors: Array<{ path: string[]; message: string }>
) => {
	mockSubmitContactForm.mockResolvedValueOnce({
		success: false,
		message: "Validation failed",
		errors: fieldErrors,
	})
}

describe("ContactForm Component - Clean Test Suite", () => {
	describe("Form Rendering and Initial State", () => {
		it("should render all form fields with correct labels and attributes", () => {
			render(<ContactForm />)

			// Check all form fields are present
			expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/subject/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/message/i)).toBeInTheDocument()

			// Check field attributes
			expect(screen.getByLabelText(/name/i)).toHaveAttribute("type", "text")
			expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email")
			expect(screen.getByLabelText(/name/i)).toHaveAttribute("required")
			expect(screen.getByLabelText(/email/i)).toHaveAttribute("required")
		})

		it("should render submit button with correct initial text", () => {
			render(<ContactForm />)

			const submitButton = screen.getByRole("button", { name: /send message/i })
			expect(submitButton).toBeInTheDocument()
			expect(submitButton).toHaveAttribute("type", "submit")
			expect(submitButton).not.toBeDisabled()
		})

		it("should initialize form fields with empty values", () => {
			render(<ContactForm />)

			expect(screen.getByLabelText(/name/i)).toHaveValue("")
			expect(screen.getByLabelText(/email/i)).toHaveValue("")
			expect(screen.getByLabelText(/subject/i)).toHaveValue("")
			expect(screen.getByLabelText(/message/i)).toHaveValue("")
		})

		it("should render subject as input field when no subjects prop provided", () => {
			render(<ContactForm />)

			const subjectField = screen.getByLabelText(/subject/i)
			expect(subjectField.tagName).toBe("INPUT")
		})

		it("should render subject as select dropdown when subjects prop provided", () => {
			const subjects = ["General Inquiry", "Technical Support", "Sales"]
			render(<ContactForm subjects={subjects} />)

			const subjectField = screen.getByLabelText(/subject/i)
			expect(subjectField.tagName).toBe("SELECT")

			subjects.forEach((subject) => {
				expect(screen.getByText(subject)).toBeInTheDocument()
			})
		})
	})

	describe("Form Field Interactions", () => {
		it("should update field values when user types", async () => {
			const user = userEvent.setup()
			render(<ContactForm />)

			const nameField = screen.getByLabelText(/name/i)
			const emailField = screen.getByLabelText(/email/i)
			const subjectField = screen.getByLabelText(/subject/i)
			const messageField = screen.getByLabelText(/message/i)

			// Type in each field
			await user.type(nameField, "John Doe")
			await user.type(emailField, "john@example.com")
			await user.type(subjectField, "Test Subject")
			await user.type(messageField, "Test message")

			// Verify values updated
			expect(nameField).toHaveValue("John Doe")
			expect(emailField).toHaveValue("john@example.com")
			expect(subjectField).toHaveValue("Test Subject")
			expect(messageField).toHaveValue("Test message")
		})

		it("should handle subject dropdown selection", async () => {
			const user = userEvent.setup()
			const subjects = ["General Inquiry", "Technical Support", "Sales"]
			render(<ContactForm subjects={subjects} />)

			const subjectField = screen.getByLabelText(/subject/i)

			// Select second option
			await user.selectOptions(subjectField, "Technical Support")
			expect(subjectField).toHaveValue("Technical Support")
		})

		it("should clear field values when reset", async () => {
			const user = userEvent.setup()
			render(<ContactForm />)

			const nameField = screen.getByLabelText(/name/i)
			const emailField = screen.getByLabelText(/email/i)

			// Type values then clear
			await user.type(nameField, "John Doe")
			await user.type(emailField, "john@example.com")

			await user.clear(nameField)
			await user.clear(emailField)

			expect(nameField).toHaveValue("")
			expect(emailField).toHaveValue("")
		})
	})

	describe("Form Structure and Accessibility", () => {
		it("should have proper label associations with form fields", () => {
			render(<ContactForm />)

			// Check label-input associations
			const nameField = screen.getByLabelText(/name/i)
			const emailField = screen.getByLabelText(/email/i)
			const subjectField = screen.getByLabelText(/subject/i)
			const messageField = screen.getByLabelText(/message/i)

			expect(nameField).toHaveAttribute("id", "name")
			expect(emailField).toHaveAttribute("id", "email")
			expect(subjectField).toHaveAttribute("id", "subject")
			expect(messageField).toHaveAttribute("id", "message")
		})

		it("should support keyboard navigation through form fields", async () => {
			const user = userEvent.setup()
			render(<ContactForm />)

			const nameField = screen.getByLabelText(/name/i)
			const emailField = screen.getByLabelText(/email/i)
			const subjectField = screen.getByLabelText(/subject/i)
			const messageField = screen.getByLabelText(/message/i)

			// Tab through fields
			await user.click(nameField)
			expect(nameField).toHaveFocus()

			await user.tab()
			expect(emailField).toHaveFocus()

			await user.tab()
			expect(subjectField).toHaveFocus()

			await user.tab()
			expect(messageField).toHaveFocus()
		})

		it("should have accessible form structure", () => {
			render(<ContactForm />)

			// Check form element exists
			const form = document.querySelector("form")
			expect(form).toBeInTheDocument()
			expect(form).toHaveClass("space-y-6")

			// Check required fields are marked
			expect(screen.getByLabelText(/name/i)).toBeRequired()
			expect(screen.getByLabelText(/email/i)).toBeRequired()
			expect(screen.getByLabelText(/subject/i)).toBeRequired()
			expect(screen.getByLabelText(/message/i)).toBeRequired()
		})

		it("should have proper button configuration", () => {
			render(<ContactForm />)

			const submitButton = screen.getByRole("button", { name: /send message/i })
			expect(submitButton).toHaveAttribute("type", "submit")
			expect(submitButton).toHaveClass("neon-button-magenta")
			expect(submitButton).not.toBeDisabled()
		})
	})

	describe("Form Validation Structure", () => {
		it("should validate required fields using HTML5 validation", () => {
			render(<ContactForm />)

			// All required fields should have 'required' attribute
			expect(screen.getByLabelText(/name/i)).toHaveAttribute("required")
			expect(screen.getByLabelText(/email/i)).toHaveAttribute("required")
			expect(screen.getByLabelText(/subject/i)).toHaveAttribute("required")
			expect(screen.getByLabelText(/message/i)).toHaveAttribute("required")
		})

		it("should use proper input types for validation", () => {
			render(<ContactForm />)

			// Email field should have email type for validation
			expect(screen.getByLabelText(/email/i)).toHaveAttribute("type", "email")
			expect(screen.getByLabelText(/name/i)).toHaveAttribute("type", "text")
		})

		it("should handle form element structure properly", () => {
			render(<ContactForm />)

			// Verify form structure without triggering submission
			const form = document.querySelector("form")
			const nameDiv = screen.getByLabelText(/name/i).closest("div")
			const emailDiv = screen.getByLabelText(/email/i).closest("div")

			expect(form).toContainElement(nameDiv)
			expect(form).toContainElement(emailDiv)
		})
	})

	describe("Props and Configuration", () => {
		it("should handle empty subjects array gracefully", () => {
			render(<ContactForm subjects={[]} />)

			// Should fallback to input field when subjects array is empty
			const subjectField = screen.getByLabelText(/subject/i)
			expect(subjectField.tagName).toBe("INPUT")
		})

		it("should handle subjects array with single item", () => {
			render(<ContactForm subjects={["General Inquiry"]} />)

			const subjectField = screen.getByLabelText(/subject/i)
			expect(subjectField.tagName).toBe("SELECT")
			expect(screen.getByText("General Inquiry")).toBeInTheDocument()
		})

		it("should initialize with first subject when provided", () => {
			const subjects = ["General Inquiry", "Technical Support"]
			render(<ContactForm subjects={subjects} />)

			const subjectField = screen.getByLabelText(/subject/i)
			expect(subjectField).toHaveValue("General Inquiry")
		})
	})

	describe("Edge Cases", () => {
		it("should handle rapid field interactions", async () => {
			const user = userEvent.setup()
			render(<ContactForm />)

			const nameField = screen.getByLabelText(/name/i)

			// Rapid typing and clearing
			await user.type(nameField, "Test")
			await user.clear(nameField)
			await user.type(nameField, "Final Value")

			expect(nameField).toHaveValue("Final Value")
		})

		it("should maintain field state during interactions", async () => {
			const user = userEvent.setup()
			render(<ContactForm />)

			// Fill multiple fields
			await user.type(screen.getByLabelText(/name/i), "John Doe")
			await user.type(screen.getByLabelText(/email/i), "john@example.com")

			// Focus different field
			await user.click(screen.getByLabelText(/message/i))

			// Previous fields should maintain values
			expect(screen.getByLabelText(/name/i)).toHaveValue("John Doe")
			expect(screen.getByLabelText(/email/i)).toHaveValue("john@example.com")
		})

		it("should handle special characters in input", async () => {
			const user = userEvent.setup()
			render(<ContactForm />)

			const nameField = screen.getByLabelText(/name/i)
			const specialName = "José María-O'Connor"

			await user.type(nameField, specialName)
			expect(nameField).toHaveValue(specialName)
		})
	})
})
