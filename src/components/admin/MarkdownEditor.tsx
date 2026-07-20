"use client"

import { useRef, useState } from "react"
import { ImagePlus, Eye, EyeOff } from "lucide-react"
import { MarkdownContent } from "@/components/MarkdownContent"

interface MarkdownEditorProps {
	content: string
	onChange: (markdown: string) => void
	placeholder?: string
}

/**
 * Raw Markdown source editor.
 *
 * The `<textarea>` value is the stored Markdown, and every keystroke passes
 * `e.target.value` straight through to `onChange` — no HTML round-trip, so what
 * an author types is stored verbatim. The live preview renders the same string
 * through `MarkdownContent`, the exact renderer the published page uses, so the
 * preview equals the published result.
 */
export default function MarkdownEditor({
	content,
	onChange,
	placeholder = "Start writing...",
}: MarkdownEditorProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const imageInputRef = useRef<HTMLInputElement>(null)
	const [isUploading, setIsUploading] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const [showPreview, setShowPreview] = useState(true)

	// Insert text at the current cursor position (or replace the selection),
	// then reposition the caret after the inserted text.
	const insertAtCursor = (snippet: string) => {
		const textarea = textareaRef.current
		if (!textarea) {
			// No DOM reference — append rather than silently dropping the insert.
			onChange(content + snippet)
			return
		}

		const start = textarea.selectionStart
		const end = textarea.selectionEnd
		const next = content.slice(0, start) + snippet + content.slice(end)
		onChange(next)

		// Restore focus and place the caret right after the inserted snippet.
		requestAnimationFrame(() => {
			textarea.focus()
			const caret = start + snippet.length
			textarea.setSelectionRange(caret, caret)
		})
	}

	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0]
		if (!file) return

		setUploadError(null)
		setIsUploading(true)

		// Validate file size (5MB max) — mirrors the old editor's limit.
		if (file.size > 5 * 1024 * 1024) {
			setUploadError("File size exceeds the 5MB limit")
			setIsUploading(false)
			if (imageInputRef.current) imageInputRef.current.value = ""
			return
		}

		try {
			const formData = new FormData()
			formData.append("file", file)

			// Reuse the existing upload endpoint — do not build a new one.
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
				credentials: "include",
			})

			const responseText = await response.text()

			let data
			try {
				data = JSON.parse(responseText)
			} catch (parseError) {
				console.error("Error parsing upload response JSON:", parseError)
				throw new Error("Invalid response from server")
			}

			if (!response.ok) {
				throw new Error(data.error || `Server error: ${response.status}`)
			}

			if (!data.url) {
				throw new Error("No URL returned from upload")
			}

			// Insert Markdown image syntax at the cursor (not HTML).
			const alt = file.name.replace(/\.[^./\\]+$/, "")
			insertAtCursor(`![${alt}](${data.url})`)
		} catch (error) {
			console.error("Upload failed:", error)
			setUploadError(
				error instanceof Error ? error.message : "Failed to upload image"
			)
		} finally {
			setIsUploading(false)
			if (imageInputRef.current) {
				imageInputRef.current.value = ""
			}
		}
	}

	// Tab inserts two spaces instead of moving focus out of the textarea.
	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key !== "Tab") return
		event.preventDefault()
		insertAtCursor("  ")
	}

	return (
		<div className="border border-[rgba(var(--color-foreground),0.1)] rounded-md overflow-hidden">
			{/* Toolbar */}
			<div className="bg-[rgba(var(--color-foreground),0.05)] border-b border-[rgba(var(--color-foreground),0.1)] p-2 flex flex-wrap items-center gap-1">
				<button
					type="button"
					onClick={() => imageInputRef.current?.click()}
					className="p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] flex items-center gap-1 text-sm"
					title="Insert Image"
				>
					<ImagePlus size={18} />
					<span>Image</span>
					<input
						type="file"
						ref={imageInputRef}
						onChange={handleFileChange}
						style={{ display: "none" }}
						accept="image/jpeg,image/png,image/gif,image/webp"
					/>
				</button>

				<div className="w-px h-6 mx-1 bg-[rgba(var(--color-foreground),0.1)] self-center" />

				<button
					type="button"
					onClick={() => setShowPreview((v) => !v)}
					className="p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] flex items-center gap-1 text-sm"
					title={showPreview ? "Hide preview" : "Show preview"}
				>
					{showPreview ? <EyeOff size={18} /> : <Eye size={18} />}
					<span>{showPreview ? "Hide preview" : "Show preview"}</span>
				</button>

				<span className="ml-auto text-xs text-[rgba(var(--color-foreground),0.5)] self-center pr-1">
					Markdown source
				</span>
			</div>

			{isUploading && (
				<div className="p-2 text-sm bg-[rgba(var(--color-foreground),0.05)]">
					Uploading image...
				</div>
			)}

			{uploadError && (
				<div className="p-2 text-sm text-[rgba(var(--color-red),0.9)] bg-[rgba(var(--color-red),0.05)]">
					{uploadError}
				</div>
			)}

			<div
				className={`grid ${
					showPreview ? "md:grid-cols-2" : "grid-cols-1"
				} divide-y md:divide-y-0 md:divide-x divide-[rgba(var(--color-foreground),0.1)]`}
			>
				{/* Source editor */}
				<textarea
					ref={textareaRef}
					value={content}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					spellCheck={false}
					className="w-full min-h-[400px] p-4 bg-transparent font-mono text-sm leading-relaxed resize-y focus:outline-none"
				/>

				{/* Live preview — same renderer as the published page */}
				{showPreview && (
					<div className="min-h-[400px] p-4 overflow-auto">
						{content.trim() ? (
							<MarkdownContent content={content} />
						) : (
							<p className="text-sm text-[rgba(var(--color-foreground),0.4)] italic">
								Preview will appear here.
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	)
}
