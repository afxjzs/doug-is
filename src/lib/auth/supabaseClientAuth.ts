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
import { AuthChangeEvent } from "@supabase/supabase-js"
import { getSupabaseStorageKey } from "@/lib/auth/helpers"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Get cookie name from helpers
const STORAGE_KEY = getSupabaseStorageKey()

// List of allowed admin emails
export const ALLOWED_ADMIN_EMAILS = ["afxjzs@gmail.com", "doug@doug.is"].map(
	(email) => email.toLowerCase()
)

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

/**
 * Creates a Supabase client for client-side authentication
 */
export const createSupabaseClient = () => {
	if (!supabaseClient) {
		if (!supabaseUrl || !supabaseAnonKey) {
			throw new Error("Missing Supabase credentials")
		}

		console.log(
			"🔑 Creating new Supabase browser client with storage key:",
			STORAGE_KEY
		)

		// Create the browser client with correct settings
		supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
			auth: {
				autoRefreshToken: true,
				persistSession: true,
				detectSessionInUrl: true,
				flowType: "pkce",
				debug: true, // Always enable debug to troubleshoot
				storageKey: STORAGE_KEY, // Key for localStorage - MUST match server-side
			},
		})

		console.log("🔑 Supabase browser client created")
	}
	return supabaseClient
}

/**
 * Custom hook to handle user authentication
 * Returns functions for login, logout, and the current user
 */
export function useAuth() {
	const [user, setUser] = useState<User | null>(null)
	const [session, setSession] = useState<Session | null>(null)
	const [loading, setLoading] = useState(true)
	const [initialized, setInitialized] = useState(false)
	const router = useRouter()
	const supabase = createSupabaseClient()

	// Log tokens on start for debugging
	const logSessionInfo = useCallback(async () => {
		try {
			const { data, error } = await supabase.auth.getSession()
			console.log("📊 AUTH DEBUG - Session info:", {
				hasSession: !!data.session,
				userId: data.session?.user?.id || "none",
				email: data.session?.user?.email || "none",
				error: error?.message || "none",
				accessTokenLength: data.session?.access_token?.length || 0,
				refreshTokenLength: data.session?.refresh_token?.length || 0,
				expiresAt: data.session?.expires_at || "none",
				storageKey: STORAGE_KEY,
			})

			// Check localStorage for items
			console.log("📊 AUTH DEBUG - localStorage items:", {
				authToken: localStorage.getItem(STORAGE_KEY) ? "exists" : "missing",
			})

			// Check cookies
			console.log("📊 AUTH DEBUG - document.cookie:", document.cookie)
		} catch (e) {
			console.error("Error logging session info:", e)
		}
	}, [supabase])

	// Load user on mount
	useEffect(() => {
		let isMounted = true
		console.log("🔄 useAuth hook mounted")

		async function loadUserData() {
			try {
				console.log("🔍 Loading initial user data...")
				await logSessionInfo()

				// Get initial session
				const {
					data: { session: initialSession },
					error: sessionError,
				} = await supabase.auth.getSession()

				if (sessionError) {
					console.error("❌ Error getting initial session:", sessionError)
					if (isMounted) {
						setSession(null)
						setUser(null)
					}
				} else {
					console.log("✅ Initial session loaded:", {
						hasSession: !!initialSession,
						user: initialSession?.user?.email,
						expiresAt: initialSession?.expires_at
							? new Date(initialSession.expires_at * 1000).toISOString()
							: "none",
					})

					if (isMounted) {
						setSession(initialSession)
						if (initialSession?.user) {
							setUser(initialSession.user)
						}
					}
				}
			} catch (error) {
				console.error("❌ Error in initial auth loading:", error)
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

		// Load initial data
		loadUserData()

		// Set up auth state change listener
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			async (event: AuthChangeEvent, currentSession: Session | null) => {
				console.log("🔔 Auth state changed:", event, {
					hasSession: !!currentSession,
					user: currentSession?.user?.email,
					expiresAt: currentSession?.expires_at
						? new Date(currentSession.expires_at * 1000).toISOString()
						: "none",
				})

				// Log full auth state details for debugging
				await logSessionInfo()

				if (isMounted) {
					setSession(currentSession)
					setUser(currentSession?.user ?? null)

					// Hard refresh the page on certain auth events to ensure
					// server and client are in sync
					if (
						event === "SIGNED_IN" ||
						event === "SIGNED_OUT" ||
						event === "TOKEN_REFRESHED"
					) {
						router.refresh()
					}
				}
			}
		)

		return () => {
			console.log("🔄 useAuth hook cleanup")
			isMounted = false
			subscription.unsubscribe()
		}
	}, [supabase, router, logSessionInfo])

	/**
	 * Handles login with email and password
	 */
	const loginWithEmail = useCallback(
		async (email: string, password: string) => {
			console.log("🔑 Starting loginWithEmail", { email })
			setLoading(true)
			try {
				const { data, error } = await supabase.auth.signInWithPassword({
					email,
					password,
				})

				console.log("🔑 Login response:", {
					success: !error,
					hasSession: !!data.session,
					user: data.user?.email,
					userId: data.user?.id,
					expiresAt: data.session?.expires_at
						? new Date(data.session.expires_at * 1000).toISOString()
						: "none",
				})

				await logSessionInfo()

				if (error) {
					throw error
				}

				return { success: true, data }
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
		[supabase, logSessionInfo]
	)

	/**
	 * Handles login with magic link
	 */
	const sendMagicLink = useCallback(
		async (email: string) => {
			console.log("✉️ Starting sendMagicLink", { email })
			setLoading(true)
			try {
				const { data, error } = await supabase.auth.signInWithOtp({
					email,
					options: {
						emailRedirectTo: `${window.location.origin}/api/auth/callback`,
					},
				})

				console.log("✉️ Magic link response:", { success: !error, data, error })

				if (error) {
					throw error
				}

				return { success: true, data }
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
	 * Handles user logout
	 */
	const logout = useCallback(async () => {
		setLoading(true)
		try {
			console.log("🚪 Starting logout process")
			await logSessionInfo()

			// Clear local state first
			setUser(null)
			setSession(null)

			// Sign out from Supabase
			const { error } = await supabase.auth.signOut({
				scope: "global", // Sign out from all tabs/windows
			})

			if (error) {
				console.error("❌ Logout error:", error)
				return { success: false, error: error.message }
			}

			console.log("✅ Logout successful")

			// Force a hard reload to ensure we're completely signed out
			// This is more reliable than router.refresh() for auth state changes
			window.location.href = "/admin/login"

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
	}, [supabase, logSessionInfo])

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
		logSessionInfo,
	}
}
