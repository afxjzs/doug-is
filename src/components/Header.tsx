"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

// Updated navigation items to match the requested structure
const navItems = [
	{ name: "/building", path: "/building" },
	{ name: "/thinking", path: "/thinking" },
	{ name: "/investing", path: "/investing" },
	{ name: "/hustling", path: "/hustling" },
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
				{/* Desktop and Mobile Header Layout */}
				<div className="flex items-center justify-between md:justify-center">
					{/* Logo */}
					<div className="flex items-center space-x-1">
						<Link href="/" className="group relative">
							<h1 className="text-lg font-bold gradient-heading">doug.is</h1>
							<span className="absolute -inset-1 bg-gradient-to-r from-[rgba(var(--color-violet),0.2)] to-[rgba(var(--color-cyan),0.2)] opacity-30 blur-lg group-hover:opacity-50 transition-opacity"></span>
						</Link>
						<span className="text-[rgba(var(--color-foreground),0.5)] text-lg">
							...
						</span>
					</div>

					{/* Desktop navigation */}
					<nav className="hidden md:flex items-center space-x-1">
						{navItems.map((item) => (
							<NavLink
								key={item.path}
								href={item.path}
								isActive={
									pathname === item.path || pathname.startsWith(`${item.path}/`)
								}
							>
								{item.name}
							</NavLink>
						))}
					</nav>

					{/* Mobile menu button - right justified */}
					<button
						className="md:hidden text-[rgba(var(--color-foreground),0.9)] z-50"
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
				{isMenuOpen && (
					<div className="fixed inset-0 bg-[rgba(var(--color-background),0.7)] backdrop-blur-md z-40 md:hidden">
						<div className="container mx-auto px-4 pt-20">
							<nav className="p-6 bg-[rgba(var(--color-background),0.95)] rounded-lg border border-[rgba(var(--color-foreground),0.1)] shadow-lg">
								<div className="flex flex-col space-y-4">
									{navItems.map((item) => (
										<MobileNavLink
											key={item.path}
											href={item.path}
											onClick={() => setIsMenuOpen(false)}
											isActive={
												pathname === item.path ||
												pathname.startsWith(`${item.path}/`)
											}
										>
											{item.name}
										</MobileNavLink>
									))}
								</div>
							</nav>
						</div>
					</div>
				)}
			</div>
		</header>
	)
}

function NavLink({
	href,
	children,
	isActive,
}: {
	href: string
	children: React.ReactNode
	isActive: boolean
}) {
	return (
		<Link
			href={href}
			className={`text-lg relative group transition-all duration-300 px-3 py-2 ${
				isActive
					? "text-[rgba(var(--color-cyan),1)] drop-shadow-[0_0_3px_rgba(var(--color-cyan),0.7)]"
					: "text-[rgba(var(--color-foreground),0.8)] hover:text-[rgba(var(--color-foreground),1)]"
			}`}
		>
			{children}
			<span
				className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[rgba(var(--color-violet),0.7)] to-[rgba(var(--color-cyan),0.7)] transition-all duration-300 ${
					isActive ? "w-full" : "w-0 group-hover:w-full"
				}`}
			></span>
		</Link>
	)
}

function MobileNavLink({
	href,
	onClick,
	children,
	isActive,
}: {
	href: string
	onClick: () => void
	children: React.ReactNode
	isActive: boolean
}) {
	return (
		<Link
			href={href}
			onClick={onClick}
			className={`text-lg py-3 px-4 rounded-md transition-all duration-300 ${
				isActive
					? "bg-[rgba(var(--color-violet),0.15)] text-[rgba(var(--color-cyan),1)] drop-shadow-[0_0_3px_rgba(var(--color-cyan),0.7)]"
					: "text-[rgba(var(--color-foreground),0.8)] hover:text-[rgba(var(--color-foreground),1)] hover:bg-[rgba(var(--color-foreground),0.05)]"
			}`}
		>
			{children}
		</Link>
	)
}
