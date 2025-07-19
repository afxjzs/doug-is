/**
 * Admin Posts Management Page
 *
 * This page displays all blog posts with management options.
 * Uses UNIFIED AUTHENTICATION SYSTEM.
 */

import { Metadata } from "next"
import { redirect } from "next/navigation"
import {
	getCurrentUser,
	isCurrentUserAdmin,
	createAdminSupabaseClient,
} from "@/lib/auth/unified-auth"
import PostsTable from "@/components/admin/PostsTable"

// Force dynamic rendering
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
	title: "Manage Posts | Admin",
	description: "Manage blog posts",
	robots: {
		index: false,
		follow: false,
	},
}

// Helper function to get all posts using unified auth
async function adminGetAllPosts() {
	try {
		console.log("Getting all posts for admin...")
		const supabase = createAdminSupabaseClient()

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.order("created_at", { ascending: false })

		if (error) {
			console.error("Error fetching posts:", error)
			return []
		}

		console.log(`Found ${data?.length || 0} posts`)
		return data || []
	} catch (error) {
		console.error("Error in adminGetAllPosts:", error)
		return []
	}
}

export default async function AdminPostsPage() {
	try {
		// Verify user is authenticated and has admin privileges using UNIFIED AUTH
		const user = await getCurrentUser()
		const isAdmin = await isCurrentUserAdmin()

		if (!user || !isAdmin) {
			console.log("Not authenticated as admin, redirecting to login")
			redirect("/admin/login?redirect=/admin/posts")
		}

		// Fetch all posts using unified auth
		const posts = await adminGetAllPosts()

		return (
			<div>
				<h1 className="text-3xl font-bold mb-6">Manage Posts</h1>
				<PostsTable posts={posts} />
			</div>
		)
	} catch (error) {
		console.error("Error in AdminPostsPage:", error)
		return (
			<div className="admin-card p-6">
				<h1 className="text-3xl font-bold text-[rgba(var(--color-red),0.9)] mb-6">
					Error
				</h1>
				<p className="mb-4">
					An error occurred while loading the posts management page.
				</p>
				<p className="text-sm text-[rgba(var(--color-foreground),0.7)]">
					Please try refreshing the page or contact the administrator.
				</p>
			</div>
		)
	}
}
