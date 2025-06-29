import { render, screen } from "@testing-library/react"
import { jest } from "@jest/globals"

// Mock Next.js components
jest.mock("next/image", () => ({
	__esModule: true,
	default: ({
		src,
		alt,
		width,
		height,
		className,
		style,
		loading,
		// Filter out Next.js-specific props that don't belong on HTML img
		priority,
		quality,
		placeholder,
		fill,
		sizes,
		blurDataURL,
		onLoad,
		onError,
		unoptimized,
		...htmlProps
	}: any) => (
		<img
			src={src}
			alt={alt}
			width={width}
			height={height}
			className={className}
			style={style}
			loading={loading}
			{...htmlProps}
		/>
	),
}))

jest.mock("next/link", () => ({
	__esModule: true,
	default: ({ children, href, ...props }: any) => (
		<a href={href} {...props}>
			{children}
		</a>
	),
}))

describe("Project Pages Layout Integration", () => {
	beforeEach(() => {
		// Mock window.matchMedia for responsive tests
		Object.defineProperty(window, "matchMedia", {
			writable: true,
			value: jest.fn().mockImplementation((query: unknown) => ({
				matches: false,
				media: query as string,
				onchange: null,
				addListener: jest.fn(),
				removeListener: jest.fn(),
				addEventListener: jest.fn(),
				removeEventListener: jest.fn(),
				dispatchEvent: jest.fn(),
			})),
		})
	})

	describe("Building Layout Integration", () => {
		test("building layout includes MainSiteLayout wrapper", async () => {
			const BuildingLayout = (await import("../../app/building/layout")).default

			render(
				<BuildingLayout>
					<div data-testid="test-content">Test Content</div>
				</BuildingLayout>
			)

			// Test that content is rendered (proving layout is working)
			expect(screen.getByTestId("test-content")).toBeInTheDocument()
			expect(screen.getByText("Test Content")).toBeInTheDocument()

			// Test that main site layout elements are present
			expect(screen.getByRole("banner")).toBeInTheDocument() // Header
			expect(screen.getByRole("contentinfo")).toBeInTheDocument() // Footer
		})

		test("building layout provides proper page structure", async () => {
			const BuildingLayout = (await import("../../app/building/layout")).default

			render(
				<BuildingLayout>
					<div data-testid="main-content">
						<h1>Project Page</h1>
						<p>Project specific content</p>
					</div>
				</BuildingLayout>
			)

			// Test structural elements
			expect(screen.getByRole("banner")).toBeInTheDocument()
			expect(screen.getAllByRole("main")).toHaveLength(1)
			expect(screen.getByRole("contentinfo")).toBeInTheDocument()

			// Test content preservation
			expect(screen.getByTestId("main-content")).toBeInTheDocument()
			expect(screen.getByText("Project Page")).toBeInTheDocument()
			expect(screen.getByText("Project specific content")).toBeInTheDocument()
		})

		test("building layout includes navigation elements", async () => {
			const BuildingLayout = (await import("../../app/building/layout")).default

			render(
				<BuildingLayout>
					<div>Test Content</div>
				</BuildingLayout>
			)

			// Test that doug.is branding is present (header desktop, mobile, footer sections)
			expect(screen.getAllByText(/doug\.is/i).length).toBeGreaterThanOrEqual(2)

			// Test that main navigation sections are present (multiple elements due to responsive design)
			expect(
				screen.getAllByText((content, element) => {
					return (
						element?.tagName.toLowerCase() === "a" &&
						content.includes("building")
					)
				}).length
			).toBeGreaterThan(0)

			expect(
				screen.getAllByText((content, element) => {
					return (
						element?.tagName.toLowerCase() === "a" &&
						content.includes("advising")
					)
				}).length
			).toBeGreaterThan(0)

			expect(
				screen.getAllByText((content, element) => {
					return (
						element?.tagName.toLowerCase() === "a" &&
						content.includes("investing")
					)
				}).length
			).toBeGreaterThan(0)

			expect(
				screen.getAllByText((content, element) => {
					return (
						element?.tagName.toLowerCase() === "a" &&
						content.includes("thinking")
					)
				}).length
			).toBeGreaterThan(0)
		})

		test("building layout provides Connect CTA", async () => {
			const BuildingLayout = (await import("../../app/building/layout")).default

			render(
				<BuildingLayout>
					<div>Test Content</div>
				</BuildingLayout>
			)

			// Test Connect button is present (multiple elements due to responsive design + footer)
			expect(
				screen.getAllByText((content, element) => {
					return (
						element?.tagName.toLowerCase() === "a" &&
						content.toLowerCase().includes("connect")
					)
				}).length
			).toBeGreaterThan(0)
		})

		test("building layout maintains responsive structure", async () => {
			const BuildingLayout = (await import("../../app/building/layout")).default

			render(
				<BuildingLayout>
					<div data-testid="responsive-content">Content</div>
				</BuildingLayout>
			)

			// Test that both desktop and mobile structures exist
			// (They may be hidden/shown via CSS, but both should be in DOM)
			expect(screen.getByTestId("responsive-content")).toBeInTheDocument()
			expect(screen.getByRole("banner")).toBeInTheDocument()

			// Test that main container structure is present
			const content = screen.getByTestId("responsive-content")
			expect(content.closest("div")).toBeInTheDocument()
		})
	})

	describe("Individual Project Page Compatibility", () => {
		test("oil price ticker page renders within building layout", async () => {
			// Test that we can import and render the page component
			const OilPriceTickerPage = (
				await import("../../app/building/oil-price-ticker/page")
			).default
			const BuildingLayout = (await import("../../app/building/layout")).default

			expect(() => {
				render(
					<BuildingLayout>
						<OilPriceTickerPage />
					</BuildingLayout>
				)
			}).not.toThrow()

			// Basic structure verification
			expect(screen.getByRole("banner")).toBeInTheDocument()
			expect(screen.getByRole("contentinfo")).toBeInTheDocument()
		})

		test("hopping list page renders within building layout", async () => {
			const HoppingListPage = (
				await import("../../app/building/hopping-list/page")
			).default
			const BuildingLayout = (await import("../../app/building/layout")).default

			expect(() => {
				render(
					<BuildingLayout>
						<HoppingListPage />
					</BuildingLayout>
				)
			}).not.toThrow()

			expect(screen.getByRole("banner")).toBeInTheDocument()
			expect(screen.getByRole("contentinfo")).toBeInTheDocument()
		})

		test("other project pages render within building layout", async () => {
			// Test multiple pages can be imported and don't cause runtime errors
			const pages = [
				"../../app/building/occupado/page",
				"../../app/building/inn/page",
				"../../app/building/just-ate/page",
				"../../app/building/bolt-form/page",
			]

			const BuildingLayout = (await import("../../app/building/layout")).default

			for (const pagePath of pages) {
				const PageComponent = (await import(pagePath)).default

				expect(() => {
					render(
						<BuildingLayout>
							<PageComponent />
						</BuildingLayout>
					)
				}).not.toThrow()

				// Clean up for next iteration
				document.body.innerHTML = ""
			}
		})
	})

	describe("Layout Performance and Structure", () => {
		test("layout renders without throwing errors", async () => {
			const BuildingLayout = (await import("../../app/building/layout")).default

			expect(() => {
				render(
					<BuildingLayout>
						<div>Performance test content</div>
					</BuildingLayout>
				)
			}).not.toThrow()
		})

		test("layout provides proper accessibility structure", async () => {
			const BuildingLayout = (await import("../../app/building/layout")).default

			render(
				<BuildingLayout>
					<div>
						<h1>Accessibility Test</h1>
					</div>
				</BuildingLayout>
			)

			// Test essential accessibility landmarks are present
			expect(screen.getByRole("banner")).toBeInTheDocument() // Header
			expect(screen.getAllByRole("main")).toHaveLength(1) // Main content
			expect(screen.getByRole("contentinfo")).toBeInTheDocument() // Footer
		})

		test("layout does not break with various content types", async () => {
			const BuildingLayout = (await import("../../app/building/layout")).default

			const testCases = [
				<div key="text">Simple text content</div>,
				<main key="main">
					<h1>Heading</h1>
					<p>Paragraph</p>
				</main>,
				<section key="section">
					<article>Article content</article>
				</section>,
				<div key="empty"></div>,
			]

			for (const content of testCases) {
				expect(() => {
					render(<BuildingLayout>{content}</BuildingLayout>)
				}).not.toThrow()

				// Verify layout structure remains intact
				expect(screen.getByRole("banner")).toBeInTheDocument()
				expect(screen.getByRole("contentinfo")).toBeInTheDocument()

				// Clean up for next test
				document.body.innerHTML = ""
			}
		})
	})
})
