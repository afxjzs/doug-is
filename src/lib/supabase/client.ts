/**
 * Supabase Browser Client - Environment-Aware
 *
 * Automatically selects local or production database based on environment.
 * Creates a Supabase client for use in Client Components.
 * Uses the official @supabase/ssr package for proper SSR support.
 */

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "../types/supabase"
import { getDatabaseConfig, logEnvironmentConfig } from "./environment"

/**
 * Create a Supabase client for Client Components
 * Automatically selects local or production database
 */
export function createClient() {
	const config = getDatabaseConfig()

	// Log configuration in development
	if (process.env.NODE_ENV === "development") {
		logEnvironmentConfig()
	}

	return createBrowserClient<Database>(config.url, config.anonKey)
}

/**
 * Gets the current user from the client
 */
export async function getClientUser() {
	const supabase = createClient()
	const { data } = await supabase.auth.getUser()
	return data?.user || null
}

/**
 * Signs out the current user
 */
export async function signOut() {
	const supabase = createClient()
	return await supabase.auth.signOut()
}

/**
 * Uploads an image to Supabase Storage
 */
export async function uploadImage(file: File, bucket: string, path: string) {
	const supabase = createClient()

	const { data, error } = await supabase.storage
		.from(bucket)
		.upload(path, file, {
			cacheControl: "3600",
			upsert: true,
		})

	if (error) {
		console.error("Error uploading image:", error)
		throw error
	}

	return data
}

/**
 * Gets a public URL for an image from Supabase Storage
 */
export function getImageUrl(bucket: string, path: string) {
	const supabase = createClient()
	return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}
