"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { useDropzone } from "react-dropzone"

interface ImageUploaderProps {
	onImageUploaded: (url: string) => void
	defaultImage?: string
	className?: string
}

export default function ImageUploader({
	onImageUploaded,
	defaultImage,
	className = "",
}: ImageUploaderProps) {
	const [isUploading, setIsUploading] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		defaultImage || null
	)

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			// Reset state
			setUploadError(null)

			// Validate that we have a file
			if (acceptedFiles.length === 0) {
				return
			}

			const file = acceptedFiles[0]

			// Validate file size (5MB max)
			if (file.size > 5 * 1024 * 1024) {
				setUploadError("File size exceeds the 5MB limit")
				return
			}

			// Set local preview
			const localPreview = URL.createObjectURL(file)
			setPreviewUrl(localPreview)

			try {
				setIsUploading(true)
				console.log(
					"Starting upload for file:",
					file.name,
					file.type,
					`${(file.size / 1024).toFixed(1)}KB`
				)

				// Create form data for the upload
				const formData = new FormData()
				formData.append("file", file)

				// Upload to the API endpoint
				console.log("Sending upload request to /api/upload")
				const response = await fetch("/api/upload", {
					method: "POST",
					body: formData,
					credentials: "include", // Include cookies for authentication
				})

				// Log response status
				console.log("Upload response status:", response.status)

				// Try to get the response text first to ensure we can read it
				const responseText = await response.text()
				console.log("Upload response text:", responseText)

				// Parse the response if possible
				let data
				try {
					data = JSON.parse(responseText)
				} catch (parseError) {
					console.error("Error parsing response JSON:", parseError)
					throw new Error("Invalid response from server")
				}

				// Handle non-success responses
				if (!response.ok) {
					console.error("Upload error response:", data)
					throw new Error(data.error || `Server error: ${response.status}`)
				}

				console.log("Upload success:", data)

				// Call the callback with the uploaded URL
				if (data.url) {
					onImageUploaded(data.url)
					// Keep the preview URL (don't revoke it)
				} else {
					throw new Error("No URL returned from upload")
				}
			} catch (error) {
				console.error("Upload failed:", error)

				// Provide more specific error message based on the error
				let errorMessage = "Failed to upload image. Please try again."
				if (error instanceof Error) {
					errorMessage = error.message
				} else if (error instanceof Response) {
					errorMessage = `Server error: ${error.status}`
				}

				setUploadError(errorMessage)

				// Don't revoke the object URL on error - keep showing the preview
				// Only reset if there's no preview URL currently
				if (!previewUrl && !defaultImage) {
					setPreviewUrl(null)
				}
			} finally {
				setIsUploading(false)
			}
		},
		[defaultImage, onImageUploaded, previewUrl]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [],
			"image/png": [],
			"image/webp": [],
			"image/gif": [],
		},
		maxFiles: 1,
		multiple: false,
	})

	// Clear the current image
	const handleClearImage = () => {
		// If we have a local preview URL, revoke it to prevent memory leaks
		if (previewUrl && previewUrl !== defaultImage) {
			try {
				URL.revokeObjectURL(previewUrl)
			} catch (e) {
				console.error("Error revoking object URL:", e)
			}
		}

		setPreviewUrl(null)
		onImageUploaded("")
	}

	return (
		<div className={`w-full ${className}`}>
			<div
				{...getRootProps()}
				className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
					isDragActive
						? "border-[rgba(var(--color-violet),0.8)] bg-[rgba(var(--color-violet),0.1)]"
						: "border-[rgba(var(--color-foreground),0.2)] hover:border-[rgba(var(--color-violet),0.5)] hover:bg-[rgba(var(--color-foreground),0.05)]"
				}`}
			>
				<input {...getInputProps()} />

				{previewUrl ? (
					<div className="relative w-full h-48 mb-2">
						<Image
							src={previewUrl}
							alt="Preview"
							fill
							className="object-contain rounded-md"
						/>
					</div>
				) : (
					<div className="py-8">
						<svg
							className="mx-auto h-12 w-12 text-[rgba(var(--color-foreground),0.3)]"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				)}

				<div className="mt-2">
					{isUploading ? (
						<p className="text-sm text-[rgba(var(--color-foreground),0.6)]">
							Uploading...
						</p>
					) : previewUrl ? (
						<p className="text-sm text-[rgba(var(--color-foreground),0.6)]">
							Drag a new image here, or click to replace
						</p>
					) : (
						<p className="text-sm text-[rgba(var(--color-foreground),0.6)]">
							Drag an image here, or click to select a file
						</p>
					)}
					<p className="text-xs mt-1 text-[rgba(var(--color-foreground),0.5)]">
						Supports JPEG, PNG, WebP, and GIF (max 5MB)
					</p>
				</div>
			</div>

			{uploadError && (
				<div className="mt-2 text-sm text-[rgba(var(--color-red),0.9)]">
					{uploadError}
				</div>
			)}

			{previewUrl && (
				<button
					type="button"
					onClick={handleClearImage}
					className="mt-2 text-sm text-[rgba(var(--color-red),0.9)] hover:text-[rgba(var(--color-red),1)]"
				>
					Remove image
				</button>
			)}
		</div>
	)
}
