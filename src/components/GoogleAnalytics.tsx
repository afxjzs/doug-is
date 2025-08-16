"use client"

import Script from "next/script"

/**
 * Google Analytics Component
 * Single Responsibility: Handles Google Analytics script injection and configuration
 * Uses Next.js Script component for optimal loading and performance
 * Only loads in production environment
 */
export function GoogleAnalytics() {
	// Only load Google Analytics in production
	if (process.env.NODE_ENV !== "production") {
		return null
	}

	return (
		<>
			{/* Google Analytics gtag.js script */}
			<Script
				src="https://www.googletagmanager.com/gtag/js?id=G-RVQRV9JEND"
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
						gtag('config', 'G-RVQRV9JEND');
					`,
				}}
			/>
		</>
	)
}
