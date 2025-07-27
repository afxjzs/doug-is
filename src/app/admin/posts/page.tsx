/**
 * Admin Posts Management Page
 *
 * This page displays all blog posts with management options.
 * Uses UNIFIED AUTHENTICATION SYSTEM.
 */

import { Metadata } from "next"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
	getCurrentUser,
	isCurrentUserAdmin,
} from "@/lib/auth/simple-auth-server"
import { createServiceRoleClient } from "@/lib/supabase/server"
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

// Helper function to get all posts using new simple server auth
async function adminGetAllPosts() {
	try {
		console.log("Getting all posts for admin...")
		const supabase = createServiceRoleClient()

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
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Manage Posts</h1>
					<Link href="/admin/posts/new" className="neon-button-violet">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
								clipRule="evenodd"
							/>
						</svg>
						Create Post
					</Link>
				</div>
				<PostsTable posts={posts} />
			</div>
		)
	} catch (error) {
		console.error("Error in AdminPostsPage:", error)
		return (
			<div className="admin-card p-6">
				<h1 className="text-3xl font-bold text-red-400 mb-6">Error</h1>
				<p className="mb-4">
					An error occurred while loading the posts management page.
				</p>
				<p className="text-sm text-gray-400">
					Please try refreshing the page or contact the administrator.
				</p>
			</div>
		)
	}
}
