"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { quotes } from "./quotes"

function getRandomQuote() {
	return quotes[Math.floor(Math.random() * quotes.length)]
}

export default function InvestingPage() {
	const [randomQuote, setRandomQuote] = useState(quotes[0])
	const pathname = usePathname()

	useEffect(() => {
		setRandomQuote(getRandomQuote())
	}, [pathname])

	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<p className="text-lg text-[rgba(var(--color-foreground),0.7)] mb-2">
					doug.is/investing
				</p>
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					Founder-Focused Investments
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					I invest in founders because I&apos;ve been one. Twice.
				</p>
			</div>

			<div className="mb-16">
				<div className="p-8 border border-[rgba(var(--color-border),0.08)] rounded-lg bg-[rgba(var(--color-foreground),0.03)]">
					<h2 className="text-2xl font-semibold gradient-heading mb-6">
						Investment Philosophy
					</h2>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Most VCs aren&apos;t former founders. They haven&apos;t sat in a room
						wondering if they can make payroll, or pivoted a product three
						times in six months. I have, and it changes how you think about
						what a company actually needs.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						I think it&apos;s better to make a job than get a job. Sometimes
						that means writing a check. Sometimes it means making an intro
						or helping a founder find funding they didn&apos;t know existed.
						Whatever gets the thing built.
					</p>
				</div>
			</div>

			<div className="mb-16">
				<div className="p-8 border border-[rgba(var(--color-border),0.08)] rounded-lg bg-[rgba(var(--color-foreground),0.03)]">
					<div className="flex flex-col md:flex-row items-center">
						<div className="md:w-1/3 p-2 flex justify-center">
							<div className="w-48 h-auto relative">
								<Image
									src="/images/venture-builder-logo-white.png"
									alt="VentureBuilder Logo"
									width={300}
									height={150}
									className="object-contain invert-on-light"
								/>
							</div>
						</div>
						<div className="md:w-2/3 p-6">
							<h2 className="text-2xl font-semibold gradient-heading mb-4">
								Current Investment Focus
							</h2>
							<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
								Right now I&apos;m working with{" "}
								<a
									href="https://venturebuilder.vc"
									target="_blank"
									rel="noopener noreferrer"
									className="text-[rgb(var(--color-accent))] hover:underline"
								>
									VentureBuilder.vc
								</a>
								, investing in startups that are running paid pilots with
								NOV to prove out their products in the real world.
							</p>
							<p className="text-[rgba(var(--color-foreground),0.8)]">
								The companies that last are the ones with actual customers
								paying actual money. I care more about revenue traction
								than pitch decks.
							</p>
						</div>
					</div>
				</div>
			</div>

			<div className="mb-16">
				<div className="p-8 border border-[rgba(var(--color-border),0.08)] rounded-lg bg-[rgba(var(--color-foreground),0.03)] text-center">
					<h2 className="text-2xl font-semibold gradient-heading mb-4">
						Discuss Your Startup
					</h2>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-8 max-w-lg mx-auto">
						If you&apos;re building something and want to talk to an investor
						who&apos;s actually been a founder, grab a time.
					</p>
					<a
						href="https://cal.com/afxjzs/startups"
						target="_blank"
						rel="noopener noreferrer"
						className="btn-primary inline-block"
					>
						Schedule a Meeting
					</a>
				</div>
			</div>

			<div className="mb-16">
				<div className="max-w-3xl mx-auto">
					<div className="relative rounded-lg py-6 px-8 bg-[rgba(var(--color-foreground),0.03)]">
						<blockquote className="relative z-10 pl-4">
							<div className="absolute top-0 left-0 w-[2px] h-full bg-[rgba(var(--color-accent),0.4)]"></div>
							<p className="italic text-lg md:text-xl text-[rgba(var(--color-foreground),0.85)] leading-relaxed pl-4">
								&ldquo;{randomQuote.text}&rdquo;
							</p>
							<p className="text-right text-[rgba(var(--color-foreground),0.6)] mt-3 text-base">
								— {randomQuote.author}
							</p>
						</blockquote>
					</div>
					<p className="text-center text-[rgba(var(--color-foreground),0.5)] mt-4 text-sm">
						Not Entirely Dumb Quotes From Actual Investors
					</p>
				</div>
			</div>
		</div>
	)
}
