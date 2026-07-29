/**
 * Tests for the /writing index page.
 *
 * The card contract mirrors the homepage vocabulary: each post is ONE
 * whole-card link (flat, bordered — not the old rounded-xl shadow card with
 * a separate "Read more →" link), tagged with a mono uppercase category
 * label. The empty state is plain prose with an exit path, not a
 * StatusMessage alert.
 */

import { render, screen, act } from "@testing-library/react"
import WritingPage from "../page"
import { getPublishedPosts } from "@/lib/supabase/data"

jest.mock("@/lib/supabase/data", () => ({
	getPublishedPosts: jest.fn(),
}))

jest.mock("next/image", () => {
	return function MockImage({
		src,
		alt,
		style,
	}: {
		src: string
		alt: string
		style?: React.CSSProperties
	}) {
		return <img src={src} alt={alt} style={style} />
	}
})

jest.mock("next/link", () => {
	return function MockLink({ href, children, ...props }: any) {
		return (
			<a href={href} {...props}>
				{children}
			</a>
		)
	}
})

const mockPosts = [
	{
		id: "1",
		title: "First Post",
		slug: "first-post",
		content: "Body one.",
		excerpt: "Excerpt one.",
		category: "Development",
		published_at: "2026-07-01T00:00:00Z",
		featured_image: "/images/one.jpg",
		created_at: "2026-07-01T00:00:00Z",
		updated_at: "2026-07-01T00:00:00Z",
	},
	{
		id: "2",
		title: "Second Post",
		slug: "second-post",
		content: "Body two.",
		excerpt: "Excerpt two.",
		category: "investing",
		published_at: "2026-06-01T00:00:00Z",
		featured_image: null,
		created_at: "2026-06-01T00:00:00Z",
		updated_at: "2026-06-01T00:00:00Z",
	},
]

async function renderPage() {
	const ui = await WritingPage()
	let view: ReturnType<typeof render>
	await act(async () => {
		view = render(ui)
	})
	return view!
}

describe("WritingPage", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	describe("with posts", () => {
		beforeEach(() => {
			;(getPublishedPosts as jest.Mock).mockResolvedValue(mockPosts)
		})

		it("renders the mono breadcrumb above a descriptive h1", async () => {
			await renderPage()

			expect(screen.getByText("doug.is/writing")).toBeInTheDocument()
			const h1 = screen.getByRole("heading", { level: 1 })
			expect(h1).toHaveTextContent("Writing")
			expect(h1).not.toHaveTextContent("doug.is/writing")
		})

		it("renders each post as one whole-card link containing tag, title, and excerpt", async () => {
			await renderPage()

			const cards = screen
				.getAllByRole("link")
				.filter(
					(a) =>
						a.getAttribute("href") ===
						"/writing/about/development/first-post"
				)
			expect(cards).toHaveLength(1)
			expect(cards[0]).toHaveTextContent("Development")
			expect(cards[0]).toHaveTextContent("First Post")
			expect(cards[0]).toHaveTextContent("Excerpt one.")
		})

		it("lowercases the category in the post href", async () => {
			await renderPage()

			const card = screen
				.getAllByRole("link")
				.find((a) =>
					a.getAttribute("href")?.endsWith("/second-post")
				)
			expect(card).toHaveAttribute(
				"href",
				"/writing/about/investing/second-post"
			)
		})

		it("uses the flat bordered card, not the legacy shadow card", async () => {
			await renderPage()

			const card = screen
				.getAllByRole("link")
				.find((a) => a.getAttribute("href")?.endsWith("/first-post"))!
			expect(card.className).toContain("border")
			expect(card.className).not.toContain("shadow")
		})

		it("has no separate Read more link", async () => {
			await renderPage()

			expect(screen.queryByText(/read more/i)).not.toBeInTheDocument()
		})

		it("transitions the properties the hover actually changes (v4 translate/scale)", async () => {
			const { container } = await renderPage()

			// Tailwind v4's -translate-y-1 and scale-[1.04] set the native CSS
			// `translate`/`scale` properties — a `transform` transition never
			// fires for them, so the hover snaps instead of animating.
			const card = screen
				.getAllByRole("link")
				.find((a) => a.getAttribute("href")?.endsWith("/first-post"))!
			expect(card.style.transition).toContain("translate")
			expect(card.style.transition).not.toMatch(/\btransform\b/)

			const image = container.querySelector("img")!
			expect(image.style.transition).toContain("scale")
			expect(image.style.transition).not.toMatch(/\btransform\b/)
		})
	})

	describe("with no posts", () => {
		beforeEach(() => {
			;(getPublishedPosts as jest.Mock).mockResolvedValue([])
		})

		it("renders a plain empty state instead of a StatusMessage alert", async () => {
			await renderPage()

			expect(
				screen.queryByText(/no posts found\. check back later/i)
			).not.toBeInTheDocument()
			expect(screen.getByText(/no posts right now/i)).toBeInTheDocument()
		})

		it("offers an exit path home", async () => {
			await renderPage()

			const exit = screen.getByRole("link", { name: /back to doug\.is/i })
			expect(exit).toHaveAttribute("href", "/")
		})
	})
})
