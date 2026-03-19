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
		// Initialize eagerly so tracking is ready before child useEffects fire
		this.initialize()
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
			console.error(
				"🚨 PostHog CRITICAL: API key not found in environment variables"
			)
			console.error("Expected: NEXT_PUBLIC_POSTHOG_KEY")
			console.error(
				"Available env vars:",
				Object.keys(process.env).filter((key) => key.includes("POSTHOG"))
			)
			return
		}

		console.log("🚀 PostHog: Starting initialization...")
		console.log("🔑 PostHog: API key found (length:", this.apiKey.length, ")")
		console.log("🌐 PostHog: Host:", this.host)
		console.log("🔧 PostHog: Environment:", process.env.NODE_ENV)

		try {
			posthog.init(this.apiKey, {
				api_host: this.host,
				defaults: "2025-05-24", // Required configuration snapshot date
				person_profiles: "always", // Allow anonymous events to be processed
				loaded: (posthog) => {
					console.log("✅ PostHog: Successfully loaded and ready")
					console.log("📊 PostHog: Instance details:", {
						config: posthog.config,
						persistence: posthog.persistence,
						sessionRecording: posthog.sessionRecording,
					})
					if (process.env.NODE_ENV === "development") {
						posthog.debug()
						console.log("🐛 PostHog: Debug mode enabled for development")
					}
				},
				capture_pageview: false, // We'll handle page views manually
				capture_pageleave: true,
				disable_session_recording: true, // Privacy compliance
				respect_dnt: true, // Respect Do Not Track headers
				opt_out_capturing_by_default: false,
				enable_recording_console_log: false, // Privacy compliance
				autocapture: false, // Disable autocapture to prevent web vitals issues
				capture_performance: false, // Disable automatic performance tracking
				// Let PostHog auto-generate distinct_id for anonymous users
			})

			this.initialized = true
			console.log("🎉 PostHog: Initialization completed successfully")
		} catch (error) {
			console.error("❌ PostHog: Initialization failed:", error)
			console.error("🔍 PostHog: Error details:", {
				name: error instanceof Error ? error.name : "Unknown",
				message: error instanceof Error ? error.message : String(error),
				stack: error instanceof Error ? error.stack : undefined,
			})
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
		console.log("📄 PostHog: Page view tracking called", { url, title })

		if (!this.isInitialized()) {
			console.warn("⚠️ PostHog: Page view tracking skipped - not initialized")
			return
		}

		try {
			const eventData = {
				$current_url: url,
				$title: title,
				timestamp: new Date().toISOString(),
			}

			console.log("📤 PostHog: Sending page view event", eventData)
			posthog.capture("$pageview", eventData)
			console.log("✅ PostHog: Page view event sent successfully")
		} catch (error) {
			console.error("❌ PostHog: Failed to track page view:", error)
		}
	}

	/**
	 * Track custom events
	 * Interface Segregation: Implements EventTracker interface
	 */
	trackEvent(event: AnalyticsEvent): void {
		console.log("🎯 PostHog: Custom event tracking called", {
			eventName: event.event,
			properties: event.properties,
		})

		if (!this.isInitialized()) {
			console.warn(
				"⚠️ PostHog: Custom event tracking skipped - not initialized",
				event.event
			)
			return
		}

		try {
			// Add timestamp if not provided
			const eventData = {
				...event.properties,
				timestamp: event.timestamp || new Date().toISOString(),
			}

			console.log("📤 PostHog: Sending custom event", {
				eventName: event.event,
				eventData,
			})
			posthog.capture(event.event, eventData)
			console.log("✅ PostHog: Custom event sent successfully", event.event)
		} catch (error) {
			console.error("❌ PostHog: Failed to track event:", error, event)
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

	/**
	 * Get comprehensive configuration status for debugging
	 * Helps diagnose PostHog connectivity issues
	 */
	getDebugInfo() {
		return {
			isInitialized: this.initialized,
			hasApiKey: !!this.apiKey,
			apiKeyLength: this.apiKey?.length || 0,
			host: this.host,
			environment: process.env.NODE_ENV,
			posthogInstance: this.isInitialized()
				? {
						config: posthog.config,
						isLoaded: posthog.__loaded,
						persistence: posthog.persistence?.props || {},
				  }
				: null,
			timestamp: new Date().toISOString(),
		}
	}
}
