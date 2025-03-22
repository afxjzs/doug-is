/**
 * Admin Posts Page
 *
 * This page displays all posts with management options.
 */

import { Metadata } from "next"
import { getServerUser, isAdminUser } from "@/lib/auth/supabaseServerAuth"
import { adminGetPosts } from "@/lib/supabase/serverClient"
import Link from "next/link"
import { redirect } from "next/navigation"

// Mark this page as dynamic to prevent static generation
export const dynamic = "force-dynamic"

export const metadata: Metadata = {
	title: "Posts | Admin Dashboard",
	description: "Manage site posts and articles",
}

export default async function AdminPostsPage({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	try {
		// Verify user is authenticated and is an admin
		const user = await getServerUser()
		const isAdmin = await isAdminUser()

		if (!user || !isAdmin) {
			console.log("Not authenticated as admin, redirecting to login")
			redirect("/admin/login?redirect=/admin/posts")
		}

		// Get status filter from query params, defaulting to "all"
		const statusParam = searchParams.status || "all"
		const status = typeof statusParam === "string" ? statusParam : "all"

		// Fetch all posts
		const allPosts = await adminGetPosts()

		// Filter posts based on status
		const posts =
			status === "published"
				? allPosts.filter((post) => !!post.published_at)
				: status === "draft"
				? allPosts.filter((post) => !post.published_at)
				: allPosts

		// Format date for display
		const formatDate = (dateString: string | undefined) => {
			if (!dateString) return "Not published"

			const date = new Date(dateString)
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			})
		}

		return (
			<div>
				<div className="flex justify-between items-center mb-6">
					<h1 className="text-3xl font-bold">Posts</h1>
					<Link
						href="/admin/posts/new"
						className="px-4 py-2 bg-[rgba(var(--color-violet),0.9)] hover:bg-[rgba(var(--color-violet),1)] text-white rounded-md transition-colors"
					>
						Create Post
					</Link>
				</div>

				{/* Status filters */}
				<div className="flex gap-2 mb-6">
					<Link
						href="/admin/posts"
						className={`px-3 py-1 rounded-md text-sm ${
							status === "all"
								? "bg-[rgba(var(--color-violet),0.1)] text-[rgba(var(--color-violet),0.9)]"
								: "bg-[rgba(var(--color-foreground),0.05)] text-[rgba(var(--color-foreground),0.7)] hover:bg-[rgba(var(--color-foreground),0.1)]"
						}`}
					>
						All ({allPosts.length})
					</Link>
					<Link
						href="/admin/posts?status=published"
						className={`px-3 py-1 rounded-md text-sm ${
							status === "published"
								? "bg-[rgba(var(--color-emerald),0.1)] text-[rgba(var(--color-emerald),0.9)]"
								: "bg-[rgba(var(--color-foreground),0.05)] text-[rgba(var(--color-foreground),0.7)] hover:bg-[rgba(var(--color-foreground),0.1)]"
						}`}
					>
						Published ({allPosts.filter((post) => !!post.published_at).length})
					</Link>
					<Link
						href="/admin/posts?status=draft"
						className={`px-3 py-1 rounded-md text-sm ${
							status === "draft"
								? "bg-[rgba(var(--color-foreground),0.1)] text-[rgba(var(--color-foreground),0.9)]"
								: "bg-[rgba(var(--color-foreground),0.05)] text-[rgba(var(--color-foreground),0.7)] hover:bg-[rgba(var(--color-foreground),0.1)]"
						}`}
					>
						Drafts ({allPosts.filter((post) => !post.published_at).length})
					</Link>
				</div>

				{/* Posts table */}
				{posts.length > 0 ? (
					<div className="admin-card overflow-x-auto">
						<table className="w-full admin-table">
							<thead>
								<tr>
									<th>Title</th>
									<th>Category</th>
									<th>Status</th>
									<th>Date</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{posts.map((post) => (
									<tr key={post.id}>
										<td className="font-medium">{post.title}</td>
										<td>{post.category}</td>
										<td>
											{post.published_at ? (
												<span className="px-2 py-1 text-xs rounded-full bg-[rgba(var(--color-emerald),0.1)] text-[rgba(var(--color-emerald),0.9)]">
													Published
												</span>
											) : (
												<span className="px-2 py-1 text-xs rounded-full bg-[rgba(var(--color-foreground),0.1)] text-[rgba(var(--color-foreground),0.6)]">
													Draft
												</span>
											)}
										</td>
										<td className="text-sm">
											{formatDate(post.published_at || post.created_at)}
										</td>
										<td>
											<div className="flex gap-3">
												<Link
													href={`/admin/posts/${post.id}`}
													className="text-sm text-[rgba(var(--color-violet),0.9)] hover:underline"
												>
													Edit
												</Link>
												{post.published_at && (
													<Link
														href={`/thinking/${post.category.toLowerCase()}/${
															post.slug
														}`}
														className="text-sm text-[rgba(var(--color-cyan),0.9)] hover:underline"
														target="_blank"
													>
														View
													</Link>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className="admin-card p-6 text-center">
						<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
							No posts found
						</p>
						<Link
							href="/admin/posts/new"
							className="px-4 py-2 bg-[rgba(var(--color-violet),0.1)] border border-[rgba(var(--color-violet),0.3)] text-[rgba(var(--color-violet),0.9)] rounded-md hover:bg-[rgba(var(--color-violet),0.15)] transition-colors"
						>
							Create your first post
						</Link>
					</div>
				)}
			</div>
		)
	} catch (error) {
		console.error("Error in AdminPostsPage:", error)
		return (
			<div className="admin-card p-6">
				<h1 className="text-3xl font-bold text-[rgba(var(--color-red),0.9)] mb-6">
					Error
				</h1>
				<p className="mb-4">An error occurred while loading posts.</p>
				<p className="text-sm text-[rgba(var(--color-foreground),0.7)]">
					Please try refreshing the page or contact the administrator.
				</p>
			</div>
		)
	}
}
