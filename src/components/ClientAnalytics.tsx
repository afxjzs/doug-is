"use client"

import { Analytics } from "@vercel/analytics/react"
import { AnalyticsProviderComponent } from "@/lib/analytics"

export function ClientAnalytics() {
	return (
		<>
			<Analytics />
			<AnalyticsProviderComponent>
				<></>
			</AnalyticsProviderComponent>
		</>
	)
}
