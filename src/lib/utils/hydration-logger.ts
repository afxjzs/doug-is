// src/lib/utils/hydration-logger.ts

/**
 * Hydration and Error Logging Utility
 *
 * Comprehensive logging system to capture client-side hydration failures,
 * component lifecycle events, and JavaScript errors for debugging.
 */

interface HydrationEvent {
	timestamp: number
	component: string
	event:
		| "mount"
		| "unmount"
		| "error"
		| "hydration-start"
		| "hydration-complete"
		| "dom-elements-check"
		| "test-event-handler"
		| "state-change"
		| "submit-start"
		| "submit-prevented-default"
		| "supabase-client-created"
		| "auth-attempt-complete"
		| "auth-error"
		| "auth-success"
		| "redirect-complete"
		| "submit-complete"
		| "email-change"
		| "password-change"
		| "render"
		| "submit-button-click"
	data?: any
	error?: Error
}

class HydrationLogger {
	private events: HydrationEvent[] = []
	private isClient = typeof window !== "undefined"
	private logPrefix = "[HYDRATION-DEBUG]"

	constructor() {
		if (this.isClient) {
			this.setupGlobalErrorHandlers()
			this.setupHydrationDetection()
		}
	}

	/**
	 * Log a hydration event with detailed information
	 */
	logEvent(
		component: string,
		event: HydrationEvent["event"],
		data?: any,
		error?: Error
	) {
		const hydrationEvent: HydrationEvent = {
			timestamp: Date.now(),
			component,
			event,
			data,
			error,
		}

		this.events.push(hydrationEvent)

		if (this.isClient) {
			const logData = {
				component,
				event,
				timestamp: new Date(hydrationEvent.timestamp).toISOString(),
				data,
				error: error?.message,
			}

			if (error) {
				console.error(`${this.logPrefix} ERROR in ${component}:`, logData)
				console.error(`${this.logPrefix} Error Stack:`, error.stack)
			} else {
				console.log(`${this.logPrefix} ${component} - ${event}:`, logData)
			}
		}
	}

	/**
	 * Log component mount with detailed lifecycle information
	 */
	logComponentMount(component: string, props?: any) {
		this.logEvent(component, "mount", {
			props,
			userAgent: this.isClient ? navigator.userAgent : "server",
			url: this.isClient ? window.location.href : "server",
		})
	}

	/**
	 * Log component unmount
	 */
	logComponentUnmount(component: string) {
		this.logEvent(component, "unmount")
	}

	/**
	 * Log hydration start
	 */
	logHydrationStart(component: string) {
		this.logEvent(component, "hydration-start", {
			readyState: this.isClient ? document.readyState : "server",
		})
	}

	/**
	 * Log hydration completion
	 */
	logHydrationComplete(component: string) {
		this.logEvent(component, "hydration-complete", {
			readyState: this.isClient ? document.readyState : "server",
			totalEvents: this.events.length,
		})
	}

	/**
	 * Log an error with component context
	 */
	logError(component: string, error: Error, context?: any) {
		this.logEvent(component, "error", context, error)
	}

