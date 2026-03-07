"use client"

import Link from "next/link"
import ThemeToggle from "./ThemeToggle"

const siteLinks = [
	{ name: "Advising", href: "/advising" },
	{ name: "Building", href: "/building" },
	{ name: "Investing", href: "/investing" },
	{ name: "Writing", href: "/thinking" },
	{ name: "About", href: "/hustling" },
	{ name: "Connect", href: "/connecting" },
]

const socialLinks = [
	{
		name: "Bluesky",
		href: "https://bsky.app/profile/doug.is",
		icon: (
			<svg fill="none" viewBox="0 0 64 57" className="w-5 h-5">
				<path
					fill="currentColor"
					d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745Z"
				/>
			</svg>
		),
	},
	{
		name: "Twitter",
		href: "https://twitter.com/glowingrec",
		icon: (
			<svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
				<path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
			</svg>
		),
	},
	{
		name: "GitHub",
		href: "https://github.com/afxjzs",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
				<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
			</svg>
		),
	},
	{
		name: "LinkedIn",
		href: "https://linkedin.com/in/douglasrogers",
		icon: (
			<svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
				<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
			</svg>
		),
	},
]

export default function Footer() {
	return (
		<footer className="mt-32 border-t border-[rgba(var(--color-border),0.08)]">
			<div className="container mx-auto px-4 py-12">
				{/* Top row: brand + nav + social */}
				<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
					{/* Brand */}
					<div className="max-w-xs">
						<Link href="/" className="text-xl font-bold gradient-heading">
							doug.is
						</Link>
						<p className="text-sm text-[rgba(var(--color-muted),1)] mt-2">
							Engineer. Advisor. Investor.
						</p>
					</div>

					{/* Site nav */}
					<nav className="flex flex-wrap gap-x-6 gap-y-2">
						{siteLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								className="text-sm text-[rgba(var(--color-foreground),0.6)] hover:text-[rgb(var(--color-accent))] transition-colors"
							>
								{link.name}
							</Link>
						))}
					</nav>

					{/* Social */}
					<div className="flex items-center gap-4">
						{socialLinks.map((link) => (
							<Link
								key={link.href}
								href={link.href}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={link.name}
								className="text-[rgba(var(--color-foreground),0.4)] hover:text-[rgb(var(--color-accent))] transition-colors"
							>
								{link.icon}
							</Link>
						))}
					</div>
				</div>

				{/* Bottom row: copyright + AI credit + theme toggle */}
				<div className="pt-6 border-t border-[rgba(var(--color-border),0.06)] flex flex-col md:flex-row justify-between items-center gap-3">
					<p className="text-[rgba(var(--color-muted),0.8)] text-xs">
						&copy; {new Date().getFullYear()} doug.is
					</p>

					<p className="text-[rgba(var(--color-muted),0.6)] text-xs">
						Built with AI.{" "}
						<Link
							href="/connecting"
							className="text-[rgb(var(--color-accent))] hover:underline"
						>
							I can help you do the same.
						</Link>
					</p>

					<ThemeToggle />
				</div>
			</div>
		</footer>
	)
}
