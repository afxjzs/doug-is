import { test, expect } from "@playwright/test"

/**
 * ADMIN GATE
 *
 * The admin pages read private data (contact messages, drafts) with the
 * service-role client, so the only thing standing between them and the
 * public is the admin layout's auth check. These tests pin the requirement
 * from the outside: an anonymous request never gets an admin page, whatever
 * headers it sends, the login page stays reachable, and there is no public
 * registration or setup page.
 *
 * Run against a running ./start.sh:
 *   npx playwright test e2e-tests/admin-gate.spec.ts --project=chromium
 */

const PROTECTED_PATHS = ["/admin", "/admin/posts", "/admin/contacts", "/admin/posts/new"]

// Headers a client could send to try to convince the layout it is on a login page.
const SPOOFED_HEADERS: Record<string, string>[] = [
	{},
	{ "x-pathname": "/admin/login" },
	{ "x-pathname": "/admin/register" },
	{ "x-pathname": "/admin/setup" },
]

for (const path of PROTECTED_PATHS) {
	for (const headers of SPOOFED_HEADERS) {
		test(`anonymous ${path} with ${JSON.stringify(headers)} is sent to login`, async ({
			request,
		}) => {
			const response = await request.get(path, { headers, maxRedirects: 0 })

			expect(response.status()).toBe(307)
			expect(response.headers()["location"]).toMatch(/\/admin\/login/)
		})
	}
}

test("anonymous /admin/login renders without a session", async ({ request }) => {
	const response = await request.get("/admin/login", { maxRedirects: 0 })

	expect(response.status()).toBe(200)
})

// Admin accounts are created in the Supabase dashboard, never by the public,
// and no public page describes the admin account.
for (const path of ["/admin/register", "/admin/setup"]) {
	test(`there is no public ${path} page`, async ({ request }) => {
		const response = await request.get(path, { maxRedirects: 0 })

		expect(response.status()).toBe(404)
	})
}
