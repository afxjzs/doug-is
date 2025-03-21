"use client"

/**
 * This component provides a registration form for creating an admin account.
 * It allows creating only a specific admin account and should be protected.
 */

import { useState } from "react"
import { createSupabaseClient } from "@/lib/auth/supabaseClientAuth"
import Link from "next/link"

// The allowed admin email address
const ADMIN_EMAIL = "douglas.rogers@gmail.com"

interface RegisterFormProps {
	redirectTo?: string | undefined
}

export default function RegisterForm({ redirectTo }: RegisterFormProps) {
	const [email, setEmail] = useState(ADMIN_EMAIL)
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [loading, setLoading] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)
	const [successMessage, setSuccessMessage] = useState<string | null>(null)

	// Prevent using any email other than the pre-approved admin email
	const isCorrectEmail = email.toLowerCase() === ADMIN_EMAIL.toLowerCase()

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault()
		setErrorMessage(null)

		// Validation checks
		if (!isCorrectEmail) {
			setErrorMessage(
				`Only the admin email ${ADMIN_EMAIL} is allowed to register`
			)
			return
		}

		if (!password) {
			setErrorMessage("Please enter a password")
			return
		}

		if (password.length < 8) {
			setErrorMessage("Password must be at least 8 characters long")
			return
		}

		if (password !== confirmPassword) {
			setErrorMessage("Passwords do not match")
			return
		}

		setLoading(true)

		try {
			const supabase = createSupabaseClient()

			// Register the user
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/api/auth/callback`,
				},
			})

			if (error) {
				throw error
			}

			// Show success message
			setSuccessMessage(
				"Account created! Please check your email to confirm your account."
			)
		} catch (error) {
			console.error("Registration error:", error)
			setErrorMessage(
				error instanceof Error ? error.message : "An unexpected error occurred"
			)
		} finally {
			setLoading(false)
		}
	}

	// If success message is shown, don't show the form
	if (successMessage) {
		return (
			<div className="rounded-md bg-[rgba(var(--color-green),0.1)] p-4 text-[rgba(var(--color-green),0.9)] border border-[rgba(var(--color-green),0.3)]">
				<p>{successMessage}</p>
				<div className="mt-4">
					<Link
						href="/admin/login"
						className="inline-block px-4 py-2 text-sm bg-[rgba(var(--color-green),0.1)] border border-[rgba(var(--color-green),0.3)] rounded-md text-[rgba(var(--color-green),0.9)] hover:bg-[rgba(var(--color-green),0.2)] transition-colors"
					>
						Go to Login
					</Link>
				</div>
			</div>
		)
	}

	return (
		<form onSubmit={handleRegister} className="space-y-4">
			{/* Email Field */}
			<div>
				<label
					htmlFor="email"
					className="block text-sm font-medium mb-1 text-[rgba(var(--color-foreground),0.9)]"
				>
					Admin Email
				</label>
				<input
					id="email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className={`w-full px-3 py-2 border rounded-md bg-[rgba(var(--color-background),0.8)] focus:outline-none focus:ring-2 focus:border-transparent ${
						isCorrectEmail
							? "border-[rgba(var(--color-foreground),0.2)] text-[rgba(var(--color-foreground),0.9)] focus:ring-[rgba(var(--color-violet),0.6)]"
							: "border-[rgba(var(--color-red),0.3)] text-[rgba(var(--color-red),0.9)] focus:ring-[rgba(var(--color-red),0.6)]"
					}`}
					disabled={loading}
					autoComplete="email"
					required
				/>
				{!isCorrectEmail && (
					<p className="mt-1 text-xs text-[rgba(var(--color-red),0.9)]">
						Only {ADMIN_EMAIL} can register as admin
					</p>
				)}
			</div>

			{/* Password Field */}
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
					placeholder="Min. 8 characters"
					className="w-full px-3 py-2 text-[rgba(var(--color-foreground),0.9)] border border-[rgba(var(--color-foreground),0.2)] rounded-md bg-[rgba(var(--color-background),0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.6)] focus:border-transparent"
					disabled={loading}
					autoComplete="new-password"
					required
					minLength={8}
				/>
			</div>

			{/* Confirm Password Field */}
			<div>
				<label
					htmlFor="confirmPassword"
					className="block text-sm font-medium mb-1 text-[rgba(var(--color-foreground),0.9)]"
				>
					Confirm Password
				</label>
				<input
					id="confirmPassword"
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
					placeholder="Confirm password"
					className="w-full px-3 py-2 text-[rgba(var(--color-foreground),0.9)] border border-[rgba(var(--color-foreground),0.2)] rounded-md bg-[rgba(var(--color-background),0.8)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.6)] focus:border-transparent"
					disabled={loading}
					autoComplete="new-password"
					required
				/>
			</div>

			{/* Error message */}
			{errorMessage && (
				<div className="text-[rgba(var(--color-red),0.9)] text-sm">
					{errorMessage}
				</div>
			)}

			{/* Register Button */}
			<button
				type="submit"
				className="w-full py-2 px-4 bg-[rgba(var(--color-violet),0.9)] hover:bg-[rgba(var(--color-violet),1)] text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(var(--color-violet),0.6)]"
				disabled={loading || !isCorrectEmail}
			>
				{loading ? "Creating Account..." : "Create Admin Account"}
			</button>
		</form>
	)
}
