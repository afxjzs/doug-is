import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getPosts } from "@/lib/supabase/client"
import { formatDate } from "@/lib/utils"
import SafeImage from "@/components/SafeImage"
import ConnectCta from "@/components/ConnectCta"

export const metadata: Metadata = {
	title: "Doug.is | Developer, Investor, Entrepreneur",
	description:
		"Personal website of Douglas E. Rogers - Developer, Investor, and Entrepreneur",
}

export default function HomePage() {
	return (
		<div className="max-w-4xl mx-auto">
			{/* Hero Section */}
			<div className="mb-16 relative">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-cyan-900/20 rounded-lg -z-10 blur-xl"></div>
				<div className="relative z-10 py-16 px-8 border border-[rgba(var(--color-foreground),0.05)] rounded-lg bg-[rgba(var(--color-background),0.8)] backdrop-blur-sm">
					<div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
						<div className="relative w-32 h-32 overflow-hidden rounded-full border-2 border-[rgba(var(--color-violet),0.6)] shadow-[0_0_15px_rgba(var(--color-violet),0.3)]">
							<Image
								src="/images/doug-2024-cropped-compr.png"
								alt="Douglas E. Rogers"
								fill
								className="object-cover"
								priority
							/>
						</div>
						<div className="flex-1 max-w-xl">
							<p className="text-lg md:text-xl text-[rgba(var(--color-foreground),0.7)] mb-2 text-center md:text-left leading-[1.2]">
								the personal website of
							</p>
							<h1 className="text-5xl md:text-6xl font-bold gradient-heading mb-4 text-center md:text-left leading-[1.2]">
								Douglas E. Rogers
							</h1>
							<p className="text-xl md:text-2xl text-[rgba(var(--color-foreground),0.8)] mb-4 text-center md:text-left leading-[1.2]">
								Engineer. Advisor. Investor.
							</p>
						</div>
					</div>
					<div className="max-w-2xl mx-auto">
						<blockquote className="italic text-lg md:text-xl text-[rgba(var(--color-foreground),0.85)] border-l-4 border-[rgba(var(--color-cyan),0.6)] pl-4 py-2 bg-[rgba(var(--color-foreground),0.05)] rounded-r-md">
							<p className="leading-relaxed">
								&ldquo;Everything you make is designed, by you. Design
								isn&apos;t just visual. Design is the manifestation of empathy
								for the user and respect for their existence in time and
								space.&rdquo;
							</p>
						</blockquote>
					</div>
				</div>
			</div>

			{/* Doug.is Section */}
			<div className="mb-16">
				<h2 className="text-3xl md:text-4xl font-semibold gradient-heading mb-8 text-center leading-[1.2]">
					doug.is...
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<Link
						href="/advising"
						className="group relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
						<div className="relative p-8">
							<h3 className="text-3xl md:text-4xl font-semibold mb-3 text-cyan-300 leading-[1.2]">
								advising
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)] mb-4 leading-[1.2]">
								Strategic guidance for B2B startups from a YC and Techstars
								alum.
							</p>
							<div className="flex items-center text-cyan-400">
								<span className="leading-[1.2]">Learn more</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 ml-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					</Link>

					<Link
						href="/building"
						className="group relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.15)]"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-pink-900/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
						<div className="relative p-8">
							<h3 className="text-3xl md:text-4xl font-semibold mb-3 text-violet-300 leading-[1.2]">
								building
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)] mb-4 leading-[1.2]">
								Check out projects I&apos;ve built and technologies I work with.
							</p>
							<div className="flex items-center text-violet-400">
								<span className="leading-[1.2]">View projects</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 ml-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					</Link>

					<Link
						href="/investing"
						className="group relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(80,200,120,0.15)]"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 to-emerald-800/5 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
						<div className="relative p-8">
							<h3 className="text-3xl md:text-4xl font-semibold mb-3 text-emerald-300 leading-[1.2]">
								investing
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)] mb-4 leading-[1.2]">
								Learn about my investment philosophy and financial insights.
							</p>
							<div className="flex items-center text-emerald-400">
								<span className="leading-[1.2]">Explore strategies</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 ml-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					</Link>

					<Link
						href="/thinking"
						className="group relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-pink-500/30 hover:shadow-[0_0_15px_rgba(236,72,153,0.15)]"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-pink-900/10 to-pink-800/5 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
						<div className="relative p-8">
							<h3 className="text-3xl md:text-4xl font-semibold mb-3 text-pink-300 leading-[1.2]">
								writing
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)] mb-4 leading-[1.2]">
								Explore my thoughts on technology, investing, and business
								strategy.
							</p>
							<div className="flex items-center text-pink-400">
								<span className="leading-[1.2]">Read articles</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 ml-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					</Link>
				</div>

				<div className="mt-8 grid grid-cols-1 gap-8">
					<Link
						href="/hustling"
						className="group relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)]"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-purple-800/5 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
						<div className="relative p-8">
							<h3 className="text-3xl md:text-4xl font-semibold mb-3 text-purple-300 leading-[1.2]">
								about me
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)] mb-4 leading-[1.2]">
								Get to know me, my background, and how to get in touch.
							</p>
							<div className="flex items-center text-purple-400">
								<span className="leading-[1.2]">Learn More</span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5 ml-2"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						</div>
					</Link>
				</div>
			</div>

			{/* CTA Section */}
			<ConnectCta className="mb-16" />
		</div>
	)
}

