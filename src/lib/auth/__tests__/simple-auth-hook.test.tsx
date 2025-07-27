/**
 * Simple Auth Hook Tests
 *
 * Tests for the new simple authentication hook to ensure it works correctly
 * and doesn't cause endless loops like the previous implementation.
 */

import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import { useSimpleAuth } from "../simple-auth-hook"
import { createBrowserClient } from "@supabase/ssr"

// Mock Supabase client
jest.mock("@supabase/ssr", () => ({
	createBrowserClient: jest.fn(),
}))

// Mock domain detection
jest.mock("@/lib/utils/domain-detection", () => ({
	getSiteUrl: jest.fn(() => "http://localhost:3000"),
}))

// Mock Next.js router
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(() => ({
		push: jest.fn(),
		replace: jest.fn(),
		refresh: jest.fn(),
	})),
}))

// Test component that uses the auth hook
function TestComponent() {
	const { user, loading, loginWithEmail, sendMagicLink, logout, error } =
		useSimpleAuth()

	return (
		<div>
			<div data-testid="user">{user?.email || "no-user"}</div>
			<div data-testid="loading">{loading ? "loading" : "not-loading"}</div>
			<div data-testid="error">{error || "no-error"}</div>
			<button
				data-testid="login"
				onClick={() => loginWithEmail("test@example.com", "password")}
			>
				Login
			</button>
			<button
				data-testid="magic-link"
				onClick={() => sendMagicLink("test@example.com")}
			>
				Magic Link
			</button>
			<button data-testid="logout" onClick={logout}>
				Logout
			</button>
		</div>
	)
}

