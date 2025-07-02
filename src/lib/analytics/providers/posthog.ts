import posthog from "posthog-js"
import type { AnalyticsProvider, AnalyticsEvent } from "../types"

/**
 * PostHog Analytics Provider Implementation
 * Implements the AnalyticsProvider interface following SOLID principles
 */
export class PostHogProvider implements AnalyticsProvider {
	private initialized: boolean = false
	private readonly apiKey: string | undefined
	private readonly host: string

	constructor() {
		this.apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
		this.host =
			process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"
	}

	/**
	 * Initialize PostHog with privacy-friendly settings
	 * Single Responsibility: Only handles PostHog initialization
	 */
	initialize(): void {
		if (typeof window === "undefined" || this.initialized) {
			return
		}

		if (!this.apiKey) {
			console.warn("PostHog API key not found. Analytics will not be tracked.")
			return
		}

		try {
			posthog.init(this.apiKey, {
				api_host: this.host,
				defaults: "2025-05-24", // Required configuration snapshot date
				person_profiles: "identified_only", // Privacy-friendly setting
				loaded: (posthog) => {
					if (process.env.NODE_ENV === "development") {
						posthog.debug()
						console.log("PostHog initialized successfully for development")
					} else {
						console.log("PostHog initialized successfully for production")
					}
				},
				capture_pageview: false, // We'll handle page views manually
				capture_pageleave: true,
				disable_session_recording: true, // Privacy compliance
				respect_dnt: true, // Respect Do Not Track headers
				opt_out_capturing_by_default: false,
				enable_recording_console_log: false, // Privacy compliance
				bootstrap: {
					distinctID: undefined, // Let PostHog handle this
				},
			})

			this.initialized = true
		} catch (error) {
			console.error("Failed to initialize PostHog:", error)
		}
	}

	/**
	 * Check if PostHog is initialized
	 */
	isInitialized(): boolean {
		return this.initialized && !!this.apiKey
	}

	/**
	 * Track page views
	 * Interface Segregation: Implements PageTracker interface
	 */
	trackPageView(url: string, title?: string): void {
		if (!this.isInitialized()) return

		try {
			posthog.capture("$pageview", {
				$current_url: url,
				$title: title,
				timestamp: new Date().toISOString(),
			})
		} catch (error) {
			console.error("Failed to track page view:", error)
		}
	}

	/**
	 * Track custom events
	 * Interface Segregation: Implements EventTracker interface
	 */
	trackEvent(event: AnalyticsEvent): void {
		if (!this.isInitialized()) return

		try {
			// Add timestamp if not provided
			const eventData = {
				...event.properties,
				timestamp: event.timestamp || new Date().toISOString(),
			}

			posthog.capture(event.event, eventData)
		} catch (error) {
			console.error("Failed to track event:", error, event)
		}
	}

	/**
	 * Identify users
	 * Interface Segregation: Implements UserTracker interface
	 */
	identifyUser(userId: string, properties?: Record<string, any>): void {
		if (!this.isInitialized()) return

		try {
			posthog.identify(userId, properties)
		} catch (error) {
			console.error("Failed to identify user:", error)
		}
	}

	/**
	 * Reset user identification
	 * Interface Segregation: Implements UserTracker interface
	 */
	resetUser(): void {
		if (!this.isInitialized()) return

		try {
			posthog.reset()
		} catch (error) {
			console.error("Failed to reset user:", error)
		}
	}

	/**
	 * Set user properties
	 * Additional functionality for user property management
	 */
	setUserProperties(properties: Record<string, any>): void {
		if (!this.isInitialized()) return

		try {
			posthog.people.set(properties)
		} catch (error) {
			console.error("Failed to set user properties:", error)
		}
	}

	/**
	 * Get PostHog instance for advanced usage
	 * Open/Closed Principle: Allows extension without modification
	 */
	getInstance() {
		return this.isInitialized() ? posthog : null
	}
}
