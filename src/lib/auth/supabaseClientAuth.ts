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
	const router = useRouter()
	const supabase = createSupabaseClient()

	// Load user on mount
	useEffect(() => {
		let isMounted = true

		async function loadUserData() {
			try {
				// Get authenticated user data directly from the auth server
				const { data: userData, error: userError } =
					await supabase.auth.getUser()

				if (userError) {
					console.error("Error getting user:", userError)
					if (isMounted) setUser(null)
				} else {
					if (isMounted) setUser(userData.user)
				}

				// Also get session for other auth operations that require it
				const { data: sessionData, error: sessionError } =
					await supabase.auth.getSession()

				if (sessionError) {
					console.error("Error getting session:", sessionError)
					if (isMounted) setSession(null)
				} else {
					if (isMounted) setSession(sessionData.session)
				}
			} catch (error) {
				console.error("Error in auth loading:", error)
				if (isMounted) {
					setUser(null)
					setSession(null)
				}
			}
		}

		// Initial data load
		loadUserData()

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (_event, newSession) => {
			if (isMounted) setSession(newSession)

			// Get the authenticated user directly instead of from session
			if (newSession) {
				const { data } = await supabase.auth.getUser()
				if (isMounted) setUser(data.user)
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

				// After successful login, force router refresh and redirect
				router.refresh()

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
		[supabase, router]
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
			const { error } = await supabase.auth.signOut()
			if (error) {
				console.error("Logout error:", error)
				return { success: false, error: error.message }
			}

			// After logout, force router refresh
			router.refresh()

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
	}, [supabase, router])

	// Determine if the user is an admin based on their email
	const isAdmin = user?.email
		? ALLOWED_ADMIN_EMAILS.includes(user.email.toLowerCase())
		: false

	return {
		user,
		session,
		loading,
		isAdmin,
		loginWithEmail,
		sendMagicLink,
		logout,
	}
}
