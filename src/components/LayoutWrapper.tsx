"use client"

import { usePathname } from "next/navigation"
import Header from "./Header"
import Footer from "./Footer"

/**
 * Client component wrapper to conditionally render Header and Footer
 * Only shows header and footer for non-admin pages
 */
export default function LayoutWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()

	// Check if the current page is in the admin section
	const isAdminPage = pathname?.startsWith("/admin")

	// If it's an admin page, don't show the header and footer
	if (isAdminPage) {
		return <main className="flex-grow relative z-10">{children}</main>
	}

	// For regular pages, show the header and footer
	return (
		<>
			<Header />
			<main className="flex-grow container mx-auto px-4 pt-28 pb-12 relative z-10">
				{children}
			</main>
			<Footer />
		</>
	)
}
