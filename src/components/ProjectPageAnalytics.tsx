"use client"

import { useEffect } from "react"
import { useEventTracking } from "@/lib/analytics"

interface ProjectPageAnalyticsProps {
	projectName: string
	projectType: string
}

/**
 * Project Page Analytics Wrapper
 * Single Responsibility: Handles project page view tracking
 * Can be embedded in server components to add analytics without client directive
 */
export function ProjectPageAnalytics({
	projectName,
	projectType,
}: ProjectPageAnalyticsProps) {
	const { trackProjectView } = useEventTracking()

	useEffect(() => {
		trackProjectView(projectName, projectType)
	}, [projectName, projectType, trackProjectView])

	// This component doesn't render anything visible
	return null
}

interface ProjectExternalLinkProps {
	href: string
	children: React.ReactNode
	projectId: string
	linkType: "github" | "download" | "demo" | "store"
	className?: string
	target?: string
	rel?: string
	download?: boolean
}

/**
 * Project External Link with Analytics
 * Single Responsibility: Handles external link clicks with analytics
 */
export function ProjectExternalLink({
	href,
	children,
	projectId,
	linkType,
	className,
	target,
	rel,
	download,
	...props
}: ProjectExternalLinkProps) {
	const { trackPortfolioExternalLink } = useEventTracking()

	const handleClick = () => {
		// Map linkType to portfolio tracking types
		const portfolioLinkType =
			linkType === "github"
				? "github"
				: linkType === "download"
				? "github" // Treat download as github for now
				: linkType === "demo"
				? "testflight"
				: "github" // Default fallback

		trackPortfolioExternalLink(
			projectId,
			portfolioLinkType as "github" | "testflight" | "rubygems",
			href
		)
	}

	return (
		<a
			href={href}
			onClick={handleClick}
			className={className}
			target={target}
			rel={rel}
			download={download}
			{...props}
		>
			{children}
		</a>
	)
}
