"use client"

/**
 * Simple Login Form Component
 *
 * A clean, simple login form using the new simple auth hook.
 * Removes all complex error handling and retry logic that was causing issues.
 *
 * Features:
 * - Simple, clean UI
 * - Standard Supabase auth patterns
 * - Clear error messages
 * - Magic link support
 * - No complex retry logic
 */

import { useState, useEffect } from "react"
import { useSimpleAuth } from "@/lib/auth/simple-auth-hook"
import { useRouter } from "next/navigation"

interface SimpleLoginFormProps {
	redirectTo?: string | undefined
}

export default function SimpleLoginForm({ redirectTo }: SimpleLoginFormProps) {
	const {
		loginWithEmail,
		sendMagicLink,
		loading: authLoading,
		user,
		error: authError,
		clearError,
	} = useSimpleAuth()
	const router = useRouter()

	// Form state
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [authMethod, setAuthMethod] = useState<"password" | "magic">("password")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	// Handle auth errors
	useEffect(() => {
		if (authError) {
			// Clear form errors after 5 seconds
			const timer = setTimeout(() => {
				clearError()
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [authError, clearError])

	// Redirect after successful login
	useEffect(() => {
		if (user && !authLoading) {
			if (redirectTo) {
				router.push(redirectTo)
			} else {
				router.push("/admin")
			}
		}
	}, [user, authLoading, redirectTo, router])

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		clearError()

		try {
			if (authMethod === "password") {
				if (!email || !password) {
					return
				}

				const result = await loginWithEmail(email, password)

				if (result.success) {
					// Redirect will be handled by useEffect
					return
				}
			} else {
				if (!email) {
					return
				}

				const result = await sendMagicLink(email)

				if (result.success) {
					setSuccessMessage(
						"Check your email for a magic link to sign in. You can close this page."
					)
				}
			}
		} catch (error) {
			console.error("Login error:", error)
		} finally {
			setIsSubmitting(false)
		}
	}

	const toggleAuthMethod = () => {
		clearError()
		setSuccessMessage(null)
		setAuthMethod(authMethod === "password" ? "magic" : "password")
	}

	const isFormDisabled = authLoading || isSubmitting

	// Render loading state
	if (authLoading) {
		return (
			<div className="space-y-4">
				<div className="text-[rgba(var(--color-foreground),0.7)]">
					<p>Initializing authentication...</p>
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
			{authError && (
				<div className="text-red-200 text-sm bg-red-900/30 p-4 rounded border border-red-700/50">
					<p className="font-medium text-red-100">Authentication Error:</p>
					<p className="text-red-200">{authError}</p>
					{authError.includes("Invalid login credentials") && (
						<div className="mt-3 pt-3 border-t border-red-700/50">
							<p className="text-red-200 text-xs mb-2">
								If you haven't set up a password yet, try using a magic link
								instead.
							</p>
							<p className="text-red-200 text-xs">
								For setup instructions, visit{" "}
								<a
									href="/admin/setup"
									className="text-[rgba(var(--color-violet),0.9)] hover:underline"
								>
									/admin/setup
								</a>
							</p>
						</div>
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
					required
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
						required
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
