/**
 * Analytics Event Types
 * Defines the structure for different analytics events across the site
 */

// Base event structure
export interface BaseEvent {
	event: string
	properties?: Record<string, any>
	timestamp?: Date
}

// Contact form events
export interface ContactFormEvent extends BaseEvent {
	event:
		| "contact_form_view"
		| "contact_form_field_focus"
		| "contact_form_submit"
		| "contact_form_success"
		| "contact_form_error"
	properties: {
		form_type?: string
		field_name?: string
		error_message?: string
		referrer?: string
		user_agent?: string
		timestamp?: string
		[key: string]: any // Allow additional properties
	}
}

// Blog engagement events
export interface BlogEvent extends BaseEvent {
	event:
		| "blog_post_view"
		| "blog_reading_time"
		| "blog_scroll_depth"
		| "blog_external_link_click"
	properties: {
		post_slug?: string
		post_title?: string
		post_category?: string
		reading_time_seconds?: number
		scroll_percentage?: number
		external_url?: string
		estimated_reading_time?: number
		timestamp?: string
		[key: string]: any // Allow additional properties
	}
}

// Project portfolio events
export interface ProjectEvent extends BaseEvent {
	event:
		| "project_view"
		| "project_demo_click"
		| "project_github_click"
		| "project_store_click"
		| "project_image_interaction"
		| "portfolio_company_click"
		| "portfolio_project_click"
		| "portfolio_external_link_click"
	properties: {
		project_name?: string
		project_type?: string
		interaction_type?: string
		external_url?: string
		time_on_page?: number
		// Portfolio-specific properties
		company_id?: string
		company_name?: string
		project_id?: string
		link_type?: string
		timestamp?: string
		[key: string]: any // Allow additional properties
	}
}

// Navigation events
export interface NavigationEvent extends BaseEvent {
	event:
		| "navigation_section_change"
		| "mobile_menu_toggle"
		| "internal_link_click"
		| "analytics_initialized"
		| "debug_test_event"
	properties: {
		from_section?: string
		to_section?: string
		menu_action?: "open" | "close"
		link_text?: string
		destination_url?: string
		timestamp?: string
		[key: string]: any // Allow additional properties
	}
}

// Union type for all possible events
export type AnalyticsEvent =
	| ContactFormEvent
	| BlogEvent
	| ProjectEvent
	| NavigationEvent

/**
 * Analytics Provider Interface (Interface Segregation Principle)
 * Separate interfaces for different analytics capabilities
 */

// Page tracking interface
export interface PageTracker {
	trackPageView(url: string, title?: string): void
}

// Event tracking interface
export interface EventTracker {
	trackEvent(event: AnalyticsEvent): void
}

// User identification interface
export interface UserTracker {
	identifyUser(userId: string, properties?: Record<string, any>): void
	resetUser(): void
}

// Main analytics provider interface (Dependency Inversion Principle)
export interface AnalyticsProvider
	extends PageTracker,
		EventTracker,
		UserTracker {
	initialize(): void
	isInitialized(): boolean
	setUserProperties(properties: Record<string, any>): void
}
