"use client"

import { useState, useEffect, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Post } from "@/lib/supabase/serverClient"
import ImageUploader from "@/components/admin/ImageUploader"
import { nanoid } from "nanoid"
import { getClientUser } from "@/lib/supabase/client"

// Define the allowed post categories
const POST_CATEGORIES = [
	"Development",
	"Design",
	"Business",
	"Marketing",
	"Finance",
	"Personal",
	"Technology",
	"Investing",
	"Lifestyle",
	"Travel",
	"General",
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

export default function PostEditor({ post, mode }: PostEditorProps) {
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState<string | null>(null)
	const [autoSlug, setAutoSlug] = useState(true)

	// Form state
	const [title, setTitle] = useState(post?.title || "")
	const [slug, setSlug] = useState(post?.slug || "")
	const [content, setContent] = useState(post?.content || "")
	const [excerpt, setExcerpt] = useState(post?.excerpt || "")
	const [category, setCategory] = useState(post?.category || POST_CATEGORIES[0])
	const [published, setPublished] = useState(post?.published_at ? true : false)
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
				category,
				featured_image: featuredImage || null,
				published: published,
			}

			console.log("Submitting post data:", postData)

			// Make API request based on mode (create or edit)
			const endpoint =
				mode === "create" ? "/api/posts" : `/api/posts/${post?.id}`

			const method = mode === "create" ? "POST" : "PATCH"

			const response = await fetch(endpoint, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(postData),
				credentials: "include", // Add credentials to include cookies
			})

			const data = await response.json()

			if (!response.ok) {
				console.error("Failed to save post:", data)

				// Handle authentication errors
				if (response.status === 401 || response.status === 403) {
					throw new Error("Authentication error. Please log in again.")
				}

				throw new Error(data.error || "Failed to save post")
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
			setIsSubmitting(false)
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
					This will be used in the URL: /thinking/{category.toLowerCase()}/
					{slug}
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
				<textarea
					id="content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					className="w-full px-4 py-2 h-80 bg-[rgba(var(--color-foreground),0.05)] border border-[rgba(var(--color-foreground),0.1)] rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.5)] focus:border-transparent"
					placeholder="Post content in Markdown format"
					required
				/>
				<p className="text-xs text-[rgba(var(--color-foreground),0.6)]">
					Markdown formatting is supported
				</p>
			</div>

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
					Published (immediately visible on the site)
				</label>
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

			{/* Form Actions */}
			<div className="flex justify-end space-x-4">
				<button
					type="button"
					onClick={() => router.push("/admin/posts")}
					className="px-4 py-2 border border-[rgba(var(--color-foreground),0.2)] rounded-md hover:bg-[rgba(var(--color-foreground),0.05)] transition-colors"
					disabled={isSubmitting}
				>
					Cancel
				</button>
				<button
					type="submit"
					className="px-4 py-2 bg-[rgba(var(--color-violet),0.9)] hover:bg-[rgba(var(--color-violet),1)] text-white rounded-md transition-colors disabled:opacity-70"
					disabled={isSubmitting}
				>
					{isSubmitting
						? "Saving..."
						: mode === "create"
						? "Create Post"
						: "Update Post"}
				</button>
			</div>
		</form>
	)
}
