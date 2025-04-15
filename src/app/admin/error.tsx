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
					<h1 className="text-2xl font-bold text-red-600 mb-4">
						Something went wrong
					</h1>

					<p className="mb-4 text-gray-700">
						There was an error loading the admin section. This could be due to:
					</p>

					<ul className="list-disc pl-5 mb-6 text-gray-700 space-y-1">
						<li>Authentication issues - please try logging in again</li>
						<li>Database connection problems</li>
						<li>Permission errors - make sure you have admin access</li>
					</ul>

					{error?.message && (
						<div className="p-3 bg-gray-100 rounded mb-6 overflow-auto text-sm">
							<p className="font-mono text-red-600">{error.message}</p>
							{error.digest && (
								<p className="font-mono text-gray-500 text-xs mt-2">
									Error ID: {error.digest}
								</p>
							)}
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
