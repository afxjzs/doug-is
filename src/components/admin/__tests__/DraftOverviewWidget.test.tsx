import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"
import DraftOverviewWidget from "../DraftOverviewWidget"
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

// Mock the PublishButton component
jest.mock("../PublishButton", () => {
	return function MockPublishButton({ postId, postTitle }: any) {
		return (
			<button
				data-testid={`publish-button-${postId}`}
				title={`Publish ${postTitle}`}
			>
				Publish
			</button>
		)
	}
})

describe("DraftOverviewWidget", () => {
	const mockDrafts: Post[] = [
		{
			id: "draft-1",
			title: "First Draft Post",
			content: "This is the content of the first draft",
			category: "building",
			excerpt: "This is a draft post about building things",
			featured_image: null,
			created_at: "2024-01-15T10:00:00Z",
			updated_at: "2024-01-15T10:00:00Z",
			published_at: null,
			slug: "first-draft-post",
		},
		{
			id: "draft-2",
			title: "Second Draft Post",
			content: "This is the content of the second draft",
			category: "investing",
			excerpt: "This is a draft post about investing",
			featured_image: null,
			created_at: "2024-01-16T11:00:00Z",
			updated_at: "2024-01-16T11:00:00Z",
			published_at: null,
			slug: "second-draft-post",
		},
		{
			id: "draft-3",
			title: "Third Draft Post",
			content: "This is the content of the third draft",
			category: "advising",
			excerpt: "",
			featured_image: null,
			created_at: "2024-01-17T12:00:00Z",
			updated_at: "2024-01-17T12:00:00Z",
			published_at: null,
			slug: "third-draft-post",
		},
		{
			id: "draft-4",
			title: "Fourth Draft Post",
			content: "This is the content of the fourth draft",
			category: "hustling",
			excerpt: "This is a draft post about hustling",
			featured_image: null,
			created_at: "2024-01-18T13:00:00Z",
			updated_at: "2024-01-18T13:00:00Z",
			published_at: null,
			slug: "fourth-draft-post",
		},
	]

	describe("Empty State", () => {
		it("renders empty state when no drafts", () => {
			render(<DraftOverviewWidget drafts={[]} />)

			expect(screen.getByText("Draft Posts")).toBeInTheDocument()
			expect(screen.getByText("No draft posts")).toBeInTheDocument()
			expect(
				screen.getByText("Create your first draft to get started")
			).toBeInTheDocument()
			expect(screen.getByText("New Draft")).toBeInTheDocument()
		})

		it("has correct link to create new draft", () => {
			render(<DraftOverviewWidget drafts={[]} />)

			const newDraftLink = screen.getByText("New Draft")
			expect(newDraftLink).toHaveAttribute("href", "/admin/posts/new")
		})
	})

	describe("Draft List", () => {
		it("renders draft count correctly", () => {
			render(<DraftOverviewWidget drafts={mockDrafts} />)

			expect(screen.getByText("4 drafts ready for review")).toBeInTheDocument()
		})

		it("renders single draft count correctly", () => {
			render(<DraftOverviewWidget drafts={[mockDrafts[0]]} />)

			expect(screen.getByText("1 draft ready for review")).toBeInTheDocument()
		})

		it("shows only first 3 drafts", () => {
			render(<DraftOverviewWidget drafts={mockDrafts} />)

			expect(screen.getByText("First Draft Post")).toBeInTheDocument()
			expect(screen.getByText("Second Draft Post")).toBeInTheDocument()
			expect(screen.getByText("Third Draft Post")).toBeInTheDocument()
			expect(screen.queryByText("Fourth Draft Post")).not.toBeInTheDocument()
		})

		it("shows view all link when more than 3 drafts", () => {
			render(<DraftOverviewWidget drafts={mockDrafts} />)

			expect(screen.getByText("View all 4 drafts →")).toBeInTheDocument()
		})

		it("does not show view all link when 3 or fewer drafts", () => {
			render(<DraftOverviewWidget drafts={mockDrafts.slice(0, 3)} />)

			expect(screen.queryByText(/View all/)).not.toBeInTheDocument()
		})
	})

	describe("Draft Information", () => {
		it("displays draft title", () => {
			render(<DraftOverviewWidget drafts={[mockDrafts[0]]} />)

			expect(screen.getByText("First Draft Post")).toBeInTheDocument()
		})

		it("displays draft category", () => {
			render(<DraftOverviewWidget drafts={[mockDrafts[0]]} />)

			expect(screen.getByText("building")).toBeInTheDocument()
		})

		it("displays draft creation date", () => {
			render(<DraftOverviewWidget drafts={[mockDrafts[0]]} />)

			expect(screen.getByText("Jan 15, 2024")).toBeInTheDocument()
		})

		it("displays draft excerpt when available", () => {
			render(<DraftOverviewWidget drafts={[mockDrafts[0]]} />)

			expect(
				screen.getByText("This is a draft post about building things")
			).toBeInTheDocument()
		})

		it("does not display excerpt when not available", () => {
			render(<DraftOverviewWidget drafts={[mockDrafts[2]]} />)

			expect(
				screen.queryByText(/This is a draft post about advising/)
			).not.toBeInTheDocument()
		})
	})

	describe("Action Buttons", () => {
		it("renders preview button for each draft", () => {
			render(<DraftOverviewWidget drafts={[mockDrafts[0]]} />)

			const previewButton = screen.getByText("Preview Draft")
			expect(previewButton).toBeInTheDocument()
			expect(previewButton).toHaveAttribute(
				"href",
				"/admin/posts/draft-1/preview"
			)
		})

		it("renders edit button for each draft", () => {
			render(<DraftOverviewWidget drafts={[mockDrafts[0]]} />)

			const editButton = screen.getByText("Edit Draft")
			expect(editButton).toBeInTheDocument()
			expect(editButton).toHaveAttribute("href", "/admin/posts/draft-1")
		})

		it("renders publish button for each draft", () => {
			render(<DraftOverviewWidget drafts={[mockDrafts[0]]} />)

			const publishButton = screen.getByTestId("publish-button-draft-1")
			expect(publishButton).toBeInTheDocument()
			expect(publishButton).toHaveAttribute("title", "Publish First Draft Post")
		})
	})

	describe("Navigation Links", () => {
		it("has correct link to view all drafts", () => {
			render(<DraftOverviewWidget drafts={mockDrafts} />)

			const viewAllLink = screen.getByText("View all 4 drafts →")
			expect(viewAllLink).toHaveAttribute("href", "/admin/posts")
		})
	})
})
