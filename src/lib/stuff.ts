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
import { getSiteUrl } from "@/lib/utils/domain-detection"

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

export interface ThingMeta {
	slug: string
	title: string
	description: string
}

const FALLBACK_DESCRIPTION = "A standalone interactive page by Doug Rogers."

function metaFromHtml(slug: string, html: string): ThingMeta {
	return {
		slug,
		title: extract(html, /<title>([\s\S]*?)<\/title>/i) ?? prettifySlug(slug),
		description:
			extract(
				html,
				/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i
			) ?? FALLBACK_DESCRIPTION,
	}
}

// Title + description for one thing (used by the dynamic OG-image route).
export async function getThingMeta(slug: string): Promise<ThingMeta | null> {
	const html = await readThing(slug)
	return html === null ? null : metaFromHtml(slug, html)
}

function escapeAttr(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
}

// Icons reuse the same paths as the site's SocialIcons component.
const ICON_TWITTER = `<svg viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>`
const ICON_BLUESKY = `<svg viewBox="0 0 64 57"><path d="M13.873 3.805C21.21 9.332 29.103 20.537 32 26.55v15.882c0-.338-.13.044-.41.867-1.512 4.456-7.418 21.847-20.923 7.944-7.111-7.32-3.819-14.64 9.125-16.85-7.405 1.264-15.73-.825-18.014-9.015C1.12 23.022 0 8.51 0 6.55 0-3.268 8.579-.182 13.873 3.805ZM50.127 3.805C42.79 9.332 34.897 20.537 32 26.55v15.882c0-.338.13.044.41.867 1.512 4.456 7.418 21.847 20.923 7.944 7.111-7.32 3.819-14.64-9.125-16.85 7.405 1.264 15.73-.825 18.014-9.015C62.88 23.022 64 8.51 64 6.55c0-9.818-8.578-6.732-13.873-2.745Z"/></svg>`
const ICON_LINKEDIN = `<svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`

// Self-scoped so it can never collide with the hosted document's own CSS: every
// rule is namespaced under .dougis-stuff-nav, and we never style bare elements
// (a, body, nav, ...). The bar inherits the document's own background and text
// color so it blends into each page; the divider is a neutral gray that reads on
// both light and dark pages.
const NAV_STYLE = `<style id="dougis-stuff-nav-style">
.dougis-stuff-nav{position:sticky;top:0;z-index:2147483647;display:flex;flex-wrap:wrap;justify-content:space-between;
gap:10px 16px;align-items:center;margin:0;padding:11px 18px;width:100%;box-sizing:border-box;
background-color:inherit;color:inherit;border-bottom:1px solid rgba(128,128,128,.22);font-size:13px;line-height:1;
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.dougis-stuff-nav .dougis-stuff-links,.dougis-stuff-nav .dougis-stuff-share{display:flex;gap:14px;align-items:center}
.dougis-stuff-nav a{color:inherit;text-decoration:none;font-weight:600;letter-spacing:.01em;background:none;opacity:.7;display:inline-flex;align-items:center}
.dougis-stuff-nav a:hover{opacity:1}
.dougis-stuff-nav .dougis-stuff-links a:hover{text-decoration:underline}
.dougis-stuff-nav .dougis-sep{opacity:.3;font-weight:400}
.dougis-stuff-nav .dougis-copy{font:inherit;color:inherit;background:none;border:0;cursor:pointer;padding:0;opacity:.7;font-weight:600;letter-spacing:.01em}
.dougis-stuff-nav .dougis-copy:hover{opacity:1}
.dougis-stuff-nav svg{width:16px;height:16px;display:block;fill:currentColor}
</style>`

function buildSocialMeta(meta: ThingMeta, pageUrl: string, ogImage: string): string {
	const t = escapeAttr(meta.title)
	const d = escapeAttr(meta.description)
	return (
		`<meta property="og:type" content="article">` +
		`<meta property="og:site_name" content="doug.is">` +
		`<meta property="og:title" content="${t}">` +
		`<meta property="og:description" content="${d}">` +
		`<meta property="og:url" content="${escapeAttr(pageUrl)}">` +
		`<meta property="og:image" content="${escapeAttr(ogImage)}">` +
		`<meta property="og:image:width" content="1200">` +
		`<meta property="og:image:height" content="630">` +
		`<meta name="twitter:card" content="summary_large_image">` +
		`<meta name="twitter:title" content="${t}">` +
		`<meta name="twitter:description" content="${d}">` +
		`<meta name="twitter:image" content="${escapeAttr(ogImage)}">` +
		`<meta name="twitter:creator" content="@doug__is">`
	)
}

function buildNav(pageUrl: string, title: string): string {
	const tweet = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
		title
	)}&url=${encodeURIComponent(pageUrl)}`
	const bsky = `https://bsky.app/intent/compose?text=${encodeURIComponent(
		`${title} ${pageUrl}`
	)}`
	const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
		pageUrl
	)}`
	const copyScript =
		`<script>(function(){var b=document.querySelector('.dougis-stuff-nav .dougis-copy');` +
		`if(!b||!navigator.clipboard)return;b.addEventListener('click',function(){` +
		`navigator.clipboard.writeText(b.getAttribute('data-url')).then(function(){` +
		`var o=b.textContent;b.textContent='Copied!';setTimeout(function(){b.textContent=o;},1500);});});})();</script>`
	return (
		`<nav class="dougis-stuff-nav" role="navigation" aria-label="doug.is">` +
		`<span class="dougis-stuff-links">` +
		`<a href="/">← doug.is</a><span class="dougis-sep">/</span><a href="/building/stuff">All stuff</a>` +
		`</span>` +
		`<span class="dougis-stuff-share">` +
		`<button type="button" class="dougis-copy" data-url="${escapeAttr(
			pageUrl
		)}" aria-label="Copy link">Copy link</button>` +
		`<a class="dougis-share-link" href="${escapeAttr(
			tweet
		)}" target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter">${ICON_TWITTER}</a>` +
		`<a class="dougis-share-link" href="${escapeAttr(
			bsky
		)}" target="_blank" rel="noopener noreferrer" aria-label="Share on Bluesky">${ICON_BLUESKY}</a>` +
		`<a class="dougis-share-link" href="${escapeAttr(
			linkedin
		)}" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">${ICON_LINKEDIN}</a>` +
		`</span></nav>${copyScript}`
	)
}

/**
 * Decorates a hosted standalone document for serving: injects the scoped style
 * and (unless the file already declares its own og:title) auto-generated
 * OpenGraph/Twitter meta into <head>, and the in-style back-nav + share bar as
 * the first child of <body>. Everything is derived from the document itself, so
 * the whole pipeline runs with zero per-file work — drop a file in and it gets
 * the nav, social cards, and share buttons automatically.
 */
export function decorateThing(html: string, slug: string): string {
	const meta = metaFromHtml(slug, html)
	const origin = getSiteUrl().replace(/\/$/, "")
	const pageUrl = `${origin}/building/stuff/${slug}`
	const ogImage = `${pageUrl}/og`
	// Respect a file that manages its own social tags.
	const hasOwnSocial = /property=["']og:title["']/i.test(html)
	const head =
		NAV_STYLE + (hasOwnSocial ? "" : buildSocialMeta(meta, pageUrl, ogImage))
	const body = buildNav(pageUrl, meta.title)

	let out = html
	out = /<\/head>/i.test(out)
		? out.replace(/<\/head>/i, `${head}</head>`)
		: head + out
	out = /<body[^>]*>/i.test(out)
		? out.replace(/(<body[^>]*>)/i, `$1${body}`)
		: body + out
	return out
}
