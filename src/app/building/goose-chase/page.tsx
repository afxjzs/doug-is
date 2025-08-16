"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useClientEventTracking } from "@/lib/analytics"

export default function GooseChasePage() {
	const { trackProjectView, trackPortfolioExternalLink } =
		useClientEventTracking()

	// Track page view
	useEffect(() => {
		trackProjectView("Goose Chase", "web-app")
	}, [trackProjectView])

	const handleExternalLinkClick = (
		linkType: "github" | "website",
		url: string
	) => {
		if (linkType === "github") {
			trackPortfolioExternalLink("goose-chase", "github", url)
		}
		// Note: website links don't have a specific tracking type, so we'll just track the page view
	}

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<Link
					href="/building"
					className="text-[rgba(var(--color-foreground),0.6)] hover:text-[rgba(var(--color-foreground),0.8)] transition-colors mb-4 inline-block"
				>
					← Back to Building
				</Link>
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					Goose Chase
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)] mb-6">
					A curated guide to Chicago's finest venues based on Dante The Don's
					Barstool Sports article.
				</p>
			</div>

			{/* Project Overview */}
			<div className="mb-12">
				<div className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] rounded-xl p-8">
					<h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
					<p className="text-[rgba(var(--color-foreground),0.7)] mb-6 leading-relaxed">
						My wife is traveling to Chicago in September, and I discovered this
						comprehensive guide written by Dante The Don, a DJ who has been in
						Chicago forever. I wondered if I could use AI to turn that into a
						structured dataset, so I did that, and then used Cursor to turn it
						into a lightweight web interface.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.7)] mb-6 leading-relaxed">
						The result is Goose Chase - an interactive web application that
						transforms Dante's extensive knowledge of Chicago's best venues into
						a searchable, filterable database with maps, photos, and detailed
						recommendations perfect for bachelor parties and visitors.
					</p>
				</div>
			</div>

			{/* Screenshots */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold mb-6">Screenshots</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Desktop View</h3>
						<div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-[rgba(var(--color-foreground),0.1)]">
							<Image
								src="/images/projects/goose-chase/goosechase-screenshot-desktop.png"
								alt="Goose Chase Desktop Screenshot"
								fill
								className="object-cover"
							/>
						</div>
					</div>
					<div className="space-y-4">
						<h3 className="text-lg font-medium">Mobile View</h3>
						<div className="relative w-full h-[300px] rounded-xl overflow-hidden border border-[rgba(var(--color-foreground),0.1)]">
							<Image
								src="/images/projects/goose-chase/goosechase-screenshot-mobile.png"
								alt="Goose Chase Mobile Screenshot"
								fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
				<div className="mt-6">
					<h3 className="text-lg font-medium mb-4">Modal Interface</h3>
					<div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-[rgba(var(--color-foreground),0.1)]">
						<Image
							src="/images/projects/goose-chase/goosechase-screenshot-modal.png"
							alt="Goose Chase Modal Screenshot"
							fill
							className="object-cover"
						/>
					</div>
				</div>
			</div>

			{/* Technical Details */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold mb-6">Technical Details</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div>
						<h3 className="text-lg font-medium mb-3">Tech Stack</h3>
						<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
							<li>
								• <strong>Frontend:</strong> Next.js with Tailwind CSS
							</li>
							<li>
								• <strong>Deployment:</strong> Vercel
							</li>
							<li>
								• <strong>Maps & Photos:</strong> Google Places API
							</li>
							<li>
								• <strong>Data Source:</strong> CSV file with venue information
							</li>
							<li>
								• <strong>Styling:</strong> Tailwind CSS v4
							</li>
						</ul>
					</div>
					<div>
						<h3 className="text-lg font-medium mb-3">Key Features</h3>
						<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
							<li>
								• <strong>Venue Filtering:</strong> By type, neighborhood, and
								keywords
							</li>
							<li>
								• <strong>Interactive Maps:</strong> Google Maps integration
							</li>
							<li>
								• <strong>Rich Data:</strong> Photos, ratings, and detailed
								descriptions
							</li>
							<li>
								• <strong>Responsive Design:</strong> Mobile-first approach
							</li>
							<li>
								• <strong>Fast Performance:</strong> Optimized for quick venue
								discovery
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Data Source */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold mb-6">Data Source</h2>
				<div className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] rounded-xl p-6">
					<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
						The venue data comes from Dante The Don's comprehensive guide
						published on Barstool Sports:
						<strong>
							"Chicago Is An Elite Bachelor Party Destination In America And
							Here Is Your Definitive Guide"
						</strong>
					</p>
					<p className="text-[rgba(var(--color-foreground),0.7)] mb-4">
						I used AI to extract and structure the venue information from the
						article, creating a comprehensive dataset that includes venue names,
						types, neighborhoods, and Dante's personal recommendations.
					</p>
					<div className="flex items-center space-x-4">
						<Link
							href="https://www.barstoolsports.com/blog/3548304/chicago-is-an-elite-bachelor-party-destination-in-america-and-here-is-your-definitive-guide"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[rgba(var(--color-cyan),0.9)] hover:text-[rgba(var(--color-cyan),1)] transition-colors"
						>
							📖 Read the Original Article
						</Link>
						<Link
							href="https://twitter.com/dantethedon"
							target="_blank"
							rel="noopener noreferrer"
							className="text-[rgba(var(--color-cyan),0.9)] hover:text-[rgba(var(--color-cyan),1)] transition-colors"
						>
							🐦 Follow Dante The Don
						</Link>
					</div>
				</div>
			</div>

			{/* Project Links */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold mb-6">Project Links</h2>
				<div className="flex flex-wrap gap-4">
					<Link
						href="https://goosechase.doug.is/"
						target="_blank"
						rel="noopener noreferrer"
						className="neon-button-cyan text-center px-6 py-3"
						onClick={() =>
							handleExternalLinkClick("website", "https://goosechase.doug.is/")
						}
					>
						🌐 Visit Live Site
					</Link>
					<Link
						href="https://github.com/afxjzs/goose-chase-simple"
						target="_blank"
						rel="noopener noreferrer"
						className="neon-button-violet text-center px-6 py-3"
						onClick={() =>
							handleExternalLinkClick(
								"github",
								"https://github.com/afxjzs/goose-chase-simple"
							)
						}
					>
						📁 View Source Code
					</Link>
				</div>
			</div>

			{/* Back to Building */}
			<div className="text-center">
				<Link
					href="/building"
					className="text-[rgba(var(--color-foreground),0.6)] hover:text-[rgba(var(--color-foreground),0.8)] transition-colors"
				>
					← Back to Building
				</Link>
			</div>
		</div>
	)
}
