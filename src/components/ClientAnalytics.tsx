"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { AnalyticsProviderComponent, useAnalytics } from "@/lib/analytics/context"

function PageViewTracker() {
	const pathname = usePathname()
	const analytics = useAnalytics()

	useEffect(() => {
		if (typeof window !== "undefined") {
			analytics.trackPageView(window.location.href, document.title)
		}
	}, [pathname, analytics])

	return null
}

interface ClientAnalyticsProps {
	children?: React.ReactNode
}

export function ClientAnalytics({ children }: ClientAnalyticsProps) {
	return (
		<AnalyticsProviderComponent>
			<PageViewTracker />
			{children}
		</AnalyticsProviderComponent>
	)
}
