/**
 * Supabase Browser Client
 *
 * Creates a Supabase client for use in browser components.
 * Uses the official @supabase/ssr package for proper SSR support.
 */

import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "../types/supabase"

/**
 * Create a Supabase client for browser components
 * Following official Next.js Supabase patterns
 */
export function createClient() {
	return createBrowserClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				get(name: string) {
					if (typeof document === "undefined") {
						return undefined
					}
					try {
						return document.cookie
							.split("; ")
							.find((row) => row.startsWith(`${name}=`))
							?.split("=")[1]
					} catch (error) {
						return undefined
					}
				},
				set(name: string, value: string, options: any) {
					if (typeof document === "undefined") {
						return
					}
					try {
						document.cookie = `${name}=${value}; path=/; max-age=${
							options?.maxAge || 31536000
						}`
					} catch (error) {
						// Ignore cookie setting errors
					}
				},
				remove(name: string, options: any) {
					if (typeof document === "undefined") {
						return
					}
					try {
						document.cookie = `${name}=; path=/; max-age=0`
					} catch (error) {
						// Ignore cookie removal errors
					}
				},
			},
		}
	)
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
