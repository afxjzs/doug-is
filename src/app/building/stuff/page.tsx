import { Metadata } from "next"
import Link from "next/link"
import { listThings } from "@/lib/stuff"
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
		creator: "@doug__is",
	},
	alternates: {
		canonical: getCanonicalUrl("/building/stuff"),
	},
}

export default async function StuffIndexPage() {
	const things = await listThings()

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<Link
					href="/building"
					className="text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-accent-secondary))] transition-colors mb-4 inline-block"
				>
					← Back to Projects
				</Link>
				<h1 className="text-4xl font-bold display-heading mb-4">Stuff</h1>
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
