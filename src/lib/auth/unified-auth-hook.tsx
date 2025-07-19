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
import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "../types/supabase"

// Admin emails - duplicated to avoid server import
const ADMIN_EMAILS = ["douglas.rogers@gmail.com"] as const

// Environment variables for client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cookie options for client
const COOKIE_OPTIONS = {
	httpOnly: false,
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	maxAge: 60 * 60 * 24 * 7, // 7 days
	path: "/",
}

interface AuthState {
	user: User | null
	// SECURITY FIX: Removed session to eliminate getSession() warnings
	loading: boolean
	initialized: boolean
	// SECURITY FIX: Removed isAdmin to prevent client-side admin state exposure
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
 * Browser Supabase Client - Client-side only
 */
function createBrowserSupabaseClient() {
	return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookieOptions: COOKIE_OPTIONS,
	})
}

/**
 * Unified Authentication Hook
 * Replaces all fragmented useAuth implementations
 */
export function useAuth(): AuthState & AuthActions {
	const [user, setUser] = useState<User | null>(null)
	// SECURITY FIX: Removed session state to eliminate getSession() warnings
	const [loading, setLoading] = useState(true)
	const [initialized, setInitialized] = useState(false)
	const router = useRouter()

	// Create Supabase client
	const supabase = createBrowserSupabaseClient()

	// SECURITY FIX: Removed client-side isAdmin calculation to prevent vulnerability
	// Admin checks should only happen server-side for security

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
						// SECURITY FIX: Removed session setting
					}
				} else if (currentUser) {
					console.log("✅ Authenticated user:", currentUser.email)

					// SECURITY FIX: Removed getSession() call to eliminate warnings
					if (isMounted) {
						setUser(currentUser)
						// SECURITY FIX: Removed session setting
					}
				} else {
					console.log("ℹ️ No authenticated user")
					if (isMounted) {
						setUser(null)
						// SECURITY FIX: Removed session setting
					}
				}
			} catch (error) {
				console.error("❌ Auth initialization error:", error)
				if (isMounted) {
					setUser(null)
					// SECURITY FIX: Removed session setting
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
			if (!isMounted) return

			console.log("🔄 Auth state changed:", event)
			if (currentSession?.user) {
				console.log("✅ User authenticated via state change")
				setUser(currentSession.user)
				// SECURITY FIX: Removed session setting
			} else {
				console.log("ℹ️ User logged out via state change")
				setUser(null)
				// SECURITY FIX: Removed session setting
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
		console.log("🚪 Logging out...")
		try {
			// Clear local state immediately
			setUser(null)
			// SECURITY FIX: Removed session clearing

			// Sign out from Supabase
			const { error } = await supabase.auth.signOut({
				scope: "global", // Sign out from all sessions
			})

			// Refresh router state on auth changes
			if (error) {
				console.error("❌ Logout failed:", error.message)
				return { success: false, error: error.message }
			}

			console.log("✅ Logout successful")
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
	}, [supabase])

	return {
		// State
		user,
		// SECURITY FIX: Removed session from return to eliminate getSession() warnings
		loading,
		initialized,
		// SECURITY FIX: Removed isAdmin from client-side return to prevent vulnerability
		// Actions
		loginWithEmail,
		sendMagicLink,
		logout,
	}
}
