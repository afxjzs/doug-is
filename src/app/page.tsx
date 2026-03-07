import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getPostsStatic } from "@/lib/supabase/data"
import { formatDate } from "@/lib/utils/index"
import ConnectCta from "@/components/ConnectCta"
import { AdvisingIcon } from "@/components/icons/AdvisingIcon"
import { BuildingIcon } from "@/components/icons/BuildingIcon"
import { InvestingIcon } from "@/components/icons/InvestingIcon"
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
	const latestPosts = await getPostsStatic(1)
	const latestPost =
		latestPosts && latestPosts.length > 0 ? latestPosts[0] : null

	return (
		<div className="max-w-4xl mx-auto">
			{/* Hero Section */}
			<div className="mb-16 py-16 px-8 animate-fade-in-up">
				<div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-8">
					<div className="relative w-32 h-32 overflow-hidden rounded-full border-2 border-[rgba(var(--color-border),0.15)]">
						<Image
							src="/images/doug-2024-cropped-compr.png"
							alt="Douglas E. Rogers"
							fill
							className="object-cover"
							priority
						/>
					</div>
					<div className="flex-1 max-w-xl">
						<p className="text-lg md:text-xl text-[rgba(var(--color-muted),1)] mb-2 text-center md:text-left">
							the personal website of
						</p>
						<h1 className="text-5xl md:text-6xl font-bold gradient-heading mb-4 text-center md:text-left leading-[1.1]">
							Douglas E. Rogers
						</h1>
						<p className="text-xl md:text-2xl text-[rgba(var(--color-foreground),0.8)] text-center md:text-left">
							Engineer. Advisor. Investor.
						</p>
					</div>
				</div>
				<div className="max-w-2xl mx-auto">
					<blockquote className="italic text-lg md:text-xl text-[rgba(var(--color-foreground),0.85)] border-l-2 border-[rgba(var(--color-accent),0.4)] pl-4 py-2">
						<p className="leading-relaxed">
							&ldquo;Everything you make is designed, by you. Design
							isn&apos;t just visual. Design is the manifestation of empathy
							for the user and respect for their existence in time and
							space.&rdquo;
						</p>
					</blockquote>
				</div>
			</div>

			{/* doug.is Section */}
			<div className="mb-16">
				<h2 className="text-3xl md:text-4xl font-semibold gradient-heading mb-8 text-center">
					doug.is...
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Link
						href="/advising"
						className="group rounded-lg border border-[rgba(var(--color-border),0.08)] bg-[rgba(var(--color-foreground),0.02)] transition-all duration-300 hover:shadow-md hover:border-[rgba(var(--color-border),0.15)]"
					>
						<div className="p-8 flex flex-col items-center text-center">
							<div className="w-24 h-24 mb-4 text-[rgb(var(--color-accent))]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="-5.0 -10.0 110.0 135.0"
									className="w-full h-full fill-current"
								>
									<AdvisingIcon />
								</svg>
							</div>
							<h3 className="text-2xl md:text-3xl font-semibold gradient-heading mb-3">
								advising
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.6)] mb-4 text-sm">
								Strategic guidance for B2B startups from a YC and Techstars
								alum.
							</p>
							<span className="flex items-center text-sm text-[rgb(var(--color-accent))] group-hover:translate-x-1 transition-transform">
								Learn more
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</span>
						</div>
					</Link>

					<Link
						href="/building"
						className="group rounded-lg border border-[rgba(var(--color-border),0.08)] bg-[rgba(var(--color-foreground),0.02)] transition-all duration-300 hover:shadow-md hover:border-[rgba(var(--color-border),0.15)]"
					>
						<div className="p-8 flex flex-col items-center text-center">
							<div className="w-24 h-24 mb-4 text-[rgb(var(--color-accent))]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="-5.0 -10.0 110.0 135.0"
									className="w-full h-full fill-current"
								>
									<BuildingIcon />
								</svg>
							</div>
							<h3 className="text-2xl md:text-3xl font-semibold gradient-heading mb-3">
								building
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.6)] mb-4 text-sm">
								Check out projects I&apos;ve built and technologies I work with.
							</p>
							<span className="flex items-center text-sm text-[rgb(var(--color-accent))] group-hover:translate-x-1 transition-transform">
								View projects
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</span>
						</div>
					</Link>

					<Link
						href="/investing"
						className="group rounded-lg border border-[rgba(var(--color-border),0.08)] bg-[rgba(var(--color-foreground),0.02)] transition-all duration-300 hover:shadow-md hover:border-[rgba(var(--color-border),0.15)]"
					>
						<div className="p-8 flex flex-col items-center text-center">
							<div className="w-24 h-24 mb-4 text-[rgb(var(--color-accent))]">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="-5.0 -10.0 110.0 135.0"
									className="w-full h-full fill-current"
								>
									<InvestingIcon />
								</svg>
							</div>
							<h3 className="text-2xl md:text-3xl font-semibold gradient-heading mb-3">
								investing
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.6)] mb-4 text-sm">
								Founder-focused investments from someone who&apos;s been there.
							</p>
							<span className="flex items-center text-sm text-[rgb(var(--color-accent))] group-hover:translate-x-1 transition-transform">
								Learn more
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</span>
						</div>
					</Link>
				</div>

				{/* About + Latest Post Section */}
				<div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
					<Link
						href="/hustling"
						className="group rounded-lg border border-[rgba(var(--color-border),0.08)] bg-[rgba(var(--color-foreground),0.02)] transition-all duration-300 hover:shadow-md hover:border-[rgba(var(--color-border),0.15)]"
					>
						<div className="p-8">
							<h3 className="text-2xl md:text-3xl font-semibold mb-3 text-[rgba(var(--color-foreground),0.9)]">
								about me
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.6)] mb-4 text-sm">
								Get to know me, my background, and how to get in touch.
							</p>
							<span className="flex items-center text-sm text-[rgb(var(--color-accent))] group-hover:translate-x-1 transition-transform">
								Learn More
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
									<path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
								</svg>
							</span>
						</div>
					</Link>

					{latestPost && (
						<Link
							href={`/thinking/about/${latestPost.category.toLowerCase()}/${latestPost.slug}`}
							className="group rounded-lg border border-[rgba(var(--color-border),0.08)] bg-[rgba(var(--color-foreground),0.02)] transition-all duration-300 hover:shadow-md hover:border-[rgba(var(--color-border),0.15)] overflow-hidden"
						>
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
							<div className="p-6 flex flex-col">
								<div className="flex items-center mb-3">
									<span className="text-xs font-medium px-2.5 py-1 rounded-full bg-[rgba(var(--color-accent-secondary),0.1)] text-[rgba(var(--color-accent-secondary),0.9)]">
										Latest Post
									</span>
									<span className="mx-2 text-[rgba(var(--color-foreground),0.3)]">
										•
									</span>
									<time className="text-sm text-[rgba(var(--color-muted),1)]">
										{latestPost.published_at
											? formatDate(latestPost.published_at)
											: ""}
									</time>
								</div>
								<h3 className="text-xl font-semibold mb-2 text-[rgba(var(--color-foreground),0.9)] group-hover:text-[rgb(var(--color-accent))] transition-colors">
									{latestPost.title}
								</h3>
								<p className="text-[rgba(var(--color-foreground),0.6)] mb-4 text-sm line-clamp-2">
									{latestPost.excerpt}
								</p>
								<span className="flex items-center text-sm text-[rgb(var(--color-accent))] group-hover:translate-x-1 transition-transform mt-auto">
									Read Post
									<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
										<path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
									</svg>
								</span>
							</div>
						</Link>
					)}
				</div>
			</div>

			{/* CTA Section */}
			<ConnectCta className="mb-16" />
		</div>
	)
}
