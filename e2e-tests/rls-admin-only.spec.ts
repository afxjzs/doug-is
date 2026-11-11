import { test, expect } from "@playwright/test"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { execSync } from "node:child_process"

/**
 * DATABASE ACCESS RULES (RLS)
 *
 * The public anon key ships to every browser, so anyone can query Supabase
 * directly, bypassing the app. These tests pin who may do what at the database
 * itself:
 *   - anonymous: read published, already-live posts and migraine triggers;
 *     submit a contact message; nothing else.
 *   - any signed-in user who is not an admin: nothing beyond anonymous.
 *   - an admin (a user_roles row with role 'admin', which only the server can
 *     write): read leads and drafts, change posts.
 *
 * Needs local Supabase (supabase start) with migrations applied. Run:
 *   npx playwright test e2e-tests/rls-admin-only.spec.ts --project=chromium
 */

function localEnv() {
	const env = Object.fromEntries(
		execSync("supabase status -o env", { encoding: "utf8" })
			.split("\n")
			.map((line) => line.match(/^([A-Z_]+)="(.*)"$/))
			.filter((m): m is RegExpMatchArray => m !== null)
			.map((m) => [m[1], m[2]])
	)
	for (const key of ["API_URL", "ANON_KEY", "SERVICE_ROLE_KEY"]) {
		if (!env[key]) throw new Error(`supabase status gave no ${key}; is local Supabase running?`)
	}
	return env
}

const env = localEnv()
const service = createClient(env.API_URL, env.SERVICE_ROLE_KEY, { auth: { persistSession: false } })
const run = `rls-${Date.now()}`

function must<T>(result: { data: T; error: { message: string } | null }, what: string): T {
	if (result.error) throw new Error(`${what}: ${result.error.message}`)
	return result.data
}

async function signedInClient(email: string, password: string): Promise<SupabaseClient> {
	const client = createClient(env.API_URL, env.ANON_KEY, { auth: { persistSession: false } })
	must(await client.auth.signInWithPassword({ email, password }), `sign in ${email}`)
	return client
}

const anon = createClient(env.API_URL, env.ANON_KEY, { auth: { persistSession: false } })
let nonAdmin: SupabaseClient
let admin: SupabaseClient
const userIds: string[] = []
let leadId: string
let draftId: string
let publishedId: string
let scheduledId: string

test.beforeAll(async () => {
	const password = `pw-${run}-x9`
	const mk = async (label: string) => {
		const { user } = must(
			await service.auth.admin.createUser({ email: `${label}-${run}@example.test`, password, email_confirm: true }),
			`create ${label}`
		)
		userIds.push(user.id)
		return user
	}
	await mk("member")
	const adminUser = await mk("admin")
	must(await service.from("user_roles").insert({ user_id: adminUser.id, role: "admin" }), "seed admin role")
	nonAdmin = await signedInClient(`member-${run}@example.test`, password)
	admin = await signedInClient(`admin-${run}@example.test`, password)

	leadId = must(
		await service.from("contact_messages").insert({ name: run, email: "lead@example.test", subject: run, message: run }).select().single(),
		"seed lead"
	).id
	const future = new Date(Date.now() + 7 * 864e5).toISOString()
	const past = new Date(Date.now() - 864e5).toISOString()
	draftId = must(await service.from("posts").insert({ title: `${run} draft`, slug: `${run}-draft` }).select().single(), "seed draft").id
	publishedId = must(
		await service.from("posts").insert({ title: `${run} live`, slug: `${run}-live`, published_at: past, status: "published" }).select().single(),
		"seed published"
	).id
	scheduledId = must(
		await service.from("posts").insert({ title: `${run} scheduled`, slug: `${run}-scheduled`, published_at: future }).select().single(),
		"seed scheduled"
	).id
})

test.afterAll(async () => {
	const errors: string[] = []
	const del = async (p: PromiseLike<{ error: { message: string } | null }>) => {
		const { error } = await p
		if (error) errors.push(error.message)
	}
	await del(service.from("contact_messages").delete().like("subject", `${run}%`))
	await del(service.from("posts").delete().like("slug", `${run}%`))
	for (const id of userIds) {
		await del(service.from("user_roles").delete().eq("user_id", id))
		await del(service.auth.admin.deleteUser(id))
	}
	if (errors.length) throw new Error(`cleanup failed: ${errors.join("; ")}`)
})

async function postTitle(id: string) {
	return must(await service.from("posts").select("title").eq("id", id).single(), "re-read post").title
}

test.describe("anonymous", () => {
	test("can read a live published post", async () => {
		const { data } = await anon.from("posts").select("id").eq("id", publishedId)
		expect(data).toHaveLength(1)
	})

	test("cannot read a draft or a post scheduled for the future", async () => {
		const { data } = await anon.from("posts").select("id").in("id", [draftId, scheduledId])
		expect(data ?? []).toHaveLength(0)
	})

	test("cannot read leads", async () => {
		const { data } = await anon.from("contact_messages").select("id").eq("id", leadId)
		expect(data ?? []).toHaveLength(0)
	})

	test("cannot read user roles", async () => {
		const { data } = await anon.from("user_roles").select("user_id")
		expect(data ?? []).toHaveLength(0)
	})

	test("can still submit a contact message", async () => {
		const { error } = await anon
			.from("contact_messages")
			.insert({ name: "x", email: "anon@example.test", subject: `${run}-anon`, message: "hello there" })
		expect(error).toBeNull()
	})

	test("can still read migraine triggers", async () => {
		const { error } = await anon.from("migraine_triggers").select("id").limit(1)
		expect(error).toBeNull()
	})
})

test.describe("signed-in non-admin", () => {
	test("cannot read leads", async () => {
		const { data } = await nonAdmin.from("contact_messages").select("id").eq("id", leadId)
		expect(data ?? []).toHaveLength(0)
	})

	test("cannot read drafts", async () => {
		const { data } = await nonAdmin.from("posts").select("id").eq("id", draftId)
		expect(data ?? []).toHaveLength(0)
	})

	test("cannot change a published post", async () => {
		await nonAdmin.from("posts").update({ title: "defaced" }).eq("id", publishedId)
		expect(await postTitle(publishedId)).toBe(`${run} live`)
	})

	test("cannot delete a post", async () => {
		await nonAdmin.from("posts").delete().eq("id", publishedId)
		const { data } = await service.from("posts").select("id").eq("id", publishedId)
		expect(data).toHaveLength(1)
	})

	test("cannot make itself an admin", async () => {
		const me = must(await nonAdmin.auth.getUser(), "get member").user
		await nonAdmin.from("user_roles").insert({ user_id: me.id, role: "admin" })
		const { data } = await service.from("user_roles").select("id").eq("user_id", me.id)
		expect(data).toHaveLength(0)
	})

	test("cannot read other users' roles", async () => {
		const { data } = await nonAdmin.from("user_roles").select("user_id")
		expect(data ?? []).toHaveLength(0)
	})
})

test.describe("admin", () => {
	test("can read leads", async () => {
		const { data } = await admin.from("contact_messages").select("id").eq("id", leadId)
		expect(data).toHaveLength(1)
	})

	test("can read and change a draft", async () => {
		const { data } = await admin.from("posts").select("id").eq("id", draftId)
		expect(data).toHaveLength(1)
		const updated = must(await admin.from("posts").update({ title: `${run} draft edited` }).eq("id", draftId).select(), "admin update")
		expect(updated).toHaveLength(1)
		expect(await postTitle(draftId)).toBe(`${run} draft edited`)
	})
})
