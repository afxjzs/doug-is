"use client"

/**
 * RegisterForm Component
 *
 * This component provides a form for user registration with basic validation.
 * Uses UNIFIED AUTHENTICATION SYSTEM.
 */

import { useState } from "react"
import { createClientClient } from "@/lib/supabase/client"

interface FormData {
	email: string
	password: string
	confirmPassword: string
}

interface ValidationErrors {
	email?: string
	password?: string
	confirmPassword?: string
	general?: string
}

export default function RegisterForm() {
	const [formData, setFormData] = useState<FormData>({
		email: "",
		password: "",
		confirmPassword: "",
	})
	const [errors, setErrors] = useState<ValidationErrors>({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [successMessage, setSuccessMessage] = useState("")

	// Create Supabase client using unified system
	const supabase = createClientClient()

	const validateForm = (): ValidationErrors => {
		const newErrors: ValidationErrors = {}

		// Email validation
		if (!formData.email) {
			newErrors.email = "Email is required"
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = "Email is invalid"
		}

		// Password validation
		if (!formData.password) {
			newErrors.password = "Password is required"
		} else if (formData.password.length < 6) {
			newErrors.password = "Password must be at least 6 characters"
		}

		// Confirm password validation
		if (!formData.confirmPassword) {
			newErrors.confirmPassword = "Confirm password is required"
		} else if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Passwords do not match"
		}

		return newErrors
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setErrors({})
		setSuccessMessage("")

		// Validate form
		const validationErrors = validateForm()
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors)
			return
		}

		setIsSubmitting(true)

		try {
			console.log("🔄 Registration attempt:", formData.email)

			const { data, error } = await supabase.auth.signUp({
				email: formData.email,
				password: formData.password,
				options: {
					emailRedirectTo: `${window.location.origin}/api/auth/callback`,
				},
			})

			if (error) {
				console.error("❌ Registration failed:", error.message)
				setErrors({ general: error.message })
			} else {
				console.log("✅ Registration successful")
				setSuccessMessage(
					"Registration successful! Please check your email to confirm your account."
				)
				// Clear form
				setFormData({
					email: "",
					password: "",
					confirmPassword: "",
				})
			}
		} catch (error) {
			console.error("❌ Registration error:", error)
			setErrors({
				general:
					error instanceof Error
						? error.message
						: "An unexpected error occurred",
			})
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target
		setFormData((prev) => ({ ...prev, [name]: value }))
		// Clear error for this field when user starts typing
		if (errors[name as keyof ValidationErrors]) {
			setErrors((prev) => ({ ...prev, [name]: undefined }))
		}
	}

	// If registration was successful, show success message
	if (successMessage) {
		return (
			<div className="rounded-md bg-[rgba(var(--color-green),0.1)] p-4 text-[rgba(var(--color-green),0.9)] border border-[rgba(var(--color-green),0.3)]">
				<p>{successMessage}</p>
			</div>
		)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{errors.general && (
				<div className="text-red-200 text-sm bg-red-900/30 p-4 rounded border border-red-700/50">
					<p className="font-medium text-red-100">Registration Error:</p>
					<p className="text-red-200">{errors.general}</p>
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
					name="email"
					type="email"
					value={formData.email}
					onChange={handleChange}
					className={`w-full p-2 border rounded-md bg-[rgba(var(--color-background),0.8)] text-[rgba(var(--color-foreground),0.9)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.6)] ${
						errors.email
							? "border-red-300 focus:ring-red-500"
							: "border-[rgba(var(--color-foreground),0.2)]"
					}`}
					disabled={isSubmitting}
				/>
				{errors.email && (
					<p className="text-red-300 text-sm mt-1">{errors.email}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="password"
					className="block text-[rgba(var(--color-foreground),0.9)] mb-2"
				>
					Password
				</label>
				<input
					id="password"
					name="password"
					type="password"
					value={formData.password}
					onChange={handleChange}
					className={`w-full p-2 border rounded-md bg-[rgba(var(--color-background),0.8)] text-[rgba(var(--color-foreground),0.9)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.6)] ${
						errors.password
							? "border-red-300 focus:ring-red-500"
							: "border-[rgba(var(--color-foreground),0.2)]"
					}`}
					disabled={isSubmitting}
				/>
				{errors.password && (
					<p className="text-red-300 text-sm mt-1">{errors.password}</p>
				)}
			</div>

			<div>
				<label
					htmlFor="confirmPassword"
					className="block text-[rgba(var(--color-foreground),0.9)] mb-2"
				>
					Confirm Password
				</label>
				<input
					id="confirmPassword"
					name="confirmPassword"
					type="password"
					value={formData.confirmPassword}
					onChange={handleChange}
					className={`w-full p-2 border rounded-md bg-[rgba(var(--color-background),0.8)] text-[rgba(var(--color-foreground),0.9)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--color-violet),0.6)] ${
						errors.confirmPassword
							? "border-red-300 focus:ring-red-500"
							: "border-[rgba(var(--color-foreground),0.2)]"
					}`}
					disabled={isSubmitting}
				/>
				{errors.confirmPassword && (
					<p className="text-red-300 text-sm mt-1">{errors.confirmPassword}</p>
				)}
			</div>

			<button
				type="submit"
				disabled={isSubmitting}
				className="w-full py-2 px-4 bg-[rgba(var(--color-violet),0.9)] hover:bg-[rgba(var(--color-violet),1)] text-white font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(var(--color-violet),0.6)] disabled:opacity-50"
			>
				{isSubmitting ? "Creating Account..." : "Create Account"}
			</button>
		</form>
	)
}
