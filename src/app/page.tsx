import Link from "next/link"
import { Metadata } from "next"
import HeroSection from "@/components/HeroSection"
import { getPublishedPosts } from "@/lib/supabase/data"
import {
	getCanonicalUrl,
	getSocialImageUrl,
	getSiteName,
} from "@/lib/utils/domain-detection"

const HOME_TITLE = "doug.is | Engineer, Advisor, Investor"
const HOME_DESCRIPTION =
	"Douglas E. Rogers - Engineer, Advisor, and Investor. Building startups, advising founders, and investing in companies with real revenue."

export const metadata: Metadata = {
	title: HOME_TITLE,
	description: HOME_DESCRIPTION,
	openGraph: {
		title: HOME_TITLE,
		description: HOME_DESCRIPTION,
		url: getCanonicalUrl("/"),
		siteName: getSiteName(),
		images: [
			{
				url: getSocialImageUrl("/images/projects/doug-is.png"),
				width: 1200,
				height: 630,
				alt: "doug.is - Engineer, Advisor, Investor",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: HOME_TITLE,
		description: HOME_DESCRIPTION,
		images: [getSocialImageUrl("/images/projects/doug-is.png")],
		creator: "@doug__is",
	},
	alternates: {
		canonical: getCanonicalUrl("/"),
	},
}

function HexSeparator() {
	return (
		<svg
			width="8"
			height="10"
			viewBox="0 0 86.6 100"
			className="fill-[rgb(var(--color-accent))] shrink-0"
		>
			<polygon points="43.3,0 86.6,25 86.6,75 43.3,100 0,75 0,25" />
		</svg>
	)
}

export default async function Home() {
	const posts = await getPublishedPosts(3)

	return (
		<div className="-mt-28 -mb-12">
			{/* Hero */}
			<HeroSection />

			{/* Credential bar */}
			<section className="border-t border-b border-[rgba(var(--color-border),0.08)] py-5 px-5 md:px-10">
				<div className="max-w-[1200px] mx-auto flex flex-wrap justify-center items-center gap-3 font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-foreground),0.45)]">
					{[
						"Y Combinator (W15)",
						"Techstars (JPM/24)",
						"25+ Years Building",
						"2x Exits",
					].map((item, i, arr) => (
						<span key={item} className="flex items-center gap-3">
							{item}
							{i < arr.length - 1 && <HexSeparator />}
						</span>
					))}
				</div>
			</section>

			{/* Three pillars */}
			<section className="py-24 px-5 md:px-10">
				<div className="max-w-[1200px] mx-auto">
					<div className="grid grid-cols-1 md:grid-cols-3">
						{[
							{
								num: "01",
								title: "Advising",
								desc: "Fractional CTO & strategic advisor for early-stage founders navigating 0→1 product development.",
								href: "/advising",
							},
							{
								num: "02",
								title: "Building",
								desc: "DubPrime (fintech, Techstars '24), GAIuS (gaius.fyi), VentureBuilder, and side projects when I can't sleep.",
								href: "/building",
							},
							{
								num: "03",
								title: "Investing",
								desc: "Small checks into founders with real revenue. Revenue over pitch decks, every time.",
								href: "/investing",
							},
						].map((item, i) => (
							<Link
								key={item.num}
								href={item.href}
								className={`group p-10 md:px-10 transition-colors duration-300 hover:bg-[rgba(var(--color-accent),0.03)] ${
									i > 0
										? "md:border-l border-t md:border-t-0 border-[rgba(var(--color-border),0.08)]"
										: ""
								}`}
							>
								<span className="block mb-4 font-[family-name:var(--font-mono)] text-[11px] text-[rgba(var(--color-accent),0.3)]">
									{item.num}
								</span>
								<h3 className="font-[family-name:var(--font-display)] text-[28px] font-bold mb-3">
									{item.title}
								</h3>
								<p className="text-[13px] leading-[1.7] text-[rgba(var(--color-foreground),0.45)]">
									{item.desc}
								</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Articles */}
			<section className="px-5 md:px-10 pb-24">
				<div className="max-w-[1200px] mx-auto">
					<div className="flex justify-between items-baseline mb-10">
						<h2 className="font-[family-name:var(--font-display)] text-[32px] font-bold">
							Writing
						</h2>
						<Link
							href="/thinking"
							className="font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-[rgba(var(--color-accent),0.3)] hover:text-[rgb(var(--color-accent))] transition-colors"
						>
							ALL POSTS &rarr;
						</Link>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{posts.map((post) => (
							<Link
								key={post.id}
								href={`/thinking/about/${post.category.toLowerCase()}/${post.slug}`}
								className="p-8 bg-[rgb(var(--color-background-alt))] rounded-lg border border-[rgba(var(--color-border),0.06)] transition-all duration-300 hover:border-[rgba(var(--color-border),0.2)] hover:-translate-y-1"
							>
								<span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[0.15em] text-[rgba(var(--color-accent),0.3)] uppercase">
									{post.category}
								</span>
								<h3 className="font-[family-name:var(--font-display)] text-lg font-bold mt-3 leading-snug">
									{post.title}
								</h3>
								<p className="text-xs leading-relaxed text-[rgba(var(--color-foreground),0.45)] mt-2.5">
									{post.excerpt}
								</p>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* Photo + quote band */}
			<section className="relative h-[400px] md:h-[400px] overflow-hidden">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src="/images/doug-nyc.jpg"
					alt="NYC Skyline"
					className="absolute inset-0 w-full h-full object-cover sepia-[0.4] saturate-[0.6] brightness-[0.35] hue-rotate-[10deg]"
				/>
				<div className="absolute inset-0 bg-gradient-to-r from-[rgba(10,14,26,0.7)] to-[rgba(10,14,26,0.3)]" />
				<div className="relative z-10 h-full flex items-center px-5 md:px-12 max-w-[1200px] mx-auto">
					<p className="font-[family-name:var(--font-display)] text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.3] max-w-[600px]">
						&ldquo;It&apos;s not how many mistakes you make.{" "}
						<span className="text-[rgb(var(--color-accent))]">
							It&apos;s how many you don&apos;t make twice.&rdquo;
						</span>
					</p>
				</div>
			</section>

			{/* Bottom CTA */}
			<section className="py-20 px-5 md:px-10 text-center">
				<p className="font-[family-name:var(--font-display)] text-[clamp(28px,3vw,40px)] font-bold max-w-[600px] mx-auto mb-6 leading-[1.3]">
					Let&apos;s build{" "}
					<span className="text-[rgb(var(--color-accent))] italic">
						something great.
					</span>
				</p>
				<p className="text-sm text-[rgba(var(--color-foreground),0.45)] mb-8">
					Got an idea? Already building? Let&apos;s talk.
				</p>
				<Link href="/connecting" className="btn-primary">
					Get in Touch
				</Link>
			</section>
		</div>
	)
}
