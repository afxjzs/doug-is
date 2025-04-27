import React from "react"
import { render as rtlRender } from "@testing-library/react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

// Mock Supabase client
jest.mock("@supabase/auth-helpers-nextjs", () => ({
	createClientComponentClient: jest.fn(),
}))

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
	useRouter() {
		return {
			push: jest.fn(),
			replace: jest.fn(),
			refresh: jest.fn(),
		}
	},
	usePathname() {
		return ""
	},
}))

// Create a mock Supabase client
export const mockSupabaseClient = {
	auth: {
		signInWithPassword: jest.fn(),
		signOut: jest.fn(),
		getUser: jest.fn(),
	},
	from: jest.fn(() => ({
		select: jest.fn().mockReturnThis(),
		insert: jest.fn().mockReturnThis(),
		update: jest.fn().mockReturnThis(),
		delete: jest.fn().mockReturnThis(),
		eq: jest.fn().mockReturnThis(),
		single: jest.fn(),
		order: jest.fn().mockReturnThis(),
	})),
}

// Setup function to configure Supabase mock for a test
export function setupSupabaseMock(
	mockImplementation = () => mockSupabaseClient
) {
	;(createClientComponentClient as jest.Mock).mockImplementation(
		mockImplementation
	)
}

// Custom render function that includes providers
export function render(ui: React.ReactElement, options = {}) {
	return rtlRender(ui, {
		wrapper: ({ children }: { children: React.ReactNode }) => children,
		...options,
	})
}

// Re-export everything
export * from "@testing-library/react"
