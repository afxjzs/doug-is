import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import "@testing-library/jest-dom"
import MarkdownEditor from "@/components/admin/MarkdownEditor"

// The torture test: the exact kind of content that broke the old WYSIWYG editor
// — a fenced code block containing `<`, `>`, `&`, and multiple lines (the jq
// settings-merge block from the agent-config write-up). If the editor stores
// this verbatim, it will store anything.
const TORTURE_MARKDOWN = `# Settings merge

Merge a permission into \`settings.json\` without clobbering the rest:

\`\`\`bash
jq --arg rule "Bash(npm test:*)" \\
  '.permissions.allow = ((.permissions.allow // []) + [$rule] | unique)' \\
  settings.json > settings.tmp && mv settings.tmp settings.json
\`\`\`

Note the \`&&\`, the \`>\` redirect, and the \`<\`/\`>\` in \`a < b && c > d\`.
`

describe("MarkdownEditor", () => {
	it("passes textarea input through to onChange byte-for-byte", () => {
		const onChange = jest.fn()
		render(<MarkdownEditor content="" onChange={onChange} />)

		const textarea = screen.getByRole("textbox")
		fireEvent.change(textarea, { target: { value: TORTURE_MARKDOWN } })

		expect(onChange).toHaveBeenCalledTimes(1)
		const stored = onChange.mock.calls[0][0]

		// The stored string must be identical to the source — no HTML-escaping of
		// < > &, no collapsed newlines, no leaked fence language.
		expect(stored).toBe(TORTURE_MARKDOWN)
		expect(stored).toContain("<")
		expect(stored).toContain(">")
		expect(stored).toContain("&&")
		expect(stored).not.toContain("&lt;")
		expect(stored).not.toContain("&amp;")
		// Newlines preserved (multi-line fenced block stays multi-line).
		expect(stored.split("\n").length).toBe(TORTURE_MARKDOWN.split("\n").length)
	})

	it("renders the current content as the textarea value", () => {
		const onChange = jest.fn()
		render(<MarkdownEditor content={TORTURE_MARKDOWN} onChange={onChange} />)

		const textarea = screen.getByRole("textbox") as HTMLTextAreaElement
		expect(textarea.value).toBe(TORTURE_MARKDOWN)
	})

	it("shows a live preview of the markdown content", () => {
		const onChange = jest.fn()
		render(<MarkdownEditor content={TORTURE_MARKDOWN} onChange={onChange} />)

		// The mocked react-markdown renders its children string verbatim, so the
		// preview pane should contain the source we passed in.
		const preview = screen.getByTestId("react-markdown")
		expect(preview).toHaveTextContent("Settings merge")
	})
})
