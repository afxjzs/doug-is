/**
 * Cyberpunk Login Form Component
 *
 * Uses standard Supabase authentication with cyberpunk styling.
 * Enhanced with comprehensive hydration logging for debugging.
 */

"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useHydrationLogger } from "@/lib/utils/hydration-logger"

export default function SimpleLoginForm() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [mounted, setMounted] = useState(false)
	const router = useRouter()

	// Add hydration logging
	const { logEvent, logError } = useHydrationLogger("SimpleLoginForm")

	// Track mounting and hydration
	useEffect(() => {
		try {
			logEvent("hydration-start", {
				email: !!email,
				password: !!password,
				loading,
				error: !!error,
				documentReadyState: document.readyState,
				windowLocation: window.location.href,
			})

			setMounted(true)

			logEvent("hydration-complete", {
				mounted: true,
				documentReadyState: document.readyState,
				hasRouter: !!router,
				timestamp: Date.now(),
			})

			// Test form element access
			const form = document.querySelector("form")
			const emailInput = document.querySelector("#email")
			const passwordInput = document.querySelector("#password")
			const submitButton = document.querySelector('button[type="submit"]')

			logEvent("dom-elements-check", {
				hasForm: !!form,
				hasEmailInput: !!emailInput,
				hasPasswordInput: !!passwordInput,
				hasSubmitButton: !!submitButton,
				formAction: form?.getAttribute("action"),
				emailValue: (emailInput as HTMLInputElement)?.value,
				buttonDisabled: (submitButton as HTMLButtonElement)?.disabled,
			})

			// Test event handler attachment
			if (submitButton) {
				const testHandler = () => {
					logEvent("test-event-handler", {
						message: "Button click handler working",
					})
				}
				submitButton.addEventListener("click", testHandler, { once: true })

				// Clean up test handler after a brief delay
				setTimeout(() => {
					submitButton.removeEventListener("click", testHandler)
				}, 2000)
			}
		} catch (error) {
			logError(error as Error, {
				phase: "mount-effect",
				documentReadyState:
					typeof document !== "undefined" ? document.readyState : "undefined",
			})
		}
	}, [logEvent, logError, router, email, password, loading, error])

	// Track state changes
	useEffect(() => {
		if (mounted) {
			logEvent("state-change", {
				email: !!email,
				emailLength: email.length,
				password: !!password,
				passwordLength: password.length,
				loading,
				error: !!error,
			})
		}
	}, [email, password, loading, error, mounted, logEvent])

	const handleSubmit = async (e: React.FormEvent) => {
		try {
			logEvent("submit-start", {
				email: !!email,
				password: !!password,
				eventType: e.type,
				timestamp: Date.now(),
			})

			e.preventDefault()
			setLoading(true)
			setError(null)

			logEvent("submit-prevented-default", {
				loading: true,
				error: null,
			})

			const supabase = createClient()

			logEvent("supabase-client-created", {
				hasSupabase: !!supabase,
				supabaseAuth: !!supabase.auth,
			})

			const { error: authError } = await supabase.auth.signInWithPassword({
				email,
				password,
			})

			logEvent("auth-attempt-complete", {
				hasError: !!authError,
				errorMessage: authError?.message,
			})

			if (authError) {
				setError(authError.message)
				logEvent("auth-error", {
					errorMessage: authError.message,
					errorName: authError.name,
				})
			} else {
				logEvent("auth-success", {
					redirecting: true,
				})

				// Redirect to admin dashboard on successful login
				router.push("/admin")
				router.refresh()

				logEvent("redirect-complete", {
					path: "/admin",
				})
			}
		} catch (err) {
			const error = err as Error
			logError(error, {
				phase: "submit-handler",
				email: !!email,
				password: !!password,
			})
			setError("An unexpected error occurred")
		} finally {
			setLoading(false)
			logEvent("submit-complete", {
				loading: false,
			})
		}
	}

	// Track input changes
	const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const newEmail = e.target.value
			setEmail(newEmail)
			logEvent("email-change", {
				hasValue: !!newEmail,
				length: newEmail.length,
				isValid: newEmail.includes("@"),
			})
		} catch (error) {
			logError(error as Error, { phase: "email-change" })
		}
	}

	const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		try {
			const newPassword = e.target.value
			setPassword(newPassword)
			logEvent("password-change", {
				hasValue: !!newPassword,
				length: newPassword.length,
			})
		} catch (error) {
			logError(error as Error, { phase: "password-change" })
		}
	}

	// Log render attempts
	logEvent("render", {
		mounted,
		email: !!email,
		password: !!password,
		loading,
		error: !!error,
		timestamp: Date.now(),
	})

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

			{/* Debug info in development */}
			{process.env.NODE_ENV === "development" && (
				<div className="mb-4 p-2 border rounded text-xs">
					<strong>Debug:</strong> Mounted: {mounted ? "Yes" : "No"}, Email:{" "}
					{email.length} chars, Password: {password.length} chars, Loading:{" "}
					{loading ? "Yes" : "No"}
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
					<div className="relative">
						<input
							id="email"
							type="email"
							value={email}
							onChange={handleEmailChange}
							required
							className="w-full px-4 py-3 bg-[rgba(var(--color-foreground),0.05)] border border-[rgba(var(--color-foreground),0.1)] rounded-lg text-[rgba(var(--color-foreground),0.9)] placeholder-[rgba(var(--color-foreground),0.4)] focus:outline-none focus:border-[rgba(var(--color-cyan),0.5)] focus:ring-2 focus:ring-[rgba(var(--color-cyan),0.2)] transition-all duration-200"
							placeholder="admin@doug.is"
						/>
						<div className="absolute inset-0 rounded-lg pointer-events-none border border-transparent focus-within:border-[rgba(var(--color-cyan),0.3)] transition-colors duration-200"></div>
					</div>
				</div>

				{/* Password field */}
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium text-[rgba(var(--color-foreground),0.8)] mb-2"
					>
						Password
					</label>
					<div className="relative">
						<input
							id="password"
							type="password"
							value={password}
							onChange={handlePasswordChange}
							required
							className="w-full px-4 py-3 bg-[rgba(var(--color-foreground),0.05)] border border-[rgba(var(--color-foreground),0.1)] rounded-lg text-[rgba(var(--color-foreground),0.9)] placeholder-[rgba(var(--color-foreground),0.4)] focus:outline-none focus:border-[rgba(var(--color-cyan),0.5)] focus:ring-2 focus:ring-[rgba(var(--color-cyan),0.2)] transition-all duration-200"
							placeholder="Enter your password"
						/>
						<div className="absolute inset-0 rounded-lg pointer-events-none border border-transparent focus-within:border-[rgba(var(--color-cyan),0.3)] transition-colors duration-200"></div>
					</div>
				</div>

				{/* Submit button */}
				<button
					type="submit"
					disabled={loading}
					onClick={() => logEvent("submit-button-click", { loading, mounted })}
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

			{/* Form footer */}
			<div className="mt-8 text-center">
				<div className="w-16 h-px bg-gradient-to-r from-transparent via-[rgba(var(--color-foreground),0.2)] to-transparent mx-auto mb-4"></div>
				{process.env.NODE_ENV === "development" && (
					<button
						type="button"
						onClick={() => {
							// @ts-ignore
							window.hydrationLogger?.printDebugReport()
						}}
						className="mt-2 text-xs text-blue-500 hover:text-blue-700 underline"
					>
						Print Hydration Debug Report
					</button>
				)}
			</div>
		</div>
	)
}
