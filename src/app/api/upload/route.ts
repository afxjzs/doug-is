/**
 * API route for handling image uploads to Supabase Storage
 */

import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/serverClient"
import { getCurrentUser } from "@/lib/supabase/auth"
import { isAdminUser } from "@/lib/auth/helpers"
import { nanoid } from "nanoid"
import { cookies } from "next/headers"

// Set maximum upload size (10MB)
export const config = {
	api: {
		bodyParser: false,
		responseLimit: "10mb",
	},
}

// Bucket name to store images - USING THE EXISTING BUCKET
const BUCKET_NAME = "media"
const FOLDER_NAME = "posts"

export async function POST(request: NextRequest) {
	console.log("Upload API called")

	try {
		// Log the auth headers for debugging
		const authHeader = request.headers.get("authorization") || "none"
		const cookie = request.headers.get("cookie") || "none"
		console.log("Auth header present:", authHeader !== "none" ? "Yes" : "No")
		console.log("Cookie header present:", cookie !== "none" ? "Yes" : "No")
		console.log("Cookie contents:", cookie)

		// Get the current user and check permissions
		try {
			const user = await getCurrentUser()
			console.log(
				"Current user:",
				user ? `ID: ${user.id}, Email: ${user.email}` : "Not authenticated"
			)

			if (!user) {
				console.error("Upload failed: User not authenticated")
				return NextResponse.json(
					{ error: "You must be logged in to upload files" },
					{ status: 401 }
				)
			}

			if (!isAdminUser(user)) {
				console.error("Upload failed: User not an admin", user.email)
				return NextResponse.json(
					{ error: "Admin privileges required" },
					{ status: 403 }
				)
			}
		} catch (authError) {
			console.error("Authentication error:", authError)
			return NextResponse.json(
				{ error: "Authentication error" },
				{ status: 401 }
			)
		}

		// Only accept form data uploads
		const contentType = request.headers.get("content-type") || ""
		if (!contentType.includes("multipart/form-data")) {
			console.error("Upload failed: Invalid content type", contentType)
			return NextResponse.json(
				{ error: "Only multipart/form-data is supported" },
				{ status: 400 }
			)
		}

		// Parse the form data
		const formData = await request.formData()
		const file = formData.get("file") as File | null

		// Validate file
		if (!file) {
			console.error("Upload failed: No file provided")
			return NextResponse.json({ error: "No file provided" }, { status: 400 })
		}

		console.log(
			"File received:",
			file.name,
			file.type,
			`${(file.size / 1024).toFixed(1)}KB`
		)

		// Validate file size (max 10MB)
		const maxSize = 10 * 1024 * 1024 // 10MB
		if (file.size > maxSize) {
			console.error("Upload failed: File too large", file.size)
			return NextResponse.json(
				{ error: "File size exceeds 10MB limit" },
				{ status: 400 }
			)
		}

		// Validate file type
		const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
		if (!allowedTypes.includes(file.type)) {
			console.error("Upload failed: Invalid file type", file.type)
			return NextResponse.json(
				{ error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
				{ status: 400 }
			)
		}

		// Generate a unique filename to prevent collisions
		const fileExtension = file.name.split(".").pop()
		const fileName = `${nanoid()}.${fileExtension}`
		const filePath = `${FOLDER_NAME}/${fileName}`

		// Convert file to buffer
		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)

		console.log("Initializing Supabase client for storage upload")

		// Initialize Supabase client
		try {
			// Ensure we're using the admin client from serverClient
			console.log("Creating admin client for storage operations")
			const supabase = createAdminClient()

			if (!supabase) {
				throw new Error("Failed to initialize Supabase admin client")
			}

			// List available buckets for debugging
			console.log("Listing available storage buckets:")
			const { data: bucketList, error: listError } =
				await supabase.storage.listBuckets()

			if (listError) {
				console.error("Error listing buckets:", listError)
			} else {
				console.log(
					"Available buckets:",
					bucketList.map((b) => b.name).join(", ")
				)

				// Check if our target bucket exists
				const bucketExists = bucketList.some((b) => b.name === BUCKET_NAME)
				if (!bucketExists) {
					console.error(
						`⚠️ IMPORTANT: Bucket '${BUCKET_NAME}' does not exist in this Supabase project!`
					)
					console.error(
						`Please create it manually in the Supabase dashboard: Storage > New Bucket > '${BUCKET_NAME}'`
					)
					console.error(
						"Make sure to set it as public if you want the images to be publicly accessible"
					)

					return NextResponse.json(
						{
							error: "Storage bucket not configured",
							details: `The bucket '${BUCKET_NAME}' doesn't exist. Please create it in the Supabase dashboard.`,
						},
						{ status: 500 }
					)
				}

				console.log(`Found bucket '${BUCKET_NAME}', proceeding with upload`)
			}

			console.log(
				`Uploading file to Supabase Storage: ${BUCKET_NAME}/${filePath}`
			)

			// Upload file to Supabase Storage
			const { data, error } = await supabase.storage
				.from(BUCKET_NAME)
				.upload(filePath, buffer, {
					contentType: file.type,
					cacheControl: "3600",
					upsert: false,
				})

			if (error) {
				console.error("Error uploading file to Supabase:", error)
				return NextResponse.json(
					{ error: `Failed to upload file: ${error.message}` },
					{ status: 500 }
				)
			}

			console.log("File uploaded successfully:", data)

			// Get the public URL for the uploaded file
			const { data: publicUrl } = supabase.storage
				.from(BUCKET_NAME)
				.getPublicUrl(filePath)

			console.log("Public URL generated:", publicUrl.publicUrl)

			// Return the response with the URL
			return NextResponse.json({
				url: publicUrl.publicUrl,
				path: filePath,
				success: true,
			})
		} catch (storageError) {
			console.error("Supabase storage error:", storageError)
			return NextResponse.json(
				{
					error: "Storage service error",
					details:
						storageError instanceof Error
							? storageError.message
							: String(storageError),
				},
				{ status: 500 }
			)
		}
	} catch (error) {
		console.error("Unhandled error in upload API route:", error)
		return NextResponse.json(
			{
				error: "Internal server error",
				details: error instanceof Error ? error.message : String(error),
			},
			{ status: 500 }
		)
	}
}
