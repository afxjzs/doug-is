import Link from "next/link"
import Image from "next/image"
import { thingImageUrl, type Thing } from "@/lib/stuff"

// How many tiles the section shows before deferring to the full index.
export const STUFF_PREVIEW_COUNT = 4

/**
 * The "Stuff" section on /building: a few preview tiles linking into the
 * standalone one-off pages, plus a link to the full index. The list is read
 * from disk by the page (a server component), so a new file in
 * src/content/stuff/ shows up here on the next deploy without touching this.
 */
export default function StuffSection({ things }: { things: Thing[] }) {
	if (things.length === 0) return null

	const preview = things.slice(0, STUFF_PREVIEW_COUNT)

	return (
		<div className="mb-16">
			<div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-8">
				<h2 className="text-3xl font-semibold display-heading">Stuff</h2>
				<Link
					href="/building/stuff"
					className="text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-accent-secondary))] transition-colors"
				>
					See all stuff →
				</Link>
			</div>

			<p className="text-[rgba(var(--color-foreground),0.7)] mb-8 max-w-2xl leading-relaxed">
				Small standalone things I&apos;ve made — interactive charts,
				experiments, and one-off pages. No framework, no build step, just a
				single file each.
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
				{preview.map((thing) => (
					<Link
						key={thing.slug}
						href={`/building/stuff/${thing.slug}`}
						// These resolve to a route handler serving raw HTML, not a page,
						// so there is no RSC payload to prefetch — Next would just 404
						// on every tile in the viewport.
						prefetch={false}
						className="group block bg-[rgba(var(--color-foreground),0.03)] rounded-xl border border-[rgba(var(--color-border),0.08)] overflow-hidden hover:border-[rgba(var(--color-border),0.2)] hover:-translate-y-1"
						style={{
							transition:
								"border-color var(--dur-base) var(--ease-out), translate var(--dur-base) var(--ease-out)",
						}}
					>
						<div className="relative aspect-[8/5] overflow-hidden bg-[rgb(var(--color-background))] border-b border-[rgba(var(--color-border),0.08)]">
							<Image
								src={thingImageUrl(thing)}
								alt={`Screenshot of ${thing.title}`}
								fill
								sizes="(max-width: 640px) 100vw, 50vw"
								className="object-cover object-top group-hover:scale-[1.03]"
								style={{ transition: "scale var(--dur-slow) var(--ease-out)" }}
							/>
						</div>
						<div className="p-5">
							<h3
								className="font-[family-name:var(--font-display)] text-lg font-bold leading-snug group-hover:text-[rgb(var(--color-accent))]"
								style={{ transition: "color var(--dur-base) var(--ease-out)" }}
							>
								{thing.title}
							</h3>
							{thing.description && (
								<p className="text-sm leading-relaxed text-[rgba(var(--color-foreground),0.55)] mt-2">
									{thing.description}
								</p>
							)}
						</div>
					</Link>
				))}
			</div>
		</div>
	)
}
