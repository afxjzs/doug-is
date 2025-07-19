"use client"

/**
 * This component provides the header for the admin dashboard.
 * It includes the mobile menu toggle, user profile, and logout button.
 */

import { useState } from "react"
import Link from "next/link"
import { User } from "@supabase/supabase-js"
import AdminNavigation from "./AdminNavigation"

interface AdminHeaderProps {
	user: User
}

export default function AdminHeader({ user }: AdminHeaderProps) {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

	// Get user's display name or email for header
	const displayName =
		user.user_metadata?.name || user.email?.split("@")[0] || "Admin User"

	return (
		<header className="bg-white border-b border-[rgba(var(--color-foreground),0.1)] sticky top-0 z-10">
			<div className="flex items-center justify-between px-4 py-3">
				{/* Mobile menu button */}
				<button
					type="button"
					className="md:hidden text-[rgba(var(--color-foreground),0.6)] hover:text-[rgba(var(--color-foreground),1)]"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
				>
					<span className="sr-only">Open main menu</span>
					{isMobileMenuOpen ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18 18 6M6 6l12 12"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-6 h-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							/>
						</svg>
					)}
				</button>

				{/* Logo - only visible on mobile */}
				<div className="md:hidden">
					<Link href="/admin" className="text-lg font-semibold">
						Doug-Is Admin
					</Link>
				</div>

				{/* User menu */}
				<div className="flex items-center gap-4">
					<span className="text-sm text-[rgba(var(--color-foreground),0.7)]">
						Welcome, {displayName}
					</span>

					<Link
						href="/logout"
						className="text-sm text-[rgba(var(--color-red),0.8)] hover:text-[rgba(var(--color-red),1)] transition-colors"
						onClick={(e) => {
							console.log("🚪 AdminHeader logout clicked")
							// Let the default navigation happen
						}}
					>
						Logout
					</Link>
				</div>
			</div>

			{/* Mobile menu */}
			{isMobileMenuOpen && (
				<div className="md:hidden">
					<div className="border-t border-[rgba(var(--color-foreground),0.1)] bg-white">
						<AdminNavigation />
					</div>
				</div>
			)}
		</header>
	)
}
