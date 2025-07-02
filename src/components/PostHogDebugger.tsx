"use client"

import { useEffect, useState } from "react"
import { useAnalytics } from "@/lib/analytics"
import { PostHogProvider } from "@/lib/analytics/providers/posthog"

interface DebugInfo {
	isInitialized: boolean
	hasApiKey: boolean
	apiKeyLength: number
	host: string
	environment: string
	posthogInstance: any
	timestamp: string
}

export function PostHogDebugger() {
	const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
	const [isVisible, setIsVisible] = useState(false)
	const analytics = useAnalytics()

	useEffect(() => {
		// Get debug info after component mounts
		if (analytics && (analytics as any).getDebugInfo) {
			const info = (analytics as any).getDebugInfo()
			setDebugInfo(info)
			console.log("🔍 PostHog Debug Info:", info)
		}
	}, [analytics])

	// Test event firing
	const testEvent = () => {
		console.log("🧪 PostHog: Testing custom event...")
		analytics.trackEvent({
			event: "debug_test_event",
			properties: {
				test_timestamp: new Date().toISOString(),
				browser_info: {
					userAgent: navigator.userAgent,
					language: navigator.language,
					platform: navigator.platform,
				},
			},
		})
	}

	if (!debugInfo) return null

	return (
		<>
			{/* Debug Toggle Button */}
			<button
				onClick={() => setIsVisible(!isVisible)}
				className="fixed bottom-4 right-4 z-50 bg-purple-600 text-white px-3 py-2 rounded text-sm font-mono"
			>
				PostHog {isVisible ? "Hide" : "Debug"}
			</button>

			{/* Debug Panel */}
			{isVisible && (
				<div className="fixed bottom-16 right-4 z-50 bg-black/90 text-green-400 p-4 rounded-lg max-w-md text-xs font-mono border border-green-500">
					<h3 className="text-green-300 font-bold mb-2">
						🔍 PostHog Debug Panel
					</h3>

					<div className="space-y-1">
						<div
							className={`${
								debugInfo.isInitialized ? "text-green-400" : "text-red-400"
							}`}
						>
							🟢 Initialized: {debugInfo.isInitialized ? "YES" : "NO"}
						</div>
						<div
							className={`${
								debugInfo.hasApiKey ? "text-green-400" : "text-red-400"
							}`}
						>
							🔑 API Key:{" "}
							{debugInfo.hasApiKey
								? `${debugInfo.apiKeyLength} chars`
								: "MISSING"}
						</div>
						<div className="text-blue-400">🌐 Host: {debugInfo.host}</div>
						<div className="text-yellow-400">
							🔧 Environment: {debugInfo.environment}
						</div>
						{debugInfo.posthogInstance && (
							<div className="text-green-400">📊 Instance: Loaded</div>
						)}
					</div>

					<div className="mt-3 space-y-2">
						<button
							onClick={testEvent}
							className="bg-blue-600 text-white px-2 py-1 rounded text-xs w-full"
						>
							🧪 Test Event
						</button>
						<button
							onClick={() => console.table(debugInfo)}
							className="bg-purple-600 text-white px-2 py-1 rounded text-xs w-full"
						>
							📋 Log Full Debug
						</button>
					</div>

					<div className="mt-2 text-gray-400 text-xs">
						Updated: {new Date(debugInfo.timestamp).toLocaleTimeString()}
					</div>
				</div>
			)}
		</>
	)
}
