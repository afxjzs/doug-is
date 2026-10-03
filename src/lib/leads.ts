import { createServiceRoleClient } from "@/lib/supabase/server"

/**
 * Lead capture shared by /api/mvp-lead and /api/automation-lead.
 *
 * Saving is the part that must not fail quietly: saveLead() reports failure
 * and the route returns an error, never a fake success. A Telegram failure
 * doesn't lose the lead (it's already in the admin inbox), so notifyTelegram()
 * logs an error and lets the request succeed.
 */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const SAVE_FAILED_MESSAGE =
	"Something went wrong saving your info. Please try again, or reach me at doug.is/connecting."

export function clean(value: unknown): string {
	return typeof value === "string" ? value.trim() : ""
}

interface LeadRow {
	name: string
	email: string
	subject: string
	message: string
}

/** Writes the lead to contact_messages. Returns false (and logs why) on any failure. */
export async function saveLead(row: LeadRow, label: string): Promise<boolean> {
	try {
		const supabase = createServiceRoleClient()
		const { error } = await supabase.from("contact_messages").insert([row])
		if (error) {
			console.error(`Failed to save ${label}:`, JSON.stringify(error))
			return false
		}
		return true
	} catch (error) {
		console.error(`${label} could not reach Supabase:`, error)
		return false
	}
}

/**
 * Sends `lines` to Doug's Telegram as plain text. Plain on purpose: with
 * parse_mode Markdown, a stray * or _ in a visitor's text makes Telegram
 * reject the whole message.
 */
export async function notifyTelegram(lines: (string | null)[], label: string) {
	const botToken = process.env.TELEGRAM_BOT_TOKEN
	const chatId = process.env.TELEGRAM_CHAT_ID
	if (!botToken || !chatId) {
		console.error(
			`Telegram not configured (TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID); ${label} saved but no notification sent`
		)
		return
	}

	const text = [
		...lines,
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
			console.error(`Telegram rejected ${label} notification:`, res.status, await res.text())
		}
	} catch (error) {
		console.error(`Telegram request failed for ${label}:`, error)
	}
}
