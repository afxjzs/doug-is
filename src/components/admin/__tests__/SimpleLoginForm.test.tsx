/**
 * Simple Login Form Tests
 *
 * Basic tests for the SimpleLoginForm component to ensure
 * it works correctly and catches any login issues.
 *
 * Uses test credentials from .env.test for consistent testing.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import SimpleLoginForm from "../SimpleLoginForm"

// Load test environment variables
require("dotenv").config({ path: ".env.test" })

const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL || "test@testing.com"
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD || "Password!"

// Mock the Supabase client
jest.mock("@/lib/supabase/client", () => ({
	createClient: jest.fn(() => ({
		auth: {
			signInWithPassword: jest.fn(),
		},
	})),
}))

// Mock Next.js router
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		replace: jest.fn(),
		refresh: jest.fn(),
	})),
}))

describe("SimpleLoginForm", () => {
	const mockCreateClient = require("@/lib/supabase/client")
		.createClient as jest.Mock
	const mockSignInWithPassword = jest.fn()
	const mockRouter = {
		push: jest.fn(),
		replace: jest.fn(),
		refresh: jest.fn(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
		mockCreateClient.mockReturnValue({
			auth: {
				signInWithPassword: mockSignInWithPassword,
			},
		})
		require("next/navigation").useRouter.mockReturnValue(mockRouter)
	})

	describe("Initial State", () => {
		it("should render login form with correct fields", () => {
			render(<SimpleLoginForm />)

			// Should have email and password fields
			expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

			// Should have submit button
			expect(screen.getByText("Sign In")).toBeInTheDocument()
		})

		it("should show loading state during form submission", async () => {
			mockSignInWithPassword.mockImplementation(
				() =>
					new Promise((resolve) =>
						setTimeout(() => resolve({ error: null }), 100)
					)
			)

			render(<SimpleLoginForm />)

			// Fill in form with test credentials
			fireEvent.change(screen.getByLabelText(/email address/i), {
				target: { value: TEST_EMAIL },
			})
			fireEvent.change(screen.getByLabelText(/password/i), {
				target: { value: TEST_PASSWORD },
			})

			// Submit form
			fireEvent.click(screen.getByText("Sign In"))

			// Should show loading state
			await waitFor(() => {
				expect(screen.getByText("Signing in...")).toBeInTheDocument()
			})
		})

		it("should show error message when login fails", async () => {
			mockSignInWithPassword.mockResolvedValue({
				error: { message: "Invalid credentials" },
			})

			render(<SimpleLoginForm />)

			// Fill in form with test credentials but wrong password
			fireEvent.change(screen.getByLabelText(/email address/i), {
				target: { value: TEST_EMAIL },
			})
			fireEvent.change(screen.getByLabelText(/password/i), {
				target: { value: "wrongpassword" },
			})

			// Submit form
			fireEvent.click(screen.getByText("Sign In"))

			// Should show error message
			await waitFor(() => {
				expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
			})
		})
	})

	describe("Login Functionality", () => {
		it("should handle successful login correctly", async () => {
			mockSignInWithPassword.mockResolvedValue({
				error: null,
			})

			render(<SimpleLoginForm />)

			// Fill in form with test credentials
			fireEvent.change(screen.getByLabelText(/email address/i), {
				target: { value: TEST_EMAIL },
			})
			fireEvent.change(screen.getByLabelText(/password/i), {
				target: { value: TEST_PASSWORD },
			})

			// Submit form
			fireEvent.click(screen.getByText("Sign In"))

			// Should call signInWithPassword with correct parameters
			await waitFor(() => {
				expect(mockSignInWithPassword).toHaveBeenCalledWith({
					email: TEST_EMAIL,
					password: TEST_PASSWORD,
				})
			})

			// Should redirect to admin page
			await waitFor(() => {
				expect(mockRouter.push).toHaveBeenCalledWith("/admin")
				expect(mockRouter.refresh).toHaveBeenCalled()
			})
		})

		it("should handle unexpected errors gracefully", async () => {
			mockSignInWithPassword.mockRejectedValue(new Error("Network error"))

			render(<SimpleLoginForm />)

			// Fill in form with test credentials
			fireEvent.change(screen.getByLabelText(/email address/i), {
				target: { value: TEST_EMAIL },
			})
			fireEvent.change(screen.getByLabelText(/password/i), {
				target: { value: TEST_PASSWORD },
			})

			// Submit form
			fireEvent.click(screen.getByText("Sign In"))

			// Should show generic error message
			await waitFor(() => {
				expect(
					screen.getByText("An unexpected error occurred")
				).toBeInTheDocument()
			})
		})

		it("should validate login with correct test credentials", async () => {
			mockSignInWithPassword.mockResolvedValue({
				error: null,
			})

			render(<SimpleLoginForm />)

			// Test with the exact credentials from .env.test
			fireEvent.change(screen.getByLabelText(/email address/i), {
				target: { value: TEST_EMAIL },
			})
			fireEvent.change(screen.getByLabelText(/password/i), {
				target: { value: TEST_PASSWORD },
			})

			fireEvent.click(screen.getByText("Sign In"))

			await waitFor(() => {
				expect(mockSignInWithPassword).toHaveBeenCalledWith({
					email: TEST_EMAIL,
					password: TEST_PASSWORD,
				})
			})
		})
	})

	describe("Form Validation", () => {
		it("should require email and password fields", () => {
			render(<SimpleLoginForm />)

			const emailInput = screen.getByLabelText(/email address/i)
			const passwordInput = screen.getByLabelText(/password/i)

			expect(emailInput).toHaveAttribute("required")
			expect(passwordInput).toHaveAttribute("required")
		})

		it("should have correct input types", () => {
			render(<SimpleLoginForm />)

			const emailInput = screen.getByLabelText(/email address/i)
			const passwordInput = screen.getByLabelText(/password/i)

			expect(emailInput).toHaveAttribute("type", "email")
			expect(passwordInput).toHaveAttribute("type", "password")
		})

		it("should accept test credentials format", () => {
			render(<SimpleLoginForm />)

			const emailInput = screen.getByLabelText(/email address/i)
			const passwordInput = screen.getByLabelText(/password/i)

			// Verify test credentials are in expected format
			expect(TEST_EMAIL).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) // Valid email format
			expect(TEST_PASSWORD).toHaveLength(9) // Password! has 9 characters

			// Test filling with our test credentials
			fireEvent.change(emailInput, { target: { value: TEST_EMAIL } })
			fireEvent.change(passwordInput, { target: { value: TEST_PASSWORD } })

			expect(emailInput).toHaveValue(TEST_EMAIL)
			expect(passwordInput).toHaveValue(TEST_PASSWORD)
		})
	})
})
