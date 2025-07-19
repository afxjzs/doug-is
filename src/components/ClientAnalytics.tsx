"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { Analytics } from "@vercel/analytics/react"
import {
	AnalyticsProviderComponent,
	usePageViewTracking,
} from "@/lib/analytics"
import { PostHogDebugger } from "./PostHogDebugger"

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

interface ClientAnalyticsProps {
	children?: React.ReactNode
}

export function ClientAnalytics({ children }: ClientAnalyticsProps) {
	return (
		<>
			<Analytics />
			<AnalyticsProviderComponent>
				<PageViewTracker />
				{process.env.NODE_ENV === "development" && <PostHogDebugger />}
				{children}
			</AnalyticsProviderComponent>
		</>
	)
}
