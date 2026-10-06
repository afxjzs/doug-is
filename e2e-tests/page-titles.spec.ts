import { test, expect, type APIRequestContext } from "@playwright/test"

/**
 * Every public page tells browsers, search engines, and link previews what it
 * is: its own <title> and og:title in the site format, a canonical URL and
 * og:url pointing at itself, and a preview image that loads. (Past bugs:
 * /advising, /building, /investing showed the root "doug.is..." title;
 * /writing previewed as the homepage; posts pointed at a missing image.)
 *
 * Format: "doug.is / Section" and "doug.is / section / Page Name".
 *
 * Needs ./start.sh and local Supabase with posts (supabase start).
 * Run: npx playwright test e2e-tests/page-titles.spec.ts --project=chromium --reporter=list
 */

interface Head {
	title?: string
	ogTitle?: string
	canonicalPath?: string
	ogUrlPath?: string
	ogImage?: string
}

function pathOf(url: string | undefined): string | undefined {
	return url === undefined ? undefined : new URL(url, "http://x").pathname
}

async function head(request: APIRequestContext, path: string): Promise<Head> {
	const res = await request.get(path)
	expect(res.status(), `${path} status`).toBe(200)
	const html = await res.text()
	const decode = (s?: string) => s?.replace(/&amp;/g, "&").replace(/&#x27;/g, "'").replace(/&quot;/g, '"')
	return {
		title: decode(html.match(/<title>([^<]*)<\/title>/)?.[1]),
		ogTitle: decode(html.match(/<meta property="og:title" content="([^"]*)"/)?.[1]),
		canonicalPath: pathOf(html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]),
		ogUrlPath: pathOf(html.match(/<meta property="og:url" content="([^"]*)"/)?.[1]),
		ogImage: decode(html.match(/<meta property="og:image" content="([^"]*)"/)?.[1]),
	}
}

async function expectHead(request: APIRequestContext, path: string, title: string, canonical = path) {
	const h = await head(request, path)
	expect(h.title, `${path} <title>`).toBe(title)
	expect(h.ogTitle, `${path} og:title`).toBe(title)
	expect(h.canonicalPath, `${path} canonical`).toBe(canonical)
	expect(h.ogUrlPath, `${path} og:url`).toBe(canonical)
	// Link previews need an image that actually loads.
	expect(h.ogImage, `${path} og:image`).toBeTruthy()
	const img = await request.get(h.ogImage!)
	expect(img.status(), `${path} og:image ${h.ogImage}`).toBe(200)
}

const STATIC_PAGES: [path: string, title: string][] = [
	["/", "doug.is | Engineer, Advisor, Investor"],
	["/advising", "doug.is / Advising"],
	["/automating", "doug.is / Automating"],
	["/building", "doug.is / Building"],
	["/connecting", "doug.is / Connecting"],
	["/hustling", "doug.is / Hustling"],
	["/investing", "doug.is / Investing"],
	["/writing", "doug.is / Writing"],
	["/building/mvps", "doug.is / building / MVPs"],
	["/building/bolt-form", "doug.is / building / Bolt Form"],
	["/building/goose-chase", "doug.is / building / Goose Chase"],
	["/building/hopping-list", "doug.is / building / Hopping List"],
	["/building/hopping-list/feedback", "doug.is / building / hopping-list / Feedback"],
	["/building/inn", "doug.is / building / Inn Ruby Gem"],
	["/building/just-ate", "doug.is / building / JustAte"],
	["/building/occupado", "doug.is / building / Occupado"],
	["/building/oil-price-ticker", "doug.is / building / Oil Price Ticker"],
	["/building/stream-sniffer", "doug.is / building / Stream Sniffer"],
	["/building/stuff", "doug.is / building / Stuff"],
	["/migraine-free", "doug.is / Migraine Trigger Foods Database (MTFDB)"],
	["/migraine-free/feedback", "doug.is / migraine-free / Feedback"],
	["/attributing", "doug.is / Attributions"],
	["/respecting-privacy", "doug.is / Privacy Policy"],
]

for (const [path, title] of STATIC_PAGES) {
	test(`${path} -> "${title}"`, async ({ request }) => {
		await expectHead(request, path, title)
	})
}

test.describe("writing", () => {
	let postPath: string
	let category: string
	let categoryName: string
	let postTitle: string

	test.beforeAll(async ({ browser }) => {
		const page = await browser.newPage()
		await page.goto("/writing")
		const href = await page.locator('a[href^="/writing/about/"]').first().getAttribute("href")
		expect(href, "need at least one published post locally (supabase start + reset script)").toBeTruthy()
		postPath = href!
		category = postPath.split("/")[3]
		categoryName = category
			.split("-")
			.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
			.join(" ")
		await page.goto(postPath)
		postTitle = (await page.locator("h1").first().textContent())!.trim()
		await page.close()
	})

	test("a post is titled after itself", async ({ request }) => {
		await expectHead(request, postPath, `doug.is / writing / ${postTitle}`)
	})

	test("a category page is titled after its category", async ({ request }) => {
		await expectHead(request, `/writing/about/${category}`, `doug.is / writing / ${categoryName}`)
	})

	test("the legacy category URL renders and points to the canonical one", async ({ request }) => {
		await expectHead(request, `/writing/${category}`, `doug.is / writing / ${categoryName}`, `/writing/about/${category}`)
	})

	test("the legacy post URL renders and points to the canonical one", async ({ request }) => {
		const slug = postPath.split("/")[4]
		await expectHead(request, `/writing/${category}/${slug}`, `doug.is / writing / ${postTitle}`, postPath)
	})
})
