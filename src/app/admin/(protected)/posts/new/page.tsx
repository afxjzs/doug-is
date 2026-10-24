/**
 * New Post Page
 *
 * This page provides an interface for creating new blog posts.
 * Uses UNIFIED AUTHENTICATION SYSTEM.
 */

import { Metadata } from "next"
import PostEditor from "@/components/admin/PostEditor"
import { requireAdminPage } from "../../require-admin"

// Mark as dynamic to ensure we always get fresh data
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
	title: "New Post | Admin",
	description: "Create a new blog post",
	robots: {
		index: false,
		follow: false,
	},
}

export default async function NewPostPage() {
	await requireAdminPage()

	try {
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
