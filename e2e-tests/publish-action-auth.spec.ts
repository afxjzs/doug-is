import { test, expect } from "@playwright/test"
import { createClient } from "@supabase/supabase-js"
import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"

/**
 * PUBLISH ACTION AUTH
 *
 * Server Actions are public POST endpoints: anyone holding an action's ID can
 * call it directly, without ever loading the admin page that renders the
 * button. The admin layout's redirect doesn't stop that, because Next runs
 * the action before it renders the page. So the publish action itself must
 * refuse callers who aren't admins, and a draft must stay a draft.
 *
 * Needs ./start.sh and local Supabase (supabase start). Run:
 *   npx playwright test e2e-tests/publish-action-auth.spec.ts --project=chromium
 */

const PAGE_USING_ACTION = "/admin/posts/00000000-0000-0000-0000-000000000000/preview"

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

// Test-only: the action ID comes from the dev server's manifest, which stands
// in for the ID an attacker would lift from the admin page's client bundle.
function actionId(exportedName: string): string {
	const manifest = JSON.parse(readFileSync(".next/server/server-reference-manifest.json", "utf8"))
	const entry = Object.entries(manifest.node).find(
		([, v]) => (v as { exportedName?: string }).exportedName === exportedName
	)
	if (!entry) throw new Error(`no server action named ${exportedName} in the dev manifest`)
	return entry[0]
}

test("an anonymous caller cannot publish a draft through the publish action", async ({
	request,
}) => {
	const supabase = localSupabase()
	const { data: draft, error } = await supabase
		.from("posts")
		.insert({ title: "E2E draft (publish auth)", slug: `e2e-publish-auth-${Date.now()}` })
		.select()
		.single()
	if (error) throw new Error(`could not create draft: ${error.message}`)

	try {
		// Compile the page so the action is registered with the dev server.
		await request.get(PAGE_USING_ACTION, { maxRedirects: 0 })

		await request.post(PAGE_USING_ACTION, {
			headers: { "Next-Action": actionId("publishPost"), "Content-Type": "text/plain;charset=UTF-8" },
			data: JSON.stringify([draft.id]),
			maxRedirects: 0,
		})

		const { data: after, error: readError } = await supabase
			.from("posts")
			.select("published_at")
			.eq("id", draft.id)
			.single()
		if (readError) throw new Error(`could not re-read draft: ${readError.message}`)
		expect(after.published_at).toBeNull()
	} finally {
		const { error: deleteError } = await supabase.from("posts").delete().eq("id", draft.id)
		if (deleteError) throw new Error(`could not delete test draft: ${deleteError.message}`)
	}
})
