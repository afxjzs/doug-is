import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getPosts } from "@/lib/supabase/publicClient"
import { formatDate } from "@/lib/utils/index"
import SafeImage from "@/components/SafeImage"
import ConnectCta from "@/components/ConnectCta"
import { AdvisingIcon } from "@/components/icons/AdvisingIcon"
import { BuildingIcon } from "@/components/icons/BuildingIcon"
import { InvestingIcon } from "@/components/icons/InvestingIcon"
import MainSiteLayout from "@/components/MainSiteLayout"
import {
	getCanonicalUrl,
	getSocialImageUrl,
	getSiteName,
	getSiteDescription,
} from "@/lib/utils/domain-detection"

interface Post {
	title: string
	slug: string
	excerpt: string
	category: string
	published_at: string
	featured_image?: string
}

interface CategoryCardProps {
	title: string
	description: string
	href: string
	color: "violet" | "cyan" | "magenta"
}

export const metadata: Metadata = {
	title: `${getSiteName()} | Developer, Investor, Entrepreneur`,
	description: getSiteDescription(),
	openGraph: {
		title: `${getSiteName()} | Developer, Investor, Entrepreneur`,
		description: getSiteDescription(),
		url: getCanonicalUrl("/"),
		siteName: getSiteName(),
		images: [
			{
				url: getSocialImageUrl("/images/doug-2024-cropped.png"),
				width: 1200,
				height: 630,
				alt: `${getSiteName()} - Developer, Investor, Entrepreneur`,
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: `${getSiteName()} | Developer, Investor, Entrepreneur`,
		description: getSiteDescription(),
		images: [getSocialImageUrl("/images/doug-2024-cropped.png")],
		creator: "@glowingrec",
	},
	alternates: {
		canonical: getCanonicalUrl("/"),
	},
}

export default async function Home() {
	// Fetch the latest blog post
	const latestPosts = await getPosts(1)
	const latestPost =
		latestPosts && latestPosts.length > 0 ? latestPosts[0] : null

	return (
		<MainSiteLayout>
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
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<Link
							href="/advising"
							className="group relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.15)]"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 to-purple-900/10 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
							<div className="relative p-8 flex flex-col items-center text-center">
								<div className="w-35 h-35 mb-4 text-cyan-300 group-hover:drop-shadow-[0_0_5px_rgba(0,255,255,0.4)]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="-5.0 -10.0 110.0 135.0"
										className="w-full h-full fill-current"
									>
										<AdvisingIcon />
									</svg>
								</div>
								<h3 className="text-3xl md:text-4xl font-semibold text-cyan-300 leading-[1.2] mb-4">
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
							<div className="relative p-8 flex flex-col items-center text-center">
								<div className="w-35 h-35 mb-4 text-violet-300 group-hover:drop-shadow-[0_0_5px_rgba(139,92,246,0.4)]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="-5.0 -10.0 110.0 135.0"
										className="w-full h-full fill-current"
									>
										<BuildingIcon />
									</svg>
								</div>
								<h3 className="text-3xl md:text-4xl font-semibold text-violet-300 leading-[1.2] mb-4">
									building
								</h3>
								<p className="text-[rgba(var(--color-foreground),0.7)] mb-4 leading-[1.2]">
									Check out projects I&apos;ve built and technologies I work
									with.
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
							<div className="relative p-8 flex flex-col items-center text-center">
								<div className="w-35 h-35 mb-4 text-emerald-300 group-hover:drop-shadow-[0_0_5px_rgba(80,200,120,0.4)]">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="-5.0 -10.0 110.0 135.0"
										className="w-full h-full fill-current"
									>
										<InvestingIcon />
									</svg>
								</div>
								<h3 className="text-3xl md:text-4xl font-semibold text-emerald-300 leading-[1.2] mb-4">
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
					</div>

					{/* About + Latest Post Section */}
					<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
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

						{latestPost && (
							<Link
								href={`/thinking/about/${latestPost.category.toLowerCase()}/${
									latestPost.slug
								}`}
								className="group relative overflow-hidden rounded-lg border border-[rgba(var(--color-foreground),0.05)] transition-all duration-300 hover:border-pink-500/30 hover:shadow-[0_0_15px_rgba(236,72,153,0.15)]"
							>
								<div className="absolute inset-0 bg-gradient-to-br from-pink-900/10 to-pink-800/5 opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
								<div className="relative flex flex-col h-full">
									{latestPost.featured_image && (
										<div className="w-full h-48 overflow-hidden">
											<Image
												src={latestPost.featured_image}
												alt={latestPost.title}
												width={400}
												height={200}
												priority
												className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												unoptimized={true}
											/>
										</div>
									)}
									<div className="p-6 flex-1 flex flex-col">
										<div className="flex items-center mb-3">
											<span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[rgba(var(--color-pink),0.1)] text-[rgba(var(--color-pink),0.8)]">
												Latest Post
											</span>
											<span className="mx-2 text-[rgba(var(--color-foreground),0.3)]">
												•
											</span>
											<time className="text-sm text-[rgba(var(--color-foreground),0.6)]">
												{latestPost.published_at
													? formatDate(latestPost.published_at)
													: ""}
											</time>
										</div>
										<h3 className="text-xl font-semibold mb-2 text-pink-300 leading-[1.2] group-hover:text-[rgb(var(--color-pink))] transition-colors">
											{latestPost.title}
										</h3>
										<p className="text-[rgba(var(--color-foreground),0.7)] mb-4 leading-[1.2] line-clamp-2">
											{latestPost.excerpt}
										</p>
										<div className="flex items-center text-pink-400 mt-auto">
											<span className="leading-[1.2]">Read Post</span>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
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
								</div>
							</Link>
						)}
					</div>
				</div>

				{/* CTA Section */}
				<ConnectCta className="mb-16" />
			</div>
		</MainSiteLayout>
	)
}

function CategoryCard({ title, description, href, color }: CategoryCardProps) {
	const colorClasses = {
		violet: {
			border: "border-[rgba(var(--color-violet),0.2)]",
			hover: "hover:border-[rgba(var(--color-violet),0.4)]",
			bg: "bg-[rgba(var(--color-violet),0.05)]",
			text: "text-[rgba(var(--color-violet),1)]",
		},
		cyan: {
			border: "border-[rgba(var(--color-cyan),0.2)]",
			hover: "hover:border-[rgba(var(--color-cyan),0.4)]",
			bg: "bg-[rgba(var(--color-cyan),0.05)]",
			text: "text-[rgba(var(--color-cyan),1)]",
		},
		magenta: {
			border: "border-[rgba(var(--color-magenta),0.2)]",
			hover: "hover:border-[rgba(var(--color-magenta),0.4)]",
			bg: "bg-[rgba(var(--color-magenta),0.05)]",
			text: "text-[rgba(var(--color-magenta),1)]",
		},
	}

	return (
		<Link
			href={href}
			className={`block p-6 rounded-lg ${colorClasses[color].border} ${colorClasses[color].hover} ${colorClasses[color].bg} transition-all duration-200`}
		>
			<h3 className={`text-xl font-semibold mb-2 ${colorClasses[color].text}`}>
				{title}
			</h3>
			<p className="text-[rgba(var(--color-foreground),0.7)]">{description}</p>
		</Link>
	)
}
