import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""

const isMissingCredentials = !supabaseUrl || !supabaseServiceKey

let supabase: ReturnType<typeof createClient> | null = null
try {
	if (!isMissingCredentials) {
		supabase = createClient(supabaseUrl, supabaseServiceKey)
	}
} catch (error) {
	console.error("Failed to initialize Supabase client:", error)
}

async function sendTelegramNotification(lead: {
	name: string
	email: string
	phone?: string
	idea: string
	stage: string
	variant: string
}) {
	const botToken = process.env.TELEGRAM_BOT_TOKEN
	const chatId = process.env.TELEGRAM_CHAT_ID

	if (!botToken || !chatId) {
		console.warn("Telegram credentials not configured, skipping notification")
		return
	}

	const message = [
		"🚀 *New MVP Lead!*",
		"",
		`*Name:* ${lead.name}`,
		`*Email:* ${lead.email}`,
		lead.phone ? `*Phone:* ${lead.phone}` : null,
		`*Stage:* ${lead.stage}`,
		`*Variant:* ${lead.variant}`,
		"",
		`*Idea:* ${lead.idea}`,
		"",
		`_${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}_`,
	]
		.filter(Boolean)
		.join("\n")

	try {
		const res = await fetch(
			`https://api.telegram.org/bot${botToken}/sendMessage`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					chat_id: chatId,
					text: message,
					parse_mode: "Markdown",
				}),
			}
		)

		if (!res.ok) {
			const errorBody = await res.text()
			console.error("Telegram API error:", res.status, errorBody)
		}
	} catch (error) {
		console.error("Failed to send Telegram notification:", error)
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json()
		const { name, email, phone, idea, stage, variant } = body

		// Validate required fields
		if (!name || !email || !idea || !stage) {
			return NextResponse.json(
				{ message: "Name, email, idea, and stage are required" },
				{ status: 400 }
			)
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ message: "Invalid email format" },
				{ status: 400 }
			)
		}

		// Store in Supabase
		if (isMissingCredentials || !supabase) {
			if (process.env.NODE_ENV === "development") {
				console.log("Dev mode: MVP lead received:", {
					name,
					email,
					phone,
					idea,
					stage,
					variant,
				})
			} else {
				console.error("Supabase not configured")
			}
		} else {
			const { error } = await supabase.from("contact_messages").insert([
				{
					name,
					email,
					subject: `[MVP Lead] ${stage}`,
					message: `Phone: ${phone || "N/A"}\nStage: ${stage}\nVariant: ${variant || "default"}\n\nIdea: ${idea}`,
				},
			])

			if (error) {
				console.error("Supabase error:", JSON.stringify(error))
				const userMessage = error.code === "23514"
					? "There was a validation issue. Please check your email and try again."
					: "Something went wrong saving your info. Please try again."
				return NextResponse.json(
					{ message: userMessage },
					{ status: 500 }
				)
			}
		}

		// Send Telegram notification (non-blocking)
		sendTelegramNotification({
			name,
			email,
			phone,
			idea,
			stage,
			variant: variant || "default",
		})

		return NextResponse.json(
			{ message: "Lead submitted successfully" },
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
