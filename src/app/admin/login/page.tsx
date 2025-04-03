"use client"

import { useState, FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/auth/supabase"

export default function LoginPage() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [method, setMethod] = useState<"password" | "magic">("password")
	const [message, setMessage] = useState<{
		text: string
		type: "error" | "success"
	} | null>(null)

	const router = useRouter()
	const searchParams = useSearchParams()
	const error = searchParams.get("error")
	const redirectTo = searchParams.get("redirect") || "/admin"

	// Show error from URL params
	if (error && !message) {
		setMessage({ text: decodeURIComponent(error), type: "error" })
	}

	const supabase = createClient()

	// Handle form submission
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setMessage(null)

		try {
			if (method === "password") {
				// Password login
				console.log(`Attempting password login for ${email}...`)
				const { error } = await supabase.auth.signInWithPassword({
					email,
					password,
				})

				if (error) {
					console.error("Login error:", error.message)
					throw error
				}

				setMessage({
					text: "Login successful! Redirecting...",
					type: "success",
				})

				// Force a hard reload to ensure the cookies are properly set
				window.location.href = redirectTo
			} else {
				// Magic link login
				console.log(`Sending magic link to ${email}...`)
				const { error } = await supabase.auth.signInWithOtp({
					email,
					options: {
						emailRedirectTo: `${window.location.origin}/api/auth/callback?redirect_to=${redirectTo}`,
					},
				})

				if (error) {
					console.error("Magic link error:", error.message)
					throw error
				}

				setMessage({
					text: "Check your email for the login link!",
					type: "success",
				})
			}
		} catch (error: any) {
			console.error("Authentication error:", error)
			setMessage({
				text: error?.message || "An unexpected error occurred",
				type: "error",
			})
		} finally {
			setIsLoading(false)
		}
	}

	const toggleMethod = () => {
		setMethod(method === "password" ? "magic" : "password")
		setMessage(null)
	}

	return (
		<div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
			<div className="w-full max-w-md space-y-8">
				<div className="text-center">
					<h1 className="text-4xl font-bold tracking-tight">Admin Login</h1>
					<p className="mt-2 text-gray-600">
						Sign in to access the admin dashboard
					</p>
				</div>

				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="space-y-4 rounded-md shadow-sm">
						<div>
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
								placeholder="Email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isLoading}
							/>
						</div>

						{method === "password" && (
							<div>
								<label htmlFor="password" className="sr-only">
									Password
								</label>
								<input
									id="password"
									name="password"
									type="password"
									autoComplete="current-password"
									required
									className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
									placeholder="Password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									disabled={isLoading}
								/>
							</div>
						)}
					</div>

					{message && (
						<div
							className={`text-center ${
								message.type === "error" ? "text-red-500" : "text-green-500"
							}`}
						>
							{message.text}
						</div>
					)}

					<div>
						<button
							type="submit"
							className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
							disabled={isLoading}
						>
							{isLoading ? (
								<span>Loading...</span>
							) : method === "password" ? (
								<span>Sign in</span>
							) : (
								<span>Send magic link</span>
							)}
						</button>
					</div>

					<div className="text-center">
						<button
							type="button"
							className="text-sm text-indigo-600 hover:text-indigo-500"
							onClick={toggleMethod}
							disabled={isLoading}
						>
							{method === "password"
								? "Don't remember password? Use magic link"
								: "Have a password? Sign in with password"}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
