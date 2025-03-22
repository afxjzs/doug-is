/**
 * Edit Post Page
 *
 * This page provides an interface for editing existing blog posts,
 * including the ability to upload featured images.
 */

import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerUser, isAdminUser } from "@/lib/auth/supabaseServerAuth"
import { adminGetPostById } from "@/lib/supabase/serverClient"
import PostEditor from "@/components/admin/PostEditor"

// Mark as dynamic to ensure we always get fresh data
export const dynamic = "force-dynamic"

// Generate metadata for the page
export const metadata: Metadata = {
	title: "Edit Post | Admin",
	description: "Edit blog post",
}

// Post edit page component
export default async function EditPostPage({
	params,
}: {
	params: { id: string }
}) {
	try {
		// Verify user is authenticated and has admin privileges
		const user = await getServerUser()
		const isAdmin = await isAdminUser()

		if (!user || !isAdmin) {
			console.log("Not authenticated as admin, redirecting to login")
			redirect("/admin/login?redirect=/admin/posts")
		}

		// Get the post ID from the URL params
		const { id } = params

		if (!id) {
			redirect("/admin/posts")
		}

		// Fetch the post data
		const post = await adminGetPostById(id)

		if (!post) {
			// Post not found, redirect back to posts list
			redirect("/admin/posts")
		}

		return (
			<div>
				<h1 className="text-3xl font-bold mb-6">Edit Post</h1>
				<PostEditor post={post} mode="edit" />
			</div>
		)
	} catch (error) {
		console.error("Error in EditPostPage:", error)
		return (
			<div className="admin-card p-6">
				<h1 className="text-3xl font-bold text-[rgba(var(--color-red),0.9)] mb-6">
					Error
				</h1>
				<p className="mb-4">An error occurred while loading the post editor.</p>
				<p className="text-sm text-[rgba(var(--color-foreground),0.7)]">
					Please try refreshing the page or contact the administrator.
				</p>
			</div>
		)
	}
}
