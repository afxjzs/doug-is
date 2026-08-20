/**
 * Tests for the standalone "stuff" page decorator.
 *
 * These pages are served straight from a route handler and never enter the React
 * tree, so anything the rest of the site gets from a layout — analytics above all
 * — has to be injected here. A page that quietly stops reporting is the failure
 * these tests exist to catch.
 */
import { buildAnalytics, decorateThing } from "@/lib/stuff"

const PAGE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Test Thing</title>
<meta name="description" content="A test page." />
</head>
<body>
<h1>Hello</h1>
</body>
</html>`

const KEY = "phc_test_key_1234567890"

describe("buildAnalytics", () => {
	const original = { ...process.env }

	afterEach(() => {
		process.env = { ...original }
		jest.restoreAllMocks()
	})

	it("emits the PostHog loader and a pageview when a key is configured", () => {
		process.env.NEXT_PUBLIC_POSTHOG_KEY = KEY
		const out = buildAnalytics("my-slug")

		expect(out).toContain("<script id=\"dougis-stuff-analytics\">")
		expect(out).toContain("window.posthog")
		expect(out).toContain(`posthog.init("${KEY}"`)
		expect(out).toContain('posthog.capture("$pageview"')
	})

	it("tags the pageview with the slug so one-offs are distinguishable", () => {
		process.env.NEXT_PUBLIC_POSTHOG_KEY = KEY
		const out = buildAnalytics("patriots-man-coverage-chart")

		expect(out).toContain('"page_type":"stuff"')
		expect(out).toContain('"stuff_slug":"patriots-man-coverage-chart"')
	})

	it("mirrors the site's privacy settings", () => {
		process.env.NEXT_PUBLIC_POSTHOG_KEY = KEY
		const out = buildAnalytics("my-slug")

		expect(out).toContain('"disable_session_recording":true')
		expect(out).toContain('"respect_dnt":true')
		expect(out).toContain('"autocapture":false')
	})

	it("defaults to the US ingest host and honours an override", () => {
		process.env.NEXT_PUBLIC_POSTHOG_KEY = KEY
		delete process.env.NEXT_PUBLIC_POSTHOG_HOST
		expect(buildAnalytics("s")).toContain('"api_host":"https://us.i.posthog.com"')

		process.env.NEXT_PUBLIC_POSTHOG_HOST = "https://eu.i.posthog.com"
		expect(buildAnalytics("s")).toContain('"api_host":"https://eu.i.posthog.com"')
	})

	it("warns loudly and emits no script when the key is missing", () => {
		delete process.env.NEXT_PUBLIC_POSTHOG_KEY
		const warn = jest.spyOn(console, "warn").mockImplementation(() => {})

		const out = buildAnalytics("my-slug")

		expect(out).not.toContain("<script")
		expect(out).toContain("analytics disabled")
		expect(warn).toHaveBeenCalledWith(
			expect.stringContaining("NEXT_PUBLIC_POSTHOG_KEY is not set")
		)
	})
})

describe("decorateThing", () => {
	const original = { ...process.env }

	beforeEach(() => {
		process.env.NEXT_PUBLIC_POSTHOG_KEY = KEY
	})

	afterEach(() => {
		process.env = { ...original }
		jest.restoreAllMocks()
	})

	it("injects analytics into the head of a hosted page", () => {
		const out = decorateThing(PAGE, "test-thing")

		expect(out).toContain("dougis-stuff-analytics")
		expect(out.indexOf("dougis-stuff-analytics")).toBeLessThan(
			out.indexOf("</head>")
		)
	})

	it("injects analytics exactly once", () => {
		const out = decorateThing(PAGE, "test-thing")

		expect(out.match(/dougis-stuff-analytics/g)).toHaveLength(1)
		expect(out.match(/posthog\.init\(/g)).toHaveLength(1)
	})

	it("still injects the nav bar and social meta", () => {
		const out = decorateThing(PAGE, "test-thing")

		expect(out).toContain("dougis-stuff-nav")
		expect(out).toContain('property="og:title"')
	})

	it("keeps analytics on a page that manages its own social tags", () => {
		const own = PAGE.replace(
			"<title>Test Thing</title>",
			'<title>Test Thing</title><meta property="og:title" content="Mine" />'
		)
		const out = decorateThing(own, "test-thing")

		// Social meta is skipped, analytics is not.
		expect(out).toContain("dougis-stuff-analytics")
		expect(out.match(/property="og:title"/g)).toHaveLength(1)
	})

	it("leaves the hosted document's own markup intact", () => {
		const out = decorateThing(PAGE, "test-thing")

		expect(out).toContain("<h1>Hello</h1>")
		expect(out).toContain("<title>Test Thing</title>")
	})
})
