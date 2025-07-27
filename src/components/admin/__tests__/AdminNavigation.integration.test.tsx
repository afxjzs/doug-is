/**
 * Integration tests for AdminNavigation component
 * Tests sidebar functionality, mobile toggle, navigation links, and server/client integration
 */

import { render, screen, fireEvent } from "@testing-library/react"
import { usePathname, useRouter } from "next/navigation"
import AdminNavigation from "../AdminNavigation"

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
	useRouter: jest.fn(),
}))

describe("AdminNavigation Integration", () => {
	const mockRouter = {
		push: jest.fn(),
		replace: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
		refresh: jest.fn(),
		prefetch: jest.fn(),
	}

	beforeEach(() => {
		;(usePathname as jest.Mock).mockReturnValue("/admin")
		;(useRouter as jest.Mock).mockReturnValue(mockRouter)
		jest.clearAllMocks()
	})

	it("should render within server AdminLayout without hydration errors", () => {
		render(<AdminNavigation />)

		// Should render the admin navigation sidebar
		expect(screen.getByText("doug.is Admin")).toBeInTheDocument()
		expect(screen.getByText("Dashboard")).toBeInTheDocument()
		expect(screen.getByText("Posts")).toBeInTheDocument()
		expect(screen.getByText("Contact Messages")).toBeInTheDocument()
	})

	it("should highlight active navigation based on current route", () => {
		;(usePathname as jest.Mock).mockReturnValue("/admin/posts")

		render(<AdminNavigation />)

		// Posts link should be highlighted as active
		const postsLink = screen.getByText("Posts").closest("a")
		expect(postsLink).toHaveClass("active")
		expect(postsLink).toHaveClass("nav-item")
	})

	it("should toggle mobile sidebar state correctly", () => {
		render(<AdminNavigation />)

		// Mobile hamburger button should be visible
		const hamburgerButton = screen.getByLabelText("Toggle menu")
		expect(hamburgerButton).toBeInTheDocument()

		// Sidebar should be hidden by default on mobile
		const sidebar = screen.getByRole("complementary")
		expect(sidebar).toHaveClass("-translate-x-full")

		// Click hamburger to open sidebar
		fireEvent.click(hamburgerButton)
		expect(sidebar).toHaveClass("translate-x-0")

		// Click hamburger again to close sidebar
		fireEvent.click(hamburgerButton)
		expect(sidebar).toHaveClass("-translate-x-full")
	})

	it("should render all navigation links with correct hrefs", () => {
		render(<AdminNavigation />)

		const dashboardLink = screen.getByText("Dashboard").closest("a")
		const postsLink = screen.getByText("Posts").closest("a")
		const contactsLink = screen.getByText("Contact Messages").closest("a")

		expect(dashboardLink).toHaveAttribute("href", "/admin")
		expect(postsLink).toHaveAttribute("href", "/admin/posts")
		expect(contactsLink).toHaveAttribute("href", "/admin/contacts")
	})

	it("should close mobile sidebar when navigation link is clicked", () => {
		render(<AdminNavigation />)

		// Open mobile sidebar
		const hamburgerButton = screen.getByLabelText("Toggle menu")
		fireEvent.click(hamburgerButton)

		const sidebar = screen.getByRole("complementary")
		expect(sidebar).toHaveClass("translate-x-0")

		// Click a navigation link
		const postsLink = screen.getByText("Posts")
		fireEvent.click(postsLink)

		// Sidebar should close
		expect(sidebar).toHaveClass("-translate-x-full")
	})

	it("should render logout and view website links", () => {
		render(<AdminNavigation />)

		expect(screen.getByText("Sign Out")).toBeInTheDocument()
		expect(screen.getByText("View Website")).toBeInTheDocument()

		const logoutLink = screen.getByText("Sign Out").closest("a")
		const viewWebsiteLink = screen.getByText("View Website").closest("a")

		expect(logoutLink).toHaveAttribute("href", "/logout")
		expect(viewWebsiteLink).toHaveAttribute("href", "/")
	})

	it("should render mobile overlay when sidebar is open", () => {
		render(<AdminNavigation />)

		// Open mobile sidebar
		const hamburgerButton = screen.getByLabelText("Toggle menu")
		fireEvent.click(hamburgerButton)

		// Overlay should be visible - use class selector since it doesn't have a role
		const overlay = document.querySelector(
			".fixed.inset-0.z-30.bg-black.bg-opacity-50.md\\:hidden"
		)
		expect(overlay).toBeInTheDocument()
		expect(overlay).toHaveClass("bg-black", "bg-opacity-50")

		// Click overlay to close sidebar
		fireEvent.click(overlay!)
		const sidebar = screen.getByRole("complementary")
		expect(sidebar).toHaveClass("-translate-x-full")
	})

	it("should handle logout click with console logging", () => {
		const consoleSpy = jest.spyOn(console, "log").mockImplementation()

		render(<AdminNavigation />)

		const logoutLink = screen.getByText("Sign Out")
		fireEvent.click(logoutLink)

		expect(consoleSpy).toHaveBeenCalledWith("🚪 AdminNavigation logout clicked")

		consoleSpy.mockRestore()
	})
})
