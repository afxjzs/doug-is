"use client"

import { useState } from "react"

interface SimpleImageUploaderProps {
	onImageUploaded: (url: string) => void
}

export default function SimpleImageUploader({
	onImageUploaded,
}: SimpleImageUploaderProps) {
	const [isUploading, setIsUploading] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [uploadStatus, setUploadStatus] = useState<string | null>(null)
	const [imageUrl, setImageUrl] = useState<string | null>(null)

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const files = e.target.files
		if (!files || files.length === 0) return

		const file = files[0]

		// Reset states
		setUploadError(null)
		setUploadStatus("Starting upload...")
		setIsUploading(true)

		try {
			// Log file details
			console.log(
				"File selected:",
				file.name,
				file.type,
				`${file.size / 1024} KB`
			)
			setUploadStatus(`Uploading ${file.name}...`)

			// Create form data
			const formData = new FormData()
			formData.append("file", file)

			// Send the request with detailed logging
			setUploadStatus("Sending request to server...")
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
				credentials: "include",
			})

			setUploadStatus(`Server responded with status: ${response.status}`)

			// Get the response text for debugging
			const responseText = await response.text()
			console.log("Raw response:", responseText)

			// Try to parse JSON
			let data: any
			try {
				data = JSON.parse(responseText)
			} catch (e) {
				console.error("Failed to parse response as JSON:", e)
				throw new Error("Server returned invalid JSON")
			}

			// Check for success
			if (!response.ok) {
				setUploadStatus(
					`Error: ${response.status} - ${data.error || "Unknown error"}`
				)
				throw new Error(data.error || `Server error: ${response.status}`)
			}

			// Handle success
			setUploadStatus("Upload successful!")
			console.log("Upload complete:", data)

			if (data.url) {
				setImageUrl(data.url)
				onImageUploaded(data.url)
			} else {
				throw new Error("No URL returned from server")
			}
		} catch (error) {
			console.error("Upload failed:", error)
			setUploadError(
				error instanceof Error ? error.message : "Unknown error occurred"
			)
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<div className="p-4 border rounded-lg">
			<h3 className="text-lg font-medium mb-2">Simple Image Uploader</h3>

			<div className="mb-4">
				<input
					type="file"
					onChange={handleFileChange}
					accept="image/jpeg,image/png,image/gif,image/webp"
					disabled={isUploading}
					className="block w-full text-sm text-gray-500
						file:mr-4 file:py-2 file:px-4
						file:rounded-full file:border-0
						file:text-sm file:font-semibold
						file:bg-[rgba(var(--color-violet),0.1)] file:text-[rgba(var(--color-violet),0.8)]
						hover:file:bg-[rgba(var(--color-violet),0.2)]"
				/>
				<p className="mt-1 text-xs text-gray-500">
					JPEG, PNG, WebP, or GIF (max 5MB)
				</p>
			</div>

			{isUploading && (
				<div className="mb-4 text-sm text-blue-600 bg-blue-50 p-2 rounded">
					<p className="font-medium">Upload in progress</p>
					{uploadStatus && <p className="mt-1 font-normal">{uploadStatus}</p>}
				</div>
			)}

			{uploadError && (
				<div className="mb-4 text-sm text-red-200 bg-red-900/30 p-2 rounded border border-red-700/50">
					<p className="font-medium">Upload failed</p>
					<p className="mt-1 font-normal">{uploadError}</p>
				</div>
			)}

			{imageUrl && !isUploading && (
				<div className="mt-4">
					<p className="mb-2 text-sm font-medium">Uploaded Image:</p>
					<div className="border rounded-lg overflow-hidden">
						<img
							src={imageUrl}
							alt="Uploaded image"
							className="max-w-full h-auto"
						/>
					</div>
					<p className="mt-2 text-xs text-gray-500 break-all">{imageUrl}</p>
				</div>
			)}
		</div>
	)
}
