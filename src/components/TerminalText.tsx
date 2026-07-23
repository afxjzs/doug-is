"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { completeInput, runCommand } from "@/lib/terminal/commands"

const allLines = [
	"$ whoami",
	"doug rogers — engineer, founder, advisor",
	"",
	"$ cat experience.log",
	"25+ years building products",
	"multiple startups, two exits",
	"YC & Techstars alum",
	"accelerator director",
	"",
	"$ cat strengths.txt",
	"rapid prototyping & MVPs",
	"idea validation & ICP identification",
	"0 → 1 product development",
	"customer empathy (the real kind)",
	"",
	"$ echo $STATUS",
	"still shipping.",
]

const COMMAND_SPEED = 45
const TEXT_SPEED = 18
const PROMPT = "❯ " // ❯

// Beat between printing a navigation command's output and leaving the
// page, so the visitor sees the response land.
const NAVIGATE_DELAY_MS = 600
// Slightly longer than the 800ms CSS animation so the class outlives it.
const BARREL_ROLL_MS = 900

const MAX_HISTORY = 50

interface HistoryLine {
	kind: "command" | "output"
	text: string
}

function makeLineEl(line: string): HTMLDivElement {
	const div = document.createElement("div")
	div.style.minHeight = "25px"

	if (line.startsWith("$")) {
		const promptSpan = document.createElement("span")
		promptSpan.style.color = "rgb(var(--color-accent))"
		promptSpan.textContent = PROMPT
		const textSpan = document.createElement("span")
		textSpan.style.color = "rgb(var(--color-foreground))"
		textSpan.textContent = line.substring(2)
		div.appendChild(promptSpan)
		div.appendChild(textSpan)
	} else {
		const span = document.createElement("span")
		span.style.color = "rgba(var(--color-foreground), 0.55)"
		span.textContent = line
		div.appendChild(span)
	}
	return div
}

