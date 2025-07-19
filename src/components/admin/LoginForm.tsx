"use client"

/**
 * This component provides the login form for the admin area.
 * It includes both password and magic link authentication options.
 *
 * Uses UNIFIED AUTHENTICATION SYSTEM for consistency
 * SECURITY FIX: Removed client-side admin checks - admin verification happens server-side only
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
	} = useAuth()
	const router = useRouter()

	// Form state
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [authMethod, setAuthMethod] = useState<"password" | "magic">("password")
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)

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
		return (
			<div className="space-y-4">
				<div className="text-[rgba(var(--color-foreground),0.7)]">
					<p>Initializing unified authentication system...</p>
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
				<div className="text-red-600 text-sm bg-red-50 p-4 rounded border border-red-200">
					{errorMessage}
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
