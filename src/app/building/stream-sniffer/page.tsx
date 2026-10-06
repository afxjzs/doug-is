import Link from "next/link"
import Image from "next/image"
import Script from "next/script"
import {
	ProjectPageAnalytics,
	ProjectExternalLink,
} from "@/components/ProjectPageAnalytics"
import { generateProjectPageStructuredData } from "@/lib/utils/structured-data"
import { pageMetadata } from "@/lib/metadata"

const GITHUB_URL = "https://github.com/afxjzs/stream-sniffer"
const DESCRIPTION =
	"A Chrome extension that finds the video stream a page is playing, so you can watch it on its own: in a clean player tab, in VLC, or on a Chromecast."

export const metadata = pageMetadata({
	trail: ["building", "Stream Sniffer"],
	description: DESCRIPTION,
	path: "/building/stream-sniffer",
	image: { url: "/images/projects/stream-sniffer/card.png", width: 1200, height: 630 },
})

const features = [
	{
		title: "Stream Capture",
		body: "Lists every HLS playlist a tab loads, including ones inside embedded players from other sites, along with the headers the page sent.",
		icon: <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
	},
	{
		title: "Clean Player",
		body: "Plays a captured stream in its own tab, sending the original Referer and Origin so the stream server accepts it.",
		icon: <path d="m6 3 14 9-14 9V3Z" />,
	},
	{
		title: "Copy Commands",
		body: "One click copies a VLC command, or a curl command that repeats the browser's request with every header.",
		icon: <path d="M8 4h10a2 2 0 0 1 2 2v12M4 8h10a2 2 0 0 1 2 2v10H6a2 2 0 0 1-2-2V8Z" />,
	},
	{
		title: "Chromecast Relay (Beta)",
		body: "Sends the stream to your TV as real video, not a mirrored browser tab. The player tab does the fetching; a small relay on your computer serves it to the Chromecast.",
		icon: <path d="M2 16a6 6 0 0 1 6 6M2 12a10 10 0 0 1 10 10M2 20h.01M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" />,
	},
]

const requirements = [
	"Google Chrome",
	"Node.js 18 or later, for the relay",
	"A Chromecast on the same network, for the relay",
	"VLC, if you want the VLC command",
]

const technologies = [
	"Chrome extension (Manifest V3)",
	"hls.js for playback",
	"Node.js relay, no dependencies",
	"Google Cast SDK",
	"Puppeteer end-to-end tests",
]

function Check() {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="h-4 w-4 shrink-0 text-[rgba(var(--color-accent),0.8)]"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="m9 12 2 2 4-4" />
		</svg>
	)
}

function GitHubIcon() {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
		</svg>
	)
}

