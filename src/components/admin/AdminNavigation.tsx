"use client"

/**
 * This component provides the main navigation for the admin area.
 * It includes links to all admin sections with active state highlighting.
 */

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"

export default function AdminNavigation() {
	const pathname = usePathname()
	const [isOpen, setIsOpen] = useState(false)
	const router = useRouter()

	// Navigation links for admin area
	const navItems = [
		{ id: "dashboard", name: "Dashboard", href: "/admin", icon: "dashboard" },
		{ id: "posts", name: "Posts", href: "/admin/posts", icon: "posts" },
		{
			id: "contacts",
			name: "Contact Messages",
			href: "/admin/contacts",
			icon: "contacts",
		},
	]

	const toggleSidebar = () => {
		setIsOpen(!isOpen)
	}

	return (
		<>
			{/* Mobile hamburger menu button */}
			<button
				className="fixed top-4 left-4 z-50 p-2 rounded-md md:hidden bg-[rgba(var(--color-background),0.8)] border border-[rgba(var(--color-foreground),0.1)]"
				onClick={toggleSidebar}
				aria-label="Toggle menu"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					className="text-[rgba(var(--color-foreground),0.8)]"
				>
					{isOpen ? (
						<>
							<line x1="18" y1="6" x2="6" y2="18" />
							<line x1="6" y1="6" x2="18" y2="18" />
						</>
					) : (
						<>
							<line x1="3" y1="12" x2="21" y2="12" />
							<line x1="3" y1="6" x2="21" y2="6" />
							<line x1="3" y1="18" x2="21" y2="18" />
						</>
					)}
				</svg>
			</button>

			{/* Sidebar Navigation - Hidden on mobile unless toggled */}
			<aside
				className={`${
					isOpen ? "translate-x-0" : "-translate-x-full"
				} fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 bg-[rgba(var(--color-background-dark),0.97)] border-r border-[rgba(var(--color-foreground),0.1)] flex flex-col`}
			>
				{/* Admin Logo/Title */}
				<div className="p-6 border-b border-[rgba(var(--color-foreground),0.1)] flex-shrink-0">
					<h1 className="text-xl font-bold gradient-heading">Doug.is Admin</h1>
				</div>

				{/* Navigation Links */}
				<nav className="p-4 flex-grow">
					<ul className="space-y-2">
						{navItems.map((item) => (
							<li key={item.id}>
								<Link
									href={item.href}
									className={`flex items-center px-4 py-3 rounded-md transition-colors ${
										pathname === item.href
											? "bg-[rgba(var(--color-violet),0.15)] text-[rgba(var(--color-violet),1)]"
											: "text-[rgba(var(--color-foreground),0.8)] hover:bg-[rgba(var(--color-foreground),0.05)] hover:text-[rgba(var(--color-foreground),1)]"
									}`}
									onClick={() => setIsOpen(false)}
								>
									<span className="mr-3">
										{/* Simple icon representation */}
										<span className="w-5 h-5 inline-block">
											{item.icon === "dashboard" && "📊"}
											{item.icon === "posts" && "📝"}
											{item.icon === "contacts" && "✉️"}
										</span>
									</span>
									<span>{item.name}</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>

				{/* Bottom Actions Section */}
				<div className="flex-shrink-0">
					{/* Admin Actions */}
					<div className="p-4 border-t border-[rgba(var(--color-foreground),0.1)]">
						<a
							href="/logout"
							className="w-full py-2 px-4 flex items-center justify-center text-[rgba(var(--color-red),0.8)] bg-[rgba(var(--color-red),0.05)] rounded-md hover:bg-[rgba(var(--color-red),0.1)] transition-colors"
							onClick={(e) => {
								console.log("🚪 AdminNavigation logout clicked")
								// Let the default navigation happen
							}}
						>
							<span className="mr-2">🚪</span>
							Sign Out
						</a>
					</div>

					{/* View Website Link */}
					<div className="p-4 pt-0">
						<Link
							href="/"
							className="w-full py-2 px-4 flex items-center justify-center text-[rgba(var(--color-foreground),0.8)] bg-[rgba(var(--color-foreground),0.05)] rounded-md hover:bg-[rgba(var(--color-foreground),0.1)] transition-colors"
						>
							<span className="mr-2">🏠</span>
							View Website
						</Link>
					</div>
				</div>
			</aside>

			{/* Overlay for mobile navigation */}
			{isOpen && (
				<div
					className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
					onClick={() => setIsOpen(false)}
				/>
			)}
		</>
	)
}
