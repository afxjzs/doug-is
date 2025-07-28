/**
 * ADMIN DASHBOARD TESTS
 *
 * Tests the actual admin dashboard page data fetching functionality
 * to prevent regressions like supabase.from() not being a function
 */

import { render, screen, waitFor } from "@testing-library/react"
import AdminPage from "@/app/admin/page"

// Mock the auth functions
jest.mock("@/lib/auth/simple-auth-server", () => ({
	getCurrentUser: jest.fn(),
	isCurrentUserAdmin: jest.fn(),
}))

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
	redirect: jest.fn(),
}))

// Mock the service role client
jest.mock("@/lib/supabase/server", () => ({
	createServiceRoleClient: jest.fn(),
}))

import {
	getCurrentUser,
	isCurrentUserAdmin,
} from "@/lib/auth/simple-auth-server"
import { redirect } from "next/navigation"
import { createServiceRoleClient } from "@/lib/supabase/server"

const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<
	typeof getCurrentUser
>
const mockIsCurrentUserAdmin = isCurrentUserAdmin as jest.MockedFunction<
	typeof isCurrentUserAdmin
>
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>
const mockCreateServiceRoleClient =
	createServiceRoleClient as jest.MockedFunction<typeof createServiceRoleClient>

describe("Admin Dashboard Data Fetching", () => {
	const mockUser = {
		id: "test-user-id",
		email: "admin@test.com",
	}

	const mockPosts = [
		{
			id: "post-1",
			title: "Test Post 1",
			category: "building",
			published_at: "2024-01-01T00:00:00Z",
			content: "Test content",
		},
		{
			id: "post-2",
			title: "Test Draft",
			category: "thinking",
			published_at: null,
			content: "Draft content",
		},
	]

	const mockContactMessages = [
		{
			id: "msg-1",
			name: "John Doe",
			email: "john@test.com",
			message: "Test message",
			subject: "Test subject",
			created_at: "2024-01-01T00:00:00Z",
		},
	]

	beforeEach(() => {
		jest.clearAllMocks()

		// Setup default successful auth
		mockGetCurrentUser.mockResolvedValue(mockUser)
		mockIsCurrentUserAdmin.mockResolvedValue(true)
	})

	describe("Supabase Client Functionality", () => {
		it("should use createServiceRoleClient with working .from() method", async () => {
			const mockSupabaseClient = {
				from: jest.fn().mockImplementation((table: string) => ({
					select: jest.fn().mockReturnThis(),
					order: jest.fn().mockResolvedValue({
						data: table === "posts" ? mockPosts : mockContactMessages,
						error: null,
					}),
				})),
			}

			mockCreateServiceRoleClient.mockReturnValue(mockSupabaseClient as any)

			await AdminPage()

			// Verify the service role client was created
			expect(mockCreateServiceRoleClient).toHaveBeenCalledTimes(2) // Once for posts, once for contacts

			// Verify .from() method exists and works
			expect(mockSupabaseClient.from).toHaveBeenCalledWith("posts")
			expect(mockSupabaseClient.from).toHaveBeenCalledWith("contact_messages")
		})

		it("should handle posts data fetching correctly", async () => {
			const mockSupabaseClient = {
				from: jest.fn().mockImplementation((table: string) => ({
					select: jest.fn().mockReturnThis(),
					order: jest.fn().mockResolvedValue({
						data: table === "posts" ? mockPosts : [],
						error: null,
					}),
				})),
			}

			mockCreateServiceRoleClient.mockReturnValue(mockSupabaseClient as any)

			const result = await AdminPage()

			// Verify posts query structure
			const fromCall = mockSupabaseClient.from.mock.calls.find(
				(call) => call[0] === "posts"
			)
			expect(fromCall).toBeDefined()
		})

		it("should handle contact messages data fetching correctly", async () => {
			const mockSupabaseClient = {
				from: jest.fn().mockImplementation((table: string) => ({
					select: jest.fn().mockReturnThis(),
					order: jest.fn().mockResolvedValue({
						data: table === "contact_messages" ? mockContactMessages : [],
						error: null,
					}),
				})),
			}

			mockCreateServiceRoleClient.mockReturnValue(mockSupabaseClient as any)

			const result = await AdminPage()

			// Verify contact messages query structure
			const fromCall = mockSupabaseClient.from.mock.calls.find(
				(call) => call[0] === "contact_messages"
			)
			expect(fromCall).toBeDefined()
		})
	})

	describe("Error Handling", () => {
		it("should handle supabase client errors gracefully", async () => {
			const mockSupabaseClient = {
				from: jest.fn().mockImplementation(() => ({
					select: jest.fn().mockReturnThis(),
					order: jest.fn().mockResolvedValue({
						data: null,
						error: { message: "Database error" },
					}),
				})),
			}

			mockCreateServiceRoleClient.mockReturnValue(mockSupabaseClient as any)

			// Should not throw even with database errors
			const result = await AdminPage()
			expect(result).toBeDefined()
		})

		it("should handle missing .from() method (regression test)", async () => {
			// This simulates the bug where createServiceRoleClient returned an SSR client
			const brokenSupabaseClient = {
				// Missing .from() method intentionally to test error handling
			}

			mockCreateServiceRoleClient.mockReturnValue(brokenSupabaseClient as any)

			// Should handle the TypeError gracefully and not crash
			const result = await AdminPage()
			expect(result).toBeDefined()
		})
	})

	// NOTE: Authentication flow is now handled in AdminLayout component
	// These auth tests are covered in AdminLayout.integration.test.tsx
})
