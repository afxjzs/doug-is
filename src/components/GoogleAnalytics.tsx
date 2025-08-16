"use client"

import Script from "next/script"

interface GoogleAnalyticsProps {
	gaId: string
}

/**
 * Google Analytics Component
 * Single Responsibility: Handles Google Analytics script injection and configuration
 * Uses Next.js Script component for optimal loading and performance
 */
export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
	if (!gaId) {
		console.warn("Google Analytics: No tracking ID provided")
		return null
	}

	return (
		<>
			{/* Google Analytics gtag.js script */}
			<Script
				src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
				strategy="afterInteractive"
				id="google-analytics-script"
			/>

			{/* Google Analytics configuration */}
			<Script
				id="google-analytics-config"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${gaId}');
					`,
				}}
			/>
		</>
	)
}