export default function TerminalText() {
	const containerRef = useRef<HTMLDivElement>(null)
	const inputRef = useRef<HTMLInputElement>(null)
	const promptRowRef = useRef<HTMLDivElement>(null)
	const router = useRouter()

	// The intro is imperative (see effect below); everything after it is
	// ordinary React state.
	const [introDone, setIntroDone] = useState(false)
	const [lines, setLines] = useState<HistoryLine[]>([])
	const [value, setValue] = useState("")
	const [history, setHistory] = useState<string[]>([])
	const [historyIndex, setHistoryIndex] = useState<number | null>(null)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		// Cancellation must be per-effect-run (not a shared ref): StrictMode
		// runs the effect twice, and a shared flag lets the first, cancelled
		// typing loop resume once the second run resets it.
		let cancelled = false

		// Reduced-motion: dump everything immediately, no typing.
		const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
		if (reduced) {
			allLines.forEach((line) => {
				container.appendChild(makeLineEl(line || " "))
			})
			setIntroDone(true)
			return () => {
				cancelled = true
				container.replaceChildren()
			}
		}

		// Cursor element — animation is CSS-only; we just move it between
		// lines and remove it when done.
		const cursor = document.createElement("span")
		cursor.textContent = "█"
		cursor.style.color = "rgb(var(--color-accent))"
		cursor.style.marginLeft = "1px"
		cursor.style.animation = "terminal-blink 1s steps(2) infinite"

		const typeLine = (lineIndex: number, charIndex: number) => {
			if (cancelled) return
			if (lineIndex >= allLines.length) {
				cursor.remove()
				setIntroDone(true)
				return
			}

			const line = allLines[lineIndex]

			// Empty line — append a blank and pause briefly. The cursor lives
			// inside the previous row, so we append the blank after it (not via
			// insertBefore, which would require cursor to be a direct child).
			if (line === "") {
				const blank = document.createElement("div")
				blank.style.minHeight = "25px"
				container.appendChild(blank)
				setTimeout(() => typeLine(lineIndex + 1, 0), 200)
				return
			}

			// First char of a line — make a fresh row and put the cursor in it.
			if (charIndex === 0) {
				const row = document.createElement("div")
				row.style.minHeight = "25px"

				if (line.startsWith("$")) {
					const promptSpan = document.createElement("span")
					promptSpan.style.color = "rgb(var(--color-accent))"
					promptSpan.textContent = PROMPT
					row.appendChild(promptSpan)
					const textSpan = document.createElement("span")
					textSpan.style.color = "rgb(var(--color-foreground))"
					textSpan.dataset.terminalContent = "true"
					row.appendChild(textSpan)
				} else {
					const textSpan = document.createElement("span")
					textSpan.style.color = "rgba(var(--color-foreground), 0.55)"
					textSpan.dataset.terminalContent = "true"
					row.appendChild(textSpan)
				}

				row.appendChild(cursor)
				container.appendChild(row)
			}

			const isCommand = line.startsWith("$")
			const visible = isCommand ? line.substring(2) : line
			const target = visible.substring(0, charIndex + 1)

			// Update only the text span — no React, no full re-render.
			const lastRow = container.lastElementChild as HTMLElement | null
			const textSpan = lastRow?.querySelector(
				'[data-terminal-content="true"]'
			) as HTMLElement | null
			if (textSpan) textSpan.textContent = target

			const charsToType = visible.length

			if (charIndex + 1 < charsToType) {
				setTimeout(
					() => typeLine(lineIndex, charIndex + 1),
					isCommand ? COMMAND_SPEED : TEXT_SPEED
				)
			} else {
				setTimeout(() => typeLine(lineIndex + 1, 0), 50)
			}
		}

		typeLine(0, 0)

		return () => {
			cancelled = true
			container.replaceChildren()
		}
	}, [])

	// Keep the prompt in view as output accumulates (scrollIntoView is
	// absent in jsdom, hence the optional call).
	useEffect(() => {
		promptRowRef.current?.scrollIntoView?.({ block: "nearest" })
	}, [lines])

	const submit = () => {
		const trimmed = value.trim()
		setValue("")
		setHistoryIndex(null)

		if (!trimmed) {
			setLines((prev) => [...prev, { kind: "command", text: "" }])
			return
		}

		setHistory((prev) => [...prev, trimmed].slice(-MAX_HISTORY))
		const { output, action } = runCommand(trimmed)

		if (action?.type === "clear") {
			containerRef.current?.replaceChildren()
			setLines([])
			return
		}

		setLines((prev) => [
			...prev,
			{ kind: "command", text: trimmed },
			...output.map((text) => ({ kind: "output" as const, text })),
		])

		if (action?.type === "navigate") {
			window.setTimeout(() => router.push(action.href), NAVIGATE_DELAY_MS)
		}

		if (action?.type === "barrel-roll") {
			// The global prefers-reduced-motion collapse in globals.css turns
			// the spin into a no-op for visitors who asked for less motion.
			document.body.classList.add("barrel-roll")
			window.setTimeout(() => {
				document.body.classList.remove("barrel-roll")
			}, BARREL_ROLL_MS)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			submit()
			return
		}

		if (e.key === "Tab") {
			e.preventDefault()
			const completed = completeInput(value)
			if (completed) setValue(completed)
			return
		}

		if (e.key === "ArrowUp") {
			e.preventDefault()
			if (history.length === 0) return
			const next =
				historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1)
			setHistoryIndex(next)
			setValue(history[next])
			return
		}

		if (e.key === "ArrowDown") {
			e.preventDefault()
			if (historyIndex === null) return
			const next = historyIndex + 1
			if (next >= history.length) {
				setHistoryIndex(null)
				setValue("")
			} else {
				setHistoryIndex(next)
				setValue(history[next])
			}
		}
	}

	return (
		<div
			style={{
				fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
				fontSize: "14px",
				lineHeight: "1.8",
			}}
			onClick={() => inputRef.current?.focus()}
		>
			<div ref={containerRef} />

			{introDone && (
				<div>
					<div role="log" aria-live="polite">
						{lines.map((line, i) => (
							<div key={i} style={{ minHeight: "25px", whiteSpace: "pre-wrap" }}>
								{line.kind === "command" ? (
									<>
										<span style={{ color: "rgb(var(--color-accent))" }}>
											{PROMPT}
										</span>
										<span style={{ color: "rgb(var(--color-foreground))" }}>
											{line.text}
										</span>
									</>
								) : (
									<span
										style={{ color: "rgba(var(--color-foreground), 0.55)" }}
									>
										{line.text}
									</span>
								)}
							</div>
						))}
					</div>

					{/* Live prompt — the visible row echoes the hidden input, so
					   the block cursor and colors stay terminal-true. */}
					<div
						ref={promptRowRef}
						className="relative"
						style={{ minHeight: "25px" }}
					>
						<span style={{ color: "rgb(var(--color-accent))" }}>{PROMPT}</span>
						<span style={{ color: "rgb(var(--color-foreground))" }}>
							{value}
						</span>
						<span
							aria-hidden="true"
							style={{
								color: "rgb(var(--color-accent))",
								marginLeft: "1px",
								animation: "terminal-blink 1s steps(2) infinite",
							}}
						>
							█
						</span>
						<input
							ref={inputRef}
							aria-label="Terminal input"
							value={value}
							onChange={(e) => setValue(e.target.value)}
							onKeyDown={handleKeyDown}
							className="absolute inset-0 w-full opacity-0 cursor-text"
							autoCapitalize="none"
							autoComplete="off"
							autoCorrect="off"
							spellCheck={false}
						/>
					</div>
				</div>
			)}
		</div>
	)
}
