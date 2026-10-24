/**
 * Edit Post Page
 *
 * Admin page for editing an existing blog post. Handles loading the post data,
 * permission checking, and rendering the post editor in edit mode.
 */

import { redirect } from "next/navigation"
import { adminGetPostById } from "@/lib/supabase/serverClient"
import PostEditor from "@/components/admin/PostEditor"
import { requireAdminPage } from "../../require-admin"

interface PageProps {
	params: Promise<{ id: string }>
}

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic"

/**
 * Generate metadata for the edit post page
 */
export async function generateMetadata({ params }: PageProps) {
	// The title is read with the service role, so this needs its own check.
	await requireAdminPage()
	const { id } = await params
	try {
		const post = await adminGetPostById(id)
		return {
			title: `Edit: ${post?.title || "Post"} - Admin`,
			description: `Edit the blog post: ${post?.title || "Untitled"}`,
		}
	} catch (error) {
		return {
			title: "Edit Post - Admin",
			description: "Edit a blog post",
		}
	}
}

/**
 * Edit Post Page Component
 */
export default async function EditPostPage({ params }: PageProps) {
	// Outside the try: redirect() throws, and the catch below would swallow it.
	await requireAdminPage()
	const { id } = await params

	try {
		// Fetch the post data
		const post = await adminGetPostById(id)

		if (!post) {
			// Post not found, redirect to posts list
			redirect("/admin/posts?error=post_not_found")
		}

		return (
			<div>
				<h1 className="text-3xl font-bold mb-6">Edit Post</h1>
				<PostEditor mode="edit" post={post} />
			</div>
		)
	} catch (error) {
		console.error("Error in EditPostPage:", error)
		return (
			<div className="admin-card p-6">
				<h1 className="text-3xl font-bold text-[rgba(var(--color-red),0.9)] mb-6">
					Error
				</h1>
				<p className="mb-4">An error occurred while loading the post.</p>
				<p className="text-sm text-[rgba(var(--color-foreground),0.7)]">
					Please try again or contact the administrator.
				</p>
			</div>
		)
	}
}
