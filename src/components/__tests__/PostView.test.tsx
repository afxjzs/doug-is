/**
 * Tests for PostView Component
 *
 * Tests the PostView component including the new isDraft functionality
 * for admin draft preview mode.
 */

import { render, screen } from "@testing-library/react"
import { PostView } from "../PostView"
import { useEventTracking } from "@/lib/analytics"
import { Post } from "@/lib/supabase/publicClient"

// Mock the analytics hook
jest.mock("@/lib/analytics", () => ({
	useEventTracking: jest.fn(() => ({
		trackBlogPostView: jest.fn(),
		trackBlogExternalLinkClick: jest.fn(),
	})),
}))

// Mock Next.js Image component
jest.mock("next/image", () => {
	return function MockImage({ src, alt, ...props }: any) {
		return <img src={src} alt={alt} {...props} />
	}
})

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

// Mock react-markdown and remark-gfm to avoid module loading issues
jest.mock("react-markdown", () => {
	return function MockReactMarkdown({ children }: any) {
		return <div data-testid="markdown-content">{children}</div>
	}
})

jest.mock("remark-gfm", () => ({}))

describe("PostView Component", () => {
	const mockPost: Post = {
		id: "test-post-id",
		title: "Test Post Title",
		slug: "test-post-slug",
		content: "This is test content for the post.",
		excerpt: "Test excerpt",
		category: "testing",
		published_at: "2024-01-01T00:00:00Z",
		featured_image: null,
		created_at: "2024-01-01T00:00:00Z",
		updated_at: "2024-01-01T00:00:00Z",
	}

	const mockTrackBlogPostView = jest.fn()
	const mockTrackBlogExternalLinkClick = jest.fn()

	beforeEach(() => {
		jest.clearAllMocks()
		;(useEventTracking as jest.Mock).mockReturnValue({
			trackBlogPostView: mockTrackBlogPostView,
			trackBlogExternalLinkClick: mockTrackBlogExternalLinkClick,
		})
	})

	describe("Basic Post Rendering", () => {
		it("renders post content correctly", () => {
			render(<PostView post={mockPost} />)

			expect(screen.getByText("Test Post Title")).toBeInTheDocument()
			expect(
				screen.getByText("This is test content for the post.")
			).toBeInTheDocument()
			expect(screen.getByText("testing")).toBeInTheDocument()
		})

		it("tracks blog post view on mount", () => {
			render(<PostView post={mockPost} />)

			expect(mockTrackBlogPostView).toHaveBeenCalledWith(
				"test-post-slug",
				"Test Post Title",
				"testing"
			)
		})

		it("renders category link correctly", () => {
			render(<PostView post={mockPost} />)

			const categoryLink = screen.getByRole("link", { name: /testing/i })
			expect(categoryLink).toHaveAttribute("href", "/thinking/about/testing")
		})

		it("renders back to thinking link", () => {
			render(<PostView post={mockPost} />)

			const backLink = screen.getByRole("link", { name: /← Back to Thinking/i })
			expect(backLink).toHaveAttribute("href", "/thinking")
		})
	})

	describe("Draft Mode Functionality", () => {
		it("does not show draft banner in normal mode", () => {
			render(<PostView post={mockPost} />)

			expect(screen.queryByText("DRAFT PREVIEW")).not.toBeInTheDocument()
			expect(
				screen.queryByText(/This is an unpublished draft/)
			).not.toBeInTheDocument()
		})

		it("shows draft banner when isDraft is true", () => {
			render(<PostView post={mockPost} isDraft={true} />)

			expect(screen.getByText("DRAFT PREVIEW")).toBeInTheDocument()
			expect(
				screen.getByText(/This is an unpublished draft/)
			).toBeInTheDocument()
			expect(
				screen.getByText(/Only administrators can view this content/)
			).toBeInTheDocument()
		})

		it("renders draft banner with correct styling", () => {
			render(<PostView post={mockPost} isDraft={true} />)

			// Look for the banner container
			const draftBannerContainer = screen
				.getByText("DRAFT PREVIEW")
				.closest("[class*='bg-yellow-900']")
			expect(draftBannerContainer).toBeInTheDocument()

			// Check for draft indicator
			const indicator = screen.getByText("DRAFT PREVIEW").previousSibling
			expect(indicator).toHaveClass("bg-yellow-500")
		})

		it("renders draft banner above post content", () => {
			render(<PostView post={mockPost} isDraft={true} />)

			const draftBanner = screen.getByText("DRAFT PREVIEW").closest("div")
			const postTitle = screen.getByText("Test Post Title")

			// Draft banner should appear before the post title
			expect(draftBanner?.compareDocumentPosition(postTitle)).toBe(
				Node.DOCUMENT_POSITION_FOLLOWING
			)
		})

		it("still tracks analytics in draft mode", () => {
			render(<PostView post={mockPost} isDraft={true} />)

			expect(mockTrackBlogPostView).toHaveBeenCalledWith(
				"test-post-slug",
				"Test Post Title",
				"testing"
			)
		})
	})

	describe("Featured Image Handling", () => {
		it("renders featured image when provided", () => {
			const postWithImage = {
				...mockPost,
				featured_image: "/test-image.jpg",
			}

			render(<PostView post={postWithImage} />)

			const image = screen.getByAltText("Test Post Title")
			expect(image).toHaveAttribute("src", "/test-image.jpg")
		})

		it("does not render image container when no featured image", () => {
			render(<PostView post={mockPost} />)

			const image = screen.queryByAltText("Test Post Title")
			expect(image).not.toBeInTheDocument()
		})

		it("renders featured image in draft mode", () => {
			const postWithImage = {
				...mockPost,
				featured_image: "/test-image.jpg",
			}

			render(<PostView post={postWithImage} isDraft={true} />)

			expect(screen.getByText("DRAFT PREVIEW")).toBeInTheDocument()
			expect(screen.getByAltText("Test Post Title")).toBeInTheDocument()
		})
	})

	describe("Date Formatting", () => {
		it("formats published date correctly", () => {
			render(<PostView post={mockPost} />)

			// The component formats dates using toLocaleDateString
			expect(screen.getByText(/December 31, 2023/)).toBeInTheDocument()
		})

		it("falls back to created_at when published_at is null", () => {
			const draftPost = {
				...mockPost,
				published_at: "",
			}

			render(<PostView post={draftPost} />)

			// Should still show the date from created_at
			expect(screen.getByText(/December 31, 2023/)).toBeInTheDocument()
		})
	})

	describe("Content Rendering", () => {
		it("renders markdown content", () => {
			render(<PostView post={mockPost} />)

			expect(screen.getByTestId("markdown-content")).toBeInTheDocument()
			expect(
				screen.getByText("This is test content for the post.")
			).toBeInTheDocument()
		})

		it("handles empty content gracefully", () => {
			const postWithoutContent = {
				...mockPost,
				content: "",
			}

			render(<PostView post={postWithoutContent} />)

			// Should render without crashing
			expect(screen.getByText("Test Post Title")).toBeInTheDocument()
		})
	})
})
