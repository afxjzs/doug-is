import { NextResponse } from "next/server"
import { createServiceRoleClient } from "@/lib/supabase/server"

/**
 * Lead capture for /automating. Saves to contact_messages (shows up in the
 * admin inbox) and pings Telegram. Saving is the part that must not fail
 * quietly: if the row can't be written, the visitor gets an error, never a
 * fake success. A Telegram failure doesn't lose the lead (it's already in the
 * inbox), so it's logged as an error and the request still succeeds.
 */

interface AutomationLead {
	name: string
	email: string
	phone: string
	context: string
	problem: string
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(value: unknown): string {
	return typeof value === "string" ? value.trim() : ""
}

async function notifyTelegram(lead: AutomationLead) {
	const botToken = process.env.TELEGRAM_BOT_TOKEN
	const chatId = process.env.TELEGRAM_CHAT_ID
	if (!botToken || !chatId) {
		console.error(
			"Telegram not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID); automation lead saved but no notification sent"
		)
		return
	}

	// Plain text on purpose: with parse_mode Markdown, a stray * or _ in the
	// visitor's text makes Telegram reject the whole message.
	const text = [
		"🤖 New automation lead",
		"",
		`Name: ${lead.name}`,
		`Email: ${lead.email}`,
		lead.phone ? `Phone: ${lead.phone}` : null,
		`For: ${lead.context || "not given"}`,
		"",
		lead.problem,
		"",
		new Date().toLocaleString("en-US", { timeZone: "America/Chicago" }),
	]
		.filter((line) => line !== null)
		.join("\n")

	try {
		const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ chat_id: chatId, text }),
		})
		if (!res.ok) {
			console.error("Telegram rejected automation lead notification:", res.status, await res.text())
		}
	} catch (error) {
		console.error("Telegram request failed for automation lead:", error, lead.email)
	}
}

export async function POST(request: Request) {
	let body: Record<string, unknown>
	try {
		body = await request.json()
	} catch {
		return NextResponse.json({ message: "Request body must be JSON" }, { status: 400 })
	}

	const lead: AutomationLead = {
		name: clean(body.name),
		email: clean(body.email),
		phone: clean(body.phone),
		context: clean(body.context),
		problem: clean(body.problem),
	}

	if (!lead.name || !lead.email || !lead.problem) {
		return NextResponse.json(
			{ message: "Name, email, and what's eating your time are required" },
			{ status: 400 }
		)
	}
	if (!EMAIL_RE.test(lead.email)) {
		return NextResponse.json({ message: "That email doesn't look right" }, { status: 400 })
	}

	try {
		const supabase = createServiceRoleClient()
		const { error } = await supabase.from("contact_messages").insert([
			{
				name: lead.name,
				email: lead.email,
				subject: `[Automation Lead] ${lead.context || "unspecified"}`,
				message: `Phone: ${lead.phone || "N/A"}\nFor: ${lead.context || "N/A"}\n\n${lead.problem}`,
			},
		])
		if (error) {
			console.error("Failed to save automation lead:", JSON.stringify(error))
			return NextResponse.json(
				{ message: "Something went wrong saving your info. Please try again, or reach me at doug.is/connecting." },
				{ status: 500 }
			)
		}
	} catch (error) {
		console.error("Automation lead could not reach Supabase:", error)
		return NextResponse.json(
			{ message: "Something went wrong saving your info. Please try again, or reach me at doug.is/connecting." },
			{ status: 500 }
		)
	}

	await notifyTelegram(lead)

	return NextResponse.json({ message: "Lead submitted successfully" }, { status: 200 })
}
