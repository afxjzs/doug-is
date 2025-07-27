"use client"

import { useState } from "react"
import { publishPost } from "@/lib/actions/postActions"

interface PublishButtonProps {
	postId: string
	postTitle: string
	redirectUrl?: string
}

export default function PublishButton({
	postId,
	postTitle,
	redirectUrl,
}: PublishButtonProps) {
	const [isPublishing, setIsPublishing] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handlePublish = async () => {
		if (!confirm(`Are you sure you want to publish "${postTitle}"?`)) {
			return
		}

		setIsPublishing(true)
		setError(null)

		try {
			const result = await publishPost(postId)

			if (result.success) {
				// Redirect to custom URL if provided, otherwise default to admin posts page
				const redirectTo = redirectUrl || "/admin/posts"
				window.location.href = redirectTo
			} else {
				setError(result.error || "Failed to publish post")
			}
		} catch (err) {
			setError("An unexpected error occurred")
			console.error("Error publishing post:", err)
		} finally {
			setIsPublishing(false)
		}
	}

	return (
		<div className="flex items-center gap-2">
			<button
				onClick={handlePublish}
				disabled={isPublishing}
				className="p-2 rounded-md text-[rgba(var(--color-green),1)] hover:bg-[rgba(var(--color-green),0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
				title="Publish Now"
			>
				{isPublishing ? (
					<svg
						className="animate-spin h-5 w-5"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle
							className="opacity-25"
							cx="12"
							cy="12"
							r="10"
							stroke="currentColor"
							strokeWidth="4"
						></circle>
						<path
							className="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
				) : (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 20 20"
						fill="currentColor"
						aria-hidden="true"
					>
						<path
							fillRule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clipRule="evenodd"
						/>
					</svg>
				)}
				<span className="sr-only">Publish Now</span>
			</button>
			{error && (
				<span className="text-sm text-[rgba(var(--color-red),1)]">{error}</span>
			)}
		</div>
	)
}
