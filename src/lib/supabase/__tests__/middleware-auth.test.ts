/**
 * Middleware Authentication Flow Tests
 *
 * CRITICAL: Tests for bulletproof auth flow that prevents endless login loops
 * Covers rate limiting, error handling, and admin access scenarios
 */

import { NextRequest, NextResponse } from "next/server"
import { updateSession } from "../middleware"

// Mock the Supabase client
jest.mock("@supabase/ssr", () => ({
	createServerClient: jest.fn(),
}))

// Mock console to avoid noise in tests
const consoleMock = {
	warn: jest.fn(),
	error: jest.fn(),
	log: jest.fn(),
}
global.console = consoleMock as any

describe("Middleware Authentication Flow", () => {
	let mockSupabase: any
	let mockRequest: NextRequest

	beforeEach(() => {
		jest.clearAllMocks()

		// Reset environment variables
		process.env.ADMIN_EMAILS = "admin@test.com,douglas.rogers@gmail.com"

		// Create mock Supabase client
		mockSupabase = {
			auth: {
				getUser: jest.fn(),
			},
		}

		// Mock createServerClient to return our mock
		const { createServerClient } = require("@supabase/ssr")
		createServerClient.mockReturnValue(mockSupabase)

		// Create mock request
		mockRequest = new NextRequest("https://example.com/admin", {
			method: "GET",
		})

		// Mock request.cookies
		Object.defineProperty(mockRequest, "cookies", {
			value: {
				getAll: jest.fn(() => []),
				set: jest.fn(),
			},
		})
	})

	describe("Auth Page Bypass", () => {
		it("should bypass auth for login pages", async () => {
			const loginRequest = new NextRequest("https://example.com/admin/login")
			const response = await updateSession(loginRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(mockSupabase.auth.getUser).not.toHaveBeenCalled()
		})

		it("should bypass auth for register pages", async () => {
			const registerRequest = new NextRequest(
				"https://example.com/admin/register"
			)
			const response = await updateSession(registerRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(mockSupabase.auth.getUser).not.toHaveBeenCalled()
		})

		it("should bypass auth for auth callback pages", async () => {
			const callbackRequest = new NextRequest(
				"https://example.com/auth/callback"
			)
			const response = await updateSession(callbackRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(mockSupabase.auth.getUser).not.toHaveBeenCalled()
		})
	})

	describe("Rate Limiting Scenarios", () => {
		it("should handle rate limiting errors gracefully without redirecting", async () => {
			mockSupabase.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: { message: "Too Many Requests", status: 429 },
			})

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toBeNull()
			expect(consoleMock.warn).toHaveBeenCalledWith(
				"Auth check failed in middleware:",
				"Too Many Requests"
			)
		})

		it("should handle rate limiting with different error message", async () => {
			mockSupabase.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: { message: "rate limit exceeded", status: 429 },
			})

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toBeNull()
		})

		it("should handle 429 status code errors", async () => {
			mockSupabase.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: { message: "Request failed with status 429", status: 429 },
			})

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toBeNull()
		})
	})

	describe("Authentication Success Scenarios", () => {
		it("should allow authenticated admin users", async () => {
			mockSupabase.auth.getUser.mockResolvedValue({
				data: {
					user: {
						id: "123",
						email: "admin@test.com",
						aud: "authenticated",
					},
				},
				error: null,
			})

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toBeNull()
		})

		it("should work with admin email from env vars", async () => {
			mockSupabase.auth.getUser.mockResolvedValue({
				data: {
					user: {
						id: "123",
						email: "douglas.rogers@gmail.com",
						aud: "authenticated",
					},
				},
				error: null,
			})

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toBeNull()
		})

		it("should handle case-insensitive email matching", async () => {
			mockSupabase.auth.getUser.mockResolvedValue({
				data: {
					user: {
						id: "123",
						email: "ADMIN@TEST.COM",
						aud: "authenticated",
					},
				},
				error: null,
			})

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toBeNull()
		})
	})

	describe("Authentication Failure Scenarios", () => {
		it("should redirect unauthenticated users to login", async () => {
			mockSupabase.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: { message: "No session found", status: 401 },
			})

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toContain("/admin/login")
			expect(response.headers.get("location")).toContain("error=auth_required")
		})

		it("should redirect non-admin users", async () => {
			mockSupabase.auth.getUser.mockResolvedValue({
				data: {
					user: {
						id: "123",
						email: "user@test.com",
						aud: "authenticated",
					},
				},
				error: null,
			})

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toContain("/admin/login")
			expect(response.headers.get("location")).toContain("error=admin_required")
		})

		it("should redirect when user exists but has no email", async () => {
			mockSupabase.auth.getUser.mockResolvedValue({
				data: {
					user: {
						id: "123",
						email: null,
						aud: "authenticated",
					},
				},
				error: null,
			})

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toContain("/admin/login")
			expect(response.headers.get("location")).toContain("error=admin_required")
		})
	})

	describe("Error Handling", () => {
		it("should handle unexpected errors gracefully", async () => {
			mockSupabase.auth.getUser.mockRejectedValue(new Error("Network error"))

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toContain("/admin/login")
			expect(response.headers.get("location")).toContain("error=auth_error")
			expect(consoleMock.error).toHaveBeenCalledWith(
				"Unexpected error in middleware auth check:",
				expect.any(Error)
			)
		})

		it("should handle null response from auth service", async () => {
			mockSupabase.auth.getUser.mockResolvedValue(null)

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toContain("/admin/login")
		})
	})

	describe("Non-Admin Routes", () => {
		it("should allow any user on non-admin routes", async () => {
			const publicRequest = new NextRequest("https://example.com/", {
				method: "GET",
			})
			Object.defineProperty(publicRequest, "cookies", {
				value: {
					getAll: jest.fn(() => []),
					set: jest.fn(),
				},
			})

			mockSupabase.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: { message: "No session", status: 401 },
			})

			const response = await updateSession(publicRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toBeNull()
		})

		it("should handle auth errors on public routes without redirecting", async () => {
			const publicRequest = new NextRequest("https://example.com/thinking", {
				method: "GET",
			})
			Object.defineProperty(publicRequest, "cookies", {
				value: {
					getAll: jest.fn(() => []),
					set: jest.fn(),
				},
			})

			mockSupabase.auth.getUser.mockRejectedValue(
				new Error("Auth service down")
			)

			const response = await updateSession(publicRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toBeNull()
		})
	})

	describe("Environment Variable Handling", () => {
		it("should use fallback admin emails when env var not set", async () => {
			delete process.env.ADMIN_EMAILS

			mockSupabase.auth.getUser.mockResolvedValue({
				data: {
					user: {
						id: "123",
						email: "douglas.rogers@gmail.com",
						aud: "authenticated",
					},
				},
				error: null,
			})

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toBeNull()
		})

		it("should handle empty admin emails env var", async () => {
			process.env.ADMIN_EMAILS = ""

			mockSupabase.auth.getUser.mockResolvedValue({
				data: {
					user: {
						id: "123",
						email: "test@testing.com",
						aud: "authenticated",
					},
				},
				error: null,
			})

			const response = await updateSession(mockRequest)

			expect(response).toBeInstanceOf(NextResponse)
			expect(response.headers.get("location")).toBeNull()
		})
	})
})
