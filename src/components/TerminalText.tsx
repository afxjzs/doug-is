"use client"

import { useEffect, useState } from "react"

const allLines = [
	"$ whoami",
	"doug rogers \u2014 engineer, founder, advisor",
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
	"0 \u2192 1 product development",
	"customer empathy (the real kind)",
	"",
	"$ echo $STATUS",
	"still shipping.",
]

export default function TerminalText() {
	const [lines, setLines] = useState<string[]>([])
	const [currentLine, setCurrentLine] = useState(0)
	const [currentChar, setCurrentChar] = useState(0)
	const [showCursor, setShowCursor] = useState(true)

	useEffect(() => {
		const timer = setInterval(() => {
			setShowCursor((prev) => !prev)
		}, 530)
		return () => clearInterval(timer)
	}, [])

	useEffect(() => {
		if (currentLine >= allLines.length) return

		const line = allLines[currentLine]
		if (line === "") {
			setTimeout(() => {
				setLines((prev) => [...prev, ""])
				setCurrentLine((prev) => prev + 1)
				setCurrentChar(0)
			}, 200)
			return
		}

		if (currentChar >= line.length) {
			setLines((prev) => [...prev, line])
			setCurrentLine((prev) => prev + 1)
			setCurrentChar(0)
			return
		}

		const isCommand = line.startsWith("$")
		const speed = isCommand ? 45 : 18

		const timer = setTimeout(() => {
			setCurrentChar((prev) => prev + 1)
		}, speed)

		return () => clearTimeout(timer)
	}, [currentLine, currentChar])

	const typingLine =
		currentLine < allLines.length
			? allLines[currentLine].substring(0, currentChar)
			: ""

	return (
		<div
			style={{
				fontFamily: "var(--font-body, 'JetBrains Mono', monospace)",
				fontSize: "14px",
				lineHeight: "1.8",
			}}
		>
			{lines.map((line, i) => (
				<div key={i} style={{ minHeight: "25px" }}>
					{line.startsWith("$") ? (
						<span>
							<span style={{ color: "rgb(var(--color-accent))" }}>
								&#10095;{" "}
							</span>
							<span style={{ color: "rgb(var(--color-foreground))" }}>
								{line.substring(2)}
							</span>
						</span>
					) : (
						<span
							style={{ color: "rgba(var(--color-foreground), 0.55)" }}
						>
							{line}
						</span>
					)}
				</div>
			))}
			{currentLine < allLines.length && (
				<div style={{ minHeight: "25px" }}>
					{typingLine.startsWith("$") ? (
						<span>
							<span style={{ color: "rgb(var(--color-accent))" }}>
								&#10095;{" "}
							</span>
							<span style={{ color: "rgb(var(--color-foreground))" }}>
								{typingLine.substring(2)}
							</span>
						</span>
					) : (
						<span
							style={{ color: "rgba(var(--color-foreground), 0.55)" }}
						>
							{typingLine}
						</span>
					)}
					<span
						style={{
							opacity: showCursor ? 1 : 0,
							color: "rgb(var(--color-accent))",
							transition: "opacity 0.1s",
						}}
					>
						&#9610;
					</span>
				</div>
			)}
		</div>
	)
}
