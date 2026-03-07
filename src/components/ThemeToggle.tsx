"use client"

import { useEffect, useState } from "react"

type Theme = "system" | "light" | "dark"

function getStoredTheme(): Theme {
	if (typeof window === "undefined") return "system"
	return (localStorage.getItem("theme") as Theme) || "system"
}

function applyTheme(theme: Theme) {
	const root = document.documentElement
	root.classList.remove("light", "dark")
	root.removeAttribute("data-theme")

	if (theme === "light") {
		root.classList.add("light")
		root.setAttribute("data-theme", "light")
	} else if (theme === "dark") {
		root.classList.add("dark")
		root.setAttribute("data-theme", "dark")
	}
	// "system" = no class, CSS media query handles it
}

function isDarkActive(theme: Theme): boolean {
	if (theme === "dark") return true
	if (theme === "light") return false
	if (typeof window === "undefined") return true
	return window.matchMedia("(prefers-color-scheme: dark)").matches
}

export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("system")
	const [isDark, setIsDark] = useState(true)

	useEffect(() => {
		const stored = getStoredTheme()
		setTheme(stored)
		applyTheme(stored)
		setIsDark(isDarkActive(stored))
	}, [])

	const toggle = () => {
		const dark = isDarkActive(theme)
		const next: Theme = dark ? "light" : "dark"
		setTheme(next)
		applyTheme(next)
		setIsDark(!dark)
		localStorage.setItem("theme", next)
	}

	const label = isDark ? "turn on the lights" : "set the mood"

	return (
		<button
			onClick={toggle}
			className="flex items-center gap-1.5 text-xs text-[rgba(var(--color-muted),1)] hover:text-[rgba(var(--color-foreground),0.8)] transition-colors"
			aria-label={label}
		>
			{/* Light switch icon */}
			<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
				{isDark ? (
					<>
						<rect x="8" y="2" width="8" height="14" rx="4" />
						<circle cx="12" cy="9" r="2" fill="currentColor" />
						<path strokeLinecap="round" d="M12 16v6" />
					</>
				) : (
					<>
						<rect x="8" y="2" width="8" height="14" rx="4" />
						<circle cx="12" cy="6" r="2" fill="currentColor" />
						<path strokeLinecap="round" d="M12 16v6" />
					</>
				)}
			</svg>
			{label}
		</button>
	)
}
