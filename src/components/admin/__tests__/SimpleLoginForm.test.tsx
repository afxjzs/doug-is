/**
 * Simple Login Form Tests
 *
 * Basic tests for the SimpleLoginForm component to ensure
 * it works correctly and catches any login issues.
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import SimpleLoginForm from "../SimpleLoginForm"
import { useSimpleAuth } from "@/lib/auth/simple-auth-hook"

// Mock the simple auth hook
jest.mock("@/lib/auth/simple-auth-hook", () => ({
	useSimpleAuth: jest.fn(),
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
	const mockUseSimpleAuth = useSimpleAuth as jest.MockedFunction<
		typeof useSimpleAuth
	>

	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe("Initial State", () => {
		it("should render login form with correct fields", () => {
			mockUseSimpleAuth.mockReturnValue({
				user: null,
				loading: false,
				error: null,
				loginWithEmail: jest.fn(),
				sendMagicLink: jest.fn(),
				logout: jest.fn(),
				clearError: jest.fn(),
			})

			render(<SimpleLoginForm />)

			// Should have email and password fields
			expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
			expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

			// Should have submit button
			expect(screen.getByText("Sign in")).toBeInTheDocument()

			// Should have toggle button for magic link
			expect(
				screen.getByText("Sign in with a magic link instead")
			).toBeInTheDocument()
		})

		it("should show loading state when auth is loading", () => {
			mockUseSimpleAuth.mockReturnValue({
				user: null,
				loading: true,
				error: null,
				loginWithEmail: jest.fn(),
				sendMagicLink: jest.fn(),
				logout: jest.fn(),
				clearError: jest.fn(),
			})

			render(<SimpleLoginForm />)

			// Should show loading indicator
			expect(
				screen.getByText(/initializing authentication/i)
			).toBeInTheDocument()
		})

		it("should show error message when auth has error", () => {
			mockUseSimpleAuth.mockReturnValue({
				user: null,
				loading: false,
				error: "Invalid credentials",
				loginWithEmail: jest.fn(),
				sendMagicLink: jest.fn(),
				logout: jest.fn(),
				clearError: jest.fn(),
			})

			render(<SimpleLoginForm />)

			// Should show error message
			expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
		})
	})

	describe("Login Functionality", () => {
		it("should handle email/password login correctly", async () => {
			const mockLoginWithEmail = jest.fn().mockResolvedValue({ success: true })

			mockUseSimpleAuth.mockReturnValue({
				user: null,
				loading: false,
				error: null,
				loginWithEmail: mockLoginWithEmail,
				sendMagicLink: jest.fn(),
				logout: jest.fn(),
				clearError: jest.fn(),
			})

			render(<SimpleLoginForm />)

			// Fill in form
			fireEvent.change(screen.getByLabelText(/email/i), {
				target: { value: "test@example.com" },
			})
			fireEvent.change(screen.getByLabelText(/password/i), {
				target: { value: "password123" },
			})

			// Submit form
			fireEvent.click(screen.getByText("Sign in"))

			// Should call loginWithEmail with correct parameters
			await waitFor(() => {
				expect(mockLoginWithEmail).toHaveBeenCalledWith(
					"test@example.com",
					"password123"
				)
			})
		})
	})

	describe("Magic Link Functionality", () => {
		it("should toggle to magic link mode", () => {
			mockUseSimpleAuth.mockReturnValue({
				user: null,
				loading: false,
				error: null,
				loginWithEmail: jest.fn(),
				sendMagicLink: jest.fn(),
				logout: jest.fn(),
				clearError: jest.fn(),
			})

			render(<SimpleLoginForm />)

			// Click magic link toggle button
			fireEvent.click(screen.getByText("Sign in with a magic link instead"))

			// Should show magic link mode (password field should be hidden)
			expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument()

			// Should show different toggle button text
			expect(
				screen.getByText("Sign in with password instead")
			).toBeInTheDocument()
		})

		it("should handle magic link requests", async () => {
			const mockSendMagicLink = jest.fn().mockResolvedValue({ success: true })

			mockUseSimpleAuth.mockReturnValue({
				user: null,
				loading: false,
				error: null,
				loginWithEmail: jest.fn(),
				sendMagicLink: mockSendMagicLink,
				logout: jest.fn(),
				clearError: jest.fn(),
			})

			render(<SimpleLoginForm />)

			// Switch to magic link mode
			fireEvent.click(screen.getByText("Sign in with a magic link instead"))

			// Fill in email
			fireEvent.change(screen.getByLabelText(/email/i), {
				target: { value: "test@example.com" },
			})

			// Submit form
			fireEvent.click(screen.getByText("Sign in"))

			// Should call sendMagicLink with correct email
			await waitFor(() => {
				expect(mockSendMagicLink).toHaveBeenCalledWith("test@example.com")
			})
		})
	})

	describe("Success Scenarios", () => {
		it("should show success message for magic link", async () => {
			const mockSendMagicLink = jest.fn().mockResolvedValue({ success: true })

			mockUseSimpleAuth.mockReturnValue({
				user: null,
				loading: false,
				error: null,
				loginWithEmail: jest.fn(),
				sendMagicLink: mockSendMagicLink,
				logout: jest.fn(),
				clearError: jest.fn(),
			})

			render(<SimpleLoginForm />)

			// Switch to magic link mode
			fireEvent.click(screen.getByText("Sign in with a magic link instead"))

			// Fill in email
			fireEvent.change(screen.getByLabelText(/email/i), {
				target: { value: "test@example.com" },
			})

			// Submit form
			fireEvent.click(screen.getByText("Sign in"))

			// Should show success message
			await waitFor(() => {
				expect(
					screen.getByText(/check your email for a magic link/i)
				).toBeInTheDocument()
			})
		})
	})
})
