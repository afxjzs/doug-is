import { test, expect } from "@playwright/test"

/**
 * Every internal link inside <main> on these pages must resolve.
 *
 * Run (with ./start.sh already running):
 *   npx playwright test e2e-tests/internal-links.spec.ts --project=chromium --reporter=list
 *
 * Past bug: the "reach out" links on both pages pointed at /contact, which is
 * a 404 (the contact page is /connecting).
 *
 * Reads the server-rendered HTML rather than a live browser page: against
 * ./start.sh the dev DOM is sometimes replaced mid-read (see
 * stream-sniffer.spec.ts), which made live-page reads flaky.
 */

const PAGES = ["/building/stream-sniffer", "/building/oil-price-ticker"]

for (const path of PAGES) {
	test(`every internal link on ${path} resolves`, async ({ request }) => {
		const res = await request.get(path)
		expect(res.status()).toBe(200)
		const main = (await res.text()).match(/<main[\s\S]*?<\/main>/)?.[0]
		expect(main, "page should render a <main>").toBeTruthy()

		const links = [
			...new Set([...main!.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)/g)].map((m) => m[1])),
		]
		expect(links.length).toBeGreaterThan(0)
		for (const link of links) {
			const linkRes = await request.get(link)
			expect(linkRes.status(), `${link} should resolve`).toBe(200)
		}
	})
}
