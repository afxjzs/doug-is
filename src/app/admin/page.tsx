/**
 * Admin Dashboard - Main Admin Page
 *
 * This page provides an overview of the admin area with quick access
 * to posts and contact messages. Uses UNIFIED AUTHENTICATION SYSTEM.
 */

import { redirect } from "next/navigation"
import {
	getCurrentUser,
	isCurrentUserAdmin,
	createAdminSupabaseClient,
} from "@/lib/auth/unified-auth"
import Link from "next/link"

// Force dynamic rendering to ensure fresh data
export const dynamic = "force-dynamic"

// Helper function to get posts using unified auth
async function adminGetPosts() {
	try {
		console.log("Getting posts...")
		const supabase = createAdminSupabaseClient()
		console.log("Creating admin client with service role")

		const { data, error } = await supabase
			.from("posts")
			.select("*")
			.order("published_at", { ascending: false })

		if (error) {
			console.error("Error fetching posts:", error)
			return []
		}

		console.log(`Found ${data?.length || 0} posts`)
		return data || []
	} catch (error) {
		console.error("Error in adminGetPosts:", error)
		return []
	}
}

// Helper function to get contact messages using unified auth
async function adminGetContactSubmissions() {
	try {
		console.log("Getting contact submissions...")
		const supabase = createAdminSupabaseClient()
		console.log("Creating admin client with service role")

		const { data, error } = await supabase
			.from("contact_messages")
			.select("*")
			.order("created_at", { ascending: false })

		if (error) {
			console.error("Error fetching contact submissions:", error)
			return []
		}

		console.log(`Found ${data?.length || 0} contact submissions`)
		return data || []
	} catch (error) {
		console.error("Error in adminGetContactSubmissions:", error)
		return []
	}
}

export default async function AdminPage() {
	try {
		// Verify user is authenticated and has admin privileges using UNIFIED AUTH
		const user = await getCurrentUser()
		const isAdmin = await isCurrentUserAdmin()

		if (!user || !isAdmin) {
			console.log("Not authenticated as admin, redirecting to login")
			redirect("/admin/login")
		}

		// Get data using unified auth functions
		const [posts, contactSubmissions] = await Promise.all([
			adminGetPosts(),
			adminGetContactSubmissions(),
		])

		return (
			<div className="space-y-8">
				<div>
					<h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
					<p className="text-[rgba(var(--color-foreground),0.7)]">
						Welcome back, {user.email}! Here's an overview of your content.
					</p>
				</div>

				{/* Quick Stats */}
				<div className="grid md:grid-cols-2 gap-6">
					<div className="admin-card p-6">
						<h2 className="text-xl font-semibold mb-4">Posts</h2>
						<div className="flex items-center justify-between mb-4">
							<span className="text-2xl font-bold">{posts.length}</span>
							<Link
								href="/admin/posts/new"
								className="bg-[rgba(var(--color-green),0.9)] hover:bg-[rgba(var(--color-green),1)] text-white px-4 py-2 rounded text-sm transition-colors"
							>
								New Post
							</Link>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Published:</span>
								<span>{posts.filter((p) => p.published_at).length}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Drafts:</span>
								<span>{posts.filter((p) => !p.published_at).length}</span>
							</div>
						</div>
						<Link
							href="/admin/posts"
							className="block mt-4 text-[rgba(var(--color-violet),0.9)] hover:text-[rgba(var(--color-violet),1)] text-sm"
						>
							Manage all posts →
						</Link>
					</div>

					<div className="admin-card p-6">
						<h2 className="text-xl font-semibold mb-4">Contact Messages</h2>
						<div className="flex items-center justify-between mb-4">
							<span className="text-2xl font-bold">
								{contactSubmissions.length}
							</span>
						</div>
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Total messages:</span>
								<span>{contactSubmissions.length}</span>
							</div>
							<div className="flex justify-between text-sm">
								<span>Recent (7 days):</span>
								<span>
									{
										contactSubmissions.filter(
											(msg) =>
												new Date(msg.created_at) >
												new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
										).length
									}
								</span>
							</div>
						</div>
						<Link
							href="/admin/contacts"
							className="block mt-4 text-[rgba(var(--color-violet),0.9)] hover:text-[rgba(var(--color-violet),1)] text-sm"
						>
							View all messages →
						</Link>
					</div>
				</div>

				{/* Recent Posts */}
				<div className="admin-card">
					<div className="p-6 border-b border-[rgba(var(--color-foreground),0.1)]">
						<h2 className="text-xl font-semibold">Recent Posts</h2>
					</div>
					<div className="divide-y divide-[rgba(var(--color-foreground),0.1)]">
						{posts.slice(0, 5).map((post) => (
							<div
								key={post.id}
								className="p-6 flex justify-between items-center"
							>
								<div>
									<h3 className="font-medium">{post.title}</h3>
									<p className="text-sm text-[rgba(var(--color-foreground),0.7)] mt-1">
										{post.category} •{" "}
										{post.published_at ? "Published" : "Draft"}
									</p>
								</div>
								<Link
									href={`/admin/posts/${post.id}`}
									className="text-[rgba(var(--color-violet),0.9)] hover:text-[rgba(var(--color-violet),1)] text-sm"
								>
									Edit
								</Link>
							</div>
						))}
						{posts.length === 0 && (
							<div className="p-6 text-center text-[rgba(var(--color-foreground),0.7)]">
								No posts yet.{" "}
								<Link
									href="/admin/posts/new"
									className="text-[rgba(var(--color-violet),0.9)] hover:text-[rgba(var(--color-violet),1)]"
								>
									Create your first post
								</Link>
							</div>
						)}
					</div>
				</div>

				{/* Recent Contact Messages */}
				<div className="admin-card">
					<div className="p-6 border-b border-[rgba(var(--color-foreground),0.1)]">
						<h2 className="text-xl font-semibold">Recent Contact Messages</h2>
					</div>
					<div className="divide-y divide-[rgba(var(--color-foreground),0.1)]">
						{contactSubmissions.slice(0, 5).map((msg) => (
							<div key={msg.id} className="p-6">
								<div className="flex justify-between items-start">
									<div>
										<h3 className="font-medium">{msg.name}</h3>
										<p className="text-sm text-[rgba(var(--color-foreground),0.7)] mt-1">
											{msg.email}
										</p>
										{msg.subject && (
											<p className="text-sm text-[rgba(var(--color-foreground),0.8)] mt-1">
												Subject: {msg.subject}
											</p>
										)}
									</div>
									<span className="text-xs text-[rgba(var(--color-foreground),0.6)]">
										{new Date(msg.created_at).toLocaleDateString()}
									</span>
								</div>
								<p className="text-sm mt-2 text-[rgba(var(--color-foreground),0.8)]">
									{msg.message.length > 100
										? `${msg.message.substring(0, 100)}...`
										: msg.message}
								</p>
							</div>
						))}
						{contactSubmissions.length === 0 && (
							<div className="p-6 text-center text-[rgba(var(--color-foreground),0.7)]">
								No contact messages yet.
							</div>
						)}
					</div>
				</div>
			</div>
		)
	} catch (error) {
		console.error("Error in AdminPage:", error)
		return (
			<div className="admin-card p-6">
				<h1 className="text-3xl font-bold text-[rgba(var(--color-red),0.9)] mb-6">
					Error
				</h1>
				<p className="mb-4">
					An error occurred while loading the admin dashboard.
				</p>
				<p className="text-sm text-[rgba(var(--color-foreground),0.7)]">
					Please try refreshing the page or contact the administrator.
				</p>
			</div>
		)
	}
}
