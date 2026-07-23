import { StrictMode, type ReactElement } from "react"
import { act, render } from "@testing-library/react"
import { mockMatchMedia } from "@/lib/test-utils"
import TerminalText from "../TerminalText"

describe("TerminalText", () => {
	it("renders in the monospace font, not the body font", () => {
		mockMatchMedia(true)
		const { container } = render(<TerminalText />)
		const terminal = container.firstElementChild as HTMLElement
		expect(terminal.style.fontFamily).toContain("--font-mono")
		expect(terminal.style.fontFamily).not.toContain("--font-body")
	})

	it("types each line exactly once when effects double-invoke (StrictMode)", () => {
		jest.useFakeTimers()
		mockMatchMedia(false)

		const typedRowCount = (ui: ReactElement): number => {
			const { container, unmount } = render(ui)
			act(() => {
				jest.runAllTimers()
			})
			const terminal = container.firstElementChild as HTMLElement
			const count = terminal.children.length
			unmount()
			return count
		}

		const baseline = typedRowCount(<TerminalText />)
		const strict = typedRowCount(
			<StrictMode>
				<TerminalText />
			</StrictMode>
		)
		expect(strict).toBe(baseline)
		jest.useRealTimers()
	})

	it("dumps all lines immediately under reduced motion", () => {
		mockMatchMedia(true)
		const { container } = render(<TerminalText />)
		expect(container.textContent).toContain(
			"doug rogers — engineer, founder, advisor"
		)
		expect(container.textContent).toContain("still shipping.")
	})
})
