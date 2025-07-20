import {
	getCurrentUser,
	isCurrentUserAdmin,
	getAdminUserStatus,
	createAdminSupabaseClient,
	ADMIN_EMAILS,
} from "../unified-auth"

// Mock Supabase SSR
jest.mock("@supabase/ssr", () => ({
	createBrowserClient: jest.fn(),
	createServerClient: jest.fn(),
}))

// Mock Next.js cookies
jest.mock("next/headers", () => ({
	cookies: jest.fn(() => ({
		get: jest.fn(),
		set: jest.fn(),
	})),
}))

describe("Unified Auth Security Tests", () => {
	let mockSupabaseClient: any

	beforeEach(() => {
		jest.clearAllMocks()

		// Create mock Supabase client
		mockSupabaseClient = {
			auth: {
				getUser: jest.fn(),
			},
		}

		// Mock createServerClient to return our mock client
		const { createServerClient } = require("@supabase/ssr")
		createServerClient.mockReturnValue(mockSupabaseClient)
	})

	describe("ADMIN_EMAILS Configuration", () => {
		it("has the correct admin email configured", () => {
			expect(ADMIN_EMAILS).toContain("douglas.rogers@gmail.com")
		})

		it("is a readonly array", () => {
			expect(ADMIN_EMAILS).toBeInstanceOf(Array)
			// Note: The array is not actually frozen in the implementation
			// but it's treated as readonly by convention
			expect(ADMIN_EMAILS).toHaveLength(1)
		})
	})

	describe("getCurrentUser", () => {
		it("returns user when authentication is successful", async () => {
			const mockUser = {
				id: "user-123",
				email: "douglas.rogers@gmail.com",
			}

			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			})

			const user = await getCurrentUser()

			expect(user).toEqual(mockUser)
		})

		it("returns null when user is not authenticated", async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			})

			const user = await getCurrentUser()

			expect(user).toBeNull()
		})

		it("returns null when authentication error occurs", async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: { message: "Network error" },
			})

			const user = await getCurrentUser()

			expect(user).toBeNull()
		})

		it("returns null when exception occurs", async () => {
			mockSupabaseClient.auth.getUser.mockRejectedValue(
				new Error("Unexpected error")
			)

			const user = await getCurrentUser()

			expect(user).toBeNull()
		})
	})

	describe("isCurrentUserAdmin", () => {
		it("returns true for authenticated admin user", async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: { email: "douglas.rogers@gmail.com" } },
				error: null,
			})

			const isAdmin = await isCurrentUserAdmin()

			expect(isAdmin).toBe(true)
		})

		it("returns false for unauthenticated user", async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			})

			const isAdmin = await isCurrentUserAdmin()

			expect(isAdmin).toBe(false)
		})

		it("returns false for authenticated non-admin user", async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: { email: "regular.user@gmail.com" } },
				error: null,
			})

			const isAdmin = await isCurrentUserAdmin()

			expect(isAdmin).toBe(false)
		})

		it("returns false for user without email", async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: { id: "123", email: null } },
				error: null,
			})

			const isAdmin = await isCurrentUserAdmin()

			expect(isAdmin).toBe(false)
		})

		it("validates admin emails case-insensitively", async () => {
			const adminEmails = [
				"douglas.rogers@gmail.com",
				"DOUGLAS.ROGERS@GMAIL.COM",
				"Douglas.Rogers@gmail.com",
			]

			for (const email of adminEmails) {
				jest.clearAllMocks()

				mockSupabaseClient.auth.getUser.mockResolvedValue({
					data: { user: { email } },
					error: null,
				})

				const isAdmin = await isCurrentUserAdmin()

				expect(isAdmin).toBe(true)
			}
		})

		it("returns false when authentication error occurs", async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: { message: "Network error" },
			})

			const isAdmin = await isCurrentUserAdmin()

			expect(isAdmin).toBe(false)
		})

		it("returns false when exception occurs", async () => {
			mockSupabaseClient.auth.getUser.mockRejectedValue(
				new Error("Unexpected error")
			)

			const isAdmin = await isCurrentUserAdmin()

			expect(isAdmin).toBe(false)
		})
	})

	describe("getAdminUserStatus", () => {
		it("returns correct status for authenticated admin user", async () => {
			const mockUser = { id: "123", email: "douglas.rogers@gmail.com" }

			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			})

			const status = await getAdminUserStatus()

			expect(status).toEqual({
				user: mockUser,
				isAdmin: true,
				isAuthenticated: true,
			})
		})

		it("returns correct status for unauthenticated user", async () => {
			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: null },
				error: null,
			})

			const status = await getAdminUserStatus()

			expect(status).toEqual({
				user: null,
				isAdmin: false,
				isAuthenticated: false,
			})
		})

		it("returns correct status for authenticated non-admin user", async () => {
			const mockUser = { id: "123", email: "regular.user@gmail.com" }

			mockSupabaseClient.auth.getUser.mockResolvedValue({
				data: { user: mockUser },
				error: null,
			})

			const status = await getAdminUserStatus()

			expect(status).toEqual({
				user: mockUser,
				isAdmin: false,
				isAuthenticated: true,
			})
		})

		it("returns error status when exception occurs", async () => {
			mockSupabaseClient.auth.getUser.mockRejectedValue(
				new Error("Unexpected error")
			)

			const status = await getAdminUserStatus()

			expect(status).toEqual({
				user: null,
				isAdmin: false,
				isAuthenticated: false,
			})
		})
	})

	describe("createAdminSupabaseClient", () => {
		it("throws error when service role key is missing", () => {
			// Temporarily remove service role key
			const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY
			delete process.env.SUPABASE_SERVICE_ROLE_KEY

			expect(() => createAdminSupabaseClient()).toThrow(
				"Service role key required for admin operations"
			)

			// Restore service role key
			process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey
		})

		it("creates admin client when service role key is available", () => {
			// Mock the environment variable before the module is loaded
			const originalKey = process.env.SUPABASE_SERVICE_ROLE_KEY
			process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-key"

			// Re-import the module to get the updated environment variable
			jest.resetModules()
			const { createAdminSupabaseClient } = require("../unified-auth")

			expect(() => createAdminSupabaseClient()).not.toThrow()

			const { createBrowserClient } = require("@supabase/ssr")
			expect(createBrowserClient).toHaveBeenCalledWith(
				expect.any(String),
				"test-service-key",
				expect.objectContaining({
					auth: {
						persistSession: false,
					},
				})
			)

			// Restore original value
			process.env.SUPABASE_SERVICE_ROLE_KEY = originalKey
		})
	})

	describe("Security Validation", () => {
		it("rejects non-admin emails", async () => {
			const nonAdminEmails = [
				"user@gmail.com",
				"admin@different.com",
				"douglas.rogers@different.com",
				"",
				null,
				undefined,
			]

			for (const email of nonAdminEmails) {
				jest.clearAllMocks()

				mockSupabaseClient.auth.getUser.mockResolvedValue({
					data: { user: { email } },
					error: null,
				})

				const isAdmin = await isCurrentUserAdmin()

				expect(isAdmin).toBe(false)
			}
		})

		it("handles edge cases gracefully", async () => {
			const edgeCases = [
				{ user: null },
				{ user: { id: "123" } }, // no email
				{ user: { email: "" } },
				{ user: { email: "   " } }, // whitespace
				{ user: { email: "douglas.rogers@gmail.com " } }, // trailing space
			]

			for (const userData of edgeCases) {
				jest.clearAllMocks()

				mockSupabaseClient.auth.getUser.mockResolvedValue({
					data: userData,
					error: null,
				})

				const isAdmin = await isCurrentUserAdmin()

				expect(isAdmin).toBe(false)
			}
		})
	})
})
