import Link from "next/link"
import Image from "next/image"
import { listThings, thingImageUrl } from "@/lib/stuff"
import {
	getCanonicalUrl,
	getSocialImageUrl,
	getSiteName,
} from "@/lib/utils/domain-detection"
import { pageMetadata } from "@/lib/metadata"

// Built statically: the file list is read at build time, so adding a new
// .html file to src/content/stuff/ and redeploying regenerates this index.
export const dynamic = "force-static"

export const metadata = pageMetadata({
	trail: ["building", "Stuff"],
	description:
		"Small standalone things I've made: interactive charts, experiments, and one-off pages.",
	path: "/building/stuff",
})

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
							// These resolve to a route handler serving raw HTML, not a
							// page, so there is no RSC payload to prefetch — Next would
							// just 404 on every card in the viewport.
							prefetch={false}
							className="group block bg-[rgb(var(--color-background-alt))] rounded-lg border border-[rgba(var(--color-border),0.08)] overflow-hidden transition-all duration-300 hover:border-[rgba(var(--color-border),0.25)] hover:-translate-y-1"
						>
							<div className="relative aspect-[8/5] overflow-hidden bg-[rgb(var(--color-background))] border-b border-[rgba(var(--color-border),0.08)]">
								<Image
									src={thingImageUrl(thing)}
									alt={`Screenshot of ${thing.title}`}
									fill
									sizes="(max-width: 640px) 100vw, 50vw"
									className="object-cover object-top group-hover:scale-[1.03]"
									style={{
										transition: "scale var(--dur-slow) var(--ease-out)",
									}}
								/>
							</div>
							<div className="p-6">
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
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
