"use client"

import dynamic from "next/dynamic"
import React from "react"

const ClientAnalytics = dynamic(
	() => import("./ClientAnalytics").then((mod) => mod.ClientAnalytics),
	{ ssr: false }
)

interface ClientAnalyticsWrapperProps {
	children: React.ReactNode
}

export function ClientAnalyticsWrapper({
	children,
}: ClientAnalyticsWrapperProps) {
	return <ClientAnalytics>{children}</ClientAnalytics>
}
