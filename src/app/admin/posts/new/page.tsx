/**
 * New Post Page
 *
 * This page provides an interface for creating new blog posts,
 * including the ability to upload featured images.
 */

import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerUser, isAdminUser } from "@/lib/auth/supabaseServerAuth"
import PostEditor from "@/components/admin/PostEditor"

// Mark as dynamic to ensure we don't cache authentication state
export const dynamic = "force-dynamic"

// Generate metadata for the page
export const metadata: Metadata = {
	title: "Create New Post | Admin",
	description: "Create a new blog post",
}

// New post page component
export default async function NewPostPage() {
	try {
		// Verify user is authenticated and has admin privileges
		const user = await getServerUser()
		const isAdmin = await isAdminUser()

		if (!user || !isAdmin) {
			console.log("Not authenticated as admin, redirecting to login")
			redirect("/admin/login?redirect=/admin/posts/new")
		}

		return (
			<div>
				<h1 className="text-3xl font-bold mb-6">Create New Post</h1>
				<PostEditor mode="create" />
			</div>
		)
	} catch (error) {
		console.error("Error in NewPostPage:", error)
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
