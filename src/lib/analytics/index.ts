/**
 * Analytics Module - Main Entry Point
 * Exports all analytics functionality with clean API
 */

// Types
export type {
	AnalyticsProvider,
	AnalyticsEvent,
	ContactFormEvent,
	BlogEvent,
	ProjectEvent,
	NavigationEvent,
	PageTracker,
	EventTracker,
	UserTracker,
} from "./types"

// Provider implementations
export { PostHogProvider } from "./providers/posthog"

// Context and hooks
export {
	AnalyticsProviderComponent,
	useAnalytics,
	usePageViewTracking,
	useEventTracking,
	useClientEventTracking,
} from "./context"
