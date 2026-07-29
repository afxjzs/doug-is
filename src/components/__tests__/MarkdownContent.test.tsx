/**
 * Tests for MarkdownContent — the shared Markdown renderer.
 *
 * The prose wrapper here styles BOTH the public post view and the admin
 * editor preview. The dark-palette assertions exist because the light-theme
 * `prose` defaults once leaked through: list items rendered dim gray-700 and
 * bold text near-black gray-900 on the dark background (invisible in prod).
 */

import { render } from "@testing-library/react"
import MarkdownContent from "../MarkdownContent"

// Mock react-markdown and remark-gfm to avoid ESM module loading issues
jest.mock("react-markdown", () => {
	return function MockReactMarkdown({ children }: any) {
		return <div data-testid="markdown-content">{children}</div>
	}
})

jest.mock("remark-gfm", () => ({}))

describe("MarkdownContent", () => {
	function renderProseWrapper(className?: string) {
		const { container } = render(
			<MarkdownContent content="Some **bold** text" className={className} />
		)
		return container.querySelector("article") as HTMLElement
	}

	it("renders content through the prose wrapper", () => {
		const article = renderProseWrapper()
		expect(article).toBeInTheDocument()
		expect(article).toHaveClass("prose", "lg:prose-lg")
	})

	it("uses the dark prose palette so no light-theme grays leak through", () => {
		const article = renderProseWrapper()
		expect(article).toHaveClass("prose-invert")
	})

	it("styles list items to match paragraph text color", () => {
		const article = renderProseWrapper()
		expect(article).toHaveClass(
			"prose-li:text-[rgba(var(--color-foreground),0.8)]"
		)
	})

	it("styles bold text brighter than body text, not darker", () => {
		const article = renderProseWrapper()
		expect(article).toHaveClass(
			"prose-strong:text-[rgb(var(--color-foreground))]"
		)
	})

	it("appends caller-supplied classes to the wrapper", () => {
		const article = renderProseWrapper("mt-8")
		expect(article).toHaveClass("prose", "mt-8")
	})
})
