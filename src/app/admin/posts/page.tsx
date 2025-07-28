/**
 * Admin Posts Management Page
 *
 * This page displays all blog posts with management options.
 * Auth is handled by AdminLayout - no need for duplicate auth checks.
 */

import { Metadata } from "next"
import Link from "next/link"
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

// Helper function to get all posts using Supabase service role
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
	// No auth check needed - AdminLayout handles this
	// Fetch all posts using service role client
	const posts = await adminGetAllPosts()

	return (
		<div>
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Posts Management</h1>
				<Link
					href="/admin/posts/new"
					className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-cyan-700 transition-all duration-200"
				>
					New Post
				</Link>
			</div>

			<div className="admin-card">
				<PostsTable posts={posts} />
			</div>
		</div>
	)
}
