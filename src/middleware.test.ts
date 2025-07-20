import { NextRequest } from "next/server"
import { middleware } from "./middleware"
import { NextResponse } from "next/server"

// Mock Next.js server components
jest.mock("next/server", () => ({
	NextResponse: {
		next: jest.fn((config) => ({
			cookies: {
				set: jest.fn(),
			},
		})),
		redirect: jest.fn((url) => {
			// Handle both string URLs and URL objects
			const urlString = typeof url === "string" ? url : url.toString()
			return {
				url: urlString,
				status: 302,
				headers: new Headers(),
			}
		}),
	},
}))

// Mock Supabase SSR
jest.mock("@supabase/ssr", () => ({
	createServerClient: jest.fn(() => ({
		auth: {
			getUser: jest.fn(),
		},
	})),
}))

// Mock the unified auth constants
jest.mock("@/lib/auth/unified-auth", () => ({
	ADMIN_EMAILS: ["douglas.rogers@gmail.com"],
}))

describe("Middleware Security Tests", () => {
	let mockRequest: NextRequest
	let mockSupabaseClient: any

	beforeEach(() => {
		jest.clearAllMocks()

		// Create mock request
		mockRequest = {
			nextUrl: {
				pathname: "/admin",
				href: "http://localhost:3000/admin",
				origin: "http://localhost:3000",
			},
			cookies: {
				getAll: jest.fn(() => []),
				set: jest.fn(),
			},
			headers: new Headers(),
			url: "http://localhost:3000/admin",
		} as any

		// Mock Supabase client
		mockSupabaseClient = {
			auth: {
				getUser: jest.fn(),
			},
		}

		// Mock createServerClient to return our mock client
		const { createServerClient } = require("@supabase/ssr")
		createServerClient.mockReturnValue(mockSupabaseClient)
	})

	describe("Admin Route Protection", () => {
		it("redirects unauthenticated users to login for admin routes", async () => {
			// Mock unauthenticated user
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/admin/posts"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL))
			expect(NextResponse.redirect).toHaveBeenCalledWith(
				expect.objectContaining({
					href: expect.stringMatching(/.*\/admin\/login/),
				})
			)
		})

		it("allows authenticated admin users to access admin routes", async () => {
			// Mock authenticated admin user
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: { email: "douglas.rogers@gmail.com" } },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/admin/posts"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).not.toHaveBeenCalled()
		})

		it("redirects non-admin authenticated users to login", async () => {
			// Mock authenticated non-admin user
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: { email: "regular.user@gmail.com" } },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/admin/posts"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL))
			expect(NextResponse.redirect).toHaveBeenCalledWith(
				expect.objectContaining({
					href: expect.stringMatching(/.*\/admin\/login/),
				})
			)
		})

		it("redirects root admin page to login for unauthenticated users", async () => {
			// Mock unauthenticated user
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/admin"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL))
			expect(NextResponse.redirect).toHaveBeenCalledWith(
				expect.objectContaining({
					href: expect.stringMatching(/.*\/admin\/login/),
				})
			)
		})

		it("allows authenticated admin users to access root admin page", async () => {
			// Mock authenticated admin user
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: { email: "douglas.rogers@gmail.com" } },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/admin"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).not.toHaveBeenCalled()
		})
	})

	describe("Login Page Handling", () => {
		it("redirects authenticated admin users from login to dashboard", async () => {
			// Mock authenticated admin user
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: { email: "douglas.rogers@gmail.com" } },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/admin/login"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL))
			expect(NextResponse.redirect).toHaveBeenCalledWith(
				expect.objectContaining({
					href: expect.stringMatching(/.*\/admin/),
				})
			)
		})

		it("redirects authenticated non-admin users with error message", async () => {
			// Mock authenticated non-admin user
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: { email: "regular.user@gmail.com" } },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/admin/login"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL))
			expect(NextResponse.redirect).toHaveBeenCalledWith(
				expect.objectContaining({
					href: expect.stringMatching(/.*\/admin\/login\?error=/),
				})
			)
		})

		it("allows unauthenticated users to access login page", async () => {
			// Mock unauthenticated user
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/admin/login"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).not.toHaveBeenCalled()
		})
	})

	describe("Non-Admin Routes", () => {
		it("allows access to non-admin routes without authentication", async () => {
			// Mock unauthenticated user
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).not.toHaveBeenCalled()
		})

		it("allows authenticated users to access non-admin routes", async () => {
			// Mock authenticated user
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: { email: "any.user@gmail.com" } },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).not.toHaveBeenCalled()
		})
	})

	describe("Authentication Error Handling", () => {
		it("handles authentication errors gracefully", async () => {
			// Mock authentication error
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: { message: "Network error" },
			})

			mockRequest.nextUrl.pathname = "/admin/posts"

			const response = await middleware(mockRequest)

			// Should redirect to login when authentication fails
			expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL))
			expect(NextResponse.redirect).toHaveBeenCalledWith(
				expect.objectContaining({
					href: expect.stringMatching(/.*\/admin\/login/),
				})
			)
		})

		it("handles missing user email gracefully", async () => {
			// Mock user without email
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: {} },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/admin/posts"

			const response = await middleware(mockRequest)

			// Should redirect to login when user has no email
			expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL))
			expect(NextResponse.redirect).toHaveBeenCalledWith(
				expect.objectContaining({
					href: expect.stringMatching(/.*\/admin\/login/),
				})
			)
		})
	})

	describe("Admin Email Validation", () => {
		it("validates admin emails case-insensitively", async () => {
			// Mock authenticated admin user with uppercase email
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: { email: "DOUGLAS.ROGERS@GMAIL.COM" } },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/admin/posts"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).not.toHaveBeenCalled()
		})

		it("rejects non-admin emails", async () => {
			// Mock authenticated non-admin user
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: { email: "user@gmail.com" } },
				error: null,
			})

			mockRequest.nextUrl.pathname = "/admin/posts"

			const response = await middleware(mockRequest)

			expect(NextResponse.redirect).toHaveBeenCalledWith(expect.any(URL))
			expect(NextResponse.redirect).toHaveBeenCalledWith(
				expect.objectContaining({
					href: expect.stringMatching(/.*\/admin\/login/),
				})
			)
		})
	})
})
