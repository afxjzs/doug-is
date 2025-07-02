"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Analytics } from "@vercel/analytics/react"
import {
	AnalyticsProviderComponent,
	usePageViewTracking,
} from "@/lib/analytics"

function PageViewTracker() {
	const pathname = usePathname()
	const { trackPageView } = usePageViewTracking()

	useEffect(() => {
		// Track page view when pathname changes
		if (typeof window !== "undefined") {
			trackPageView(window.location.href, document.title)
		}
	}, [pathname, trackPageView])

	return null
}

export function ClientAnalytics() {
	return (
		<>
			<Analytics />
			<AnalyticsProviderComponent>
				<PageViewTracker />
			</AnalyticsProviderComponent>
		</>
	)
}