export default function StreamSnifferPage() {
	const structuredData = generateProjectPageStructuredData({
		title: "Stream Sniffer",
		description: DESCRIPTION,
		url: "/building/stream-sniffer",
		image: "/images/projects/stream-sniffer/card.png",
		technologies: ["JavaScript", "Chrome Extensions", "hls.js", "Node.js", "Google Cast"],
		github_url: GITHUB_URL,
		created_at: "2026-10-04T12:25:00Z",
		updated_at: "2026-10-06T12:00:00Z",
	})

	return (
		<>
			<Script
				id="project-page-structured-data"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
			/>
			<div className="max-w-4xl mx-auto">
				<ProjectPageAnalytics projectName="Stream Sniffer" projectType="Chrome Extension" />

				{/* Breadcrumb Navigation */}
				<div className="mb-8">
					<Link
						href="/building"
						className="text-[rgba(var(--color-accent),0.8)] hover:text-[rgba(var(--color-accent),1)] transition-colors inline-flex items-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="m15 18-6-6 6-6" />
						</svg>
						Back to Building
					</Link>
				</div>

				{/* Hero Section */}
				<div className="mb-16">
					<div className="mb-8">
						<h1 className="text-5xl font-bold display-heading mb-6">Stream Sniffer</h1>
						<p className="text-xl text-[rgba(var(--color-foreground),0.8)] max-w-2xl leading-relaxed">
							A lot of live video on the web plays inside a cluttered embedded player, with pop-ups
							stacked on top. I wanted the video without the page around it, and I wanted it on my
							TV. Stream Sniffer is a Chrome extension that finds the stream a page is playing, so
							you can watch it in a clean player tab, in VLC, or on a Chromecast.
						</p>
						<p className="mt-6 text-base text-[rgba(var(--color-foreground),0.7)] max-w-2xl leading-relaxed border-l-2 border-[rgba(var(--color-accent),0.4)] pl-4">
							<span className="text-[rgba(var(--color-accent),0.9)] font-semibold">Use it responsibly:</span>{" "}
							it replays what your own browser already receives, so only use it with streams you
							have the right to watch. It works well with free broadcasters like DW News and
							C-SPAN, and with Twitch.
						</p>
					</div>

					<div className="relative w-full max-w-xl mx-auto mb-8 rounded-xl overflow-hidden bg-[rgba(var(--color-background),0.6)] p-6">
						<Image
							src="/images/projects/stream-sniffer/popup.png"
							alt="The Stream Sniffer popup listing two captured playlists"
							width={1008}
							height={940}
							className="w-full h-auto rounded-lg shadow-lg"
							priority
						/>
					</div>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<ProjectExternalLink
							href={GITHUB_URL}
							projectId="stream-sniffer"
							linkType="github"
							target="_blank"
							rel="noopener noreferrer"
							className="btn-primary text-lg px-8 py-3 flex items-center gap-2"
						>
							<GitHubIcon />
							View Source on GitHub
						</ProjectExternalLink>
						<ProjectExternalLink
							href={`${GITHUB_URL}#install`}
							projectId="stream-sniffer"
							linkType="github"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-accent),0.9)] transition-colors border border-[rgba(var(--color-foreground),0.2)] hover:border-[rgba(var(--color-accent),0.3)] px-6 py-3 rounded-lg flex items-center gap-2"
						>
							Setup Guide
						</ProjectExternalLink>
					</div>
				</div>

				{/* Key Features Section */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold display-heading mb-8 text-center">Key Features</h2>
					<div className="grid md:grid-cols-2 gap-8">
						{features.map((f) => (
							<div
								key={f.title}
								className="p-6 bg-[rgba(var(--color-accent),0.05)] border border-[rgba(var(--color-accent),0.1)] rounded-xl"
							>
								<div className="w-12 h-12 mb-4 bg-[rgba(var(--color-accent),0.1)] rounded-full flex items-center justify-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-[rgba(var(--color-accent),0.8)]"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										{f.icon}
									</svg>
								</div>
								<h3 className="text-xl font-semibold mb-2 text-[rgba(var(--color-accent),0.9)]">{f.title}</h3>
								<p className="text-[rgba(var(--color-foreground),0.7)]">{f.body}</p>
							</div>
						))}
					</div>
				</div>

				{/* How the relay works */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold display-heading mb-8 text-center">How the Chromecast Relay Works</h2>
					<div className="space-y-4 text-[rgba(var(--color-foreground),0.75)] leading-relaxed max-w-2xl mx-auto">
						<p>
							A Chromecast fetches video itself, and it can&apos;t send the Referer or Origin headers
							that stream servers check. Some servers go further and refuse anything that isn&apos;t
							the browser. In testing, curl got HTTP 403 even when it sent every header Chrome
							did.
						</p>
						<p>
							So the relay never fetches the stream. When the TV asks for a playlist or a video
							segment, the relay queues the request. The Stream Sniffer player tab picks it up,
							fetches it through Chrome, and hands the bytes back. The relay rewrites each playlist
							so every link points back to itself, then serves it all to the TV on your local
							network. Whatever plays in the player tab plays on the TV.
						</p>
					</div>
				</div>

				{/* Odd things streams do */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold display-heading mb-8 text-center">Odd Things Streams Do</h2>
					<div className="space-y-4 text-[rgba(var(--color-foreground),0.75)] leading-relaxed max-w-2xl mx-auto">
						<p>
							Testing on real pages turned up a few tricks that made streams harder to find or play.
						</p>
						<p>
							One player fetched its stream from a service worker, a background script the page
							installs. Chrome reports those requests without a tab attached, so at first the
							extension never saw them. It now credits them to the tab with a frame from the
							worker&apos;s site.
						</p>
						<p>
							Another hid each video segment inside a PNG image on an image CDN. The image&apos;s
							pixel bytes spell out a marker, a length, and then the gzipped video. The player and
							the relay now decode those back into plain video before playing them.
						</p>
						<p>
							And some players add a timestamp to the playlist address on every refresh, which made
							the same stream show up as a new one every few seconds. Stream Sniffer now ignores
							those timestamps.
						</p>
					</div>
				</div>

				{/* Screenshots Section */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold display-heading mb-8 text-center">Screenshots</h2>
					<div className="grid md:grid-cols-2 gap-8">
						<div className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] rounded-xl p-6">
							<h3 className="text-xl font-semibold mb-4 text-[rgba(var(--color-accent),0.9)]">Captured Streams</h3>
							<div className="relative w-full h-64 rounded-lg overflow-hidden">
								<Image
									src="/images/projects/stream-sniffer/popup.png"
									alt="Popup with captured playlists and copy buttons"
									fill
									style={{ objectFit: "contain" }}
									className="rounded-lg"
								/>
							</div>
						</div>
						<div className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] rounded-xl p-6">
							<h3 className="text-xl font-semibold mb-4 text-[rgba(var(--color-accent),0.9)]">Player Tab</h3>
							<div className="relative w-full h-64 rounded-lg overflow-hidden">
								<Image
									src="/images/projects/stream-sniffer/player.png"
									alt="Player tab playing a test stream, with cast buttons"
									fill
									style={{ objectFit: "contain" }}
									className="rounded-lg"
								/>
							</div>
						</div>
					</div>
				</div>

				{/* Technical Details Section */}
				<div className="mb-16">
					<h2 className="text-3xl font-bold display-heading mb-8 text-center">Technical Details</h2>
					<div className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] rounded-xl p-8">
						<div className="grid md:grid-cols-2 gap-8">
							<div>
								<h3 className="text-xl font-semibold mb-4 text-[rgba(var(--color-accent),0.9)]">Requirements</h3>
								<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
									{requirements.map((r) => (
										<li key={r} className="flex items-center gap-2">
											<Check />
											{r}
										</li>
									))}
								</ul>
							</div>
							<div>
								<h3 className="text-xl font-semibold mb-4 text-[rgba(var(--color-accent),0.9)]">Technologies</h3>
								<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
									{technologies.map((t) => (
										<li key={t} className="flex items-center gap-2">
											<Check />
											{t}
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* Call to Action */}
				<div className="text-center">
					<h2 className="text-3xl font-bold display-heading mb-6">Try It</h2>
					<p className="text-lg text-[rgba(var(--color-foreground),0.7)] mb-8 max-w-2xl mx-auto">
						It&apos;s open source under the Apache 2.0 license. The README walks through installing
						the extension and starting the relay. If something breaks, open an issue on GitHub or{" "}
						<Link
							href="/contact"
							className="text-[rgba(var(--color-accent),0.8)] hover:text-[rgba(var(--color-accent),1)] transition-colors"
						>
							reach out
						</Link>
						.
					</p>
					<ProjectExternalLink
						href={GITHUB_URL}
						projectId="stream-sniffer"
						linkType="github"
						target="_blank"
						rel="noopener noreferrer"
						className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2"
					>
						<GitHubIcon />
						View Source on GitHub
					</ProjectExternalLink>
				</div>
			</div>
		</>
	)
}
