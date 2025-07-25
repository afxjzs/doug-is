"use client"

/**
 * This component provides the login form for the admin area.
 * It includes both password and magic link authentication options.
 *
 * Uses UNIFIED AUTHENTICATION SYSTEM for consistency
 * SECURITY FIX: Removed client-side admin checks - admin verification happens server-side only
 * ERROR HANDLING: Comprehensive error handling with retry logic and user feedback
 */

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/unified-auth-hook"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface LoginFormProps {
	redirectTo?: string | undefined
}

export default function LoginForm({ redirectTo }: LoginFormProps) {
	const {
		loginWithEmail,
		sendMagicLink,
		loading: authLoading,
		initialized,
		user,
		// SECURITY FIX: Removed isAdmin to prevent client-side admin state exposure
		logout,
		error: authError,
		retryCount,
		clearError,
	} = useAuth()
	const router = useRouter()

	// Form state
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [authMethod, setAuthMethod] = useState<"password" | "magic">("password")
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

	// Fallback state for stuck auth
	const [showFallback, setShowFallback] = useState(false)

	// Add a timeout fallback in case auth gets stuck
	useEffect(() => {
		const timer = setTimeout(() => {
			if (authLoading) {
				setShowFallback(true)
			}
		}, 5000) // Show fallback after 5 seconds

		return () => clearTimeout(timer)
	}, [authLoading])

	// Handle auth errors from the hook
	useEffect(() => {
		if (authError) {
			setErrorMessage(authError)
			// Clear form errors when auth error is resolved
			if (
				!authError.includes("Rate limited") &&
				!authError.includes("Network error")
			) {
				setTimeout(() => {
					clearError()
				}, 5000) // Auto-clear non-critical errors after 5 seconds
			}
		} else {
			setErrorMessage(null)
		}
	}, [authError, clearError])

	// SECURITY FIX: Removed client-side admin check logic
	// Admin verification now happens server-side only
	// After successful login, server-side middleware will handle admin route protection
	useEffect(() => {
		if (initialized && user) {
			// User is authenticated - redirect to admin (server will verify admin status)
			if (redirectTo) {
				router.push(redirectTo)
			} else {
				router.push("/admin")
			}
		}
	}, [initialized, user, redirectTo, router])

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setErrorMessage(null)
		setSuccessMessage(null)
		setIsSubmitting(true)

		try {
			if (authMethod === "password") {
				if (!email || !password) {
					setErrorMessage("Please enter both email and password")
					return
				}

				const result = await loginWithEmail(email, password)

				if (!result.success) {
					setErrorMessage(result.error as string)
				} else {
					router.push(redirectTo || "/admin")
					return
				}
			} else {
				if (!email) {
					setErrorMessage("Please enter your email")
					return
				}

				const result = await sendMagicLink(email)

				if (result.success) {
					setSuccessMessage(
						"Check your email for a magic link to sign in. You can close this page."
					)
				} else {
					setErrorMessage(result.error as string)
				}
			}
		} catch (error) {
			console.error("Login error:", error)
			setErrorMessage(
				error instanceof Error ? error.message : "An unexpected error occurred"
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	const toggleAuthMethod = () => {
		setErrorMessage(null)
		setSuccessMessage(null)
		setAuthMethod(authMethod === "password" ? "magic" : "password")
	}

	const isFormDisabled = authLoading || isSubmitting

	// Render loading state
	if (authLoading) {
		if (showFallback) {
			return (
				<div className="space-y-4">
					<div className="text-[rgba(var(--color-foreground),0.7)]">
						<p>Authentication system taking longer than expected...</p>
						{retryCount > 0 && (
							<p className="text-sm text-[rgba(var(--color-foreground),0.6)]">
								Retry attempt {retryCount}/3
							</p>
						)}
						<button
							onClick={() => window.location.reload()}
							className="mt-2 text-[rgba(var(--color-violet),0.9)] hover:text-[rgba(var(--color-violet),1)] underline"
						>
							Refresh page to try again
						</button>
					</div>
				</div>
			)
		}

		return (
			<div className="space-y-4">
				<div className="text-[rgba(var(--color-foreground),0.7)]">
					<p>Initializing unified authentication system...</p>
					{retryCount > 0 && (
						<p className="text-sm text-[rgba(var(--color-foreground),0.6)]">
							Retry attempt {retryCount}/3
						</p>
					)}
				</div>
			</div>
		)
	}

	// Render success message
	if (successMessage) {
		return (
			<div className="rounded-md bg-[rgba(var(--color-green),0.1)] p-4 text-[rgba(var(--color-green),0.9)] border border-[rgba(var(--color-green),0.3)]">
				<p>{successMessage}</p>
			</div>
		)
	}

	// Render form
	return (
		<form onSubmit={handleLogin} className="space-y-4">
			{errorMessage && (
				<div className="text-red-200 text-sm bg-red-900/30 p-4 rounded border border-red-700/50">
					<p className="font-medium text-red-100">Authentication Error:</p>
					<p className="text-red-200">{errorMessage}</p>
					{retryCount > 0 && (
						<p className="text-xs mt-2 text-red-300">
							Retry attempt {retryCount}/3 - Please wait before trying again
						</p>
					)}
					{errorMessage.includes("Rate limited") && (
						<p className="text-xs mt-2 text-red-300">
							Too many login attempts. Please wait a few minutes before trying
							again.
						</p>
					)}
					{errorMessage.includes("Network error") && (
						<p className="text-xs mt-2 text-red-300">
							Network connectivity issue. Please check your connection and try
							again.
						</p>
					)}
				</div>
			)}

			<div>
				<label
					htmlFor="email"
					className="block text-[rgba(var(--color-foreground),0.9)] mb-2"
				>
					Email
				</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className="w-full p-2 border border-[rgba(var(--color-foreground),0.2)] rounded-md bg-[rgba(var(--color-background),0.8)] text-[rgba(var(--color-foreground),0.9)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.6)]"
					disabled={isFormDisabled}
				/>
			</div>

			{authMethod === "password" && (
				<div>
					<label
						htmlFor="password"
						className="block text-[rgba(var(--color-foreground),0.9)] mb-2"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full p-2 border border-[rgba(var(--color-foreground),0.2)] rounded-md bg-[rgba(var(--color-background),0.8)] text-[rgba(var(--color-foreground),0.9)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.6)]"
						disabled={isFormDisabled}
					/>
				</div>
			)}

			<button
				type="submit"
				disabled={isFormDisabled}
				className="w-full py-2 px-4 bg-[rgba(var(--color-violet),0.9)] hover:bg-[rgba(var(--color-violet),1)] text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(var(--color-violet),0.6)] disabled:opacity-50"
			>
				{isSubmitting ? "Signing in..." : "Sign in"}
			</button>

			<button
				type="button"
				onClick={toggleAuthMethod}
				className="w-full text-[rgba(var(--color-violet),0.9)] hover:text-[rgba(var(--color-violet),1)] text-sm"
			>
				{authMethod === "password"
					? "Sign in with a magic link instead"
					: "Sign in with password instead"}
			</button>
		</form>
	)
}
