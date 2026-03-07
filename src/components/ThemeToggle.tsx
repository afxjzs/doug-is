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
			{isDark ? (
				<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
				</svg>
			) : (
				<svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
				</svg>
			)}
			{label}
		</button>
	)
}
