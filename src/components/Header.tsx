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
		const handleScroll = () => {
			setScrolled(window.scrollY > 20)
		}

		window.addEventListener("scroll", handleScroll)
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
			className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
			style={{
				background: scrolled ? "rgba(10,14,26,0.95)" : "transparent",
				backdropFilter: scrolled ? "blur(20px)" : "none",
				borderBottom: scrolled
					? "1px solid rgba(212,168,83,0.1)"
					: "1px solid transparent",
			}}
		>
			<div className="max-w-[1200px] mx-auto px-4 md:px-10 py-4 md:py-5 flex items-center justify-between">
				{/* Left: glowing hexagon + doug.is */}
				<Link href="/" className="flex items-center gap-3">
					<svg
						width="10"
						height="12"
						viewBox="0 0 86.6 100"
						className="animate-hex-glow"
						style={{ fill: "rgb(var(--color-accent))" }}
					>
						<polygon points="43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25" />
					</svg>
					<span
						className="text-sm tracking-[0.15em]"
						style={{ color: "rgba(var(--color-foreground), 0.45)", fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}
					>
						doug.is
					</span>
				</Link>

				{/* Desktop nav */}
				<nav className="hidden md:flex items-center gap-1.5 text-xs tracking-[0.1em]" style={{ fontFamily: "var(--font-mono, 'JetBrains Mono', monospace)" }}>
					<span
						className="mr-2"
						style={{ color: "rgba(var(--color-foreground), 0.45)" }}
					>
						doug.is...
					</span>
					{navItems.map((item) => (
						<Link
							key={item.path}
							href={item.path}
							onClick={() => handleNavClick(item.path)}
							className="px-1.5 py-1 transition-colors duration-200"
							style={{
								color:
									pathname === item.path ||
									pathname.startsWith(`${item.path}/`)
										? "rgb(var(--color-accent))"
										: "rgba(var(--color-foreground), 0.45)",
							}}
							onMouseEnter={(e) =>
								(e.currentTarget.style.color = "rgb(var(--color-accent))")
							}
							onMouseLeave={(e) => {
								if (
									pathname !== item.path &&
									!pathname.startsWith(`${item.path}/`)
								) {
									e.currentTarget.style.color =
										"rgba(var(--color-foreground), 0.45)"
								}
							}}
						>
							{item.name}
						</Link>
					))}
				</nav>

				{/* Mobile hamburger */}
				<button
					className="md:hidden z-50"
					style={{ color: "rgba(var(--color-foreground), 0.9)" }}
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

				{/* Mobile navigation overlay */}
				<div
					className={`fixed inset-0 transform transition-transform duration-300 ease-in-out z-40 ${
						isMenuOpen ? "translate-x-0" : "translate-x-full"
					}`}
					style={{
						background: "rgba(10,14,26,0.97)",
						backdropFilter: "blur(20px)",
					}}
				>
					<div className="flex flex-col items-center justify-center h-full gap-8">
						{navItems.map((item) => (
							<Link
								key={item.path}
								href={item.path}
								className="text-2xl tracking-[0.1em] transition-colors duration-200"
								style={{
									color:
										pathname === item.path ||
										pathname.startsWith(`${item.path}/`)
											? "rgb(var(--color-accent))"
											: "rgba(var(--color-foreground), 0.6)",
								}}
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
