import { render, screen, fireEvent } from "@testing-library/react"
import PostsTable from "../PostsTable"
import { Post } from "@/lib/supabase/serverClient"

// Mock sample posts data
const mockPosts: Post[] = [
	{
		id: "1",
		title: "First Post",
		slug: "first-post",
		content: "First post content",
		excerpt: "This is the first post excerpt",
		category: "Development",
		published_at: "2024-04-17T00:00:00.000Z",
		featured_image: null,
		created_at: "2024-04-17T00:00:00.000Z",
		updated_at: "2024-04-17T00:00:00.000Z",
	},
	{
		id: "2",
		title: "Second Post",
		slug: "second-post",
		content: "Second post content",
		excerpt: "This is the second post excerpt",
		category: "Design",
		published_at: null, // Draft post
		featured_image: null,
		created_at: "2024-04-17T00:00:00.000Z",
		updated_at: "2024-04-17T00:00:00.000Z",
	},
]

// Mock next/navigation
jest.mock("next/navigation", () => ({
	useRouter() {
		return {
			push: jest.fn(),
		}
	},
}))

describe("PostsTable", () => {
	it("renders all posts initially", () => {
		render(<PostsTable posts={mockPosts} />)
		expect(screen.getByText("First Post")).toBeInTheDocument()
		expect(screen.getByText("Second Post")).toBeInTheDocument()
	})

	it("filters posts by search term", () => {
		render(<PostsTable posts={mockPosts} />)

		const searchInput = screen.getByPlaceholderText("Search posts...")
		fireEvent.change(searchInput, { target: { value: "first" } })

		expect(screen.getByText("First Post")).toBeInTheDocument()
		expect(screen.queryByText("Second Post")).not.toBeInTheDocument()
	})

	it("filters posts by category", () => {
		render(<PostsTable posts={mockPosts} />)

		const categorySelect = screen.getByRole("combobox")
		fireEvent.change(categorySelect, { target: { value: "Design" } })

		expect(screen.queryByText("First Post")).not.toBeInTheDocument()
		expect(screen.getByText("Second Post")).toBeInTheDocument()
	})

	it("shows 'Draft' for unpublished posts", () => {
		render(<PostsTable posts={mockPosts} />)
		const draftLabels = screen.getAllByText("Draft")
		expect(draftLabels).toHaveLength(1)
	})

	it("shows formatted date for published posts", () => {
		render(<PostsTable posts={mockPosts} />)
		expect(screen.getByText("Apr 16, 2024")).toBeInTheDocument()
	})

	it("shows 'No posts' message when no posts match filters", () => {
		render(<PostsTable posts={mockPosts} />)

		const searchInput = screen.getByPlaceholderText("Search posts...")
		fireEvent.change(searchInput, { target: { value: "nonexistent" } })

		expect(
			screen.getByText(/no posts match your search criteria/i)
		).toBeInTheDocument()
	})

	it("truncates long excerpts", () => {
		const longExcerptPost = {
			...mockPosts[0],
			excerpt:
				"This is a very long excerpt that should be truncated because it exceeds the maximum length allowed for display in the table",
		}

		render(<PostsTable posts={[longExcerptPost]} />)

		const excerpt = screen.getByText(/this is a very long excerpt/i)
		expect(excerpt.textContent?.length).toBeLessThanOrEqual(73) // 70 chars + "..."
		expect(excerpt.textContent?.endsWith("...")).toBe(true)
	})
})