function CategoryCard({
	title,
	description,
	href,
	color,
}: {
	title: string
	description: string
	href: string
	color: "violet" | "cyan" | "magenta"
}) {
	const colorClasses = {
		violet: {
			border: "border-[rgba(var(--color-violet),0.2)]",
			hover: "hover:border-[rgba(var(--color-violet),0.4)]",
			bg: "bg-[rgba(var(--color-violet),0.05)]",
			text: "text-[rgba(var(--color-violet),1)]",
			glow: "group-hover:text-[rgba(var(--color-violet),1)] group-hover:drop-shadow-[0_0_3px_rgba(var(--color-violet),0.5)]",
		},
		cyan: {
			border: "border-[rgba(var(--color-cyan),0.2)]",
			hover: "hover:border-[rgba(var(--color-cyan),0.4)]",
			bg: "bg-[rgba(var(--color-cyan),0.05)]",
			text: "text-[rgba(var(--color-cyan),1)]",
			glow: "group-hover:text-[rgba(var(--color-cyan),1)] group-hover:drop-shadow-[0_0_3px_rgba(var(--color-cyan),0.5)]",
		},
		magenta: {
			border: "border-[rgba(var(--color-magenta),0.2)]",
			hover: "hover:border-[rgba(var(--color-magenta),0.4)]",
			bg: "bg-[rgba(var(--color-magenta),0.05)]",
			text: "text-[rgba(var(--color-magenta),1)]",
			glow: "group-hover:text-[rgba(var(--color-magenta),1)] group-hover:drop-shadow-[0_0_3px_rgba(var(--color-magenta),0.5)]",
		},
	}

	return (
		<Link
			href={href}
			className={`group block relative p-6 rounded-xl overflow-hidden border ${colorClasses[color].border} ${colorClasses[color].hover} ${colorClasses[color].bg} transition-all duration-300`}
		>
			<h3 className="text-xl font-bold mb-2 relative z-10 transition-all duration-300 ${colorClasses[color].glow}">
				{title}
			</h3>
			<p className="text-[rgba(var(--color-foreground),0.7)] mb-4 relative z-10">
				{description}
			</p>
			<div
				className={`flex items-center text-[rgba(var(--color-foreground),0.6)] ${colorClasses[color].glow} transition-all duration-300 relative z-10`}
			>
				<span>Explore</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M9 5l7 7-7 7"
					/>
				</svg>
			</div>
		</Link>
	)
}
