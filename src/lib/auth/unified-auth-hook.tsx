"use client"

/**
 * Unified Authentication Hook
 *
 * Consolidates multiple fragmented useAuth hooks into a single,
 * secure implementation following React 19 and Next.js 15 best practices.
 *
 * SECURITY: Uses secure authentication patterns
 * CONSISTENCY: Single authentication hook across the application
 * PERFORMANCE: Optimized for React 19 patterns
 */

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import type { User, Session } from "@supabase/supabase-js"
import { createBrowserSupabaseClient, ADMIN_EMAILS } from "./unified-auth"

interface AuthState {
	user: User | null
	session: Session | null
	loading: boolean
	initialized: boolean
	isAdmin: boolean
}

interface AuthActions {
	loginWithEmail: (
		email: string,
		password: string
	) => Promise<{ success: boolean; error?: string }>
	sendMagicLink: (
		email: string
	) => Promise<{ success: boolean; error?: string }>
	logout: () => Promise<{ success: boolean; error?: string }>
}

/**
 * Unified Authentication Hook
 * Replaces all fragmented useAuth implementations
 */
export function useAuth(): AuthState & AuthActions {
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [loading, setLoading] = useState(true)
	const [initialized, setInitialized] = useState(false)
	const router = useRouter()

	// Create Supabase client
	const supabase = createBrowserSupabaseClient()

	// Determine if user is admin
	const isAdmin = user?.email
		? ADMIN_EMAILS.includes(
				user.email.toLowerCase() as (typeof ADMIN_EMAILS)[number]
		  )
		: false

	// Initialize authentication state
	useEffect(() => {
		let isMounted = true

		async function initializeAuth() {
			try {
				console.log("🔄 Initializing unified auth...")

				// Use SECURE getUser() instead of insecure getSession()
				const {
					data: { user: currentUser },
					error: userError,
				} = await supabase.auth.getUser()

				if (userError) {
					console.warn("⚠️ User validation error:", userError.message)
					if (isMounted) {
						setUser(null)
						setSession(null)
					}
				} else if (currentUser) {
					console.log("✅ Authenticated user:", currentUser.email)

					// Get session for additional metadata
					const {
						data: { session: currentSession },
						error: sessionError,
					} = await supabase.auth.getSession()

					if (isMounted) {
						setUser(currentUser)
						setSession(sessionError ? null : currentSession)
					}
				} else {
					console.log("ℹ️ No authenticated user")
					if (isMounted) {
						setUser(null)
						setSession(null)
					}
				}
			} catch (error) {
				console.error("❌ Auth initialization error:", error)
				if (isMounted) {
					setUser(null)
					setSession(null)
				}
			} finally {
				if (isMounted) {
					setLoading(false)
					setInitialized(true)
					console.log("✅ Auth initialization complete")
				}
			}
		}

		// Initialize authentication
		initializeAuth()

		// Set up auth state change listener
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, currentSession) => {
			console.log("🔔 Auth state changed:", event)

			if (isMounted) {
				if (currentSession?.user) {
					// Validate user with secure method
					const {
						data: { user: validatedUser },
						error,
					} = await supabase.auth.getUser()

					if (!error && validatedUser) {
						setUser(validatedUser)
						setSession(currentSession)
					} else {
						setUser(null)
						setSession(null)
					}
				} else {
					setUser(null)
					setSession(null)
				}

				// Refresh router state on auth changes
				if (
					event === "SIGNED_IN" ||
					event === "SIGNED_OUT" ||
					event === "TOKEN_REFRESHED"
				) {
					router.refresh()
				}
			}
		})

		return () => {
			console.log("🔄 Auth cleanup")
			isMounted = false
			subscription.unsubscribe()
		}
	}, [supabase, router])

	/**
	 * Login with email and password
	 */
	const loginWithEmail = useCallback(
		async (email: string, password: string) => {
			console.log("🔑 Login attempt:", email)
			setLoading(true)

			try {
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				})

				if (error) {
					console.error("❌ Login failed:", error.message)
					return { success: false, error: error.message }
				}

				console.log("✅ Login successful:", data.user?.email)
				return { success: true }
			} catch (error) {
				console.error("❌ Login error:", error)
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

	/**
	 * Send magic link
	 */
	const sendMagicLink = useCallback(
		async (email: string) => {
			console.log("✉️ Sending magic link to:", email)
			setLoading(true)

			try {
				const { error } = await supabase.auth.signInWithOtp({
					email,
					options: {
						emailRedirectTo: `${window.location.origin}/api/auth/callback`,
					},
				})

				if (error) {
					console.error("❌ Magic link failed:", error.message)
					return { success: false, error: error.message }
				}

				console.log("✅ Magic link sent successfully")
				return { success: true }
			} catch (error) {
				console.error("❌ Magic link error:", error)
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

	/**
	 * Logout - Uses server-side logout route for consistency
	 */
	const logout = useCallback(async () => {
		console.log("🚪 Logout initiated")
		setLoading(true)

		try {
			// Clear local state first
			setUser(null)
			setSession(null)

			// Use server-side logout route for consistent behavior
			const baseUrl =
				process.env.NEXT_PUBLIC_SITE_URL ||
				(process.env.NODE_ENV === "production"
					? "https://www.doug.is"
					: "http://localhost:3000")

			// Redirect to server logout route
			window.location.href = `${baseUrl}/logout`

			return { success: true }
		} catch (error) {
			console.error("❌ Logout error:", error)
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			}
		} finally {
			setLoading(false)
		}
	}, [])

	return {
		// State
		user,
		session,
		loading,
		initialized,
		isAdmin,
		// Actions
		loginWithEmail,
		sendMagicLink,
		logout,
	}
}
