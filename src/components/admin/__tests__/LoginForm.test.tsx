import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import LoginForm from "../LoginForm"
import { useAuth } from "@/lib/auth/supabaseClientAuth"
import { useRouter } from "next/navigation"

// Mock the auth hook
jest.mock("@/lib/auth/supabaseClientAuth", () => ({
	useAuth: jest.fn(),
}))

// Mock next/navigation
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}))

describe("LoginForm", () => {
	const mockRouter = {
		push: jest.fn(),
	}

	const mockAuthHook = {
		loginWithEmail: jest.fn(),
		sendMagicLink: jest.fn(),
		loading: false,
		initialized: true,
		user: null,
		isAdmin: false,
		logout: jest.fn(),
	}

	beforeEach(() => {
		;(useRouter as jest.Mock).mockReturnValue(mockRouter)
		;(useAuth as jest.Mock).mockReturnValue(mockAuthHook)
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it("renders login form with password fields by default", () => {
		render(<LoginForm />)
		expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
		expect(
			screen.getByText(/sign in with a magic link instead/i)
		).toBeInTheDocument()
	})

	it("toggles between password and magic link auth", () => {
		render(<LoginForm />)

		// Initially shows password field
		expect(screen.getByLabelText(/password/i)).toBeInTheDocument()

		// Click to switch to magic link
		fireEvent.click(screen.getByText(/sign in with a magic link instead/i))

		// Password field should be gone
		expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument()
		expect(
			screen.getByText(/sign in with password instead/i)
		).toBeInTheDocument()
	})

	it("handles password login successfully", async () => {
		mockAuthHook.loginWithEmail.mockResolvedValue({ success: true })

		render(<LoginForm />)

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		})
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "password123" },
		})

		fireEvent.click(screen.getByText(/sign in$/i))

		await waitFor(() => {
			expect(mockAuthHook.loginWithEmail).toHaveBeenCalledWith(
				"test@example.com",
				"password123"
			)
			expect(mockRouter.push).toHaveBeenCalledWith("/admin")
		})
	})

	it("handles magic link request successfully", async () => {
		mockAuthHook.sendMagicLink.mockResolvedValue({ success: true })

		render(<LoginForm />)

		// Switch to magic link mode
		fireEvent.click(screen.getByText(/sign in with a magic link instead/i))

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		})

		fireEvent.click(screen.getByText(/sign in$/i))

		await waitFor(() => {
			expect(mockAuthHook.sendMagicLink).toHaveBeenCalledWith(
				"test@example.com"
			)
			expect(
				screen.getByText(/check your email for a magic link/i)
			).toBeInTheDocument()
		})
	})

	it("shows error message on failed login", async () => {
		mockAuthHook.loginWithEmail.mockResolvedValue({
			success: false,
			error: "Invalid credentials",
		})

		render(<LoginForm />)

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: "test@example.com" },
		})
		fireEvent.change(screen.getByLabelText(/password/i), {
			target: { value: "wrongpassword" },
		})

		fireEvent.click(screen.getByText(/sign in$/i))

		await waitFor(() => {
			expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
		})
	})

	it("redirects authenticated admin users", () => {
		const authenticatedMockAuthHook = {
			...mockAuthHook,
			user: { id: "123", email: "admin@example.com" },
			isAdmin: true,
		}
		;(useAuth as jest.Mock).mockReturnValue(authenticatedMockAuthHook)

		render(<LoginForm redirectTo="/admin/posts" />)

		expect(mockRouter.push).toHaveBeenCalledWith("/admin/posts")
	})

	it("logs out non-admin authenticated users", () => {
		const nonAdminMockAuthHook = {
			...mockAuthHook,
			user: { id: "123", email: "user@example.com" },
			isAdmin: false,
		}
		;(useAuth as jest.Mock).mockReturnValue(nonAdminMockAuthHook)

		render(<LoginForm />)

		expect(nonAdminMockAuthHook.logout).toHaveBeenCalled()
	})
})
