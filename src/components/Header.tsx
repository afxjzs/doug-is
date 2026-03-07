"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils/index"
import { useClientEventTracking } from "@/lib/analytics"

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

	const analytics = useClientEventTracking()

	const handleNavClick = (toSection: string) => {
		const fromSection = pathname.split("/")[1] || "home"
		if (fromSection !== toSection.substring(1)) {
			analytics.trackSectionNavigation(fromSection, toSection.substring(1))
		}
	}

	const handleConnectClick = () => {
		const currentSection = pathname.split("/")[1] || "home"
		analytics.trackSectionNavigation(currentSection, "connecting")
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
			className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
				scrolled
					? "bg-[rgba(var(--color-background),0.9)] backdrop-blur-md shadow-sm"
					: ""
			}`}
		>
			<div className="container mx-auto px-4 py-4">
				{/* Desktop Header Layout */}
				<div className="hidden md:flex items-center justify-between">
					<div className="flex-1"></div>

					<div className="flex items-center justify-center space-x-8">
						<Link href="/" className="group relative flex items-center">
							<h1 className="text-lg font-bold gradient-heading">doug.is</h1>
							<span className="text-[rgba(var(--color-foreground),0.5)] text-lg">
								...
							</span>
						</Link>

						{navItems.map((item) => (
							<Link
								key={item.path}
								href={item.path}
								onClick={() => handleNavClick(item.path)}
								className={`text-lg relative group transition-all duration-300 px-3 py-2 ${
									pathname === item.path || pathname.startsWith(`${item.path}/`)
										? "text-[rgba(var(--color-foreground),1)]"
										: "text-[rgba(var(--color-foreground),0.6)] hover:text-[rgba(var(--color-foreground),1)]"
								}`}
							>
								{item.name}
								<span
									className={`absolute -bottom-1 left-0 h-0.5 bg-[rgb(var(--color-accent))] transition-all duration-300 ${
										pathname === item.path ||
										pathname.startsWith(`${item.path}/`)
											? "w-full"
											: "w-0 group-hover:w-full"
									}`}
								></span>
							</Link>
						))}
					</div>

					<div className="flex-1 flex justify-end">
						<Link
							href="/connecting"
							onClick={handleConnectClick}
							className="btn-primary text-sm py-2 whitespace-nowrap"
						>
							Let&apos;s Connect
						</Link>
					</div>
				</div>

				{/* Mobile Header Layout */}
				<div className="flex md:hidden items-center justify-between">
					<Link href="/" className="group relative flex items-center">
						<h1 className="text-lg font-bold gradient-heading">doug.is</h1>
						<span className="text-[rgba(var(--color-foreground),0.5)] text-lg">
							...
						</span>
					</Link>

					<button
						className="text-[rgba(var(--color-foreground),0.9)] z-50"
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
				</div>

				{/* Mobile navigation */}
				<div
					className={`fixed inset-0 bg-[rgba(var(--color-background),0.97)] backdrop-blur-lg transform transition-transform duration-300 ease-in-out z-40 ${
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
											? "text-[rgb(var(--color-accent))]"
											: "text-[rgba(var(--color-foreground),0.8)] hover:text-[rgba(var(--color-foreground),1)]"
									}`}
									onClick={() => {
										handleNavClick(item.path)
										setIsMenuOpen(false)
									}}
								>
									{item.name}
									<span
										className={`absolute -bottom-1 left-0 h-0.5 bg-[rgb(var(--color-accent))] transition-all duration-300 ${
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
								className="btn-primary mt-6"
								onClick={() => {
									handleConnectClick()
									setIsMenuOpen(false)
								}}
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
