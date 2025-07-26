"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

// Dynamically import ClientAnalytics to prevent SSR issues
const ClientAnalytics = dynamic(
	() => import("./ClientAnalytics").then((mod) => mod.ClientAnalytics),
	{
		ssr: false,
		loading: () => null,
	}
)

interface ClientAnalyticsWrapperProps {
	children: React.ReactNode
}

export function ClientAnalyticsWrapper({
	children,
}: ClientAnalyticsWrapperProps) {
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	// Only render analytics on client side
	if (!isClient) {
		return <>{children}</>
	}

	return <ClientAnalytics>{children}</ClientAnalytics>
}
