import { test, expect } from "@playwright/test"
import { createClient } from "@supabase/supabase-js"
import { execSync } from "node:child_process"

/**
 * ADMIN GATE vs. RSC NAVIGATION REQUESTS
 *
 * Client-side navigation asks the server for an RSC payload and sends a
 * Next-Router-State-Tree header saying which layouts it already has mounted.
 * Next skips rendering those layouts. A client can forge that header to claim
 * the (protected) gate layout is mounted, so a gate that lives only in the
 * layout never runs. Every gated page must refuse to send admin data to an
 * anonymous request of any shape.
 *
 * Needs ./start.sh and local Supabase (supabase start). Run:
 *   npx playwright test e2e-tests/admin-gate-rsc.spec.ts --project=chromium
 */

function localSupabase() {
	const env = Object.fromEntries(
		execSync("supabase status -o env", { encoding: "utf8" })
			.split("\n")
			.map((line) => line.match(/^([A-Z_]+)="(.*)"$/))
			.filter((m): m is RegExpMatchArray => m !== null)
			.map((m) => [m[1], m[2]])
	)
	if (!env.API_URL || !env.SERVICE_ROLE_KEY) {
		throw new Error("supabase status gave no API_URL/SERVICE_ROLE_KEY; is local Supabase running?")
	}
	return createClient(env.API_URL, env.SERVICE_ROLE_KEY)
}

// Router state claiming /admin/(protected) is already mounted on the client.
const FORGED_STATE = encodeURIComponent(
	JSON.stringify([
		"",
		{ children: ["admin", { children: ["(protected)", { children: ["__PAGE__", {}] }] }] },
		null,
		null,
		true,
	])
)

for (const path of ["/admin/contacts", "/admin", "/admin/posts"]) {
	test(`anonymous RSC request with forged router state gets no admin data from ${path}`, async ({
		request,
	}) => {
		const supabase = localSupabase()
		const marker = `rsc-gate-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
		const { data: lead, error } = await supabase
			.from("contact_messages")
			.insert({ name: marker, email: "rsc-gate@example.test", subject: marker, message: marker })
			.select()
			.single()
		if (error) throw new Error(`could not create test lead: ${error.message}`)
		const { data: draft, error: draftError } = await supabase
			.from("posts")
			.insert({ title: marker, slug: marker })
			.select()
			.single()
		if (draftError) throw new Error(`could not create test draft: ${draftError.message}`)

		try {
			const response = await request.get(path, {
				headers: { RSC: "1", "Next-Router-State-Tree": FORGED_STATE },
				maxRedirects: 0,
			})
			const body = await response.text()
			expect(body).not.toContain(marker)
		} finally {
			const del1 = await supabase.from("contact_messages").delete().eq("id", lead.id)
			const del2 = await supabase.from("posts").delete().eq("id", draft.id)
			if (del1.error || del2.error) {
				throw new Error(`cleanup failed: ${del1.error?.message ?? ""} ${del2.error?.message ?? ""}`)
			}
		}
	})
}