describe("Simple Auth Hook", () => {
	let mockSupabaseClient: any
	let mockUnsubscribe: jest.Mock

	beforeEach(() => {
		// Reset mocks
		jest.clearAllMocks()

		// Create mock unsubscribe function
		mockUnsubscribe = jest.fn()

		// Create mock Supabase client
		mockSupabaseClient = {
			auth: {
				getUser: jest.fn(),
				getSession: jest.fn(),
				signInWithPassword: jest.fn(),
				signInWithOtp: jest.fn(),
				signOut: jest.fn(),
				onAuthStateChange: jest.fn(),
			},
		}

		// Mock the createBrowserClient function
		;(createBrowserClient as jest.Mock).mockReturnValue(mockSupabaseClient)

		// Mock onAuthStateChange to return a proper subscription object
		mockSupabaseClient.auth.onAuthStateChange.mockReturnValue({
			data: {
				subscription: {
					unsubscribe: mockUnsubscribe,
				},
			},
		})
	})

	describe("Initialization", () => {
		it("should initialize without causing endless loops", async () => {
			// Mock successful user fetch
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			})

			mockSupabaseClient.auth.getSession.mockResolvedValue({
				data: { session: null },
				error: null,
			})

			render(<TestComponent />)

			// Should show loading initially
			expect(screen.getByTestId("loading")).toHaveTextContent("loading")

			// Should resolve to not loading
			await waitFor(() => {
				expect(screen.getByTestId("loading")).toHaveTextContent("not-loading")
			})

			// Should show no user
			expect(screen.getByTestId("user")).toHaveTextContent("no-user")

			// Should show no error
			expect(screen.getByTestId("error")).toHaveTextContent("no-error")
		})

		it("should handle user authentication correctly", async () => {
			const mockUser = {
				id: "123",
				email: "test@example.com",
				user_metadata: {},
			}

			// Mock successful user fetch
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			})

			mockSupabaseClient.auth.getSession.mockResolvedValue({
				data: { session: { user: mockUser } },
				error: null,
			})

			render(<TestComponent />)

			// Should resolve to show user
			await waitFor(() => {
				expect(screen.getByTestId("user")).toHaveTextContent("test@example.com")
			})

			// Should not be loading
			expect(screen.getByTestId("loading")).toHaveTextContent("not-loading")
		})
	})

	describe("Login Functionality", () => {
		it("should handle login with email and password", async () => {
			const mockUser = {
				id: "123",
				email: "test@example.com",
				user_metadata: {},
			}

			// Mock successful login
			mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
				data: { user: mockUser, session: { user: mockUser } },
				error: null,
			})

			// Mock successful user fetch
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			})

			render(<TestComponent />)

			// Click login button
			fireEvent.click(screen.getByTestId("login"))

			// Should call signInWithPassword with correct parameters
			await waitFor(() => {
				expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith(
					{
						email: "test@example.com",
						password: "password",
					}
				)
			})
		})

		it("should handle login errors gracefully", async () => {
			// Mock login error
			mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
				data: { user: null, session: null },
				error: { message: "Invalid credentials" },
			})

			render(<TestComponent />)

			// Click login button
			fireEvent.click(screen.getByTestId("login"))

			// Should show error
			await waitFor(() => {
				expect(screen.getByTestId("error")).toHaveTextContent(
					"Invalid credentials"
				)
			})
		})
	})

	describe("Magic Link Functionality", () => {
		it("should handle magic link requests", async () => {
			// Mock successful magic link
			mockSupabaseClient.auth.signInWithOtp.mockResolvedValue({
				data: { user: null, session: null },
				error: null,
			})

			render(<TestComponent />)

			// Click magic link button
			fireEvent.click(screen.getByTestId("magic-link"))

			// Should call signInWithOtp with correct parameters
			await waitFor(() => {
				expect(mockSupabaseClient.auth.signInWithOtp).toHaveBeenCalledWith({
					email: "test@example.com",
					options: {
						emailRedirectTo: "http://localhost:3000/api/auth/callback",
					},
				})
			})
		})

		it("should handle magic link errors gracefully", async () => {
			// Mock magic link error
			mockSupabaseClient.auth.signInWithOtp.mockResolvedValue({
				data: { user: null, session: null },
				error: { message: "Email not found" },
			})

			render(<TestComponent />)

			// Click magic link button
			fireEvent.click(screen.getByTestId("magic-link"))

			// Should show error
			await waitFor(() => {
				expect(screen.getByTestId("error")).toHaveTextContent("Email not found")
			})
		})
	})

	describe("Logout Functionality", () => {
		it("should handle logout correctly", async () => {
			// Mock successful logout
			mockSupabaseClient.auth.signOut.mockResolvedValue({
				error: null,
			})

			render(<TestComponent />)

			// Click logout button
			fireEvent.click(screen.getByTestId("logout"))

			// Should call signOut
			await waitFor(() => {
				expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
			})
		})
	})

	describe("Error Handling", () => {
		it("should handle getUser errors gracefully", async () => {
			// Mock getUser error
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: { message: "Network error" },
			})

			mockSupabaseClient.auth.getSession.mockResolvedValue({
				data: { session: null },
				error: null,
			})

			render(<TestComponent />)

			// Should resolve to not loading
			await waitFor(() => {
				expect(screen.getByTestId("loading")).toHaveTextContent("not-loading")
			})

			// Should show no user
			expect(screen.getByTestId("user")).toHaveTextContent("no-user")
		})

		it("should handle getSession errors gracefully", async () => {
			// Mock getSession error
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			})

			mockSupabaseClient.auth.getSession.mockResolvedValue({
				data: { session: null },
				error: { message: "Session error" },
			})

			render(<TestComponent />)

			// Should resolve to not loading
			await waitFor(() => {
				expect(screen.getByTestId("loading")).toHaveTextContent("not-loading")
			})

			// Should show no user
			expect(screen.getByTestId("user")).toHaveTextContent("no-user")
		})
	})

	describe("No Endless Loops", () => {
		it("should not cause endless token refresh loops", async () => {
			// Mock successful user fetch
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			})

			mockSupabaseClient.auth.getSession.mockResolvedValue({
				data: { session: null },
				error: null,
			})

			render(<TestComponent />)

			// Wait for initial load
			await waitFor(() => {
				expect(screen.getByTestId("loading")).toHaveTextContent("not-loading")
			})

			// getUser should only be called once during initialization
			expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledTimes(1)

			// onAuthStateChange should only be called once during initialization
			expect(mockSupabaseClient.auth.onAuthStateChange).toHaveBeenCalledTimes(1)

			// getSession should not be called (simple auth hook doesn't use it)
			expect(mockSupabaseClient.auth.getSession).toHaveBeenCalledTimes(0)
		})

		it("should not make repeated API calls", async () => {
			// Mock successful user fetch
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			})

			mockSupabaseClient.auth.getSession.mockResolvedValue({
				data: { session: null },
				error: null,
			})

			render(<TestComponent />)

			// Wait for initial load
			await waitFor(() => {
				expect(screen.getByTestId("loading")).toHaveTextContent("not-loading")
			})

			// Wait a bit more to ensure no additional calls
			await new Promise((resolve) => setTimeout(resolve, 500))

			// getUser should only be called once during initialization
			expect(mockSupabaseClient.auth.getUser).toHaveBeenCalledTimes(1)

			// onAuthStateChange should only be called once
			expect(mockSupabaseClient.auth.onAuthStateChange).toHaveBeenCalledTimes(1)

			// getSession should not be called (simple auth hook doesn't use it)
			expect(mockSupabaseClient.auth.getSession).toHaveBeenCalledTimes(0)
		})
	})
})
