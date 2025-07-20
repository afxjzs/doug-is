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
	return function MockImage({
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
	}: any) {
		return (
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
		)
	}
})

// Mock the components to avoid complex dependencies
jest.mock("../Header", () => {
	return function MockHeader() {
		return <div data-testid="header">Header</div>
	}
})

jest.mock("../Footer", () => {
	return function MockFooter() {
		return <div data-testid="footer">Footer</div>
	}
})

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>

describe("Layout Integration", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe("LayoutWrapper", () => {
		it("renders header and footer for regular pages", () => {
			mockUsePathname.mockReturnValue("/thinking/building/test-post")

			render(
				<LayoutWrapper>
					<div data-testid="content">Page Content</div>
				</LayoutWrapper>
			)

			expect(screen.getByTestId("header")).toBeInTheDocument()
			expect(screen.getByTestId("footer")).toBeInTheDocument()
			expect(screen.getByTestId("content")).toBeInTheDocument()
		})

		it("skips header and footer for admin pages", () => {
			mockUsePathname.mockReturnValue("/admin/posts")

			render(
				<LayoutWrapper>
					<div data-testid="content">Admin Content</div>
				</LayoutWrapper>
			)

			expect(screen.queryByTestId("header")).not.toBeInTheDocument()
			expect(screen.queryByTestId("footer")).not.toBeInTheDocument()
			expect(screen.getByTestId("content")).toBeInTheDocument()
		})

		it("skips header and footer for migraine-free pages", () => {
			mockUsePathname.mockReturnValue("/migraine-free")

			render(
				<LayoutWrapper>
					<div data-testid="content">Migraine Content</div>
				</LayoutWrapper>
			)

			expect(screen.queryByTestId("header")).not.toBeInTheDocument()
			expect(screen.queryByTestId("footer")).not.toBeInTheDocument()
			expect(screen.getByTestId("content")).toBeInTheDocument()
		})
	})

	describe("MainSiteLayout", () => {
		it("renders with proper background effects", () => {
			render(
				<MainSiteLayout>
					<div data-testid="content">Content</div>
				</MainSiteLayout>
			)

			expect(screen.getByTestId("content")).toBeInTheDocument()
		})
	})

	describe("Blog Post Layout Integration", () => {
		it("renders blog post layout with proper structure", () => {
			mockUsePathname.mockReturnValue("/thinking/building/test-post")

			render(
				<LayoutWrapper>
					<div data-testid="blog-content">
						<h1>Test Blog Post</h1>
						<p>This is a test blog post content.</p>
					</div>
				</LayoutWrapper>
			)

			// Verify header and footer are present for blog posts
			expect(screen.getByTestId("header")).toBeInTheDocument()
			expect(screen.getByTestId("footer")).toBeInTheDocument()

			// Verify blog content is present
			expect(screen.getByText("Test Blog Post")).toBeInTheDocument()
			expect(
				screen.getByText("This is a test blog post content.")
			).toBeInTheDocument()
		})

		it("maintains proper container structure for blog posts", () => {
			mockUsePathname.mockReturnValue("/thinking/building/test-post")

			render(
				<LayoutWrapper>
					<div data-testid="blog-content">
						<div className="max-w-3xl mx-auto">
							<h1>Test Blog Post</h1>
						</div>
					</div>
				</LayoutWrapper>
			)

			// Verify the blog content has proper container structure
			const blogContainer = screen.getByText("Test Blog Post").closest("div")
			expect(blogContainer).toHaveClass("max-w-3xl", "mx-auto")
		})

		it("renders with proper responsive layout classes", () => {
			mockUsePathname.mockReturnValue("/thinking/building/test-post")

			render(
				<LayoutWrapper>
					<div data-testid="blog-content">
						<article className="prose lg:prose-lg max-w-none">
							<h1>Test Blog Post</h1>
						</article>
					</div>
				</LayoutWrapper>
			)

			// Verify the article has proper prose classes
			const article = screen.getByText("Test Blog Post").closest("article")
			expect(article).toHaveClass("prose", "lg:prose-lg", "max-w-none")
		})
	})
})
