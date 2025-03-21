"use client"

/**
 * This component provides the login form for the admin area.
 * It includes both password and magic link authentication options.
 */

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth/supabaseClientAuth"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface LoginFormProps {
	redirectTo?: string | undefined
}

export default function LoginForm({ redirectTo }: LoginFormProps) {
	const { loginWithEmail, sendMagicLink, loading, initialized } = useAuth()
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [authMethod, setAuthMethod] = useState<"password" | "magic">("password")
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const router = useRouter()

	// Wait for auth initialization to complete
	const [authReady, setAuthReady] = useState(false)

	useEffect(() => {
		if (initialized) {
			setAuthReady(true)
		}
	}, [initialized])

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault()
		console.log("Form submitted", { email, authMethod })

		// Clear previous error messages
		setErrorMessage(null)
		// Set local submitting state to show feedback
		setIsSubmitting(true)

		// Ensure auth is ready before proceeding
		if (!authReady) {
			setErrorMessage(
				"Authentication system is initializing. Please try again."
			)
			setIsSubmitting(false)
			return
		}

		try {
			if (authMethod === "password") {
				if (!email || !password) {
					setErrorMessage("Please enter both email and password")
					setIsSubmitting(false)
					return
				}

				// Password login
				console.log("Attempting password login")
				const result = await loginWithEmail(email, password)
				console.log("Login result:", result)

				if (!result.success) {
					setErrorMessage(result.error as string)
				} else {
					// If login was successful and we have a redirect, go there
					if (redirectTo) {
						router.push(redirectTo)
					} else {
						router.push("/admin")
					}
				}
			} else {
				// Magic link login
				if (!email) {
					setErrorMessage("Please enter your email")
					setIsSubmitting(false)
					return
				}

				console.log("Attempting magic link login")
				const result = await sendMagicLink(email)
				console.log("Magic link result:", result)

				if (result.success) {
					setSuccessMessage(
						"Check your email for a magic link to sign in. You can close this page."
					)
				} else {
					setErrorMessage(result.error as string)
				}
			}
		} catch (error) {
			console.error("Unexpected error during login:", error)
			setErrorMessage(
				error instanceof Error
					? `Login error: ${error.message}`
					: "An unexpected error occurred. Please try again."
			)
		} finally {
			setIsSubmitting(false)
		}
	}

	// Handle switching between login methods
	const toggleAuthMethod = () => {
		setErrorMessage(null)
		setSuccessMessage(null)
		setAuthMethod(authMethod === "password" ? "magic" : "password")
	}

	// If a success message is shown, don't display the form
	if (successMessage) {
		return (
			<div className="rounded-md bg-[rgba(var(--color-green),0.1)] p-4 text-[rgba(var(--color-green),0.9)] border border-[rgba(var(--color-green),0.3)]">
				<p>{successMessage}</p>
			</div>
		)
	}

	// Don't allow form submission until auth is ready
	const isFormDisabled = loading || isSubmitting || !authReady

	return (
		<form onSubmit={handleLogin} className="space-y-4">
			{!authReady && (
				<div className="text-amber-600 text-sm bg-amber-50 p-2 rounded border border-amber-200">
					Initializing authentication system...
				</div>
			)}

			{/* Email Field */}
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium mb-1 text-[rgba(var(--color-foreground),0.9)]"
				>
					Email
				</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					placeholder="you@example.com"
					className="w-full px-3 py-2 text-[rgba(var(--color-foreground),0.9)] border border-[rgba(var(--color-foreground),0.2)] rounded-md bg-[rgba(var(--color-background),0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.6)] focus:border-transparent"
					disabled={isFormDisabled}
					autoComplete="email"
					required
				/>
			</div>

			{/* Password Field - only shown for password login */}
			{authMethod === "password" && (
				<div>
					<label
						htmlFor="password"
						className="block text-sm font-medium mb-1 text-[rgba(var(--color-foreground),0.9)]"
					>
						Password
					</label>
					<input
						id="password"
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="••••••••"
						className="w-full px-3 py-2 text-[rgba(var(--color-foreground),0.9)] border border-[rgba(var(--color-foreground),0.2)] rounded-md bg-[rgba(var(--color-background),0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.6)] focus:border-transparent"
						disabled={isFormDisabled}
						autoComplete="current-password"
					/>
				</div>
			)}

			{/* Error message */}
			{errorMessage && (
				<div className="text-[rgba(var(--color-red),0.9)] text-sm bg-[rgba(var(--color-red),0.05)] p-2 rounded border border-[rgba(var(--color-red),0.2)]">
					{errorMessage}
				</div>
			)}

			{/* Login Button */}
			<button
				type="submit"
				className="w-full py-2 px-4 bg-[rgba(var(--color-violet),0.9)] hover:bg-[rgba(var(--color-violet),1)] text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(var(--color-violet),0.6)]"
				disabled={isFormDisabled}
			>
				{isSubmitting
					? "Processing..."
					: !authReady
					? "Initializing..."
					: authMethod === "password"
					? "Sign In"
					: "Send Magic Link"}
			</button>

			{/* Toggle between login methods */}
			<div className="text-center">
				<button
					type="button"
					onClick={toggleAuthMethod}
					className="text-sm text-[rgba(var(--color-violet),0.8)] hover:text-[rgba(var(--color-violet),1)] focus:outline-none"
					disabled={isFormDisabled}
				>
					{authMethod === "password"
						? "Sign in with a magic link instead"
						: "Sign in with password instead"}
				</button>
			</div>

			{/* Link to create account - note: this should be hidden for production */}
			<div className="border-t border-[rgba(var(--color-foreground),0.1)] pt-4 mt-6">
				<p className="text-sm text-[rgba(var(--color-foreground),0.7)] mb-2">
					Don't have an account yet?
				</p>
				<Link
					href={`/admin/register${redirectTo ? `?redirect=${redirectTo}` : ""}`}
					className="text-[rgba(var(--color-violet),0.8)] hover:text-[rgba(var(--color-violet),1)] text-sm"
				>
					Create an account
				</Link>
			</div>
		</form>
	)
}
