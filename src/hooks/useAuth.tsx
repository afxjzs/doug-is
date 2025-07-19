"use client"

import { createClient, ALLOWED_ADMIN_EMAILS } from "@/lib/auth/supabase"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import { type User, type Session } from "@supabase/supabase-js"

/**
 * Custom hook for handling authentication in client components
 */
export function useAuth() {
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [loading, setLoading] = useState(true)
	const [initialized, setInitialized] = useState(false)
	const router = useRouter()
	const supabase = createClient()

	// Load user session on mount
	useEffect(() => {
		console.log("useAuth hook initializing...")
		let mounted = true

		async function getInitialSession() {
			try {
				console.log("Getting initial session...")
				setLoading(true)
				const {
					data: { session },
				} = await supabase.auth.getSession()

				console.log("Session response:", {
					exists: !!session,
					user: session?.user?.email ?? "none",
					expires: session?.expires_at
						? new Date(session.expires_at * 1000).toISOString()
						: "none",
				})

				if (mounted) {
					if (session) {
						console.log("Found initial session for", session.user.email)
						setSession(session)
						setUser(session.user)
					} else {
						console.log("No initial session found")
						setSession(null)
						setUser(null)
					}
					setInitialized(true)
				}
			} catch (error) {
				console.error("Error getting initial session:", error)
			} finally {
				if (mounted) {
					setLoading(false)
				}
			}
		}

		getInitialSession()

		// Set up auth state listener
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, currentSession) => {
			console.log("Auth state change event:", event)

			if (mounted) {
				setSession(currentSession)
				setUser(currentSession?.user ?? null)

				if (event === "SIGNED_IN") {
					console.log("User signed in:", currentSession?.user?.email)
					// Don't navigate automatically - let the component decide
				} else if (event === "SIGNED_OUT") {
					console.log("User signed out")
					// Don't navigate automatically - let the component decide
				}
			}
		})

		return () => {
			console.log("useAuth hook cleanup")
			mounted = false
			subscription.unsubscribe()
		}
	}, [supabase]) // Remove router dependency

	// Handle login with email and password
	const login = useCallback(
		async (email: string, password: string) => {
			setLoading(true)
			try {
				console.log(`Attempting to log in user: ${email}`)
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				})

				if (error) {
					console.error("Login failed:", error.message)
					throw error
				}

				console.log("Login successful for:", email)
				return { success: true, data }
			} catch (error) {
				console.error("Login error:", error)
				return {
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				}
			} finally {
				setLoading(false)
			}
		},
		[supabase]
	)

	// Handle login with magic link
	const sendMagicLink = useCallback(
		async (email: string) => {
			setLoading(true)
			try {
				console.log(`Sending magic link to: ${email}`)
				const { data, error } = await supabase.auth.signInWithOtp({
					email,
					options: {
						emailRedirectTo: `${window.location.origin}/api/auth/callback`,
					},
				})

				if (error) {
					console.error("Magic link failed:", error.message)
					throw error
				}

				console.log("Magic link sent successfully to:", email)
				return { success: true, data }
			} catch (error) {
				console.error("Magic link error:", error)
				return {
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				}
			} finally {
				setLoading(false)
			}
		},
		[supabase]
	)

	// Handle logout
	const logout = useCallback(async () => {
		setLoading(true)
		try {
			console.log("Logging out user")
			const { error } = await supabase.auth.signOut()
			if (error) {
				console.error("Logout failed:", error.message)
				throw error
			}

			console.log("Logout successful")

			// Determine redirect URL based on environment
			const baseUrl =
				process.env.NEXT_PUBLIC_SITE_URL ||
				(process.env.NODE_ENV === "production"
					? "https://www.doug.is"
					: "http://localhost:3000")

			// Force a hard reload to /admin/login using window.location
			// to ensure all state is cleared properly
			window.location.href = `${baseUrl}/admin/login`
			return { success: true }
		} catch (error) {
			console.error("Logout error:", error)
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			}
		} finally {
			setLoading(false)
		}
	}, [supabase])

	// Check if user is an admin
	const isAdmin = user?.email
		? ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())
		: false

	return {
		user,
		session,
		loading,
		initialized,
		isAdmin,
		login,
		sendMagicLink,
		logout,
	}
}
