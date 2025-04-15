"use client"

/**
 * This layout applies to all pages under /admin.
 * It provides the admin dashboard UI with navigation and header.
 * Authentication is handled by middleware, not in this layout.
 */

import AdminNavigation from "@/components/admin/AdminNavigation"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import "./admin.css"

/**
 * Admin layout component that provides the structure for admin pages
 * Authentication is handled by middleware
 * This layout does not include the site header or footer, which are only for the public site
 */
export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const router = useRouter()

	// Check if the current path is an auth page
	const isAuthPage =
		pathname === "/admin/login" ||
		pathname === "/admin/register" ||
		pathname?.startsWith("/admin/login?") ||
		pathname?.startsWith("/admin/register?")

	// For auth pages, render just the content without the admin navigation
	if (isAuthPage) {
		return (
			<div className="admin-layout">
				<div style={{ maxWidth: "28rem", margin: "0 auto", padding: "2rem" }}>
					{children}
				</div>
			</div>
		)
	}

	// For regular admin pages, render with the navigation
	return (
		<div className="admin-layout flex">
			{/* Admin sidebar navigation */}
			<div className="admin-sidebar">
				<AdminNavigation />
			</div>

			{/* Main content area */}
			<main className="admin-main">
				<div className="max-w-4xl mx-auto">{children}</div>
			</main>
		</div>
	)
}
