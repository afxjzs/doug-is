"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Post } from "@/lib/supabase/serverClient"
import { normalizeCategory } from "@/lib/supabase/publicClient"
import ImageUploader from "@/components/admin/ImageUploader"
import TiptapEditor from "@/components/admin/TiptapEditor"
import { nanoid } from "nanoid"
import { getClientUser } from "@/lib/supabase/client"

// Define the allowed post categories (capitalized for display)
const POST_CATEGORIES = [
	"Advisory",
	"Business",
	"Design",
	"Development",
	"Finance",
	"General",
	"Investing",
	"Lifestyle",
	"Personal",
	"Technology",
	"Travel",
	"Other",
]

// Define props for the PostEditor component
interface PostEditorProps {
	post?: Post
	mode: "create" | "edit"
}

// Helper to generate a URL-friendly slug from a title
function generateSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^\w\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.trim()
}

// Helper to format date for input
function formatDateForInput(dateString: string | null): string {
	if (!dateString) return ""
	const date = new Date(dateString)
	return date.toISOString().split("T")[0]
}

export default function PostEditor({ post, mode }: PostEditorProps) {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [autoSlug, setAutoSlug] = useState(true)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	// Form state
	const [title, setTitle] = useState(post?.title || "")
	const [slug, setSlug] = useState(post?.slug || "")
	const [content, setContent] = useState(post?.content || "")
	const [excerpt, setExcerpt] = useState(post?.excerpt || "")
	const [category, setCategory] = useState(
		post?.category ? normalizeCategory(post.category) : POST_CATEGORIES[0]
	)
	const [published, setPublished] = useState(post?.published_at ? true : false)
	const [publishDate, setPublishDate] = useState(
		formatDateForInput(post?.published_at || null)
	)
	const [featuredImage, setFeaturedImage] = useState(post?.featured_image || "")

	// Update slug automatically when title changes (if enabled)
	useEffect(() => {
		if (autoSlug && title) {
			setSlug(generateSlug(title))
		}
	}, [title, autoSlug])

	// Handle form submission
	async function handleSubmit(e: FormEvent) {
		e.preventDefault()
		setError(null)
		setSuccess(null)

		try {
			setIsSubmitting(true)

			// Validate required fields
			if (!title || !slug || !content || !excerpt || !category) {
				throw new Error("Please fill in all required fields")
			}

			// Prepare post data
			const postData = {
				title,
				slug,
				content,
				excerpt,
				category: normalizeCategory(category),
				featured_image: featuredImage || null,
				published: published,
				published_at: published
					? publishDate
						? new Date(publishDate).toISOString()
						: new Date().toISOString()
					: null,
			}

			console.log("Submitting post data:", postData)

			// Make API request based on mode (create or edit)
			const endpoint =
				mode === "create" ? "/api/posts" : `/api/posts/${post?.id}`

			const method = mode === "create" ? "POST" : "PATCH"

			// Use a more robust fetch with credentials and detailed error handling
			const response = await fetch(endpoint, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(postData),
				credentials: "include", // Include cookies for authentication
				cache: "no-store", // Prevent caching
			})

			// Handle non-JSON responses
			const contentType = response.headers.get("content-type")
			let data

			if (contentType && contentType.includes("application/json")) {
				data = await response.json()
			} else {
				const text = await response.text()
				console.warn("Non-JSON response:", text)
				data = { error: "Unexpected response from server" }
			}

			if (!response.ok) {
				console.error("Failed to save post:", { status: response.status, data })

				// Handle authentication errors
				if (response.status === 401) {
					console.error("Authentication error - redirecting to login")
					router.push("/admin/login")
					throw new Error("Session expired. Please log in again.")
				}

				throw new Error(data.error || `Server error: ${response.status}`)
			}

			console.log("Post saved successfully:", data)

			// Show success message
			setSuccess(
				mode === "create"
					? "Post created successfully!"
					: "Post updated successfully!"
			)

			// Redirect after a short delay
			setTimeout(() => {
				router.push("/admin/posts")
				router.refresh()
			}, 1500)
		} catch (err) {
			console.error("Error saving post:", err)
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while saving the post"
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	// Handle post deletion
	async function handleDelete() {
		if (!post?.id) return

		try {
			setIsDeleting(true)
			setError(null)

			const response = await fetch(`/api/posts/${post.id}`, {
				method: "DELETE",
				credentials: "include",
				cache: "no-store",
			})

			// Handle non-JSON responses
			const contentType = response.headers.get("content-type")
			let data

			if (contentType && contentType.includes("application/json")) {
				data = await response.json()
			} else {
				const text = await response.text()
				console.warn("Non-JSON response:", text)
				data = { error: "Unexpected response from server" }
			}

			if (!response.ok) {
				console.error("Failed to delete post:", {
					status: response.status,
					data,
				})

				// Handle authentication errors
				if (response.status === 401) {
					console.error("Authentication error - redirecting to login")
					router.push("/admin/login")
					throw new Error("Session expired. Please log in again.")
				}

				throw new Error(data.error || `Server error: ${response.status}`)
			}

			// Show success message
			setSuccess("Post deleted successfully!")

			// Redirect after a short delay
			setTimeout(() => {
				router.push("/admin/posts")
				router.refresh()
			}, 1500)
		} catch (err) {
			console.error("Error deleting post:", err)
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while deleting the post"
			)
		} finally {
			setIsDeleting(false)
			setShowDeleteConfirm(false)
		}
	}

	// Handle image upload
	function handleImageUploaded(url: string) {
		console.log("Image uploaded, setting featured image:", url)
		setFeaturedImage(url)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			{/* Title */}
			<div className="space-y-2">
				<label htmlFor="title" className="block text-sm font-medium">
					Title <span className="text-[rgba(var(--color-red),0.9)]">*</span>
				</label>
				<input
					id="title"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full px-4 py-2 bg-[rgba(var(--color-foreground),0.05)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent"
					placeholder="Post title"
					required
				/>
			</div>

			{/* Slug with auto-generation toggle */}
			<div className="space-y-2">
				<div className="flex justify-between items-center">
					<label htmlFor="slug" className="block text-sm font-medium">
						Slug <span className="text-[rgba(var(--color-red),0.9)]">*</span>
					</label>
					<div className="flex items-center">
						<input
							id="auto-slug"
							type="checkbox"
							checked={autoSlug}
							onChange={() => setAutoSlug(!autoSlug)}
							className="mr-2 h-4 w-4"
						/>
						<label htmlFor="auto-slug" className="text-xs">
							Auto-generate from title
						</label>
					</div>
				</div>
				<input
					id="slug"
					type="text"
					value={slug}
					onChange={(e) => setSlug(e.target.value)}
					className="w-full px-4 py-2 bg-[rgba(var(--color-foreground),0.05)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent"
					placeholder="post-url-slug"
					required
					disabled={autoSlug}
				/>
				<p className="text-xs text-[rgba(var(--color-foreground),0.6)]">
					This will be used in the URL: /thinking/about/
					{normalizeCategory(category).toLowerCase()}/{slug}
				</p>
			</div>

			{/* Category */}
			<div className="space-y-2">
				<label htmlFor="category" className="block text-sm font-medium">
					Category <span className="text-[rgba(var(--color-red),0.9)]">*</span>
				</label>
				<select
					id="category"
					value={category}
					onChange={(e) => setCategory(e.target.value)}
					className="w-full px-4 py-2 bg-[rgba(var(--color-foreground),0.05)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent"
					required
				>
					{POST_CATEGORIES.map((cat) => (
						<option key={cat} value={cat}>
							{cat}
						</option>
					))}
				</select>
			</div>

			{/* Featured Image */}
			<div className="space-y-2">
				<label className="block text-sm font-medium">Featured Image</label>
				<ImageUploader
					onImageUploaded={handleImageUploaded}
					defaultImage={featuredImage}
				/>
			</div>

			{/* Excerpt */}
			<div className="space-y-2">
				<label htmlFor="excerpt" className="block text-sm font-medium">
					Excerpt <span className="text-[rgba(var(--color-red),0.9)]">*</span>
				</label>
				<textarea
					id="excerpt"
					value={excerpt}
					onChange={(e) => setExcerpt(e.target.value)}
					className="w-full px-4 py-2 h-24 bg-[rgba(var(--color-foreground),0.05)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent"
					placeholder="Brief summary of the post"
					required
				/>
			</div>

			{/* Content */}
			<div className="space-y-2">
				<label htmlFor="content" className="block text-sm font-medium">
					Content <span className="text-[rgba(var(--color-red),0.9)]">*</span>
				</label>
				<TiptapEditor
					content={content}
					onChange={setContent}
					placeholder="Write your post content here..."
				/>
				<p className="text-xs text-[rgba(var(--color-foreground),0.6)]">
					Markdown formatting is supported
				</p>
			</div>

			{/* Publication Settings */}
			<div className="space-y-4 border-t border-[rgba(var(--color-foreground),0.1)] pt-4">
				<h3 className="font-medium">Publication Settings</h3>

				{/* Published Status */}
				<div className="flex items-center">
					<input
						id="published"
						type="checkbox"
						checked={published}
						onChange={() => setPublished(!published)}
						className="mr-2 h-4 w-4"
					/>
					<label htmlFor="published" className="text-sm">
						Published (visible on the site)
					</label>
				</div>

				{/* Publish Date */}
				{published && (
					<div className="space-y-2">
						<label htmlFor="publish-date" className="block text-sm font-medium">
							Publish Date
						</label>
						<input
							id="publish-date"
							type="date"
							value={publishDate}
							onChange={(e) => setPublishDate(e.target.value)}
							className="px-4 py-2 bg-[rgba(var(--color-foreground),0.05)] border border-[rgba(var(--color-foreground),0.1)] rounded-md focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent"
						/>
						<p className="text-xs text-[rgba(var(--color-foreground),0.6)]">
							Leave empty to use current date and time
						</p>
					</div>
				)}
			</div>

			{/* Error and Success messages */}
			{error && (
				<div className="p-4 bg-[rgba(var(--color-red),0.1)] border border-[rgba(var(--color-red),0.3)] rounded-md text-[rgba(var(--color-red),0.9)]">
					{error}
				</div>
			)}

			{success && (
				<div className="p-4 bg-[rgba(var(--color-emerald),0.1)] border border-[rgba(var(--color-emerald),0.3)] rounded-md text-[rgba(var(--color-emerald),0.9)]">
					{success}
				</div>
			)}

			{/* Delete Confirmation */}
			{mode === "edit" && showDeleteConfirm && (
				<div className="p-4 bg-[rgba(var(--color-red),0.1)] border border-[rgba(var(--color-red),0.3)] rounded-md">
					<p className="mb-3 font-medium text-[rgba(var(--color-red),0.9)]">
						Are you sure you want to delete this post?
					</p>
					<p className="mb-4 text-sm">This action cannot be undone.</p>
					<div className="flex space-x-3">
						<button
							type="button"
							onClick={() => setShowDeleteConfirm(false)}
							className="px-3 py-1 text-sm border border-[rgba(var(--color-foreground),0.2)] rounded-md"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleDelete}
							className="px-3 py-1 text-sm bg-[rgba(var(--color-red),0.9)] text-white rounded-md"
							disabled={isDeleting}
						>
							{isDeleting ? "Deleting..." : "Confirm Delete"}
						</button>
					</div>
				</div>
			)}

			{/* Form Actions */}
			<div className="flex justify-between space-x-4 border-t border-[rgba(var(--color-foreground),0.1)] pt-4">
				{/* Delete button (only show in edit mode) */}
				{mode === "edit" && (
					<button
						type="button"
						onClick={() => setShowDeleteConfirm(true)}
						className="px-4 py-2 bg-[rgba(var(--color-red),0.1)] text-[rgba(var(--color-red),0.9)] border border-[rgba(var(--color-red),0.3)] rounded-md hover:bg-[rgba(var(--color-red),0.2)] transition-colors"
						disabled={isSubmitting || isDeleting}
					>
						Delete Post
					</button>
				)}

				<div className="flex space-x-3 ml-auto">
					<button
						type="button"
						onClick={() => router.push("/admin/posts")}
						className="px-4 py-2 border border-[rgba(var(--color-foreground),0.2)] rounded-md hover:bg-[rgba(var(--color-foreground),0.05)] transition-colors"
						disabled={isSubmitting || isDeleting}
					>
						Cancel
					</button>
					<button
						type="submit"
						className="px-4 py-2 bg-[rgba(var(--color-violet),0.9)] hover:bg-[rgba(var(--color-violet),1)] text-white rounded-md transition-colors disabled:opacity-70"
						disabled={isSubmitting || isDeleting}
					>
						{isSubmitting
							? "Saving..."
							: mode === "create"
							? "Create Post"
							: "Update Post"}
					</button>
				</div>
			</div>
		</form>
	)
}
