#!/usr/bin/env node
/**
 * Capture a thumbnail for every standalone page in src/content/stuff/.
 *
 * The "stuff" index (/building/stuff) and the Stuff section on /building show a
 * real screenshot of each page. Those PNGs are committed to the repo rather than
 * generated at build time: Vercel's build container has no browser, and booting
 * one during `next build` would be slow and fragile.
 *
 * The cost of committing them is that a new .html file needs one extra step:
 *
 *     ./start.sh                 # in another terminal
 *     npm run stuff:shots        # then commit public/images/stuff/*.png
 *
 * Forgetting is survivable, not silent: src/lib/stuff.ts warns during the build
 * for every page missing a screenshot, and the card falls back to its generated
 * OG card so the grid never shows a hole.
 *
 * Usage:
 *   npm run stuff:shots                              # every page
 *   npm run stuff:shots -- nfl-doubleheaders-2026    # just these slugs
 *   npm run stuff:shots -- --base-url=http://localhost:3000
 */
import { promises as fs } from "node:fs"
import path from "node:path"
import process from "node:process"
import { chromium } from "@playwright/test"

const ROOT = path.resolve(import.meta.dirname, "..")
const STUFF_DIR = path.join(ROOT, "src", "content", "stuff")
const OUT_DIR = path.join(ROOT, "public", "images", "stuff")

// 8:5, matching the aspect ratio the cards reserve. Captured at 1x because the
// tiles render around 500px wide, so 1200px of source is already retina there.
const WIDTH = 1200
const HEIGHT = 750

const DEFAULT_BASE_URL = "http://localhost:3000"

function parseArgs(argv) {
	let baseUrl = process.env.STUFF_SHOTS_BASE_URL || DEFAULT_BASE_URL
	const only = []

	for (const arg of argv) {
		if (arg.startsWith("--base-url=")) {
			baseUrl = arg.slice("--base-url=".length)
		} else if (arg.startsWith("--")) {
			throw new Error(`Unknown flag: ${arg}`)
		} else {
			only.push(arg)
		}
	}

	return { baseUrl: baseUrl.replace(/\/$/, ""), only }
}

async function readSlugs() {
	const files = await fs.readdir(STUFF_DIR)
	return files
		.filter((file) => file.endsWith(".html"))
		.map((file) => file.replace(/\.html$/, ""))
		.sort()
}

async function assertServerIsUp(baseUrl) {
	let response
	try {
		response = await fetch(baseUrl, { signal: AbortSignal.timeout(10_000) })
	} catch (error) {
		throw new Error(
			`Could not reach ${baseUrl} (${error.message}).\n` +
				`Start the dev server first:  ./start.sh\n` +
				`Or point at another origin:  npm run stuff:shots -- --base-url=https://www.doug.is`
		)
	}
	if (!response.ok) {
		throw new Error(`${baseUrl} responded ${response.status}, expected a 2xx.`)
	}
}

async function launchBrowser() {
	try {
		return await chromium.launch()
	} catch (error) {
		throw new Error(
			`Could not launch Chromium (${error.message}).\n` +
				`Install the browser this project's Playwright expects:  npx playwright install chromium`
		)
	}
}

async function capture(context, baseUrl, slug) {
	const url = `${baseUrl}/building/stuff/${slug}`
	const page = await context.newPage()
	try {
		// A capture run must not show up as real traffic. Without this, every run
		// posts one $pageview per page and quietly inflates the numbers.
		await page.route(/posthog\.com/, (route) => route.abort())

		const response = await page.goto(url, {
			waitUntil: "networkidle",
			timeout: 30_000,
		})
		if (!response) throw new Error("no response")
		if (!response.ok()) throw new Error(`HTTP ${response.status()}`)

		// Webfonts land after load; screenshotting early bakes in the fallback face.
		await page.evaluate(() => document.fonts.ready)

		// The injected back-nav is site chrome, not part of the thing itself.
		await page.evaluate(() => {
			document.querySelector(".dougis-stuff-nav")?.remove()
		})

		const out = path.join(OUT_DIR, `${slug}.png`)
		await page.screenshot({ path: out, type: "png" })
		const { size } = await fs.stat(out)
		return { slug, ok: true, out, size }
	} catch (error) {
		return { slug, ok: false, error: error.message }
	} finally {
		await page.close()
	}
}

async function main() {
	const { baseUrl, only } = parseArgs(process.argv.slice(2))

	const all = await readSlugs()
	const slugs = only.length ? only : all

	const unknown = slugs.filter((slug) => !all.includes(slug))
	if (unknown.length) {
		throw new Error(
			`No such page in src/content/stuff/: ${unknown.join(", ")}\n` +
				`Available: ${all.join(", ")}`
		)
	}
	if (!slugs.length) {
		console.log("Nothing to capture — src/content/stuff/ has no .html files.")
		return
	}

	await assertServerIsUp(baseUrl)
	await fs.mkdir(OUT_DIR, { recursive: true })

	const browser = await launchBrowser()
	const context = await browser.newContext({
		viewport: { width: WIDTH, height: HEIGHT },
		deviceScaleFactor: 1,
	})

	const results = []
	try {
		for (const slug of slugs) {
			const result = await capture(context, baseUrl, slug)
			results.push(result)
			console.log(
				result.ok
					? `  ok    ${slug}  ->  ${path.relative(ROOT, result.out)} (${Math.round(result.size / 1024)} KB)`
					: `  FAIL  ${slug}  ->  ${result.error}`
			)
		}
	} finally {
		await context.close()
		await browser.close()
	}

	const failed = results.filter((r) => !r.ok)
	console.log(
		`\n${results.length - failed.length}/${results.length} captured from ${baseUrl}`
	)
	if (failed.length) {
		// Exit non-zero so a partial run can never read as a clean one.
		console.error(`${failed.length} failed: ${failed.map((r) => r.slug).join(", ")}`)
		process.exitCode = 1
	}
}

main().catch((error) => {
	console.error(`\n${error.message}`)
	process.exitCode = 1
})
