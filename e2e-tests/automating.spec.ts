import { test, expect } from "@playwright/test"

/**
 * /automating landing page + the /building/mvp -> /building/mvps move.
 *
 * Run (with ./start.sh already running):
 *   npx playwright test e2e-tests/automating.spec.ts --project=chromium --reporter=list
 *
 * The lead form's POST is intercepted so a test run never writes a row to
 * Supabase or pings Telegram. The route itself is covered by
 * src/app/api/automation-lead/__tests__/route.test.ts.
 */

test.describe("/automating", () => {
	test("renders inside the site chrome with an active nav link", async ({ page }) => {
		const res = await page.goto("/automating")
		expect(res?.status()).toBe(200)
		await expect(page.locator("h1")).toBeVisible()
		await expect(
			page.getByRole("banner").getByRole("link", { name: "/automating" }).first()
		).toBeVisible()
		await expect(page).toHaveTitle("doug.is / Automating")
	})

	test("the cost calculator does the math from the visitor's numbers", async ({ page }) => {
		await page.goto("/automating")
		await page.getByLabel("Hours per week").fill("5")
		await page.getByLabel("People doing it").fill("2")
		await page.getByLabel("Cost per hour").fill("50")
		await page.getByLabel("Share I could automate").fill("50")

		// 5 h x 2 people x 52 weeks = 520 h/yr; x $50 = $26,000/yr; 50% = $13,000.
		const calc = page.getByRole("region", { name: "Cost calculator" })
		await expect(calc).toContainText("520 hours a year")
		await expect(calc).toContainText("$26,000 a year")
		await expect(calc).toContainText("$13,000 a year")

		// Payback only appears once the visitor types a build cost.
		await expect(calc).not.toContainText("pays for itself")
		await page.getByLabel("A build that costs").fill("3000")
		// $3,000 / ($13,000 / 52 weeks) = 12 weeks.
		await expect(calc).toContainText("pays for itself in about 12 weeks")
	})

	test("submitting the form sends the lead and opens the calendar", async ({ page }) => {
		let sent: Record<string, string> | null = null
		await page.route("**/api/automation-lead", async (route) => {
			sent = route.request().postDataJSON()
			await route.fulfill({ status: 200, json: { message: "ok" } })
		})

		await page.goto("/automating")
		await page.getByLabel("Your name").fill("Jane Smith")
		await page.getByLabel("Email").fill("jane@example.com")
		await page.getByLabel("Who's this for?").selectOption("business")
		await page.getByLabel("What's eating your time?").fill("Retyping invoices.")
		await page.getByRole("button", { name: /book/i }).click()

		await expect(page.getByText("Got it. Now pick a time")).toBeVisible()
		expect(sent).toMatchObject({
			name: "Jane Smith",
			email: "jane@example.com",
			context: "business",
			problem: "Retyping invoices.",
		})
	})

	test("a failed submission shows the server's error instead of a success", async ({ page }) => {
		await page.route("**/api/automation-lead", (route) =>
			route.fulfill({ status: 500, json: { message: "Something broke on my end." } })
		)

		await page.goto("/automating")
		await page.getByLabel("Your name").fill("Jane Smith")
		await page.getByLabel("Email").fill("jane@example.com")
		await page.getByLabel("Who's this for?").selectOption("just-me")
		await page.getByLabel("What's eating your time?").fill("Email.")
		await page.getByRole("button", { name: /book/i }).click()

		await expect(page.getByText("Something broke on my end.")).toBeVisible()
		await expect(page.getByText("Got it. Now pick a time")).toHaveCount(0)
	})
})

test.describe("/building/mvp moved to /building/mvps", () => {
	test("old URLs 301 to the new path, query string intact", async ({ request }) => {
		for (const [from, to] of [
			["/building/mvp", "/building/mvps"],
			["/building/mvp?utm_source=x", "/building/mvps?utm_source=x"],
		]) {
			const res = await request.get(from, { maxRedirects: 0 })
			expect(res.status()).toBe(301)
			const location = new URL(res.headers()["location"], "http://x")
			expect(location.pathname + location.search).toBe(to)
		}
	})

	test("the new path serves the MVP landing page", async ({ page }) => {
		const res = await page.goto("/building/mvps")
		expect(res?.status()).toBe(200)
		await expect(page.locator("h1")).toContainText("MVP")
	})
})
