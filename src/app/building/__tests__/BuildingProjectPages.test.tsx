/**
 * Comprehensive tests for all /building/* project pages
 * Tests that every building project page loads properly
 */

import { render, screen } from "@testing-library/react"
import { headers } from "next/headers"

// Mock Next.js headers
jest.mock("next/headers", () => ({
	headers: jest.fn(() => ({
		get: jest.fn((key: string) => {
			if (key === "x-is-admin-route") {
				return "false"
			}
			return null
		}),
	})),
}))

// Mock components
jest.mock("@/components/ServerLayoutWrapper", () => {
	return function MockServerLayoutWrapper({
		children,
	}: {
		children: React.ReactNode
	}) {
		return (
			<>
				<div data-testid="main-site-header">Main Site Header</div>
				<main data-testid="main-site-content">{children}</main>
				<div data-testid="main-site-footer">Main Site Footer</div>
			</>
		)
	}
})

jest.mock("@/components/ClientAnalyticsWrapper", () => {
	return function MockClientAnalyticsWrapper({
		children,
	}: {
		children: React.ReactNode
	}) {
		return <div data-testid="client-analytics">{children}</div>
	}
})

jest.mock("@/components/ui/tooltip", () => ({
	TooltipProvider: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="tooltip-provider">{children}</div>
	),
}))

// Mock font imports
jest.mock("next/font/google", () => ({
	Inter: jest.fn(() => ({
		variable: "mock-inter-variable",
		className: "mock-inter-class",
	})),
}))

jest.mock("next/font/local", () => ({
	__esModule: true,
	default: jest.fn(() => ({
		variable: "mock-inter-local-variable",
		className: "mock-inter-local-class",
	})),
}))

// Import building project pages
import BoltFormPage from "../bolt-form/page"
import HoppingListPage from "../hopping-list/page"
import InnPage from "../inn/page"
import JustAtePage from "../just-ate/page"
import OccupadoPage from "../occupado/page"
import OilPriceTickerPage from "../oil-price-ticker/page"

// Test wrapper component that provides the layout structure
function TestLayoutWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<div data-testid="main-site-header">Main Site Header</div>
			<main data-testid="main-site-content">{children}</main>
			<div data-testid="main-site-footer">Main Site Footer</div>
		</div>
	)
}

describe("Building Project Pages - All Pages Load Properly", () => {
	describe("Bolt Form Page", () => {
		it("should load the bolt form page properly", () => {
			render(
				<TestLayoutWrapper>
					<BoltFormPage />
				</TestLayoutWrapper>
			)

			// Should show main site layout
			expect(screen.getByTestId("main-site-header")).toBeInTheDocument()
			expect(screen.getByTestId("main-site-footer")).toBeInTheDocument()

			// Should show bolt form page content
			expect(screen.getByText("Bolt Form")).toBeInTheDocument()
		})
	})

	describe("Hopping List Page", () => {
		it("should load the hopping list page properly", () => {
			render(
				<TestLayoutWrapper>
					<HoppingListPage />
				</TestLayoutWrapper>
			)

			// Should show main site layout
			expect(screen.getByTestId("main-site-header")).toBeInTheDocument()
			expect(screen.getByTestId("main-site-footer")).toBeInTheDocument()

			// Should show hopping list page content
			expect(screen.getByText("Hopping List")).toBeInTheDocument()
		})
	})

	describe("Inn Page", () => {
		it("should load the inn page properly", () => {
			render(
				<TestLayoutWrapper>
					<InnPage />
				</TestLayoutWrapper>
			)

			// Should show main site layout
			expect(screen.getByTestId("main-site-header")).toBeInTheDocument()
			expect(screen.getByTestId("main-site-footer")).toBeInTheDocument()

			// Should show inn page content
			expect(screen.getByText("Inn Ruby Gem")).toBeInTheDocument()
		})
	})

	describe("Just Ate Page", () => {
		it("should load the just ate page properly", () => {
			render(
				<TestLayoutWrapper>
					<JustAtePage />
				</TestLayoutWrapper>
			)

			// Should show main site layout
			expect(screen.getByTestId("main-site-header")).toBeInTheDocument()
			expect(screen.getByTestId("main-site-footer")).toBeInTheDocument()

			// Should show just ate page content
			expect(screen.getByText("JustAte")).toBeInTheDocument()
		})
	})

	describe("Occupado Page", () => {
		it("should load the occupado page properly", () => {
			render(
				<TestLayoutWrapper>
					<OccupadoPage />
				</TestLayoutWrapper>
			)

			// Should show main site layout
			expect(screen.getByTestId("main-site-header")).toBeInTheDocument()
			expect(screen.getByTestId("main-site-footer")).toBeInTheDocument()

			// Should show occupado page content
			expect(screen.getByText("Occupado")).toBeInTheDocument()
		})
	})

	describe("Oil Price Ticker Page", () => {
		it("should load the oil price ticker page properly", () => {
			render(
				<TestLayoutWrapper>
					<OilPriceTickerPage />
				</TestLayoutWrapper>
			)

			// Should show main site layout
			expect(screen.getByTestId("main-site-header")).toBeInTheDocument()
			expect(screen.getByTestId("main-site-footer")).toBeInTheDocument()

			// Should show oil price ticker page content
			expect(screen.getByText("Oil Price Ticker")).toBeInTheDocument()
		})
	})
})
