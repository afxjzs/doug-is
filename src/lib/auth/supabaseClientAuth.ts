"use client"

/**
 * This file contains client-side utilities for Supabase authentication.
 * It provides hooks and functions for login, logout, and session management.
 */

import { createBrowserClient } from "@supabase/ssr"
import { useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import type { Database } from "../types/supabase"
import type { User, Session } from "@supabase/supabase-js"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// This is for UI display only - actual access control happens on the server
// Keep in sync with the server-side ALLOWED_ADMIN_EMAILS list
const ALLOWED_ADMIN_EMAILS = ["douglas.rogers@gmail.com"]

/**
 * Creates a Supabase client for client-side authentication
 */
export function createSupabaseClient() {
	return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

/**
 * Custom hook to handle user authentication
 * Returns functions for login, logout, and the current user
 */
export function useAuth() {
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [loading, setLoading] = useState(false)
	const [initialized, setInitialized] = useState(false)
	const router = useRouter()
	const supabase = createSupabaseClient()

	// Load user on mount
	useEffect(() => {
		let isMounted = true

		async function loadUserData() {
			try {
				// First, try to get the session to see if we're already logged in
				const { data: sessionData, error: sessionError } =
					await supabase.auth.getSession()

				if (sessionError) {
					console.error("Error getting session:", sessionError)
					if (isMounted) {
						setSession(null)
						setUser(null)
					}
				} else if (sessionData.session) {
					if (isMounted) setSession(sessionData.session)

					// Only try to get user if we have a session to avoid AuthSessionMissingError
					try {
						const { data: userData, error: userError } =
							await supabase.auth.getUser()

						if (userError) {
							console.error("Error getting user:", userError)
							if (isMounted) setUser(null)
						} else if (userData.user) {
							if (isMounted) setUser(userData.user)
						}
					} catch (userFetchError) {
						console.error("Failed to fetch user details:", userFetchError)
						if (isMounted) setUser(null)
					}
				} else {
					// No session, so no user
					if (isMounted) {
						setSession(null)
						setUser(null)
					}
				}
			} catch (error) {
				console.error("Error in auth loading:", error)
				if (isMounted) {
					setUser(null)
					setSession(null)
				}
			} finally {
				if (isMounted) setInitialized(true)
			}
		}

		// Initial data load
		loadUserData()

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, newSession) => {
			console.log("Auth state changed:", event, !!newSession)

			if (isMounted) setSession(newSession)

			// Only try to get user if we have a session to avoid AuthSessionMissingError
			if (newSession) {
				try {
					const { data, error } = await supabase.auth.getUser()
					if (error) {
						console.error("Error getting user after auth change:", error)
						if (isMounted) setUser(null)
					} else if (data.user) {
						if (isMounted) setUser(data.user)
					}
				} catch (e) {
					console.error("Failed to fetch user after auth change:", e)
					if (isMounted) setUser(null)
				}
			} else {
				if (isMounted) setUser(null)
			}

			// Refresh server-side data related to authenticated state
			router.refresh()
		})

		// Clean up subscription
		return () => {
			isMounted = false
			subscription.unsubscribe()
		}
	}, [supabase, router])

	/**
	 * Handles login with email and password
	 */
	const loginWithEmail = useCallback(
		async (email: string, password: string) => {
			console.log("Starting loginWithEmail", { email })
			setLoading(true)
			try {
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				})

				console.log("Login response:", { success: !error, data, error })

				if (error) {
					throw error
				}

				// Don't trigger router refresh here - let the component handle redirection
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

	/**
	 * Handles login with magic link
	 */
	const sendMagicLink = useCallback(
		async (email: string) => {
			console.log("Starting sendMagicLink", { email })
			setLoading(true)
			try {
				const { data, error } = await supabase.auth.signInWithOtp({
					email,
					options: {
						emailRedirectTo: `${window.location.origin}/api/auth/callback`,
					},
				})

				console.log("Magic link response:", { success: !error, data, error })

				if (error) {
					throw error
				}

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

	/**
	 * Handles user logout
	 */
	const logout = useCallback(async () => {
		setLoading(true)
		try {
			// Clear local state first
			setUser(null)
			setSession(null)

			// Sign out from Supabase
			const { error } = await supabase.auth.signOut({
				scope: "global", // Sign out from all tabs/windows
			})

			if (error) {
				console.error("Logout error:", error)
				return { success: false, error: error.message }
			}

			// Force cleanup of all cookies
			document.cookie =
				"sb-access-token=; Max-Age=0; path=/; domain=" +
				window.location.hostname
			document.cookie =
				"sb-refresh-token=; Max-Age=0; path=/; domain=" +
				window.location.hostname

			// Force a hard reload to clear any client-side state
			// This will trigger middleware to handle the redirect
			window.location.href = "/admin/login"

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

	// Determine if the user is an admin based on their email
	const isAdmin = user?.email
		? ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())
		: false

	return {
		user,
		session,
		loading,
		initialized,
		isAdmin,
		loginWithEmail,
		sendMagicLink,
		logout,
	}
}
