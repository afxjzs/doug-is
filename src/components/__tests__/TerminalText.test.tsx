import { StrictMode, type ReactElement } from "react"
import { act, fireEvent, render, screen } from "@testing-library/react"
import { mockMatchMedia, mockRouterPush } from "@/lib/test-utils"
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

	it("notifies onIntroDone when the intro completes", () => {
		mockMatchMedia(true)
		const onIntroDone = jest.fn()
		render(<TerminalText onIntroDone={onIntroDone} />)
		expect(onIntroDone).toHaveBeenCalled()
	})
})

describe("TerminalText interactive prompt", () => {
	beforeEach(() => {
		mockRouterPush.mockClear()
		document.body.classList.remove("barrel-roll")
	})

	const setup = () => {
		mockMatchMedia(true)
		const utils = render(<TerminalText />)
		const input = screen.getByLabelText("Terminal input") as HTMLInputElement
		return { ...utils, input }
	}

	const run = (input: HTMLInputElement, cmd: string) => {
		fireEvent.change(input, { target: { value: cmd } })
		fireEvent.keyDown(input, { key: "Enter" })
	}

	it("shows a prompt after the intro and answers help", () => {
		const { input, container } = setup()
		run(input, "help")
		expect(container.textContent).toContain("available commands:")
		expect(container.textContent).toContain("doesn't mention")
	})

	it("fails loudly on unknown commands", () => {
		const { input, container } = setup()
		run(input, "frobnicate")
		expect(container.textContent).toContain("command not found: frobnicate")
	})

	it("navigates via open after a short beat", () => {
		jest.useFakeTimers()
		const { input } = setup()
		run(input, "open advising")
		expect(mockRouterPush).not.toHaveBeenCalled()
		act(() => {
			jest.advanceTimersByTime(700)
		})
		expect(mockRouterPush).toHaveBeenCalledWith("/advising")
		jest.useRealTimers()
	})

	it("does a barrel roll on the body and cleans up after itself", () => {
		jest.useFakeTimers()
		const { input, container } = setup()
		run(input, "do a barrel roll")
		expect(container.textContent).toContain("nailed it")
		expect(document.body.classList.contains("barrel-roll")).toBe(true)
		act(() => {
			jest.advanceTimersByTime(1000)
		})
		expect(document.body.classList.contains("barrel-roll")).toBe(false)
		jest.useRealTimers()
	})

	it("recalls history with ArrowUp", () => {
		const { input } = setup()
		run(input, "uptime")
		fireEvent.keyDown(input, { key: "ArrowUp" })
		expect(input.value).toBe("uptime")
	})

	it("completes with Tab", () => {
		const { input } = setup()
		fireEvent.change(input, { target: { value: "he" } })
		fireEvent.keyDown(input, { key: "Tab" })
		expect(input.value).toBe("help")
	})

	it("clear wipes the screen including the intro", () => {
		const { input, container } = setup()
		run(input, "help")
		run(input, "clear")
		expect(container.textContent).not.toContain("available commands:")
		expect(container.textContent).not.toContain("25+ years building products")
	})
})
