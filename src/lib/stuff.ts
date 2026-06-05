/**
 * "Stuff" — standalone, self-contained HTML one-offs hosted under
 * /building/stuff/<name>. Each file in src/content/stuff/<name>.html is served
 * as-is (its own <html>/<head>/<style>), with only a small self-scoped nav bar
 * injected so it stays layout-less but still links back to the site.
 *
 * Files live OUTSIDE public/ on purpose: they are served exclusively through the
 * static route handler (src/app/building/stuff/[name]/route.ts), so there is no
 * raw, nav-less backdoor URL. Both the route handler and the index page read
 * the directory at build time.
 */
import { promises as fs } from "fs"
import path from "path"

export const STUFF_DIR = path.join(process.cwd(), "src", "content", "stuff")

export interface Thing {
	slug: string
	title: string
	description: string | null
}

function extract(html: string, regex: RegExp): string | null {
	const match = html.match(regex)
	return match ? match[1].trim() : null
}

function prettifySlug(slug: string): string {
	return slug
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

async function readHtmlFilenames(): Promise<string[]> {
	try {
		const files = await fs.readdir(STUFF_DIR)
		return files.filter((file) => file.endsWith(".html"))
	} catch (error: unknown) {
		// Missing directory is a legitimate empty state. Anything else is a real
		// problem and must not be swallowed.
		if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return []
		throw error
	}
}

export async function getStuffSlugs(): Promise<string[]> {
	const files = await readHtmlFilenames()
	return files.map((file) => file.replace(/\.html$/, ""))
}

export async function listThings(): Promise<Thing[]> {
	const files = await readHtmlFilenames()
	const things = await Promise.all(
		files.map(async (file): Promise<Thing> => {
			const slug = file.replace(/\.html$/, "")
			const html = await fs.readFile(path.join(STUFF_DIR, file), "utf8")
			return {
				slug,
				title:
					extract(html, /<title>([\s\S]*?)<\/title>/i) ?? prettifySlug(slug),
				description: extract(
					html,
					/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i
				),
			}
		})
	)
	return things.sort((a, b) => a.title.localeCompare(b.title))
}

export async function readThing(slug: string): Promise<string | null> {
	// Only simple slugs — guards against path traversal even though the route is
	// statically generated from a fixed list.
	if (!/^[a-z0-9-]+$/i.test(slug)) return null
	try {
		return await fs.readFile(path.join(STUFF_DIR, `${slug}.html`), "utf8")
	} catch (error: unknown) {
		if ((error as NodeJS.ErrnoException)?.code === "ENOENT") return null
		throw error
	}
}

// Self-scoped so it can never collide with the hosted document's own CSS:
// every rule is namespaced under .dougis-stuff-nav, and we never style bare
// elements (a, body, nav, ...).
const NAV_STYLE = `<style id="dougis-stuff-nav-style">
.dougis-stuff-nav{position:sticky;top:0;z-index:2147483647;display:flex;gap:14px;align-items:center;
margin:0;padding:11px 18px;width:100%;box-sizing:border-box;background:#0b1020;
border-bottom:1px solid rgba(255,255,255,.14);font-size:13px;line-height:1;
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.dougis-stuff-nav a{color:#e6e9eb;text-decoration:none;font-weight:600;letter-spacing:.01em;background:none}
.dougis-stuff-nav a:hover{color:#fff;text-decoration:underline}
.dougis-stuff-nav span{color:rgba(255,255,255,.3);font-weight:400}
</style>`

const NAV_HTML = `<nav class="dougis-stuff-nav" role="navigation" aria-label="doug.is">
<a href="/">← doug.is</a><span>/</span><a href="/building/stuff">All stuff</a>
</nav>`

/**
 * Inserts the scoped style into <head> and the nav as the first child of <body>.
 * Falls back to prepending if the document lacks those tags.
 */
export function injectNav(html: string): string {
	let out = html
	out = /<\/head>/i.test(out)
		? out.replace(/<\/head>/i, `${NAV_STYLE}</head>`)
		: NAV_STYLE + out
	out = /<body[^>]*>/i.test(out)
		? out.replace(/(<body[^>]*>)/i, `$1${NAV_HTML}`)
		: NAV_HTML + out
	return out
}
