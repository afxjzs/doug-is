/**
 * Admin Draft Preview Page
 *
 * Allows authenticated admins to preview unpublished posts.
 * Uses UNIFIED AUTHENTICATION SYSTEM for security.
 */

import { Metadata } from "next"
import { redirect, notFound } from "next/navigation"
import Link from "next/link"
import {
	getCurrentUser,
	isCurrentUserAdmin,
	createAuthServerClient,
} from "@/lib/auth/simple-auth-server"
import { PostView } from "@/components/PostView"
import PublishButton from "@/components/admin/PublishButton"

// Admin Post type that allows null published_at for drafts
type AdminPost = {
	id: string
	title: string
	slug: string
	content: string
	excerpt: string
	category: string
	published_at: string | null
	featured_image: string | null
	created_at: string
	updated_at: string
}

interface DraftPreviewPageProps {
	params: Promise<{
		id: string
	}>
}

export async function generateMetadata({
	params,
}: DraftPreviewPageProps): Promise<Metadata> {
	await params // Resolve params for Next.js 15 compatibility
	return {
		title: "Draft Preview - Admin",
		description: "Preview unpublished post draft",
		robots: {
			index: false,
			follow: false,
		},
	}
}

export default async function DraftPreviewPage({
	params,
}: DraftPreviewPageProps) {
	try {
		const resolvedParams = await params

		// Verify user is authenticated and has admin privileges using UNIFIED AUTH
		const user = await getCurrentUser()
		const isAdmin = await isCurrentUserAdmin()

		if (!user || !isAdmin) {
			console.log("Not authenticated as admin, redirecting to login")
			redirect("/admin/login")
		}

		// Get admin client to fetch the post (including unpublished)
		const supabase = await createAuthServerClient()

		const { data: adminPost, error } = await supabase
			.from("posts")
			.select("*")
			.eq("id", resolvedParams.id)
			.single()

		if (error) {
			console.error("Error fetching post:", error)
			notFound()
		}

		if (!adminPost) {
			notFound()
		}

		// Transform AdminPost to Post for PostView component
		const post = {
			...adminPost,
			published_at: adminPost.published_at || adminPost.created_at, // Use created_at as fallback for drafts
		}

		return (
			<div className="min-h-screen bg-gray-950">
				{/* Admin Header */}
				<div className="border-b border-gray-800 bg-gray-900/50">
					<div className="mx-auto max-w-4xl px-4 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-4">
								<Link
									href="/admin/posts"
									className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
								>
									← Back to Posts
								</Link>
								<div className="h-4 w-px bg-gray-700" />
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-yellow-500" />
									<span className="text-yellow-400 text-sm font-medium">
										DRAFT PREVIEW
									</span>
								</div>
							</div>

							{/* Quick Actions */}
							{!adminPost.published_at && (
								<div className="flex items-center gap-3">
									<Link
										href={`/admin/posts/${adminPost.id}`}
										className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
									>
										Edit Post
									</Link>
									<PublishButton
										postId={adminPost.id}
										postTitle={adminPost.title}
										redirectUrl={`/admin/posts/${adminPost.id}`}
									/>
								</div>
							)}
						</div>
					</div>
				</div>

				{/* Post Content */}
				<div className="mx-auto max-w-4xl px-4 py-8">
					<PostView post={post} isDraft={!adminPost.published_at} />
				</div>
			</div>
		)
	} catch (error) {
		console.error("Error in draft preview page:", error)
		redirect("/admin/login")
	}
}
