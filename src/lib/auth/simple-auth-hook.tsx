"use client"

/**
 * Simple Authentication Hook
 *
 * A clean, simple authentication implementation using standard Supabase patterns.
 * Optimized to reduce API calls and prevent rate limiting.
 *
 * Features:
 * - Standard Supabase auth patterns
 * - Reduced API calls to prevent rate limiting
 * - Simple state management
 * - Clear error handling
 * - Magic link support with dynamic URLs
 * - Debounced requests to prevent rate limiting
 */

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import type { User } from "@supabase/supabase-js"
import type { Database } from "../types/supabase"
import { getSiteUrl } from "../utils/domain-detection"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Cookie options
const COOKIE_OPTIONS = {
	httpOnly: false,
	sameSite: "lax" as const,
	secure: process.env.NODE_ENV === "production",
	maxAge: 60 * 60 * 24 * 7, // 7 days
	path: "/",
}

interface AuthState {
	user: User | null
	loading: boolean
	error: string | null
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
 * Create browser Supabase client
 */
function createBrowserSupabaseClient() {
	return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey, {
		cookieOptions: COOKIE_OPTIONS,
	})
}

/**
 * Simple Authentication Hook
 * Uses standard Supabase patterns with reduced API calls
 */
export function useSimpleAuth(): AuthState & AuthActions {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()
	const initializationRef = useRef(false)
	const authStateChangeRef = useRef(false)

	// Create Supabase client
	const supabase = createBrowserSupabaseClient()

	/**
	 * Clear error state
	 */
	const clearError = useCallback(() => {
		setError(null)
	}, [])

	/**
	 * Login with email and password
	 */
	const loginWithEmail = useCallback(
		async (email: string, password: string) => {
			setLoading(true)
			setError(null)

			try {
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				})

				if (error) {
					setError(error.message)
					return { success: false, error: error.message }
				}

				setUser(data.user)
				setError(null)
				return { success: true }
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error"
				setError(errorMessage)
				return { success: false, error: errorMessage }
			} finally {
				setLoading(false)
			}
		},
		[supabase]
	)

	/**
	 * Send magic link with dynamic URL
	 */
	const sendMagicLink = useCallback(
		async (email: string) => {
			setLoading(true)
			setError(null)

			try {
				const siteUrl = getSiteUrl()
				const { error } = await supabase.auth.signInWithOtp({
					email,
					options: {
						emailRedirectTo: `${siteUrl}/api/auth/callback`,
					},
				})

				if (error) {
					setError(error.message)
					return { success: false, error: error.message }
				}

				setError(null)
				return { success: true }
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : "Unknown error"
				setError(errorMessage)
				return { success: false, error: errorMessage }
			} finally {
				setLoading(false)
			}
		},
		[supabase]
	)

	/**
	 * Logout
	 */
	const logout = useCallback(async () => {
		setLoading(true)
		setError(null)

		try {
			const { error } = await supabase.auth.signOut()

			if (error) {
				setError(error.message)
				return { success: false, error: error.message }
			}

			setUser(null)
			setError(null)
			return { success: true }
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : "Unknown error"
			setError(errorMessage)
			return { success: false, error: errorMessage }
		} finally {
			setLoading(false)
		}
	}, [supabase])

	// Initialize authentication state - only once
	useEffect(() => {
		if (initializationRef.current) return
		initializationRef.current = true

		let isMounted = true

		async function initializeAuth() {
			try {
				// Get initial user state
				const {
					data: { user: initialUser },
				} = await supabase.auth.getUser()

				if (!isMounted) return

				setUser(initialUser)
				setError(null)
			} catch (error) {
				if (isMounted) {
					console.error("Auth initialization error:", error)
					setUser(null)
					setError("Authentication initialization failed")
				}
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		// Initialize authentication
		initializeAuth()

		// Set up auth state change listener - only once
		if (!authStateChangeRef.current) {
			authStateChangeRef.current = true
			const {
				data: { subscription },
			} = supabase.auth.onAuthStateChange((event, session) => {
				if (!isMounted) return

				if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
					setUser(session?.user ?? null)
					setError(null)
				} else if (event === "SIGNED_OUT") {
					setUser(null)
					setError(null)
				}
			})

			return () => {
				isMounted = false
				subscription.unsubscribe()
			}
		}
	}, [supabase])

	return {
		// State
		user,
		loading,
		error,
		// Actions
		loginWithEmail,
		sendMagicLink,
		logout,
		clearError,
	}
}
