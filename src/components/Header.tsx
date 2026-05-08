"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { useClientEventTracking } from "@/lib/analytics"

const navItems = [
	{ name: "/advising", path: "/advising" },
	{ name: "/building", path: "/building" },
	{ name: "/investing", path: "/investing" },
	{ name: "/writing", path: "/thinking" },
]

function isActive(pathname: string, itemPath: string) {
	return pathname === itemPath || pathname.startsWith(`${itemPath}/`)
}

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const pathname = usePathname()

	const analytics = useClientEventTracking()

	const handleNavClick = (toSection: string) => {
		const fromSection = pathname.split("/")[1] || "home"
		if (fromSection !== toSection.substring(1)) {
			analytics.trackSectionNavigation(fromSection, toSection.substring(1))
		}
	}

	const handleMobileMenuToggle = () => {
		const newState = !isMenuOpen
		setIsMenuOpen(newState)
		analytics.trackMobileMenuToggle(newState ? "open" : "close")
	}

	useEffect(() => {
		let ticking = false
		const handleScroll = () => {
			if (ticking) return
			requestAnimationFrame(() => {
				const past = window.scrollY > 20
				setScrolled((prev) => (prev !== past ? past : prev))
				ticking = false
			})
			ticking = true
		}

		window.addEventListener("scroll", handleScroll, { passive: true })
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	useEffect(() => {
		if (isMenuOpen) {
			document.body.classList.add("overflow-hidden")
		} else {
			document.body.classList.remove("overflow-hidden")
		}

		return () => {
			document.body.classList.remove("overflow-hidden")
		}
	}, [isMenuOpen])

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 border-b ${
				scrolled
					? "bg-[rgba(10,14,26,0.95)] backdrop-blur-[20px] border-[rgba(var(--color-border),0.1)]"
					: "bg-transparent border-transparent"
			}`}
			style={{
				transition:
					"background-color var(--dur-base) var(--ease-out), border-color var(--dur-base) var(--ease-out), backdrop-filter var(--dur-base) var(--ease-out)",
			}}
		>
			<div className="max-w-[1200px] mx-auto px-4 md:px-10 py-4 md:py-5 flex items-center justify-between">
				{/* Left: glowing hexagon + doug.is */}
				<Link href="/" className="flex items-center gap-3">
					<svg
						width="10"
						height="12"
						viewBox="0 0 86.6 100"
						className="animate-hex-glow fill-[rgb(var(--color-accent))]"
					>
						<polygon points="43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25" />
					</svg>
					<span className="text-sm tracking-[0.15em] text-[rgba(var(--color-foreground),0.45)] font-[family-name:var(--font-mono)]">
						doug.is
					</span>
				</Link>

				{/* Desktop nav */}
				<nav className="hidden md:flex items-center gap-1.5 text-xs tracking-[0.1em] font-[family-name:var(--font-mono)]">
					<span className="mr-2 text-[rgba(var(--color-foreground),0.45)]">
						doug.is...
					</span>
					{navItems.map((item) => (
						<Link
							key={item.path}
							href={item.path}
							onClick={() => handleNavClick(item.path)}
							style={{
								transition: "color var(--dur-base) var(--ease-out)",
							}}
							className={`px-1.5 py-1 ${
								isActive(pathname, item.path)
									? "text-[rgb(var(--color-accent))]"
									: "text-[rgba(var(--color-foreground),0.45)] hover:text-[rgb(var(--color-accent))]"
							}`}
						>
							{item.name}
						</Link>
					))}
				</nav>

				{/* Mobile hamburger */}
				<button
					className="md:hidden z-50 text-[rgba(var(--color-foreground),0.9)]"
					onClick={handleMobileMenuToggle}
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
				>
					{isMenuOpen ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					)}
				</button>

				{/* Mobile navigation overlay — iOS drawer curve.
				   Items stagger in once the drawer has opened so the entry has tempo. */}
				<div
					className={`fixed inset-0 transform z-40 bg-[rgba(10,14,26,0.97)] backdrop-blur-[20px] ${
						isMenuOpen ? "translate-x-0" : "translate-x-full"
					}`}
					style={{
						transition: "transform 320ms var(--ease-drawer)",
					}}
				>
					<div className="flex flex-col items-center justify-center h-full gap-8">
						{navItems.map((item, i) => (
							<Link
								key={item.path}
								href={item.path}
								style={{
									transition: "color var(--dur-base) var(--ease-out), opacity 280ms var(--ease-out), transform 280ms var(--ease-out)",
									transitionDelay: isMenuOpen ? `${120 + i * 50}ms` : "0ms",
									opacity: isMenuOpen ? 1 : 0,
									transform: isMenuOpen ? "translateY(0)" : "translateY(8px)",
								}}
								className={`text-2xl tracking-[0.1em] ${
									isActive(pathname, item.path)
										? "text-[rgb(var(--color-accent))]"
										: "text-[rgba(var(--color-foreground),0.6)]"
								}`}
								onClick={() => {
									handleNavClick(item.path)
									setIsMenuOpen(false)
								}}
							>
								{item.name}
							</Link>
						))}
						<Link
							href="/connecting"
							className="btn-primary mt-4"
							style={{
								transitionDelay: isMenuOpen ? `${120 + navItems.length * 50}ms` : "0ms",
								opacity: isMenuOpen ? 1 : 0,
								transform: isMenuOpen ? "translateY(0)" : "translateY(8px)",
							}}
							onClick={() => setIsMenuOpen(false)}
						>
							Get in Touch
						</Link>
					</div>
				</div>
			</div>
		</header>
	)
}
