import { NextResponse } from "next/server"
import { clean, EMAIL_RE, notifyTelegram, saveLead, SAVE_FAILED_MESSAGE } from "@/lib/leads"

/** Lead capture for /automating. See src/lib/leads.ts for the failure rules. */
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
	const context = clean(body.context)
	const problem = clean(body.problem)

	if (!name || !email || !problem) {
		return NextResponse.json(
			{ message: "Name, email, and what's eating your time are required" },
			{ status: 400 }
		)
	}
	if (!EMAIL_RE.test(email)) {
		return NextResponse.json({ message: "That email doesn't look right" }, { status: 400 })
	}

	const saved = await saveLead(
		{
			name,
			email,
			subject: `[Automation Lead] ${context || "unspecified"}`,
			message: `Phone: ${phone || "N/A"}\nFor: ${context || "N/A"}\n\n${problem}`,
		},
		"automation lead"
	)
	if (!saved) {
		return NextResponse.json({ message: SAVE_FAILED_MESSAGE }, { status: 500 })
	}

	await notifyTelegram(
		[
			"🤖 New automation lead",
			"",
			`Name: ${name}`,
			`Email: ${email}`,
			phone ? `Phone: ${phone}` : null,
			`For: ${context || "not given"}`,
			"",
			problem,
		],
		"automation lead"
	)

	return NextResponse.json({ message: "Lead submitted successfully" }, { status: 200 })
}
