"use client"

import { usePathname } from "next/navigation"
import Header from "./Header"
import Footer from "./Footer"

/**
 * Client component wrapper to conditionally render Header and Footer
 * Only shows header and footer for main site pages
 */
export default function LayoutWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()

	// Check if the current page should skip the main layout
	const skipMainLayout =
		pathname?.startsWith("/admin") ||
		pathname?.startsWith("/migraine-free") ||
		pathname?.startsWith("/test")

	// If it's a page that should skip the main layout, just render the content
	if (skipMainLayout) {
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
