import { render, screen, waitFor } from "@testing-library/react"
import { redirect } from "next/navigation"
import EditPostPage from "../page"
import {
	getCurrentUser,
	isCurrentUserAdmin,
	createAdminSupabaseClient,
} from "@/lib/auth/unified-auth"

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
	redirect: jest.fn(),
}))

// Mock unified auth
jest.mock("@/lib/auth/unified-auth", () => ({
	getCurrentUser: jest.fn(),
	isCurrentUserAdmin: jest.fn(),
	createAdminSupabaseClient: jest.fn(),
}))

// Mock PostEditor component
jest.mock("@/components/admin/PostEditor", () => {
	return function MockPostEditor({ post, mode }: { post: any; mode: string }) {
		return (
			<div data-testid="post-editor">
				<span>Post Editor - Mode: {mode}</span>
				<span>Post ID: {post?.id}</span>
				<span>Post Title: {post?.title}</span>
			</div>
		)
	}
})

describe("EditPostPage", () => {
	const mockUser = { id: "user123", email: "admin@example.com" }
	const mockPost = {
		id: "post123",
		title: "Test Post",
		content: "Test content",
		slug: "test-post",
		category: "testing",
	}

	const mockSupabaseClient = {
		from: jest.fn().mockReturnThis(),
		select: jest.fn().mockReturnThis(),
		eq: jest.fn().mockReturnThis(),
		single: jest.fn(),
	}

	beforeEach(() => {
		jest.clearAllMocks()
		;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
		;(isCurrentUserAdmin as jest.Mock).mockResolvedValue(true)
		;(createAdminSupabaseClient as jest.Mock).mockReturnValue(
			mockSupabaseClient
		)
	})

	it("renders edit post page with post data", async () => {
		// Mock successful post fetch
		mockSupabaseClient.single.mockResolvedValue({
			data: mockPost,
			error: null,
		})

		const params = { id: "post123" }

		render(await EditPostPage({ params }))

		await waitFor(() => {
			expect(screen.getByText("Edit Post")).toBeInTheDocument()
			expect(screen.getByTestId("post-editor")).toBeInTheDocument()
			expect(screen.getByText("Post Editor - Mode: edit")).toBeInTheDocument()
			expect(screen.getByText("Post ID: post123")).toBeInTheDocument()
			expect(screen.getByText("Post Title: Test Post")).toBeInTheDocument()
		})
	})

	it("redirects to login when user is not authenticated", async () => {
		;(getCurrentUser as jest.Mock).mockResolvedValue(null)

		const params = { id: "post123" }

		await EditPostPage({ params })

		expect(redirect).toHaveBeenCalledWith("/admin/login?redirect=/admin/posts")
	})

	it("redirects to login when user is not admin", async () => {
		;(isCurrentUserAdmin as jest.Mock).mockResolvedValue(false)

		const params = { id: "post123" }

		await EditPostPage({ params })

		expect(redirect).toHaveBeenCalledWith("/admin/login?redirect=/admin/posts")
	})

	it("redirects to posts list when post ID is missing", async () => {
		const params = { id: "" }

		await EditPostPage({ params })

		expect(redirect).toHaveBeenCalledWith("/admin/posts")
	})

	it("redirects to posts list when post is not found (404 scenario)", async () => {
		// Mock post not found
		mockSupabaseClient.single.mockResolvedValue({
			data: null,
			error: { message: "Post not found" },
		})

		const params = { id: "nonexistent-post" }

		await EditPostPage({ params })

		expect(redirect).toHaveBeenCalledWith("/admin/posts")
	})

	it("renders error message when an unexpected error occurs", async () => {
		// Mock unexpected error
		;(getCurrentUser as jest.Mock).mockRejectedValue(
			new Error("Database error")
		)

		const params = { id: "post123" }

		render(await EditPostPage({ params }))

		await waitFor(() => {
			expect(screen.getByText("Error")).toBeInTheDocument()
			expect(
				screen.getByText("An error occurred while loading the post editor.")
			).toBeInTheDocument()
		})
	})

	it("calls adminGetPostById with correct post ID", async () => {
		mockSupabaseClient.single.mockResolvedValue({
			data: mockPost,
			error: null,
		})

		const params = { id: "specific-post-id" }

		await EditPostPage({ params })

		expect(createAdminSupabaseClient).toHaveBeenCalled()
		expect(mockSupabaseClient.from).toHaveBeenCalledWith("posts")
		expect(mockSupabaseClient.select).toHaveBeenCalledWith("*")
		expect(mockSupabaseClient.eq).toHaveBeenCalledWith("id", "specific-post-id")
		expect(mockSupabaseClient.single).toHaveBeenCalled()
	})

	it("handles database errors gracefully", async () => {
		// Mock database error
		mockSupabaseClient.single.mockResolvedValue({
			data: null,
			error: { message: "Database connection failed" },
		})

		const params = { id: "post123" }

		await EditPostPage({ params })

		// Should redirect to posts list when post fetch fails
		expect(redirect).toHaveBeenCalledWith("/admin/posts")
	})

	it("verifies post editor receives correct props", async () => {
		mockSupabaseClient.single.mockResolvedValue({
			data: mockPost,
			error: null,
		})

		const params = { id: "post123" }

		render(await EditPostPage({ params }))

		await waitFor(() => {
			const postEditor = screen.getByTestId("post-editor")
			expect(postEditor).toBeInTheDocument()

			// Verify the PostEditor component receives the post and mode props
			expect(screen.getByText("Post Editor - Mode: edit")).toBeInTheDocument()
			expect(screen.getByText("Post ID: post123")).toBeInTheDocument()
		})
	})
})
