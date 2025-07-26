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
 * ERROR HANDLING: Comprehensive token refresh error handling with exponential backoff
 */

import { useState, useEffect, useCallback, useRef } from "react"
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

// Token refresh error handling configuration
const TOKEN_REFRESH_CONFIG = {
	maxRetries: 3,
	baseDelay: 1000, // 1 second
	maxDelay: 30000, // 30 seconds
	backoffMultiplier: 2,
}

interface AuthState {
	user: User | null
	// SECURITY FIX: Removed session to eliminate getSession() warnings
	loading: boolean
	initialized: boolean
	// SECURITY FIX: Removed isAdmin to prevent client-side admin state exposure
	error: string | null
	retryCount: number
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
	clearError: () => void
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
 * Exponential backoff delay calculation
 */
function calculateBackoffDelay(attempt: number): number {
	const delay =
		TOKEN_REFRESH_CONFIG.baseDelay *
		Math.pow(TOKEN_REFRESH_CONFIG.backoffMultiplier, attempt)
	return Math.min(delay, TOKEN_REFRESH_CONFIG.maxDelay)
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
	const [error, setError] = useState<string | null>(null)
	const [retryCount, setRetryCount] = useState(0)
	const router = useRouter()

	// Refs for managing concurrent operations and cleanup
	const isMountedRef = useRef(true)
	const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const authOperationRef = useRef<Promise<any> | null>(null)

	// Create Supabase client
	const supabase = createBrowserSupabaseClient()

	// SECURITY FIX: Removed client-side isAdmin calculation to prevent vulnerability
	// Admin checks should only happen server-side for security

	/**
	 * Secure token refresh with exponential backoff
	 */
	const refreshTokenWithBackoff = useCallback(
		async (
			attempt: number = 0
		): Promise<{ user: User | null; error: string | null }> => {
			try {
				console.log(
					`🔄 Token refresh attempt ${attempt + 1}/${
						TOKEN_REFRESH_CONFIG.maxRetries + 1
					}`
				)

				// Use SECURE getUser() instead of insecure getSession()
				const {
					data: { user: currentUser },
					error: userError,
				} = await supabase.auth.getUser()

				if (userError) {
					console.warn(
						`⚠️ Token refresh error (attempt ${attempt + 1}):`,
						userError.message
					)

					// Handle specific error types
					if (
						userError.message.includes("429") ||
						userError.message.includes("Too many requests")
					) {
						if (attempt < TOKEN_REFRESH_CONFIG.maxRetries) {
							const delay = calculateBackoffDelay(attempt)
							console.log(`⏳ Rate limited, retrying in ${delay}ms...`)

							// Schedule retry with exponential backoff
							await new Promise((resolve) => {
								retryTimeoutRef.current = setTimeout(resolve, delay)
							})

							return refreshTokenWithBackoff(attempt + 1)
						} else {
							console.error("❌ Max retry attempts reached for token refresh")
							return {
								user: null,
								error: "Rate limited - too many refresh attempts",
							}
						}
					} else if (
						userError.message.includes("401") ||
						userError.message.includes("Token expired")
					) {
						console.log("ℹ️ Token expired, user needs to re-authenticate")
						return { user: null, error: "Token expired - please log in again" }
					} else {
						// Network or other errors
						if (attempt < TOKEN_REFRESH_CONFIG.maxRetries) {
							const delay = calculateBackoffDelay(attempt)
							console.log(`⏳ Network error, retrying in ${delay}ms...`)

							await new Promise((resolve) => {
								retryTimeoutRef.current = setTimeout(resolve, delay)
							})

							return refreshTokenWithBackoff(attempt + 1)
						} else {
							console.error("❌ Max retry attempts reached for network errors")
							return {
								user: null,
								error: "Network error - please check your connection",
							}
						}
					}
				}

				// Success - return user
				return { user: currentUser, error: null }
			} catch (error) {
				console.error("❌ Unexpected error during token refresh:", error)
				return { user: null, error: "Unexpected error during authentication" }
			}
		},
		[supabase]
	)

	/**
	 * Clear error state
	 */
	const clearError = useCallback(() => {
		setError(null)
		setRetryCount(0)
	}, [])

	// Initialize authentication state
	useEffect(() => {
		let isMounted = true

		async function initializeAuth() {
			try {
				console.log("🔄 Initializing unified auth...")

				// Add timeout to prevent infinite loading
				const authPromise = refreshTokenWithBackoff()
				const timeoutPromise = new Promise((_, reject) =>
					setTimeout(() => reject(new Error("Auth timeout")), 10000)
				)

				const { user: currentUser, error: authError } = (await Promise.race([
					authPromise,
					timeoutPromise,
				])) as any

				if (!isMounted) return

				if (authError) {
					console.warn("⚠️ Auth initialization error:", authError)
					setUser(null)
					setError(authError)
					setRetryCount(0)
				} else if (currentUser) {
					console.log("✅ Authenticated user:", currentUser.email)
					setUser(currentUser)
					setError(null)
					setRetryCount(0)
				} else {
					console.log("ℹ️ No authenticated user")
					setUser(null)
					setError(null)
					setRetryCount(0)
				}
			} catch (error) {
				console.error("❌ Auth initialization error:", error)
				if (isMounted) {
					setUser(null)
					setError("Authentication initialization failed")
					setRetryCount(0)
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
		} = supabase.auth.onAuthStateChange(async (event, _session) => {
			if (!isMounted) return

			console.log("🔄 Auth state changed:", event)

			// SECURITY FIX: Don't trust session from event, validate securely instead
			if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
				console.log("✅ User signed in via state change - validating securely")

				// Use secure token refresh with backoff
				const { user: validatedUser, error: refreshError } =
					await refreshTokenWithBackoff()

				if (!isMounted) return

				if (!refreshError && validatedUser) {
					setUser(validatedUser)
					setError(null)
					setRetryCount(0)
				} else {
					setUser(null)
					setError(refreshError)
					setRetryCount(0)
				}
			} else if (event === "SIGNED_OUT") {
				console.log("ℹ️ User signed out via state change")
				setUser(null)
				setError(null)
				setRetryCount(0)
			}
		})

		return () => {
			console.log("🔄 Auth cleanup")
			isMounted = false
			if (retryTimeoutRef.current) {
				clearTimeout(retryTimeoutRef.current)
			}
			subscription.unsubscribe()
		}
	}, [supabase, router, refreshTokenWithBackoff])

	/**
	 * Login with email and password
	 */
	const loginWithEmail = useCallback(
		async (email: string, password: string) => {
			console.log("🔑 Login attempt:", email)
			setLoading(true)
			setError(null)

			// Prevent concurrent login operations
			if (authOperationRef.current) {
				return { success: false, error: "Login operation already in progress" }
			}

			try {
				authOperationRef.current = supabase.auth.signInWithPassword({
					email,
					password,
				})

				const { data, error } = await authOperationRef.current

				if (error) {
					console.error("❌ Login failed:", error.message)
					setError(error.message)
					return { success: false, error: error.message }
				}

				console.log("✅ Login successful:", data.user?.email)
				setError(null)
				return { success: true }
			} catch (error) {
				console.error("❌ Login error:", error)
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error"
				setError(errorMessage)
				return { success: false, error: errorMessage }
			} finally {
				authOperationRef.current = null
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
			setError(null)

			// Prevent concurrent magic link operations
			if (authOperationRef.current) {
				return {
					success: false,
					error: "Magic link operation already in progress",
				}
			}

			try {
				authOperationRef.current = supabase.auth.signInWithOtp({
					email,
					options: {
						emailRedirectTo: `${window.location.origin}/api/auth/callback`,
					},
				})

				const { error } = await authOperationRef.current

				if (error) {
					console.error("❌ Magic link failed:", error.message)
					setError(error.message)
					return { success: false, error: error.message }
				}

				console.log("✅ Magic link sent successfully")
				setError(null)
				return { success: true }
			} catch (error) {
				console.error("❌ Magic link error:", error)
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error"
				setError(errorMessage)
				return { success: false, error: errorMessage }
			} finally {
				authOperationRef.current = null
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
		setLoading(true)
		setError(null)

		// Prevent concurrent logout operations
		if (authOperationRef.current) {
			return { success: false, error: "Logout operation already in progress" }
		}

		try {
			// Clear local state immediately
			setUser(null)
			// SECURITY FIX: Removed session clearing

			authOperationRef.current = supabase.auth.signOut({
				scope: "global", // Sign out from all sessions
			})

			const { error } = await authOperationRef.current

			// Refresh router state on auth changes
			if (error) {
				console.error("❌ Logout failed:", error.message)
				setError(error.message)
				return { success: false, error: error.message }
			}

			console.log("✅ Logout successful")
			setError(null)
			return { success: true }
		} catch (error) {
			console.error("❌ Logout error:", error)
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error"
			setError(errorMessage)
			return { success: false, error: errorMessage }
		} finally {
			authOperationRef.current = null
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
		error,
		retryCount,
		// Actions
		loginWithEmail,
		sendMagicLink,
		logout,
		clearError,
	}
}
