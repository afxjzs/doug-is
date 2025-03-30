"use client"

import {
	useEditor,
	EditorContent,
	BubbleMenu,
	FloatingMenu,
} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import YouTube from "@tiptap/extension-youtube"
import { useState, useRef, useCallback, useEffect, useMemo } from "react"
import {
	ImagePlus,
	Link2,
	List,
	ListOrdered,
	Quote,
	Heading1,
	Heading2,
	Heading3,
	Bold,
	Italic,
	Code,
	Youtube,
} from "lucide-react"
import { Text } from "@tiptap/extension-text"
import { Document } from "@tiptap/extension-document"

interface TiptapEditorProps {
	content: string
	onChange: (markdown: string) => void
	placeholder?: string
}

export default function TiptapEditor({
	content,
	onChange,
	placeholder = "Start writing...",
}: TiptapEditorProps) {
	const [showImageUploader, setShowImageUploader] = useState(false)
	const [imageUrl, setImageUrl] = useState("")
	const [isUploading, setIsUploading] = useState(false)
	const [uploadError, setUploadError] = useState<string | null>(null)
	const imageInputRef = useRef<HTMLInputElement>(null)
	const [htmlContent, setHtmlContent] = useState("")
	const [markdownValue, setMarkdownValue] = useState(content)
	const editorInitialized = useRef(false)
	const updateHandlerTimeout = useRef<ReturnType<typeof setTimeout> | null>(
		null
	)

	// Simple function to convert markdown to HTML
	const convertMarkdownToHtml = useCallback((markdown: string) => {
		// Process markdown line by line to better handle lists
		const lines = markdown.split("\n")
		let inList = false
		let listType = ""
		let html = ""

		for (let i = 0; i < lines.length; i++) {
			const line = lines[i]

			// Check for list items
			const bulletMatch = line.match(/^\s*([\*\-])\s+(.*?)$/)
			const numberMatch = line.match(/^\s*(\d+)\.\s+(.*?)$/)

			if (bulletMatch) {
				// Bullet list item
				const content = bulletMatch[2]
				if (!inList || listType !== "ul") {
					// Start new list if not in a bullet list
					if (inList) html += `</${listType}>\n` // Close previous list if needed
					html += `<ul>\n<li>${content}</li>\n`
					inList = true
					listType = "ul"
				} else {
					// Continue existing bullet list
					html += `<li>${content}</li>\n`
				}
			} else if (numberMatch) {
				// Numbered list item
				const content = numberMatch[2]
				if (!inList || listType !== "ol") {
					// Start new list if not in a numbered list
					if (inList) html += `</${listType}>\n` // Close previous list if needed
					html += `<ol>\n<li>${content}</li>\n`
					inList = true
					listType = "ol"
				} else {
					// Continue existing numbered list
					html += `<li>${content}</li>\n`
				}
			} else {
				// Not a list item
				if (inList) {
					// Close the current list
					html += `</${listType}>\n`
					inList = false
				}

				// Process other markdown elements
				if (line.match(/^### (.*$)/)) {
					html += line.replace(/^### (.*$)/, "<h3>$1</h3>") + "\n"
				} else if (line.match(/^## (.*$)/)) {
					html += line.replace(/^## (.*$)/, "<h2>$1</h2>") + "\n"
				} else if (line.match(/^# (.*$)/)) {
					html += line.replace(/^# (.*$)/, "<h1>$1</h1>") + "\n"
				} else if (line.match(/^>\s*(.*$)/)) {
					html +=
						line.replace(/^>\s*(.*$)/, "<blockquote>$1</blockquote>") + "\n"
				} else if (line.trim() === "") {
					html += "<p></p>\n"
				} else {
					// Regular paragraph
					html += `<p>${line
						.replace(/\*\*(.*)\*\*/g, "<strong>$1</strong>")
						.replace(/\*(.*)\*/g, "<em>$1</em>")
						.replace(/`([^`]+)`/g, "<code>$1</code>")
						.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
						.replace(
							/!\[([^\]]+)\]\(([^)]+)\)/g,
							'<img src="$2" alt="$1" />'
						)}</p>\n`
				}
			}
		}

		// Close any open list
		if (inList) {
			html += `</${listType}>\n`
		}

		// Handle code blocks separately since they can be multi-line
		html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")

		return html
	}, [])

	// HTML to Markdown conversion function
	const convertHtmlToMarkdown = useCallback((html: string): string => {
		// Clean HTML first
		let cleanHtml = html
			.replace(/<p><br><\/p>/g, "\n")
			.replace(/\n\s*\n/g, "\n\n")
			.trim()

		// Process HTML to Markdown
		return (
			cleanHtml
				// Headers
				.replace(/<h1>(.*?)<\/h1>/gim, "# $1\n\n")
				.replace(/<h2>(.*?)<\/h2>/gim, "## $1\n\n")
				.replace(/<h3>(.*?)<\/h3>/gim, "### $1\n\n")
				.replace(/<h4>(.*?)<\/h4>/gim, "#### $1\n\n")
				.replace(/<h5>(.*?)<\/h5>/gim, "##### $1\n\n")
				.replace(/<h6>(.*?)<\/h6>/gim, "###### $1\n\n")

				// Formatting
				.replace(/<strong>(.*?)<\/strong>/gim, "**$1**")
				.replace(/<em>(.*?)<\/em>/gim, "*$1*")
				.replace(/<code>(.*?)<\/code>/gim, "`$1`")

				// Code blocks
				.replace(
					/<pre><code>([\s\S]*?)<\/code><\/pre>/gim,
					function (match: string, content: string) {
						return "```\n" + content.trim() + "\n```\n\n"
					}
				)

				// Links
				.replace(
					/<a\s+(?:[^>]*?\s+)?href=["'](.*?)["'][^>]*>(.*?)<\/a>/gim,
					"[$2]($1)"
				)

				// Images
				.replace(/<img\s+(?:[^>]*?\s+)?src=["'](.*?)["'][^>]*?>/gim, "![]($1)")

				// Blockquotes
				.replace(
					/<blockquote>([\s\S]*?)<\/blockquote>/gim,
					function (match: string, content: string) {
						return content.replace(/<p>(.*?)<\/p>/gim, "> $1\n").trim() + "\n\n"
					}
				)

				// Unordered lists - handle properly
				.replace(/<ul>([\s\S]*?)<\/ul>/gim, function (match: string) {
					return (
						match
							.replace(
								/<li>([\s\S]*?)<\/li>/gim,
								function (liMatch: string, content: string) {
									// Handle nested content properly
									return "* " + content.replace(/<\/?p>/g, "").trim() + "\n"
								}
							)
							.replace(/<\/?ul>/g, "") + "\n"
					)
				})

				// Ordered lists - handle properly
				.replace(/<ol>([\s\S]*?)<\/ol>/gim, function (match: string) {
					let counter = 1
					return (
						match
							.replace(
								/<li>([\s\S]*?)<\/li>/gim,
								function (liMatch: string, content: string) {
									// Handle nested content properly
									return (
										counter++ +
										". " +
										content.replace(/<\/?p>/g, "").trim() +
										"\n"
									)
								}
							)
							.replace(/<\/?ol>/g, "") + "\n"
					)
				})

				// Clean up paragraphs
				.replace(/<p>([\s\S]*?)<\/p>/gim, "$1\n\n")

				// Clean up remaining tags
				.replace(/<\/?[^>]+(>|$)/g, "")

				// Clean up extra line breaks
				.replace(/\n\s*\n\s*\n/g, "\n\n")
				.trim()
		)
	}, [])

	// Prepare initial HTML content when component loads
	useEffect(() => {
		if (content) {
			const html = convertMarkdownToHtml(content)
			setHtmlContent(html)
			setMarkdownValue(content)
		}
	}, [content, convertMarkdownToHtml])

	// Initialize the TipTap editor with our config
	const editor = useEditor({
		extensions: [
			Document,
			Text,
			StarterKit.configure({
				heading: {
					levels: [1, 2, 3],
				},
			}),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: {
					class: "text-[rgba(var(--color-violet),0.9)] underline",
				},
			}),
			Image.configure({
				HTMLAttributes: {
					class: "mx-auto rounded-lg max-w-full my-4",
				},
			}),
			Placeholder.configure({
				placeholder,
				emptyEditorClass: "is-editor-empty",
			}),
			YouTube.configure({
				width: 640,
				height: 360,
				HTMLAttributes: {
					class: "mx-auto my-4",
				},
			}),
		],
		content: htmlContent,
		immediatelyRender: false,
		editorProps: {
			attributes: {
				class:
					"prose prose-lg dark:prose-invert prose-violet focus:outline-none max-w-none min-h-[300px] p-4",
			},
		},
	})

	// Initialize the editor with the content once it's ready
	useEffect(() => {
		if (editor && htmlContent && !editorInitialized.current) {
			// Set content once editor is ready
			editor.commands.setContent(htmlContent)
			editorInitialized.current = true
		}
	}, [editor, htmlContent])

	// Use a debounced transaction handler to update markdown only when needed
	useEffect(() => {
		if (!editor) return

		// Create a stable update listener function
		const handleUpdate = () => {
			if (updateHandlerTimeout.current) {
				clearTimeout(updateHandlerTimeout.current)
			}

			updateHandlerTimeout.current = setTimeout(() => {
				const html = editor.getHTML()
				const markdown = convertHtmlToMarkdown(html)
				onChange(markdown)
			}, 300)
		}

		// Register the event listener
		editor.on("update", handleUpdate)

		// Clean up function
		return () => {
			if (updateHandlerTimeout.current) {
				clearTimeout(updateHandlerTimeout.current)
			}
			// Clean up the listener
			editor.off("update", handleUpdate)
		}
	}, [editor, onChange, convertHtmlToMarkdown])

	// Handle file upload for images
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0]
		if (!file) return

		// Reset states
		setUploadError(null)
		setIsUploading(true)

		// Validate file size (5MB max)
		if (file.size > 5 * 1024 * 1024) {
			setUploadError("File size exceeds the 5MB limit")
			setIsUploading(false)
			return
		}

		try {
			console.log("Uploading image:", file.name)

			// Create form data for the upload
			const formData = new FormData()
			formData.append("file", file)

			// Upload to the API endpoint
			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
				credentials: "include",
			})

			// Try to get the response text first
			const responseText = await response.text()

			// Parse the response
			let data
			try {
				data = JSON.parse(responseText)
			} catch (parseError) {
				console.error("Error parsing response JSON:", parseError)
				throw new Error("Invalid response from server")
			}

			// Handle non-success responses
			if (!response.ok) {
				throw new Error(data.error || `Server error: ${response.status}`)
			}

			// Insert the image into the editor
			if (data.url && editor) {
				editor.chain().focus().setImage({ src: data.url, alt: file.name }).run()
			} else {
				throw new Error("No URL returned from upload")
			}
		} catch (error) {
			console.error("Upload failed:", error)
			setUploadError(
				error instanceof Error ? error.message : "Failed to upload image"
			)
		} finally {
			setIsUploading(false)
			// Reset file input
			if (imageInputRef.current) {
				imageInputRef.current.value = ""
			}
		}
	}

	// Handle pasting images
	const handlePaste = (event: React.ClipboardEvent) => {
		const items = event.clipboardData?.items
		if (!items || !editor) return

		for (const item of Array.from(items)) {
			if (item.type.indexOf("image") === 0) {
				event.preventDefault()
				const file = item.getAsFile()
				if (!file) continue

				// Create a form data and upload
				const formData = new FormData()
				formData.append("file", file)

				setIsUploading(true)
				setUploadError(null)

				fetch("/api/upload", {
					method: "POST",
					body: formData,
					credentials: "include",
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.url) {
							editor.chain().focus().setImage({ src: data.url }).run()
						}
					})
					.catch((error) => {
						console.error("Error uploading pasted image:", error)
						setUploadError("Failed to upload pasted image")
					})
					.finally(() => {
						setIsUploading(false)
					})
			}
		}
	}

	// Handle inserting a YouTube video
	const insertYoutubeVideo = useCallback(() => {
		if (!editor) return

		const url = prompt("Enter YouTube URL")
		if (url) {
			editor.chain().focus().setYoutubeVideo({ src: url }).run()
		}
	}, [editor])

	// Insert a link
	const insertLink = useCallback(() => {
		if (!editor) return

		const url = prompt("Enter URL")
		if (url) {
			// Check if text is selected
			if (editor.isActive("link")) {
				// Update link
				editor
					.chain()
					.focus()
					.extendMarkRange("link")
					.setLink({ href: url })
					.run()
			} else if (editor.view.state.selection.empty) {
				// No selection, insert URL as link
				editor
					.chain()
					.focus()
					.insertContent(`<a href="${url}">${url}</a>`)
					.run()
			} else {
				// Text is selected, convert to link
				editor.chain().focus().setLink({ href: url }).run()
			}
		}
	}, [editor])

	// Trigger file input click
	const handleImageClick = () => {
		imageInputRef.current?.click()
	}

	if (!editor) {
		return null
	}

	return (
		<div
			className="border border-[rgba(var(--color-foreground),0.1)] rounded-md overflow-hidden"
			onPaste={handlePaste}
		>
			<div className="bg-[rgba(var(--color-foreground),0.05)] border-b border-[rgba(var(--color-foreground),0.1)] p-2 flex flex-wrap gap-1">
				{/* Text formatting */}
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] ${
						editor.isActive("bold")
							? "bg-[rgba(var(--color-foreground),0.1)]"
							: ""
					}`}
					title="Bold"
				>
					<Bold size={18} />
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] ${
						editor.isActive("italic")
							? "bg-[rgba(var(--color-foreground),0.1)]"
							: ""
					}`}
					title="Italic"
				>
					<Italic size={18} />
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleCode().run()}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] ${
						editor.isActive("code")
							? "bg-[rgba(var(--color-foreground),0.1)]"
							: ""
					}`}
					title="Inline Code"
				>
					<Code size={18} />
				</button>

				<div className="w-px h-6 mx-1 bg-[rgba(var(--color-foreground),0.1)] self-center"></div>

				{/* Headings */}
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 1 }).run()
					}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] ${
						editor.isActive("heading", { level: 1 })
							? "bg-[rgba(var(--color-foreground),0.1)]"
							: ""
					}`}
					title="Heading 1"
				>
					<Heading1 size={18} />
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] ${
						editor.isActive("heading", { level: 2 })
							? "bg-[rgba(var(--color-foreground),0.1)]"
							: ""
					}`}
					title="Heading 2"
				>
					<Heading2 size={18} />
				</button>
				<button
					type="button"
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] ${
						editor.isActive("heading", { level: 3 })
							? "bg-[rgba(var(--color-foreground),0.1)]"
							: ""
					}`}
					title="Heading 3"
				>
					<Heading3 size={18} />
				</button>

				<div className="w-px h-6 mx-1 bg-[rgba(var(--color-foreground),0.1)] self-center"></div>

				{/* Lists */}
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] ${
						editor.isActive("bulletList")
							? "bg-[rgba(var(--color-foreground),0.1)]"
							: ""
					}`}
					title="Bullet List"
				>
					<List size={18} />
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] ${
						editor.isActive("orderedList")
							? "bg-[rgba(var(--color-foreground),0.1)]"
							: ""
					}`}
					title="Ordered List"
				>
					<ListOrdered size={18} />
				</button>
				<button
					type="button"
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] ${
						editor.isActive("blockquote")
							? "bg-[rgba(var(--color-foreground),0.1)]"
							: ""
					}`}
					title="Quote"
				>
					<Quote size={18} />
				</button>

				<div className="w-px h-6 mx-1 bg-[rgba(var(--color-foreground),0.1)] self-center"></div>

				{/* Media */}
				<button
					type="button"
					onClick={handleImageClick}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)]`}
					title="Insert Image"
				>
					<ImagePlus size={18} />
					<input
						type="file"
						ref={imageInputRef}
						onChange={handleFileChange}
						style={{ display: "none" }}
						accept="image/jpeg,image/png,image/gif,image/webp"
					/>
				</button>
				<button
					type="button"
					onClick={insertLink}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)] ${
						editor.isActive("link")
							? "bg-[rgba(var(--color-foreground),0.1)]"
							: ""
					}`}
					title="Insert Link"
				>
					<Link2 size={18} />
				</button>
				<button
					type="button"
					onClick={insertYoutubeVideo}
					className={`p-2 rounded hover:bg-[rgba(var(--color-foreground),0.1)]`}
					title="Insert YouTube Video"
				>
					<Youtube size={18} />
				</button>
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

			<EditorContent editor={editor} className="min-h-[300px]" />
		</div>
	)
}
