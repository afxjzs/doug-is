"use client"

import dynamic from "next/dynamic"

const ClientAnalytics = dynamic(
	() => import("./ClientAnalytics").then((mod) => mod.ClientAnalytics),
	{ ssr: false }
)

export function ClientAnalyticsWrapper() {
	return <ClientAnalytics />
}
