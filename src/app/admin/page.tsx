/**
 * Admin Dashboard Page
 *
 * This is the main dashboard page that displays an overview of the site's statistics
 * and provides quick access to key admin features.
 */

import { Metadata } from "next"
import { getServerUser, isAdminUser } from "@/lib/auth/supabaseServerAuth"
import {
	adminGetPosts,
	adminGetContactSubmissions,
	Post,
	ContactMessage,
} from "@/lib/supabase/serverClient"
import Link from "next/link"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
	title: "Admin Dashboard | Doug Rogers",
	description: "Admin dashboard for site management",
}

export default async function AdminDashboardPage() {
	try {
		// Get current user and admin status
		const user = await getServerUser()
		const isAdmin = await isAdminUser()

		// Redirect if not admin
		if (!user || !isAdmin) {
			console.log("Not authenticated as admin, redirecting to login")
			redirect("/admin/login?redirect=/admin")
		}

		// Fetch posts and contact messages
		// These will return empty arrays if there's a permission error or no data
		const posts = (await adminGetPosts()) || []
		const contactMessages = (await adminGetContactSubmissions()) || []

		// Count published and draft posts
		const publishedPosts = posts.filter((post) => post.published_at)
		const draftPosts = posts.filter((post) => !post.published_at)

		// Get recent posts and messages (up to 5 of each)
		const recentPosts = [...posts]
			.sort((a, b) => {
				const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
				const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
				return dateB - dateA
			})
			.slice(0, 5)

		const recentMessages = [...contactMessages]
			.sort((a, b) => {
				const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
				const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
				return dateB - dateA
			})
			.slice(0, 5)

		// Format the date for display
		const formatDate = (dateString: string | undefined) => {
			if (!dateString) return "Unknown date"

			const date = new Date(dateString)
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			})
		}

		return (
			<div>
				<h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
				<p className="mb-8">Welcome, {user?.email}</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					{/* Total Posts Card */}
					<div className="admin-card">
						<h2 className="text-xl font-semibold mb-2">Total Posts</h2>
						<p className="text-3xl">{posts.length}</p>
						<Link
							href="/admin/posts"
							className="text-sm text-[rgba(var(--color-violet),0.9)] mt-2 block hover:underline"
						>
							View all posts
						</Link>
					</div>

					{/* Published Posts Card */}
					<div className="admin-card">
						<h2 className="text-xl font-semibold mb-2">Published Posts</h2>
						<p className="text-3xl">{publishedPosts.length}</p>
						<Link
							href="/admin/posts?status=published"
							className="text-sm text-[rgba(var(--color-violet),0.9)] mt-2 block hover:underline"
						>
							View published
						</Link>
					</div>

					{/* Draft Posts Card */}
					<div className="admin-card">
						<h2 className="text-xl font-semibold mb-2">Draft Posts</h2>
						<p className="text-3xl">{draftPosts.length}</p>
						<Link
							href="/admin/posts?status=draft"
							className="text-sm text-[rgba(var(--color-violet),0.9)] mt-2 block hover:underline"
						>
							View drafts
						</Link>
					</div>

					{/* Contact Messages Card */}
					<div className="admin-card">
						<h2 className="text-xl font-semibold mb-2">Contact Messages</h2>
						<p className="text-3xl">{contactMessages.length}</p>
						<Link
							href="/admin/messages"
							className="text-sm text-[rgba(var(--color-violet),0.9)] mt-2 block hover:underline"
						>
							View messages
						</Link>
					</div>
				</div>

				{/* Recent Posts Section */}
				<div className="admin-card mb-8">
					<h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
					{recentPosts.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full admin-table">
								<thead>
									<tr>
										<th>Title</th>
										<th>Status</th>
										<th>Date</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{recentPosts.map((post) => (
										<tr key={post.id}>
											<td className="font-medium">{post.title}</td>
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
											<td className="text-sm">{formatDate(post.created_at)}</td>
											<td>
												<Link
													href={`/admin/posts/${post.id}`}
													className="text-sm text-[rgba(var(--color-violet),0.9)] hover:underline"
												>
													Edit
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="p-4 bg-[rgba(var(--color-foreground),0.05)] rounded-md">
							<p>No posts found. Create your first post to get started.</p>
							<Link
								href="/admin/posts/new"
								className="mt-2 inline-block px-4 py-2 bg-[rgba(var(--color-violet),0.1)] border border-[rgba(var(--color-violet),0.3)] rounded-md text-[rgba(var(--color-violet),0.9)] hover:bg-[rgba(var(--color-violet),0.15)] transition-colors"
							>
								Create a post
							</Link>
						</div>
					)}

					{recentPosts.length > 0 && (
						<Link
							href="/admin/posts"
							className="block mt-4 text-sm text-[rgba(var(--color-violet),0.9)] hover:underline"
						>
							View all posts →
						</Link>
					)}
				</div>

				{/* Recent Messages Section */}
				<div className="admin-card">
					<h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
					{recentMessages.length > 0 ? (
						<div className="overflow-x-auto">
							<table className="w-full admin-table">
								<thead>
									<tr>
										<th>Name</th>
										<th>Email</th>
										<th>Date</th>
										<th>Actions</th>
									</tr>
								</thead>
								<tbody>
									{recentMessages.map((message) => (
										<tr key={message.id}>
											<td className="font-medium">{message.name}</td>
											<td className="text-sm">{message.email}</td>
											<td className="text-sm">
												{formatDate(message.created_at)}
											</td>
											<td>
												<Link
													href={`/admin/messages/${message.id}`}
													className="text-sm text-[rgba(var(--color-violet),0.9)] hover:underline"
												>
													View
												</Link>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className="p-4 bg-[rgba(var(--color-foreground),0.05)] rounded-md">
							<p>
								No contact messages found. Messages will appear here when
								visitors submit the contact form.
							</p>
						</div>
					)}

					{recentMessages.length > 0 && (
						<Link
							href="/admin/messages"
							className="block mt-4 text-sm text-[rgba(var(--color-violet),0.9)] hover:underline"
						>
							View all messages →
						</Link>
					)}
				</div>
			</div>
		)
	} catch (error) {
		console.error("Error in AdminDashboardPage:", error)
		return (
			<div>
				<h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
				<div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-8">
					<h2 className="text-lg font-semibold mb-2">
						Error Loading Dashboard
					</h2>
					<p>
						There was an error loading the admin dashboard data. This might be
						due to:
					</p>
					<ul className="list-disc ml-5 mt-2">
						<li>Authentication issues - please try logging in again</li>
						<li>Database connection problems</li>
						<li>Permission errors - make sure you have admin access</li>
					</ul>
					<div className="mt-4">
						<Link
							href="/admin/login"
							className="px-4 py-2 bg-red-100 text-red-800 rounded-md border border-red-200 hover:bg-red-200 transition-colors"
						>
							Go to Login
						</Link>
					</div>
				</div>
			</div>
		)
	}
}
