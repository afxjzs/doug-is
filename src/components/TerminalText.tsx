"use client"

import { useEffect, useRef } from "react"

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

	return (
		<div
			ref={containerRef}
			style={{
				fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)",
				fontSize: "14px",
				lineHeight: "1.8",
			}}
		/>
	)
}
