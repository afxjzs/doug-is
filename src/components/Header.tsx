"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Updated navigation items to remove the contact link
const navItems = [
	{ name: "/building", path: "/building" },
	{ name: "/advising", path: "/advising" },
	{ name: "/investing", path: "/investing" },
	{ name: "/thinking", path: "/thinking" },
]

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [scrolled, setScrolled] = useState(false)
	const pathname = usePathname()

	// Add scroll effect
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 20)
		}

		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	// Add body class to prevent scrolling when menu is open
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
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? "bg-[rgba(var(--color-background),0.8)] backdrop-blur-md shadow-lg"
					: ""
			}`}
		>
			<div className="container mx-auto px-4 py-4">
				{/* Desktop Header Layout */}
				<div className="hidden md:flex items-center justify-between">
					{/* Left - Empty space */}
					<div className="flex-1"></div>

					{/* Center - Logo and Navigation */}
					<div className="flex items-center justify-center space-x-8">
						{/* Logo */}
						<Link href="/" className="group relative flex items-center">
							<h1 className="text-lg font-bold gradient-heading">doug.is</h1>
							<span className="absolute -inset-1 bg-gradient-to-r from-[rgba(var(--color-violet),0.2)] to-[rgba(var(--color-cyan),0.2)] opacity-30 blur-lg group-hover:opacity-50 transition-opacity"></span>
							<span className="text-[rgba(var(--color-foreground),0.5)] text-lg">
								...
							</span>
						</Link>

						{/* Navigation links */}
						{navItems.map((item) => (
							<Link
								key={item.path}
								href={item.path}
								className={`text-lg relative group transition-all duration-300 px-3 py-2 ${
									pathname === item.path || pathname.startsWith(`${item.path}/`)
										? "text-[rgba(var(--color-foreground),1)] drop-shadow-[0_0_3px_rgba(var(--color-cyan),0.7)]"
										: "text-[rgba(var(--color-foreground),0.8)] hover:text-[rgba(var(--color-foreground),1)]"
								}`}
							>
								{item.name}
								<span
									className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[rgba(var(--color-violet),0.7)] to-[rgba(var(--color-cyan),0.7)] transition-all duration-300 ${
										pathname === item.path ||
										pathname.startsWith(`${item.path}/`)
											? "w-full"
											: "w-0 group-hover:w-full"
									}`}
								></span>
							</Link>
						))}
					</div>

					{/* Right - Let's Connect button */}
					<div className="flex-1 flex justify-end">
						<Link
							href="/connecting"
							className="neon-button-magenta text-sm py-2 whitespace-nowrap"
						>
							Let&apos;s Connect
						</Link>
					</div>
				</div>

				{/* Mobile Header Layout */}
				<div className="flex md:hidden items-center justify-between">
					<Link href="/" className="group relative flex items-center">
						<h1 className="text-lg font-bold gradient-heading">doug.is</h1>
						<span className="absolute -inset-1 bg-gradient-to-r from-[rgba(var(--color-violet),0.2)] to-[rgba(var(--color-cyan),0.2)] opacity-30 blur-lg group-hover:opacity-50 transition-opacity"></span>
						<span className="text-[rgba(var(--color-foreground),0.5)] text-lg">
							...
						</span>
					</Link>

					{/* Mobile menu button */}
					<button
						className="text-[rgba(var(--color-foreground),0.9)] z-50"
						onClick={() => setIsMenuOpen(!isMenuOpen)}
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
				</div>

				{/* Mobile navigation with animation and backdrop blur */}
				<div
					className={`fixed inset-0 bg-[rgba(var(--color-background),0.95)] backdrop-blur-lg transform transition-transform duration-300 ease-in-out z-40 ${
						isMenuOpen ? "translate-x-0" : "translate-x-full"
					}`}
				>
					<div className="container mx-auto px-4 py-24">
						<nav className="flex flex-col space-y-8 items-center">
							{navItems.map((item) => (
								<Link
									key={item.path}
									href={item.path}
									className={`text-2xl relative group transition-all duration-300 ${
										pathname === item.path ||
										pathname.startsWith(`${item.path}/`)
											? "text-[rgba(var(--color-cyan),1)] drop-shadow-[0_0_3px_rgba(var(--color-cyan),0.7)]"
											: "text-[rgba(var(--color-foreground),0.8)] hover:text-[rgba(var(--color-foreground),1)]"
									}`}
									onClick={() => setIsMenuOpen(false)}
								>
									{item.name}
									<span
										className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[rgba(var(--color-violet),0.7)] to-[rgba(var(--color-cyan),0.7)] transition-all duration-300 ${
											pathname === item.path ||
											pathname.startsWith(`${item.path}/`)
												? "w-full"
												: "w-0 group-hover:w-full"
										}`}
									></span>
								</Link>
							))}

							<Link
								href="/connecting"
								className="neon-button-magenta mt-6"
								onClick={() => setIsMenuOpen(false)}
							>
								Let&apos;s Connect
							</Link>
						</nav>
					</div>
				</div>
			</div>
		</header>
	)
}