	/**
	 * Setup global error handlers to catch hydration failures
	 */
	private setupGlobalErrorHandlers() {
		if (!this.isClient) return

		// Catch unhandled JavaScript errors
		window.addEventListener("error", (event) => {
			this.logError("GLOBAL", new Error(event.message), {
				filename: event.filename,
				lineno: event.lineno,
				colno: event.colno,
				type: "javascript-error",
			})
		})

		// Catch unhandled promise rejections
		window.addEventListener("unhandledrejection", (event) => {
			this.logError("GLOBAL", new Error(String(event.reason)), {
				type: "unhandled-promise-rejection",
			})
		})

		// Catch React errors if available
		if (
			typeof window !== "undefined" &&
			(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
		) {
			const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__
			if (hook.onCommitFiberRoot) {
				const originalOnCommitFiberRoot = hook.onCommitFiberRoot
				hook.onCommitFiberRoot = (...args: any[]) => {
					try {
						this.logEvent("REACT_DEVTOOLS", "hydration-complete", {
							args: args.length,
						})
						return originalOnCommitFiberRoot(...args)
					} catch (error) {
						this.logError("REACT_DEVTOOLS", error as Error)
						throw error
					}
				}
			}
		}
	}

	/**
	 * Setup hydration detection to track when React hydrates
	 */
	private setupHydrationDetection() {
		if (!this.isClient) return

		// Track DOM ready state changes
		const logReadyState = () => {
			this.logEvent("DOM", "hydration-start", {
				readyState: document.readyState,
				timestamp: Date.now(),
			})
		}

		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", logReadyState)
		} else {
			logReadyState()
		}

		// Track when window loads
		if (document.readyState !== "complete") {
			window.addEventListener("load", () => {
				this.logEvent("WINDOW", "hydration-complete", {
					readyState: document.readyState,
					timestamp: Date.now(),
				})
			})
		}

		// Track Next.js router events if available
		if (typeof window !== "undefined") {
			setTimeout(() => {
				const nextRouter = (window as any).next?.router
				if (nextRouter) {
					this.logEvent("NEXT_ROUTER", "hydration-complete", {
						route: nextRouter.route,
						pathname: nextRouter.pathname,
					})
				} else {
					this.logEvent("NEXT_ROUTER", "error", {
						message: "Next.js router not found - potential hydration issue",
					})
				}
			}, 1000)
		}
	}

	/**
	 * Get all logged events for debugging
	 */
	getEvents(): HydrationEvent[] {
		return [...this.events]
	}

	/**
	 * Get events for a specific component
	 */
	getEventsForComponent(component: string): HydrationEvent[] {
		return this.events.filter((event) => event.component === component)
	}

	/**
	 * Get all error events
	 */
	getErrors(): HydrationEvent[] {
		return this.events.filter((event) => event.event === "error")
	}

	/**
	 * Print a comprehensive debug report
	 */
	printDebugReport() {
		if (!this.isClient) return

		console.group(`${this.logPrefix} HYDRATION DEBUG REPORT`)

		console.log("Total Events:", this.events.length)
		console.log("Document Ready State:", document.readyState)
		console.log("Window Location:", window.location.href)
		console.log("User Agent:", navigator.userAgent)

		const errors = this.getErrors()
		if (errors.length > 0) {
			console.group("Errors:")
			errors.forEach((error) => {
				console.error(`${error.component}: ${error.error?.message}`)
			})
			console.groupEnd()
		}

		const components = Array.from(new Set(this.events.map((e) => e.component)))
		console.group("Components:")
		components.forEach((component) => {
			const componentEvents = this.getEventsForComponent(component)
			console.log(`${component}: ${componentEvents.length} events`)
		})
		console.groupEnd()

		console.group("All Events:")
		console.table(
			this.events.map((e) => ({
				timestamp: new Date(e.timestamp).toISOString(),
				component: e.component,
				event: e.event,
				hasData: !!e.data,
				hasError: !!e.error,
			}))
		)
		console.groupEnd()

		console.groupEnd()
	}
}

// Create singleton instance
const hydrationLogger = new HydrationLogger()

// Expose globally for debugging
if (typeof window !== "undefined") {
	;(window as any).hydrationLogger = hydrationLogger
}

// Export hook for React components
export function useHydrationLogger(componentName: string) {
	if (typeof window !== "undefined") {
		// Log mount on first render
		React.useEffect(() => {
			hydrationLogger.logComponentMount(componentName)
			return () => {
				hydrationLogger.logComponentUnmount(componentName)
			}
		}, [componentName])
	}

	return {
		logEvent: (event: HydrationEvent["event"], data?: any, error?: Error) =>
			hydrationLogger.logEvent(componentName, event, data, error),
		logError: (error: Error, context?: any) =>
			hydrationLogger.logError(componentName, error, context),
	}
}

// Add React import for useEffect
import React from "react"

export default hydrationLogger
