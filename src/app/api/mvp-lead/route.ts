import { NextResponse } from "next/server"
import { clean, EMAIL_RE, notifyTelegram, saveLead, SAVE_FAILED_MESSAGE } from "@/lib/leads"

/** Lead capture for /building/mvps. See src/lib/leads.ts for the failure rules. */
export async function POST(request: Request) {
	let body: Record<string, unknown>
	try {
		body = await request.json()
	} catch {
		return NextResponse.json({ message: "Request body must be JSON" }, { status: 400 })
	}

	const name = clean(body.name)
	const email = clean(body.email)
	const phone = clean(body.phone)
	const idea = clean(body.idea)
	const stage = clean(body.stage)
	const variant = clean(body.variant) || "default"

	if (!name || !email || !idea || !stage) {
		return NextResponse.json(
			{ message: "Name, email, idea, and stage are required" },
			{ status: 400 }
		)
	}
	if (!EMAIL_RE.test(email)) {
		return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
	}

	const saved = await saveLead(
		{
			name,
			email,
			subject: `[MVP Lead] ${stage}`,
			message: `Phone: ${phone || "N/A"}\nStage: ${stage}\nVariant: ${variant}\n\nIdea: ${idea}`,
		},
		"MVP lead"
	)
	if (!saved) {
		return NextResponse.json({ message: SAVE_FAILED_MESSAGE }, { status: 500 })
	}

	await notifyTelegram(
		[
			"🚀 New MVP lead",
			"",
			`Name: ${name}`,
			`Email: ${email}`,
			phone ? `Phone: ${phone}` : null,
			`Stage: ${stage}`,
			`Variant: ${variant}`,
			"",
			`Idea: ${idea}`,
		],
		"MVP lead"
	)

	return NextResponse.json({ message: "Lead submitted successfully" }, { status: 200 })
}
