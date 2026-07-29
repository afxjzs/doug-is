"use client"

import { FC } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

/**
 * Shared Markdown renderer for the site.
 *
 * This is the single source of truth for how stored Markdown becomes HTML:
 * the public post view (`PostView`) and the admin editor's live preview both
 * render through this component, so what an author previews is byte-for-byte
 * what a reader sees. Do not inline `<ReactMarkdown>` elsewhere — extend this
 * instead, or the preview and the published page will silently drift.
 */

// The exact prose wrapper classes used by the published post view. Kept here so
// the editor preview inherits them verbatim.
const PROSE_CLASSES =
	"prose prose-invert lg:prose-lg prose-headings:text-[rgb(var(--color-foreground))] prose-headings:font-bold prose-p:text-[rgba(var(--color-foreground),0.8)] prose-li:text-[rgba(var(--color-foreground),0.8)] prose-strong:text-[rgb(var(--color-foreground))] prose-a:text-[rgb(var(--color-accent))] prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-code:text-[rgb(var(--color-accent-secondary))] prose-pre:bg-[rgba(var(--color-foreground),0.05)] prose-pre:text-[rgba(var(--color-foreground),0.9)] prose-blockquote:text-[rgba(var(--color-foreground),0.7)] prose-blockquote:border-l-4 prose-blockquote:border-[rgba(var(--color-accent),0.3)] prose-blockquote:pl-4 prose-blockquote:italic prose-p:my-6"

interface MarkdownContentProps {
	/** Raw Markdown source to render. */
	content: string
	/**
	 * Optional ReactMarkdown component overrides (e.g. a link renderer that
	 * tracks clicks). Passed straight through to `<ReactMarkdown components>`.
	 */
	components?: React.ComponentProps<typeof ReactMarkdown>["components"]
	/** Extra classes appended to the prose wrapper (e.g. layout margins). */
	className?: string
}

/**
 * Renders Markdown with the same plugins (`remark-gfm`) and `prose` styling used
 * across the site.
 */
export const MarkdownContent: FC<MarkdownContentProps> = ({
	content,
	components,
	className = "",
}) => {
	return (
		<article className={`${PROSE_CLASSES} ${className}`.trim()}>
			<div className="[&>p]:mb-8">
				<ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
					{content || ""}
				</ReactMarkdown>
			</div>
		</article>
	)
}

export default MarkdownContent
