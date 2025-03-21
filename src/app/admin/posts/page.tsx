/**
 * Admin Posts Page
 *
 * This page displays all blog posts with options to
 * create, edit, and delete posts.
 */

import { Metadata } from "next"
import Link from "next/link"
import { adminGetPosts, Post } from "@/lib/supabase/serverClient"
import PostsTable from "@/components/admin/PostsTable"

export const metadata: Metadata = {
	title: "Manage Blog Posts | Admin",
	description: "Create, edit, and manage blog posts",
}

export default async function AdminPostsPage() {
	// Get all posts
	const posts = await adminGetPosts()

	// Count published and draft posts
	const publishedPosts = posts.filter(
		(post) => post.published_at !== null
	).length
	const draftPosts = posts.filter((post) => post.published_at === null).length

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-semibold">Manage Blog Posts</h1>
				<Link
					href="/admin/posts/new"
					className="px-4 py-2 bg-[rgba(var(--color-violet),0.9)] hover:bg-[rgba(var(--color-violet),1)] text-white font-medium rounded-md transition-colors duration-200"
				>
					New Post
				</Link>
			</div>

			{/* Summary statistics */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="admin-card">
					<h2 className="text-sm font-medium opacity-80">Total Posts</h2>
					<p className="text-2xl font-bold">{posts.length}</p>
				</div>
				<div className="admin-card">
					<h2 className="text-sm font-medium opacity-80">Published</h2>
					<p className="text-2xl font-bold text-[rgba(var(--color-green),1)]">
						{publishedPosts}
					</p>
				</div>
				<div className="admin-card">
					<h2 className="text-sm font-medium opacity-80">Drafts</h2>
					<p className="text-2xl font-bold text-[rgba(var(--color-amber),1)]">
						{draftPosts}
					</p>
				</div>
			</div>

			{/* Posts table */}
			<div className="admin-card">
				{posts.length === 0 ? (
					<div className="text-center py-8">
						<h3 className="text-lg font-medium">No Posts Created Yet</h3>
						<p className="mt-2 opacity-80">
							Get started by creating your first blog post.
						</p>
						<div className="mt-4">
							<Link
								href="/admin/posts/new"
								className="px-4 py-2 bg-[rgba(var(--color-violet),0.9)] hover:bg-[rgba(var(--color-violet),1)] text-white font-medium rounded-md transition-colors duration-200"
							>
								Create First Post
							</Link>
						</div>
					</div>
				) : (
					<PostsTable posts={posts} />
				)}
			</div>
		</div>
	)
}
