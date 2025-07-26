"use client"

/**
 * Error Boundary for Admin Section
 *
 * This component catches runtime errors in the admin section
 * and displays a user-friendly error message.
 */

import { useEffect } from "react"
import Link from "next/link"

export default function AdminError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		// Log the error to the console for debugging
		console.error("Admin section error:", error)
	}, [error])

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="max-w-2xl mx-auto">
				<div className="bg-white shadow-sm border border-gray-200 rounded-lg p-8">
					<h1 className="text-2xl font-bold text-red-200 mb-4">
						Something went wrong!
					</h1>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-6">
						An error occurred while loading this page. Please try refreshing or
						contact support if the problem persists.
					</p>
					{error && (
						<div className="bg-red-900/30 border border-red-700/50 rounded-md p-4 mb-4">
							<h2 className="text-lg font-semibold text-red-100 mb-2">
								Error Details:
							</h2>
							<p className="font-mono text-red-200">{error.message}</p>
						</div>
					)}

					<div className="flex flex-wrap gap-4">
						<button
							onClick={reset}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
						>
							Try again
						</button>

						<Link
							href="/admin/login"
							className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
						>
							Go to login
						</Link>

						<Link
							href="/logout"
							className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
						>
							Force logout
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
