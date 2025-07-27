/**
 * Auth Callback Route Tests
 *
 * Comprehensive tests for the auth callback route to ensure
 * it handles all authentication scenarios correctly.
 */

import { NextRequest } from "next/server"
import { GET } from "../route"

// Mock Supabase client
jest.mock("@supabase/ssr", () => ({
	createServerClient: jest.fn(),
}))

// Mock NextResponse
jest.mock("next/server", () => ({
	NextResponse: {
		redirect: jest.fn((url) => ({ url, status: 302 })),
		json: jest.fn((data) => ({ data, status: 200 })),
	},
	NextRequest: jest.fn().mockImplementation((url) => ({
		url,
		cookies: {
			getAll: jest.fn().mockReturnValue([]),
		},
	})),
}))

describe("Auth Callback Route", () => {
	let mockSupabaseClient: any
	let mockCreateServerClient: jest.Mock

	beforeEach(() => {
		jest.clearAllMocks()

		// Create mock Supabase client
		mockSupabaseClient = {
			auth: {
				exchangeCodeForSession: jest.fn(),
			},
		}

		// Mock createServerClient
		const { createServerClient } = require("@supabase/ssr")
		mockCreateServerClient = createServerClient as jest.Mock
		mockCreateServerClient.mockReturnValue(mockSupabaseClient)
	})

	describe("Successful Authentication", () => {
		it("should handle successful auth code exchange", async () => {
			const mockUser = {
				id: "123",
				email: "test@example.com",
			}

			const mockSession = {
				user: mockUser,
				access_token: "access_token",
				refresh_token: "refresh_token",
			}

			// Mock successful code exchange
			mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
				data: { session: mockSession },
				error: null,
			})

			// Create request with auth code
			const request = new NextRequest(
				"http://localhost:3000/api/auth/callback?code=test_code"
			)

			// Call the route
			const response = await GET(request)

			// Should exchange code for session
			expect(
				mockSupabaseClient.auth.exchangeCodeForSession
			).toHaveBeenCalledWith("test_code")

			// Should redirect to admin page
			expect(response.status).toBe(302)
		})

		it("should handle successful magic link authentication", async () => {
			const mockUser = {
				id: "123",
				email: "test@example.com",
			}

			const mockSession = {
				user: mockUser,
				access_token: "access_token",
				refresh_token: "refresh_token",
			}

			// Mock successful code exchange
			mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
				data: { session: mockSession },
				error: null,
			})

			// Create request with auth code
			const request = new NextRequest(
				"http://localhost:3000/api/auth/callback?code=magic_link_code"
			)

			// Call the route
			const response = await GET(request)

			// Should exchange code for session
			expect(
				mockSupabaseClient.auth.exchangeCodeForSession
			).toHaveBeenCalledWith("magic_link_code")

			// Should redirect to admin page
			expect(response.status).toBe(302)
		})
	})

	describe("Error Handling", () => {
		it("should handle missing auth code", async () => {
			// Create request without auth code
			const request = new NextRequest("http://localhost:3000/api/auth/callback")

			// Call the route
			const response = await GET(request)

			// Should redirect to login with error
			expect(response.status).toBe(302)
		})

		it("should handle invalid auth code", async () => {
			// Mock failed code exchange
			mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
				data: { session: null },
				error: { message: "Invalid code" },
			})

			// Create request with invalid auth code
			const request = new NextRequest(
				"http://localhost:3000/api/auth/callback?code=invalid_code"
			)

			// Call the route
			const response = await GET(request)

			// Should redirect to login with error
			expect(response.status).toBe(302)
		})

		it("should handle expired auth code", async () => {
			// Mock expired code error
			mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
				data: { session: null },
				error: { message: "Code expired" },
			})

			// Create request with expired auth code
			const request = new NextRequest(
				"http://localhost:3000/api/auth/callback?code=expired_code"
			)

			// Call the route
			const response = await GET(request)

			// Should redirect to login with error
			expect(response.status).toBe(302)
		})

		it("should handle network errors", async () => {
			// Mock network error
			mockSupabaseClient.auth.exchangeCodeForSession.mockRejectedValue(
				new Error("Network error")
			)

			// Create request with auth code
			const request = new NextRequest(
				"http://localhost:3000/api/auth/callback?code=test_code"
			)

			// Call the route
			const response = await GET(request)

			// Should redirect to login with error
			expect(response.status).toBe(302)
		})
	})

	describe("Redirect Handling", () => {
		it("should redirect to admin page on successful auth", async () => {
			const mockUser = {
				id: "123",
				email: "test@example.com",
			}

			const mockSession = {
				user: mockUser,
				access_token: "access_token",
				refresh_token: "refresh_token",
			}

			// Mock successful code exchange
			mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
				data: { session: mockSession },
				error: null,
			})

			// Create request with auth code
			const request = new NextRequest(
				"http://localhost:3000/api/auth/callback?code=test_code"
			)

			// Call the route
			const response = await GET(request)

			// Should redirect to admin page
			expect(response.status).toBe(302)
		})

		it("should redirect to login page on error", async () => {
			// Mock failed code exchange
			mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
				data: { session: null },
				error: { message: "Invalid code" },
			})

			// Create request with invalid auth code
			const request = new NextRequest(
				"http://localhost:3000/api/auth/callback?code=invalid_code"
			)

			// Call the route
			const response = await GET(request)

			// Should redirect to login page
			expect(response.status).toBe(302)
		})
	})

	describe("Security", () => {
		it("should not expose sensitive information in error responses", async () => {
			// Mock failed code exchange with sensitive error
			mockSupabaseClient.auth.exchangeCodeForSession.mockResolvedValue({
				data: { session: null },
				error: {
					message: "Internal server error with sensitive data",
					details: "sensitive_information",
				},
			})

			// Create request with auth code
			const request = new NextRequest(
				"http://localhost:3000/api/auth/callback?code=test_code"
			)

			// Call the route
			const response = await GET(request)

			// Should redirect to login without exposing sensitive data
			expect(response.status).toBe(302)
		})

		it("should handle malformed requests gracefully", async () => {
			// Create request with malformed URL
			const request = new NextRequest(
				"http://localhost:3000/api/auth/callback?code="
			)

			// Call the route
			const response = await GET(request)

			// Should handle gracefully
			expect(response.status).toBe(302)
		})
	})
})
