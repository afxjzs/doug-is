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
				className="fixed top-4 left-4 z-50 p-2 rounded-md md:hidden bg-gray-800 border border-gray-600"
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
					className="text-gray-300"
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
				} fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ease-in-out md:translate-x-0 admin-navigation`}
			>
				{/* Admin Logo/Title */}
				<div className="admin-header">
					<h1 className="text-xl font-bold">doug.is Admin</h1>
				</div>

				{/* Navigation Links */}
				<nav className="p-4 flex-grow">
					<ul className="space-y-2">
						{navItems.map((item) => (
							<li key={item.id}>
								<Link
									href={item.href}
									className={`nav-item ${
										pathname === item.href ? "active" : ""
									}`}
									onClick={() => setIsOpen(false)}
								>
									<span>
										{/* Simple icon representation */}
										<span className="w-5 h-5 inline-block">
											{item.icon === "dashboard" && "📊"}
											{item.icon === "posts" && "📝"}
											{item.icon === "contacts" && "✉️"}
										</span>
										<span>{item.name}</span>
									</span>
								</Link>
							</li>
						))}
					</ul>
				</nav>

				{/* Bottom Actions Section */}
				<div className="admin-actions">
					<ul className="space-y-2 p-4">
						<li>
							<a
								href="/logout"
								className="nav-item"
								onClick={(e) => {
									console.log("🚪 AdminNavigation logout clicked")
									// Let the default navigation happen
								}}
							>
								<span>
									<span className="w-5 h-5 inline-block">🚪</span>
									<span>Sign Out</span>
								</span>
							</a>
						</li>
						<li>
							<Link href="/" className="nav-item">
								<span>
									<span className="w-5 h-5 inline-block">🏠</span>
									<span>View Website</span>
								</span>
							</Link>
						</li>
					</ul>
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
