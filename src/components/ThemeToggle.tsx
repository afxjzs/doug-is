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

export default function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("system")

	useEffect(() => {
		const stored = getStoredTheme()
		setTheme(stored)
		applyTheme(stored)
	}, [])

	const cycle = () => {
		const order: Theme[] = ["system", "light", "dark"]
		const next = order[(order.indexOf(theme) + 1) % order.length]
		setTheme(next)
		applyTheme(next)
		localStorage.setItem("theme", next)
	}

	const label =
		theme === "system" ? "Auto" : theme === "light" ? "Light" : "Dark"

	return (
		<button
			onClick={cycle}
			className="flex items-center gap-1.5 text-sm text-[rgba(var(--color-muted),1)] hover:text-[rgba(var(--color-foreground),0.8)] transition-colors"
			aria-label={`Theme: ${label}. Click to change.`}
		>
			{theme === "system" && (
				<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
				</svg>
			)}
			{theme === "light" && (
				<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
				</svg>
			)}
			{theme === "dark" && (
				<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
					<path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
				</svg>
			)}
			{label}
		</button>
	)
}
