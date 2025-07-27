// src/components/HydrationErrorBoundary.tsx

/**
 * Hydration Error Boundary
 *
 * React error boundary specifically designed to catch hydration failures
 * and other client-side errors during component rendering.
 */

"use client"

import React, { Component, ErrorInfo, ReactNode } from "react"
import hydrationLogger from "@/lib/utils/hydration-logger"

interface Props {
	children: ReactNode
	componentName?: string
	fallback?: ReactNode
}

interface State {
	hasError: boolean
	error?: Error
	errorInfo?: ErrorInfo
}

export class HydrationErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError(error: Error): State {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error }
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		// Log the error with detailed context
		const componentName = this.props.componentName || "HydrationErrorBoundary"

		hydrationLogger.logError(componentName, error, {
			errorInfo,
			componentStack: errorInfo.componentStack,
			errorBoundary: true,
			timestamp: Date.now(),
		})

		// Also log to console for immediate debugging
		console.error("[HYDRATION-ERROR-BOUNDARY] Error caught:", {
			error: error.message,
			stack: error.stack,
			componentStack: errorInfo.componentStack,
			componentName,
		})

		this.setState({ error, errorInfo })
	}

	componentDidMount() {
		// Log successful mounting
		const componentName = this.props.componentName || "HydrationErrorBoundary"
		hydrationLogger.logEvent(componentName, "mount", {
			hasError: this.state.hasError,
		})
	}

	render() {
		if (this.state.hasError) {
			// Render fallback UI
			if (this.props.fallback) {
				return this.props.fallback
			}

			return (
				<div className="p-4 bg-red-50 border border-red-200 rounded-lg">
					<h2 className="text-lg font-semibold text-red-800 mb-2">
						Hydration Error Detected
					</h2>
					<p className="text-red-700 mb-2">
						A client-side error occurred. Check the console for details.
					</p>
					{process.env.NODE_ENV === "development" && (
						<details className="mt-2">
							<summary className="cursor-pointer text-red-600 font-medium">
								Error Details (Development Only)
							</summary>
							<pre className="mt-2 p-2 bg-red-100 text-red-800 text-sm overflow-auto rounded">
								{this.state.error?.message}
								{"\n\n"}
								{this.state.error?.stack}
								{this.state.errorInfo?.componentStack && (
									<>
										{"\n\nComponent Stack:"}
										{this.state.errorInfo.componentStack}
									</>
								)}
							</pre>
						</details>
					)}
					<button
						onClick={() => window.location.reload()}
						className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
					>
						Reload Page
					</button>
				</div>
			)
		}

		return this.props.children
	}
}

// Higher-order component for easier usage
export function withHydrationErrorBoundary<P extends object>(
	WrappedComponent: React.ComponentType<P>,
	componentName?: string,
	fallback?: ReactNode
) {
	const WithErrorBoundary = (props: P) => (
		<HydrationErrorBoundary
			componentName={componentName || WrappedComponent.name}
			fallback={fallback}
		>
			<WrappedComponent {...props} />
		</HydrationErrorBoundary>
	)

	WithErrorBoundary.displayName = `withHydrationErrorBoundary(${
		WrappedComponent.displayName || WrappedComponent.name
	})`

	return WithErrorBoundary
}

export default HydrationErrorBoundary
