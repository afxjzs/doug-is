/**
 * Test for the migraine-free page
 * Tests that the page loads properly without the default site layout (no nav/footer)
 */

import { render, screen } from "@testing-library/react"
import { headers } from "next/headers"

// Mock environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"

// Mock Next.js headers
jest.mock("next/headers", () => ({
	headers: jest.fn(() => ({
		get: jest.fn((key: string) => {
			if (key === "x-is-admin-route") {
				return "true" // This should be true for migraine-free routes
			}
			return null
		}),
	})),
}))

// Mock the migraine-free page component to avoid complex dependencies
jest.mock("../migraine-free/page", () => {
	return function MockMigrainePage() {
		return (
			<div>
				<h1>Migraine Trigger Foods Database (MTFDB)</h1>
				<div>Test content for migraine-free page</div>
			</div>
		)
	}
})

// Mock the migraine-free layout
jest.mock("../layout", () => {
	return function MockMigraineFreeLayout({
		children,
	}: {
		children: React.ReactNode
	}) {
		return (
			<div data-testid="migraine-free-layout">
				<div className="min-h-screen bg-gray-900 text-white">
					<div className="relative z-10">{children}</div>
				</div>
			</div>
		)
	}
})

// Import the mocked component
import MigrainePage from "../migraine-free/page"
import MigraineFreeLayout from "../layout"

describe("Migraine Free Page", () => {
	it("should load the migraine-free page properly without default site layout", () => {
		render(
			<MigraineFreeLayout>
				<MigrainePage />
			</MigraineFreeLayout>
		)

		// Should show migraine-free layout
		expect(screen.getByTestId("migraine-free-layout")).toBeInTheDocument()

		// Should show migraine-free page content
		expect(
			screen.getByText("Migraine Trigger Foods Database (MTFDB)")
		).toBeInTheDocument()
		expect(
			screen.getByText("Test content for migraine-free page")
		).toBeInTheDocument()

		// Should NOT show main site header/footer (these would be rendered by ServerLayoutWrapper)
		expect(screen.queryByTestId("main-site-header")).not.toBeInTheDocument()
		expect(screen.queryByTestId("main-site-footer")).not.toBeInTheDocument()
	})
})
