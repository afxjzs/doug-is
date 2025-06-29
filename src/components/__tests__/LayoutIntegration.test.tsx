import { render, screen } from "@testing-library/react"
import { usePathname } from "next/navigation"
import LayoutWrapper from "../LayoutWrapper"
import MainSiteLayout from "../MainSiteLayout"

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
	usePathname: jest.fn(),
}))

// Mock Next.js Link component
jest.mock("next/link", () => {
	return function MockLink({ href, children, ...props }: any) {
		return (
			<a href={href} {...props}>
				{children}
			</a>
		)
	}
})

// Mock Next.js Image component
jest.mock("next/image", () => {
	return function MockImage({ src, alt, ...props }: any) {
		return <img src={src} alt={alt} {...props} />
	}
})

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe("Layout Integration for Project Pages", () => {
	describe("LayoutWrapper Behavior on Project Pages", () => {
		it("should render Header and Footer for project pages", () => {
			mockUsePathname.mockReturnValue("/building/oil-price-ticker")

			render(
				<LayoutWrapper>
					<div data-testid="project-content">Oil Price Ticker Content</div>
				</LayoutWrapper>
			)

			// Should have header navigation
			expect(screen.getByRole("banner")).toBeInTheDocument()
			expect(screen.getByRole("navigation")).toBeInTheDocument()

			// Should have footer
			expect(screen.getByRole("contentinfo")).toBeInTheDocument()

			// Should still have project content
			expect(screen.getByTestId("project-content")).toBeInTheDocument()
		})

		it("should render Header and Footer for hopping-list project page", () => {
			mockUsePathname.mockReturnValue("/building/hopping-list")

			render(
				<LayoutWrapper>
					<div data-testid="project-content">Hopping List Content</div>
				</LayoutWrapper>
			)

			expect(screen.getByRole("banner")).toBeInTheDocument()
			expect(screen.getByRole("contentinfo")).toBeInTheDocument()
		})

		it("should render Header and Footer for all building project pages", () => {
			const projectPages = [
				"/building/oil-price-ticker",
				"/building/hopping-list",
				"/building/occupado",
				"/building/inn",
				"/building/just-ate",
				"/building/bolt-form",
			]

			projectPages.forEach((path) => {
				mockUsePathname.mockReturnValue(path)

				const { unmount } = render(
					<LayoutWrapper>
						<div data-testid="project-content">Project Content</div>
					</LayoutWrapper>
				)

				expect(screen.getByRole("banner")).toBeInTheDocument()
				expect(screen.getByRole("contentinfo")).toBeInTheDocument()

				unmount()
			})
		})

		it("should maintain existing skipMainLayout logic for admin pages", () => {
			mockUsePathname.mockReturnValue("/admin/posts")

			render(
				<LayoutWrapper>
					<div data-testid="admin-content">Admin Content</div>
				</LayoutWrapper>
			)

			// Should NOT have header or footer for admin pages
			expect(screen.queryByRole("banner")).not.toBeInTheDocument()
			expect(screen.queryByRole("contentinfo")).not.toBeInTheDocument()

			// Should have admin content
			expect(screen.getByTestId("admin-content")).toBeInTheDocument()
		})
	})

	describe("Header Navigation on Project Pages", () => {
		beforeEach(() => {
			mockUsePathname.mockReturnValue("/building/oil-price-ticker")
		})

		it("should display main navigation links in header", () => {
			render(
				<LayoutWrapper>
					<div>Project Content</div>
				</LayoutWrapper>
			)

			// Check for main navigation links (handle multiple elements for responsive design)
			const buildingLinks = screen.getAllByRole("link", { name: /building/i })
			expect(buildingLinks.length).toBeGreaterThan(0)

			const advisingLinks = screen.getAllByRole("link", { name: /advising/i })
			expect(advisingLinks.length).toBeGreaterThan(0)

			const investingLinks = screen.getAllByRole("link", { name: /investing/i })
			expect(investingLinks.length).toBeGreaterThan(0)

			const thinkingLinks = screen.getAllByRole("link", { name: /thinking/i })
			expect(thinkingLinks.length).toBeGreaterThan(0)

			const connectLinks = screen.getAllByRole("link", {
				name: /let's connect/i,
			})
			expect(connectLinks.length).toBeGreaterThan(0)
		})

		it("should have correct navigation link URLs", () => {
			render(
				<LayoutWrapper>
					<div>Project Content</div>
				</LayoutWrapper>
			)

			// Handle multiple navigation elements (desktop + mobile)
			const buildingLinks = screen.getAllByRole("link", { name: /building/i })
			expect(buildingLinks[0]).toHaveAttribute("href", "/building")

			const advisingLinks = screen.getAllByRole("link", { name: /advising/i })
			expect(advisingLinks[0]).toHaveAttribute("href", "/advising")

			const investingLinks = screen.getAllByRole("link", { name: /investing/i })
			expect(investingLinks[0]).toHaveAttribute("href", "/investing")

			const thinkingLinks = screen.getAllByRole("link", { name: /thinking/i })
			expect(thinkingLinks[0]).toHaveAttribute("href", "/thinking")

			const connectLinks = screen.getAllByRole("link", {
				name: /let's connect/i,
			})
			expect(connectLinks[0]).toHaveAttribute("href", "/connecting")
		})

		it("should display site logo/home link", () => {
			render(
				<LayoutWrapper>
					<div>Project Content</div>
				</LayoutWrapper>
			)

			// Handle multiple home links (desktop + mobile)
			const homeLinks = screen.getAllByRole("link", { name: /doug\.is/i })
			expect(homeLinks[0]).toBeInTheDocument()
			expect(homeLinks[0]).toHaveAttribute("href", "/")
		})
	})

	describe("Footer Rendering on Project Pages", () => {
		beforeEach(() => {
			mockUsePathname.mockReturnValue("/building/oil-price-ticker")
		})

		it("should display social media links in footer", () => {
			render(
				<LayoutWrapper>
					<div>Project Content</div>
				</LayoutWrapper>
			)

			// Check for social links
			expect(screen.getByRole("link", { name: /bluesky/i })).toBeInTheDocument()
			expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument()
			expect(
				screen.getByRole("link", { name: /linkedin/i })
			).toBeInTheDocument()
		})

		it("should display footer navigation links", () => {
			render(
				<LayoutWrapper>
					<div>Project Content</div>
				</LayoutWrapper>
			)

			const footerNavLinks = screen.getAllByRole("link", {
				name: /advising|building|investing|writing/i,
			})
			expect(footerNavLinks.length).toBeGreaterThan(0)
		})

		it("should display contact and copyright information", () => {
			render(
				<LayoutWrapper>
					<div>Project Content</div>
				</LayoutWrapper>
			)

			expect(screen.getByText(/© 2025 Doug\.is/)).toBeInTheDocument()
			// Handle multiple "Let's Connect" links (header + footer + mobile)
			const connectLinks = screen.getAllByRole("link", {
				name: /let's connect/i,
			})
			expect(connectLinks.length).toBeGreaterThan(0)
		})
	})

	describe("MainSiteLayout Integration", () => {
		it("should apply background effects when MainSiteLayout is used", () => {
			const { container } = render(
				<MainSiteLayout>
					<div data-testid="content">Project Content</div>
				</MainSiteLayout>
			)

			// Check for background effect elements
			const backgroundElements = container.querySelectorAll(
				'[class*="fixed inset-0"]'
			)
			expect(backgroundElements.length).toBeGreaterThan(0)

			// Should have the main container with proper styling
			expect(container.querySelector(".min-h-screen")).toBeInTheDocument()
		})

		it("should maintain proper layout structure with MainSiteLayout", () => {
			mockUsePathname.mockReturnValue("/building/oil-price-ticker")

			render(
				<MainSiteLayout>
					<div data-testid="content">Project Content</div>
				</MainSiteLayout>
			)

			// Should have header, content, and footer
			expect(screen.getByRole("banner")).toBeInTheDocument()
			expect(screen.getByTestId("content")).toBeInTheDocument()
			expect(screen.getByRole("contentinfo")).toBeInTheDocument()
		})
	})

	describe("Responsive Design and Accessibility", () => {
		beforeEach(() => {
			mockUsePathname.mockReturnValue("/building/oil-price-ticker")
		})

		it("should have proper semantic HTML structure", () => {
			render(
				<LayoutWrapper>
					<div>Project Content</div>
				</LayoutWrapper>
			)

			// Check for proper semantic elements
			expect(screen.getByRole("banner")).toBeInTheDocument() // header
			expect(screen.getByRole("main")).toBeInTheDocument() // main content
			expect(screen.getByRole("contentinfo")).toBeInTheDocument() // footer
			expect(screen.getByRole("navigation")).toBeInTheDocument() // nav
		})

		it("should maintain proper heading hierarchy", () => {
			render(
				<LayoutWrapper>
					<h1>Project Title</h1>
					<div>Project Content</div>
				</LayoutWrapper>
			)

			// Header should not interfere with page heading hierarchy
			// Multiple h1s exist (site logos + project title)
			const allHeadings = screen.getAllByRole("heading", { level: 1 })
			const projectTitleHeading = allHeadings.find(
				(heading) => heading.textContent === "Project Title"
			)
			expect(projectTitleHeading).toBeInTheDocument()
		})
	})

	describe("Performance and CSS Considerations", () => {
		it("should not cause CSS conflicts with project-specific styling", () => {
			mockUsePathname.mockReturnValue("/building/oil-price-ticker")

			const { container } = render(
				<LayoutWrapper>
					<div className="neon-button-orange" data-testid="styled-element">
						Orange Button
					</div>
				</LayoutWrapper>
			)

			// Project-specific styling classes should be preserved
			const styledElement = screen.getByTestId("styled-element")
			expect(styledElement).toHaveClass("neon-button-orange")
		})

		it("should apply proper container styling without conflicts", () => {
			mockUsePathname.mockReturnValue("/building/oil-price-ticker")

			const { container } = render(
				<LayoutWrapper>
					<div data-testid="content">Project Content</div>
				</LayoutWrapper>
			)

			// Main container should have proper classes
			const mainElement = screen.getByRole("main")
			expect(mainElement).toHaveClass(
				"flex-grow",
				"container",
				"mx-auto",
				"px-4",
				"pt-28",
				"pb-12",
				"relative",
				"z-10"
			)
		})
	})
})
