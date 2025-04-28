"use client"

import { Analytics } from "@vercel/analytics/react"
import { OpenPanelComponent } from "@openpanel/nextjs"

export function ClientAnalytics() {
	return (
		<>
			<Analytics />
			<OpenPanelComponent
				clientId="6df4af06-599f-46ec-b7ee-977066751d43"
				trackScreenViews={true}
				trackOutgoingLinks={true}
				trackAttributes={true}
			/>
		</>
	)
}
