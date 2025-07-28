/**
 * Simple Login Form - Official Supabase Pattern
 *
 * Clean, simple login form following official Supabase Next.js guide.
 * No complex rate limiting or session manipulation needed.
 */

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"

export default function SimpleLoginForm() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [mounted, setMounted] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()

	// Handle URL error parameters
	useEffect(() => {
		setMounted(true)
		const urlError = searchParams.get("error")
		if (urlError) {
			switch (urlError) {
				case "login_required":
					setError("Please sign in to access the admin area.")
					break
				case "admin_required":
					setError(
						"Admin privileges required. Please contact the administrator."
					)
					break
				default:
					setError("An authentication error occurred. Please try signing in.")
			}

			// Clear error from URL
			const newUrl = new URL(window.location.href)
			newUrl.searchParams.delete("error")
			window.history.replaceState({}, "", newUrl.toString())
		}
	}, [searchParams])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setError(null)

		try {
			const supabase = createClient()

			const { error: authError } = await supabase.auth.signInWithPassword({
				email,
				password,
			})

			if (authError) {
				setError(authError.message)
			} else {
				// Simple redirect on success
				router.push("/admin")
				router.refresh()
			}
		} catch (err) {
			setError("An unexpected error occurred")
		} finally {
			setLoading(false)
		}
	}

	if (!mounted) {
		return <div className="p-8">Loading...</div>
	}

	return (
		<div className="p-8">
			{/* Error message */}
			{error && (
				<div className="mb-6 p-4 bg-[rgba(var(--color-pink),0.1)] border border-[rgba(var(--color-pink),0.3)] text-[rgba(var(--color-pink),0.9)] rounded-lg">
					<div className="flex items-center">
						<svg
							className="w-5 h-5 mr-2"
							fill="currentColor"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
						{error}
					</div>
				</div>
			)}

			{/* Login form */}
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Email field */}
				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-[rgba(var(--color-foreground),0.8)] mb-2"
					>
						Email Address
					</label>
					<input
						id="email"
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
						className="w-full px-4 py-3 bg-[rgba(var(--color-foreground),0.05)] border border-[rgba(var(--color-foreground),0.1)] rounded-lg text-[rgba(var(--color-foreground),0.9)] placeholder-[rgba(var(--color-foreground),0.4)] focus:outline-none focus:border-[rgba(var(--color-cyan),0.5)] focus:ring-2 focus:ring-[rgba(var(--color-cyan),0.2)] transition-all duration-200"
						placeholder="admin@doug.is"
					/>
				</div>

				{/* Password field */}
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-[rgba(var(--color-foreground),0.8)] mb-2"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="w-full px-4 py-3 bg-[rgba(var(--color-foreground),0.05)] border border-[rgba(var(--color-foreground),0.1)] rounded-lg text-[rgba(var(--color-foreground),0.9)] placeholder-[rgba(var(--color-foreground),0.4)] focus:outline-none focus:border-[rgba(var(--color-cyan),0.5)] focus:ring-2 focus:ring-[rgba(var(--color-cyan),0.2)] transition-all duration-200"
						placeholder="Enter your password"
					/>
				</div>

				{/* Submit button */}
				<button
					type="submit"
					disabled={loading}
					className="w-full neon-button-cyan py-3 px-6 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
				>
					{loading ? (
						<div className="flex items-center justify-center">
							<svg
								className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Signing in...
						</div>
					) : (
						"Sign In"
					)}
				</button>
			</form>
		</div>
	)
}
