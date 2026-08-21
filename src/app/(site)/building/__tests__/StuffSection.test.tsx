import { render, screen } from "@testing-library/react"
import StuffSection, { STUFF_PREVIEW_COUNT } from "../StuffSection"
import type { Thing } from "@/lib/stuff"

jest.mock("next/image", () => {
	return function MockImage({ src, alt }: { src: string; alt: string }) {
		return <img src={src} alt={alt} />
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

function thing(n: number, screenshot: string | null = null): Thing {
	return {
		slug: `thing-${n}`,
		title: `Thing ${n}`,
		description: `Description ${n}.`,
		screenshot,
	}
}

describe("StuffSection", () => {
	it("renders a heading and a link to the full index", () => {
		render(<StuffSection things={[thing(1)]} />)

		expect(screen.getByRole("heading", { name: "Stuff" })).toBeInTheDocument()
		expect(screen.getByRole("link", { name: /see all stuff/i })).toHaveAttribute(
			"href",
			"/building/stuff"
		)
	})

	it("links each tile to its standalone page", () => {
		render(<StuffSection things={[thing(1)]} />)

		const tile = screen.getByRole("link", { name: /Thing 1/ })
		expect(tile).toHaveAttribute("href", "/building/stuff/thing-1")
		expect(screen.getByText("Description 1.")).toBeInTheDocument()
	})

	it("shows the committed screenshot when there is one", () => {
		render(
			<StuffSection things={[thing(1, "/images/stuff/thing-1.png")]} />
		)

		expect(screen.getByAltText("Screenshot of Thing 1")).toHaveAttribute(
			"src",
			"/images/stuff/thing-1.png"
		)
	})

	it("falls back to the OG card when no screenshot was captured", () => {
		render(<StuffSection things={[thing(1)]} />)

		expect(screen.getByAltText("Screenshot of Thing 1")).toHaveAttribute(
			"src",
			"/building/stuff/thing-1/og"
		)
	})

	it("caps the preview and leaves the rest to the index", () => {
		const many = Array.from({ length: STUFF_PREVIEW_COUNT + 3 }, (_, i) =>
			thing(i + 1)
		)

		render(<StuffSection things={many} />)

		expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
			STUFF_PREVIEW_COUNT
		)
		expect(
			screen.queryByText(`Thing ${STUFF_PREVIEW_COUNT + 1}`)
		).not.toBeInTheDocument()
	})

	it("renders nothing when there are no things", () => {
		const { container } = render(<StuffSection things={[]} />)

		expect(container).toBeEmptyDOMElement()
	})
})
