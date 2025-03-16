import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

// Initialize Supabase client with better error handling
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Check if required environment variables are available
const isMissingCredentials = !supabaseUrl || !supabaseKey

// Create Supabase client only if credentials are available
let supabase: ReturnType<typeof createClient> | null = null
try {
	if (!isMissingCredentials) {
		supabase = createClient(supabaseUrl, supabaseKey)
	}
} catch (error) {
	console.error("Failed to initialize Supabase client:", error)
}

export async function POST(request: Request) {
	try {
		// Parse request body
		const body = await request.json()
		const { name, email, subject, message } = body

		// Validate required fields
		if (!name || !email || !subject || !message) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			)
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ message: "Invalid email format" },
				{ status: 400 }
			)
		}

		// Check if Supabase client is available
		if (isMissingCredentials || !supabase) {
			console.error(
				"Supabase client not initialized. Missing credentials or initialization failed."
			)

			// For development, we can still return a success response
			if (process.env.NODE_ENV === "development") {
				console.log(
					"Development mode: Simulating successful message submission"
				)
				console.log("Message details:", { name, email, subject, message })
				return NextResponse.json(
					{
						message:
							"Message received (development mode - not stored in database)",
						id: "dev-mode-id",
					},
					{ status: 200 }
				)
			}

			return NextResponse.json(
				{
					message:
						"Server configuration error. Please try again later or contact the administrator.",
				},
				{ status: 500 }
			)
		}

		// Store message in Supabase
		const { data, error } = await supabase
			.from("contact_messages")
			.insert([{ name, email, subject, message }])
			.select()

		if (error) {
			console.error("Supabase error:", error)
			return NextResponse.json(
				{ message: "Failed to store message: " + error.message },
				{ status: 500 }
			)
		}

		return NextResponse.json(
			{ message: "Message sent successfully", id: data?.[0]?.id },
			{ status: 200 }
		)
	} catch (error) {
		console.error("Server error:", error)
		return NextResponse.json(
			{
				message:
					"Internal server error: " +
					(error instanceof Error ? error.message : "Unknown error"),
			},
			{ status: 500 }
		)
	}
}
