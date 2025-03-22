/**
 * Supabase client for client-side components
 * This file contains only client-side functionality - no server imports
 */

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "../types/supabase"

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

/**
 * Creates a Supabase client for client-side components
 */
export function createClientClient() {
	return createClientComponentClient<Database>({
		supabaseUrl,
		supabaseKey: supabaseAnonKey,
	})
}

/**
 * Gets the current user from the client
 */
export async function getClientUser() {
	const supabase = createClientClient()
	const { data } = await supabase.auth.getUser()
	return data?.user || null
}

/**
 * Signs out the current user
 */
export async function signOut() {
	const supabase = createClientClient()
	return await supabase.auth.signOut()
}

/**
 * Uploads an image to Supabase Storage
 */
export async function uploadImage(file: File, bucket: string, path: string) {
	const supabase = createClientClient()

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
	const supabase = createClientClient()
	return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl
}
