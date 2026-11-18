import { test, expect, type APIRequestContext } from "@playwright/test"

/**
 * /building/stream-sniffer, including the Couch Director section.
 *
 * Run (with ./start.sh already running):
 *   npx playwright test e2e-tests/stream-sniffer.spec.ts --project=chromium --reporter=list
 *
 * Couch Director runs on Doug's home server and its repo is private, so the
 * page must never link the repo or show anything that locates that server.
 *
 * Internal links are checked in internal-links.spec.ts.
 *
 * The leak check reads the server-rendered HTML (what visitors and
 * crawlers get) rather than a live browser page. Against ./start.sh, the
 * browser intermittently logs "[Fast Refresh] rebuilding" and the DOM is
 * replaced mid-read (seen on 2026-11-11; trigger not pinned down), which made
 * one-shot reads of a live page flaky.
 */

const PATH = "/building/stream-sniffer"

/** The page's <main>, with <script> blocks (JSON-LD) removed. */
async function mainHtml(request: APIRequestContext): Promise<string> {
	const res = await request.get(PATH)
	expect(res.status()).toBe(200)
	const html = await res.text()
	const main = html.match(/<main[\s\S]*?<\/main>/)?.[0]
	expect(main, "page should render a <main>").toBeTruthy()
	return main!.replace(/<script[\s\S]*?<\/script>/g, "")
}

test.describe(PATH, () => {
	test("Couch Director has its own section, linkable at #couch-director", async ({ page }) => {
		const res = await page.goto(PATH)
		expect(res?.status()).toBe(200)
		const section = page.locator("#couch-director")
		await expect(section.getByRole("heading", { level: 2, name: /Couch Director/ })).toBeVisible()
		await expect(section).toContainText(/work in progress/i)
	})

	test("the page leaks no private repo or home-network details", async ({ request }) => {
		const main = await mainHtml(request)

		const hrefs = [...main.matchAll(/\bhref="([^"]*)"/g)].map((m) => m[1])
		expect(hrefs.filter((h) => /couch-director/i.test(h))).toEqual([])

		const text = main.replace(/<[^>]+>/g, " ")
		expect(text).toMatch(/Couch Director/) // guard: the checks below ran on real content
		expect(text).not.toMatch(/\b\d{1,3}(\.\d{1,3}){3}\b/) // IPv4 address
		expect(text).not.toMatch(/tailscale|\.ts\.net|\.local\b|\.lan\b/i)
		expect(text).not.toMatch(/[a-z0-9-]+:\d{2,5}\b/i) // host:port
	})
})
