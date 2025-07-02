"use client"

import { createContext, useContext, useEffect, ReactNode } from "react"
import type { AnalyticsProvider } from "./types"
import { PostHogProvider } from "./providers/posthog"

/**
 * Analytics Context
 * Dependency Inversion Principle: Components depend on AnalyticsProvider interface, not concrete implementation
 */
const AnalyticsContext = createContext<AnalyticsProvider | null>(null)

interface AnalyticsProviderProps {
	children: ReactNode
	provider?: AnalyticsProvider // Allow injecting different providers
}

/**
 * Analytics Provider Component
 * Single Responsibility: Manages analytics provider initialization and context
 */
export function AnalyticsProviderComponent({
	children,
	provider = new PostHogProvider(), // Default to PostHog, but allow injection
}: AnalyticsProviderProps) {
	useEffect(() => {
		// Initialize the analytics provider
		provider.initialize()

		// Send a test event to verify PostHog is working
		if (provider.isInitialized()) {
			provider.trackEvent({
				event: "analytics_initialized",
				properties: {
					provider: "posthog",
					timestamp: new Date().toISOString(),
					environment: process.env.NODE_ENV || "production",
				},
			})
		}
	}, [provider])

	return (
		<AnalyticsContext.Provider value={provider}>
			{children}
		</AnalyticsContext.Provider>
	)
}

/**
 * Analytics Hook
 * Custom hook for accessing analytics functionality in components
 * Dependency Inversion: Components use this hook instead of importing providers directly
 */
export function useAnalytics() {
	const context = useContext(AnalyticsContext)

	if (!context) {
		// Return a no-op implementation if analytics is not available
		// This ensures components don't break if analytics fails to initialize
		return {
			trackPageView: () => {},
			trackEvent: () => {},
			identifyUser: () => {},
			resetUser: () => {},
			setUserProperties: () => {},
			isInitialized: () => false,
		}
	}

	return context
}

/**
 * Page View Tracking Hook
 * Single Responsibility: Only handles page view tracking
 * Custom hook for automatic page view tracking in pages
 */
export function usePageViewTracking() {
	const analytics = useAnalytics()

	const trackPageView = (url?: string, title?: string) => {
		if (typeof window !== "undefined") {
			const currentUrl = url || window.location.href
			const currentTitle = title || document.title
			analytics.trackPageView(currentUrl, currentTitle)
		}
	}

	return { trackPageView }
}

/**
 * Event Tracking Helper Hook
 * Single Responsibility: Provides typed event tracking functions
 * Returns strongly typed functions for specific event categories
 */
export function useEventTracking() {
	const analytics = useAnalytics()

	return {
		// Contact form events
		trackContactFormView: (formType?: string) => {
			analytics.trackEvent({
				event: "contact_form_view",
				properties: {
					form_type: formType,
					timestamp: new Date().toISOString(),
				},
			})
		},

		trackContactFormSubmit: (formType?: string, referrer?: string) => {
			analytics.trackEvent({
				event: "contact_form_submit",
				properties: {
					form_type: formType,
					referrer:
						referrer ||
						(typeof window !== "undefined" ? document.referrer : undefined),
					timestamp: new Date().toISOString(),
				},
			})
		},

		trackContactFormSuccess: (formType?: string) => {
			analytics.trackEvent({
				event: "contact_form_success",
				properties: {
					form_type: formType,
					timestamp: new Date().toISOString(),
				},
			})
		},

		trackContactFormError: (errorMessage: string, formType?: string) => {
			analytics.trackEvent({
				event: "contact_form_error",
				properties: {
					error_message: errorMessage,
					form_type: formType,
					timestamp: new Date().toISOString(),
				},
			})
		},

		// Blog events
		trackBlogPostView: (slug: string, title: string, category: string) => {
			analytics.trackEvent({
				event: "blog_post_view",
				properties: {
					post_slug: slug,
					post_title: title,
					post_category: category,
					timestamp: new Date().toISOString(),
				},
			})
		},

		trackBlogExternalLinkClick: (externalUrl: string, postSlug?: string) => {
			analytics.trackEvent({
				event: "blog_external_link_click",
				properties: {
					external_url: externalUrl,
					post_slug: postSlug,
					timestamp: new Date().toISOString(),
				},
			})
		},

		// Project events
		trackProjectView: (projectName: string, projectType: string) => {
			analytics.trackEvent({
				event: "project_view",
				properties: {
					project_name: projectName,
					project_type: projectType,
					timestamp: new Date().toISOString(),
				},
			})
		},

		trackProjectLinkClick: (
			projectName: string,
			linkType: "demo" | "github" | "store",
			externalUrl: string
		) => {
			const eventName =
				linkType === "demo"
					? "project_demo_click"
					: linkType === "github"
					? "project_github_click"
					: "project_store_click"

			analytics.trackEvent({
				event: eventName as any,
				properties: {
					project_name: projectName,
					external_url: externalUrl,
					timestamp: new Date().toISOString(),
				},
			})
		},

		// Navigation events
		trackSectionNavigation: (fromSection: string, toSection: string) => {
			analytics.trackEvent({
				event: "navigation_section_change",
				properties: {
					from_section: fromSection,
					to_section: toSection,
					timestamp: new Date().toISOString(),
				},
			})
		},

		trackMobileMenuToggle: (action: "open" | "close") => {
			analytics.trackEvent({
				event: "mobile_menu_toggle",
				properties: {
					menu_action: action,
					timestamp: new Date().toISOString(),
				},
			})
		},

		// Generic event tracking
		trackCustomEvent: analytics.trackEvent,
	}
}
