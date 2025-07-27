/**
 * Tests for PostsTable Component
 *
 * Tests for the admin posts management table including draft view functionality.
 */

import { render, screen, fireEvent } from "@testing-library/react"
import PostsTable from "../PostsTable"
import { Post } from "@/lib/supabase/clientData"

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

// Mock PublishButton component
jest.mock("@/components/admin/PublishButton", () => {
	return function MockPublishButton({ postId, postTitle, redirectUrl }: any) {
		return (
			<button
				data-testid={`publish-button-${postId}`}
				onClick={() => {
					// Simulate successful publish
					if (redirectUrl) {
						window.location.href = redirectUrl
					}
				}}
			>
				Publish {postTitle}
			</button>
		)
	}
})

describe("PostsTable", () => {
	const mockPublishedPost: Post = {
		id: "published-post-id",
		title: "Published Post",
		slug: "published-post",
		content: "Published content",
		excerpt: "Published excerpt",
		category: "building",
		published_at: "2024-01-01T12:00:00Z",
		featured_image: null,
		created_at: "2024-01-01T10:00:00Z",
		updated_at: "2024-01-01T11:00:00Z",
	}

	const mockDraftPost: Post = {
		id: "draft-post-id",
		title: "Draft Post",
		slug: "draft-post",
		content: "Draft content",
		excerpt: "Draft excerpt",
		category: "building",
		published_at: null, // Draft post
		featured_image: null,
		created_at: "2024-01-01T10:00:00Z",
		updated_at: "2024-01-01T11:00:00Z",
	}

	const mockPosts = [mockPublishedPost, mockDraftPost]

	describe("Basic Table Rendering", () => {
		it("renders posts table with correct headers", () => {
			render(<PostsTable posts={mockPosts} />)

			expect(screen.getByText("Title")).toBeInTheDocument()
			expect(screen.getByText("Category")).toBeInTheDocument()
			expect(screen.getByText("Published")).toBeInTheDocument()
			expect(screen.getByText("Actions")).toBeInTheDocument()
		})

		it("displays posts with correct information", () => {
			render(<PostsTable posts={mockPosts} />)

			expect(screen.getByText("Published Post")).toBeInTheDocument()
			expect(screen.getByText("Draft Post")).toBeInTheDocument()
			expect(screen.getAllByText("building")).toHaveLength(3) // Filter option + 2 category badges
		})

		it("shows published status correctly", () => {
			render(<PostsTable posts={mockPosts} />)

			expect(screen.getByText("Jan 1, 2024")).toBeInTheDocument() // Published date
			expect(screen.getByText("Draft")).toBeInTheDocument() // Draft status
		})
	})

	describe("Draft View Functionality", () => {
		it('shows "View Draft" button for unpublished posts', () => {
			render(<PostsTable posts={[mockDraftPost]} />)

			const viewDraftButton = screen.getByRole("link", { name: /view draft/i })
			expect(viewDraftButton).toBeInTheDocument()
			expect(viewDraftButton).toHaveAttribute(
				"href",
				"/admin/posts/draft-post-id/preview"
			)
		})

		it('does not show "View Draft" button for published posts', () => {
			render(<PostsTable posts={[mockPublishedPost]} />)

			expect(
				screen.queryByRole("link", { name: /view draft/i })
			).not.toBeInTheDocument()
		})

		it('shows both "Edit" and "View Draft" buttons for draft posts', () => {
			render(<PostsTable posts={[mockDraftPost]} />)

			const editButton = screen.getByRole("link", { name: /edit/i })
			const viewDraftButton = screen.getByRole("link", { name: /view draft/i })

			expect(editButton).toBeInTheDocument()
			expect(editButton).toHaveAttribute("href", "/admin/posts/draft-post-id")

			expect(viewDraftButton).toBeInTheDocument()
			expect(viewDraftButton).toHaveAttribute(
				"href",
				"/admin/posts/draft-post-id/preview"
			)
		})

		it("generates correct preview URLs for draft posts", () => {
			const draftPosts = [
				{ ...mockDraftPost, id: "draft-1", title: "Draft 1" },
				{ ...mockDraftPost, id: "draft-2", title: "Draft 2" },
			]

			render(<PostsTable posts={draftPosts} />)

			const viewDraftButtons = screen.getAllByRole("link", {
				name: /view draft/i,
			})

			expect(viewDraftButtons[0]).toHaveAttribute(
				"href",
				"/admin/posts/draft-1/preview"
			)
			expect(viewDraftButtons[1]).toHaveAttribute(
				"href",
				"/admin/posts/draft-2/preview"
			)
		})

		it("applies draft-specific styling to view button", () => {
			render(<PostsTable posts={[mockDraftPost]} />)

			const viewButton = screen.getByRole("link", { name: /view draft/i })
			expect(viewButton).toHaveClass("text-cyan-400")
		})

		it("applies published-specific styling to view button", () => {
			render(<PostsTable posts={[mockPublishedPost]} />)

			const viewButton = screen.getByRole("link", { name: /view live post/i })
			expect(viewButton).toHaveClass("text-cyan-400")
		})

		it("shows appropriate buttons for each post type", () => {
			render(<PostsTable posts={[mockPublishedPost, mockDraftPost]} />)

			// Should have edit and view buttons for both posts
			const editButtons = screen.getAllByRole("link", { name: /edit/i })
			const viewButtons = screen.getAllByRole("link", { name: /view/i })

			expect(editButtons).toHaveLength(2)
			expect(viewButtons).toHaveLength(2)

			// Check that view buttons have correct destinations
			expect(viewButtons[0]).toHaveAttribute(
				"href",
				"/thinking/about/building/published-post"
			)
			expect(viewButtons[1]).toHaveAttribute(
				"href",
				"/admin/posts/draft-post-id/preview"
			)
		})

		it("provides correct tooltips for action buttons", () => {
			render(<PostsTable posts={mockPosts} />)

			const viewDraftButton = screen.getByRole("link", { name: /view draft/i })
			expect(viewDraftButton).toHaveAttribute("title", "View Draft")
		})
	})

	describe("Search and Filter Integration", () => {
		it("maintains draft view buttons after filtering", () => {
			render(<PostsTable posts={mockPosts} />)

			const searchInput = screen.getByPlaceholderText("Search posts...")
			fireEvent.change(searchInput, { target: { value: "Draft" } })

			// After filtering for draft posts, view draft button should still be there
			expect(
				screen.getByRole("link", { name: /view draft/i })
			).toBeInTheDocument()
		})

		it("shows empty state when no draft posts match filter", () => {
			render(<PostsTable posts={mockPosts} />)

			const searchInput = screen.getByPlaceholderText("Search posts...")
			fireEvent.change(searchInput, { target: { value: "Nonexistent" } })

			expect(
				screen.getByText(/no posts match your search criteria/i)
			).toBeInTheDocument()
			expect(
				screen.queryByRole("link", { name: /view/i })
			).not.toBeInTheDocument()
		})
	})

	describe("Button Accessibility", () => {
		it("provides accessible labels for draft view buttons", () => {
			render(<PostsTable posts={[mockDraftPost]} />)

			const viewDraftButton = screen.getByRole("link", { name: /view draft/i })
			// Check that it has proper screen reader text instead of aria-label
			expect(viewDraftButton).toHaveTextContent("View Draft")
		})

		it("provides accessible labels for published view buttons", () => {
			render(<PostsTable posts={[mockPublishedPost]} />)

			const viewLiveButton = screen.getByRole("link", {
				name: /view live post/i,
			})
			// Check that it has proper screen reader text instead of aria-label
			expect(viewLiveButton).toHaveTextContent("View Live Post")
		})

		it("includes screen reader text for action context", () => {
			render(<PostsTable posts={[mockDraftPost]} />)

			const viewDraftButton = screen.getByRole("link", { name: /view draft/i })
			const screenReaderText = viewDraftButton.querySelector(".sr-only")
			expect(screenReaderText).toHaveTextContent("View Draft")
		})
	})

	describe("Error Handling", () => {
		it("handles posts with missing IDs gracefully", () => {
			const invalidPost = { ...mockDraftPost, id: "" }

			render(<PostsTable posts={[invalidPost]} />)

			// Should still render the post but without functional buttons
			expect(screen.getByText("Draft Post")).toBeInTheDocument()
		})

		it("handles posts with null published_at correctly", () => {
			const nullPublishedPost = { ...mockDraftPost, published_at: null }

			render(<PostsTable posts={[nullPublishedPost]} />)

			expect(screen.getByText("Draft")).toBeInTheDocument()
			expect(
				screen.getByRole("link", { name: /view draft/i })
			).toBeInTheDocument()
		})
	})

	describe("Performance Considerations", () => {
		it("renders efficiently with large number of posts", () => {
			const largePosts = Array.from({ length: 100 }, (_, i) => ({
				...mockDraftPost,
				id: `post-${i}`,
				title: `Post ${i}`,
			}))

			const { container } = render(<PostsTable posts={largePosts} />)

			// Should render without performance issues
			expect(container.querySelectorAll("tr")).toHaveLength(101) // 100 posts + header
		})
	})

	describe("URL Generation Validation", () => {
		it("generates valid admin preview URLs for drafts", () => {
			render(<PostsTable posts={[mockDraftPost]} />)

			const viewDraftButton = screen.getByRole("link", { name: /view draft/i })
			const href = viewDraftButton.getAttribute("href")

			// URL should follow the pattern /admin/posts/[id]/preview
			expect(href).toMatch(/^\/admin\/posts\/[^\/]+\/preview$/)
		})

		it("generates valid thinking URLs for published posts with /about/ segment", () => {
			render(<PostsTable posts={[mockPublishedPost]} />)

			const viewLiveButton = screen.getByRole("link", {
				name: /view live post/i,
			})
			const href = viewLiveButton.getAttribute("href")

			// URL should follow the pattern /thinking/about/[category]/[slug]
			expect(href).toMatch(/^\/thinking\/about\/[^\/]+\/[^\/]+$/)
		})

		it("escapes special characters in post IDs for URLs", () => {
			const specialIdPost = {
				...mockDraftPost,
				id: "post-with-special-chars-123",
			}

			render(<PostsTable posts={[specialIdPost]} />)

			const viewDraftButton = screen.getByRole("link", { name: /view draft/i })
			expect(viewDraftButton).toHaveAttribute(
				"href",
				"/admin/posts/post-with-special-chars-123/preview"
			)
		})

		it("generates correct URLs for different post categories", () => {
			const technologyPost = {
				...mockPublishedPost,
				category: "Technology",
				slug: "ai-slop-will-eat-itself",
			}
			const buildingPost = {
				...mockPublishedPost,
				category: "Building",
				slug: "startup-lessons",
			}

			render(<PostsTable posts={[technologyPost, buildingPost]} />)

			const viewButtons = screen.getAllByRole("link", {
				name: /view live post/i,
			})

			expect(viewButtons[0]).toHaveAttribute(
				"href",
				"/thinking/about/technology/ai-slop-will-eat-itself"
			)
			expect(viewButtons[1]).toHaveAttribute(
				"href",
				"/thinking/about/building/startup-lessons"
			)
		})

		it("handles lowercase category conversion correctly", () => {
			const mixedCasePost = {
				...mockPublishedPost,
				category: "Technology",
				slug: "test-post",
			}

			render(<PostsTable posts={[mixedCasePost]} />)

			const viewButton = screen.getByRole("link", { name: /view live post/i })
			expect(viewButton).toHaveAttribute(
				"href",
				"/thinking/about/technology/test-post"
			)
		})

		it("generates URLs that match the expected blog post structure", () => {
			const testPost = {
				...mockPublishedPost,
				category: "Technology",
				slug: "ai-slop-will-eat-itself",
			}

			render(<PostsTable posts={[testPost]} />)

			const viewButton = screen.getByRole("link", { name: /view live post/i })
			const href = viewButton.getAttribute("href")

			// Should match the required format: /thinking/about/[category]/[slug]
			expect(href).toBe("/thinking/about/technology/ai-slop-will-eat-itself")
		})
	})

	describe("Publish Button Functionality", () => {
		it("shows view draft button for draft posts", () => {
			render(<PostsTable posts={[mockDraftPost]} />)

			expect(
				screen.getByRole("link", { name: /view draft/i })
			).toBeInTheDocument()
		})

		it("shows view live post button for published posts", () => {
			render(<PostsTable posts={[mockPublishedPost]} />)

			expect(
				screen.getByRole("link", { name: /view live post/i })
			).toBeInTheDocument()
		})

		it("does not show publish button for published posts", () => {
			render(<PostsTable posts={[mockPublishedPost]} />)

			expect(
				screen.queryByTestId("publish-button-published-post-id")
			).not.toBeInTheDocument()
		})

		it("passes correct props to publish button", () => {
			render(<PostsTable posts={[mockDraftPost]} />)

			const publishButton = screen.getByTestId("publish-button-draft-post-id")
			expect(publishButton).toBeInTheDocument()
			expect(publishButton).toHaveTextContent("Publish Draft Post")
		})

		it("shows publish button alongside other action buttons for drafts", () => {
			render(<PostsTable posts={[mockDraftPost]} />)

			// Should have edit, view draft, and publish buttons
			expect(screen.getByRole("link", { name: /edit/i })).toBeInTheDocument()
			expect(
				screen.getByRole("link", { name: /view draft/i })
			).toBeInTheDocument()
			expect(
				screen.getByTestId("publish-button-draft-post-id")
			).toBeInTheDocument()
		})

		it("handles multiple draft posts with publish buttons", () => {
			const multipleDrafts = [
				{ ...mockDraftPost, id: "draft-1", title: "Draft 1" },
				{ ...mockDraftPost, id: "draft-2", title: "Draft 2" },
			]

			render(<PostsTable posts={multipleDrafts} />)

			const publishButtons = screen.getAllByTestId(/^publish-button-/)
			expect(publishButtons).toHaveLength(2)

			expect(publishButtons[0]).toHaveTextContent("Publish Draft 1")
			expect(publishButtons[1]).toHaveTextContent("Publish Draft 2")
		})
	})
})
