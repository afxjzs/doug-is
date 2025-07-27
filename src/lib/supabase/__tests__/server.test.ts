/**
 * Tests for Supabase Server Client
 *
 * Tests the server client utility to ensure it follows proper Supabase SSR patterns.
 */

import { createServerClient } from "@supabase/ssr"
import { createClient } from "../server"

// Mock @supabase/ssr
jest.mock("@supabase/ssr", () => ({
	createServerClient: jest.fn(),
}))

// Mock next/headers
jest.mock("next/headers", () => ({
	cookies: jest.fn(() =>
		Promise.resolve({
			getAll: jest.fn(() => []),
			set: jest.fn(),
		})
	),
}))

describe("Supabase Server Client", () => {
	const mockCreateServerClient = createServerClient as jest.MockedFunction<
		typeof createServerClient
	>
	const mockSupabaseClient = {
		auth: {
			getUser: jest.fn(),
			getSession: jest.fn(),
			signInWithPassword: jest.fn(),
			signInWithOtp: jest.fn(),
			signOut: jest.fn(),
		},
		from: jest.fn(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
		mockCreateServerClient.mockReturnValue(mockSupabaseClient as any)
	})

	describe("createClient", () => {
		it("should create a server client with correct environment variables", async () => {
			// Arrange
			const expectedUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
			const expectedKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

			// Act
			const client = await createClient()

			// Assert
			expect(mockCreateServerClient).toHaveBeenCalledWith(
				expectedUrl,
				expectedKey,
				{
					cookies: expect.objectContaining({
						getAll: expect.any(Function),
						setAll: expect.any(Function),
					}),
				}
			)
			expect(client).toBe(mockSupabaseClient)
		})

		it("should handle cookie operations properly", async () => {
			// Act
			await createClient()

			// Assert
			expect(mockCreateServerClient).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(String),
				expect.objectContaining({
					cookies: {
						getAll: expect.any(Function),
						setAll: expect.any(Function),
					},
				})
			)
		})

		it("should create client with proper cookie handling", async () => {
			// Act
			const client = await createClient()

			// Assert
			expect(client).toBe(mockSupabaseClient)
			expect(mockCreateServerClient).toHaveBeenCalledWith(
				expect.any(String),
				expect.any(String),
				expect.objectContaining({
					cookies: expect.objectContaining({
						getAll: expect.any(Function),
						setAll: expect.any(Function),
					}),
				})
			)
		})
	})
})
