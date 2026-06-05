import { Metadata } from "next"
import Link from "next/link"
import { promises as fs } from "fs"
import path from "path"
import {
	getCanonicalUrl,
	getSocialImageUrl,
	getSiteName,
} from "@/lib/utils/domain-detection"

// Built statically: the file list is read at build time, so adding a new
// .html file to public/building/stuff/ and redeploying regenerates this index.
export const dynamic = "force-static"

export const metadata: Metadata = {
	title: `Stuff | Building | ${getSiteName()}`,
	description:
		"Small standalone things I've made — interactive charts, experiments, and one-off pages.",
	openGraph: {
		title: `Stuff | Building | ${getSiteName()}`,
		description:
			"Small standalone things I've made — interactive charts, experiments, and one-off pages.",
		url: getCanonicalUrl("/building/stuff"),
		siteName: getSiteName(),
		type: "website",
		images: [
			{
				url: getSocialImageUrl("/images/projects/doug-is.png"),
				width: 1200,
				height: 630,
				alt: "Stuff - doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: `Stuff | Building | ${getSiteName()}`,
		description:
			"Small standalone things I've made — interactive charts, experiments, and one-off pages.",
		images: [getSocialImageUrl("/images/projects/doug-is.png")],
		creator: "@glowingrec",
	},
	alternates: {
		canonical: getCanonicalUrl("/building/stuff"),
	},
}

interface Thing {
	slug: string
	title: string
	description: string | null
}

const STUFF_DIR = path.join(process.cwd(), "public", "building", "stuff")

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

async function getThings(): Promise<Thing[]> {
	let files: string[]
	try {
		files = await fs.readdir(STUFF_DIR)
	} catch (error: unknown) {
		// Directory doesn't exist yet — that's a legitimate empty state, not a
		// failure. Any other error should be surfaced, not swallowed.
		if (
			error &&
			typeof error === "object" &&
			(error as NodeJS.ErrnoException).code === "ENOENT"
		) {
			return []
		}
		throw error
	}

	const things = await Promise.all(
		files
			.filter((file) => file.endsWith(".html"))
			.map(async (file): Promise<Thing> => {
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

export default async function StuffIndexPage() {
	const things = await getThings()

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<Link
					href="/building"
					className="text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-accent-secondary))] transition-colors mb-4 inline-block"
				>
					← Back to Projects
				</Link>
				<h1 className="text-4xl font-bold gradient-heading mb-4">Stuff</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					Small standalone things I&apos;ve made — interactive charts,
					experiments, and one-off pages.
				</p>
			</div>

			{things.length === 0 ? (
				<p className="text-[rgba(var(--color-foreground),0.6)]">
					Nothing here yet.
				</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
					{things.map((thing) => (
						<Link
							key={thing.slug}
							href={`/building/stuff/${thing.slug}`}
							className="block p-6 bg-[rgb(var(--color-background-alt))] rounded-lg border border-[rgba(var(--color-border),0.08)] transition-all duration-300 hover:border-[rgba(var(--color-border),0.25)] hover:-translate-y-1"
						>
							<h2 className="font-[family-name:var(--font-display)] text-lg font-bold leading-snug">
								{thing.title}
							</h2>
							{thing.description && (
								<p className="text-sm leading-relaxed text-[rgba(var(--color-foreground),0.55)] mt-2">
									{thing.description}
								</p>
							)}
							<span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.15em] text-[rgba(var(--color-accent),0.45)] uppercase mt-4 inline-block">
								/building/stuff/{thing.slug}
							</span>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
