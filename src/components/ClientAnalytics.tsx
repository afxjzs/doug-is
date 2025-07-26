"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

function PageViewTracker() {
	const pathname = usePathname()

	useEffect(() => {
		// Only track page view on client side
		if (typeof window !== "undefined") {
			// Simple page view tracking without analytics dependency
			console.log("Page view:", window.location.href)
		}
	}, [pathname])

	return null
}

interface ClientAnalyticsProps {
	children?: React.ReactNode
}

export function ClientAnalytics({ children }: ClientAnalyticsProps) {
	return (
		<>
			<PageViewTracker />
			{children}
		</>
	)
}
