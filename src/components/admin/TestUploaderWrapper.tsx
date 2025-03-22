"use client"

import { useState } from "react"
import SimpleImageUploader from "./SimpleImageUploader"

/**
 * Client component wrapper for SimpleImageUploader
 * This is needed because server components can't pass function props to client components
 */
export default function TestUploaderWrapper() {
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

	// This function stays on the client side
	const handleImageUploaded = (url: string) => {
		console.log("Image uploaded:", url)
		setUploadedUrl(url)
	}

	return (
		<div className="mb-8 p-4 border border-amber-300 bg-amber-50 rounded-lg">
			<h2 className="text-lg font-semibold mb-4 text-amber-800">
				Uploader Test
			</h2>
			<SimpleImageUploader onImageUploaded={handleImageUploaded} />

			{uploadedUrl && (
				<div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
					<p className="text-sm font-medium text-green-800">
						Image uploaded successfully!
					</p>
					<p className="text-xs text-green-600 break-all mt-1">{uploadedUrl}</p>
				</div>
			)}
		</div>
	)
}
