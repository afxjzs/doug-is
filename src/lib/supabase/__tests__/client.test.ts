/**
 * Tests for Supabase Browser Client
 *
 * Tests the browser client utility to ensure it follows proper Supabase SSR patterns.
 */

import { createBrowserClient } from "@supabase/ssr"
import { createClient } from "../client"

// Mock @supabase/ssr
jest.mock("@supabase/ssr", () => ({
	createBrowserClient: jest.fn(),
}))

describe("Supabase Browser Client", () => {
	const mockCreateBrowserClient = createBrowserClient as jest.MockedFunction<
		typeof createBrowserClient
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
		mockCreateBrowserClient.mockReturnValue(mockSupabaseClient as any)

		// Reset the singleton instance
		const { createClient } = require("../client")
		// Clear the module cache to reset the singleton
		jest.resetModules()
	})

	describe("createClient", () => {
		it("should create a browser client with correct environment variables", () => {
			// Arrange
			const expectedUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
			const expectedKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

			// Act
			const client = createClient()

			// Assert
			expect(mockCreateBrowserClient).toHaveBeenCalledWith(
				expectedUrl,
				expectedKey
			)
			expect(client).toBe(mockSupabaseClient)
		})

		it("should return a client instance", () => {
			// Act
			const client = createClient()

			// Assert
			expect(client).toBeDefined()
			expect(typeof client.auth).toBe("object")
		})
	})
})
