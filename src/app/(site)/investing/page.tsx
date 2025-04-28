import { Metadata } from "next"
import Image from "next/image"
import { quotes } from "./quotes"

export const metadata: Metadata = {
	title: "Investing | Doug.is",
	description: "Founder-focused investment philosophy and startup advising",
}

// Function to get a random quote from the quotes array
function getRandomQuote() {
	return quotes[Math.floor(Math.random() * quotes.length)]
}

// Function to get a random color theme
function getRandomColorTheme() {
	const colors = ["violet", "cyan", "amber", "magenta"]
	return colors[Math.floor(Math.random() * colors.length)]
}

export default function InvestingPage() {
	// Get a random quote and color theme
	const randomQuote = getRandomQuote()
	const colorTheme = getRandomColorTheme()

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
					Former founder who understands what it takes to build something from
					nothing.
				</p>
			</div>

			<div className="mb-16">
				<div className="relative rounded-lg overflow-hidden mb-8">
					<div className="absolute inset-0 bg-gradient-to-r from-[rgba(var(--color-violet),0.2)] to-[rgba(var(--color-cyan),0.2)] -z-10"></div>
					<div className="relative z-10 p-8 border border-[rgba(var(--color-foreground),0.05)] rounded-lg bg-[rgba(var(--color-background),0.8)] backdrop-blur-sm">
						<h2 className="text-2xl font-semibold gradient-heading mb-6">
							Investment Philosophy
						</h2>
						<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
							Most VCs today aren't former founders. They're MBAs who don't
							truly understand what it takes to start a company and make it
							successful. Building a startup requires more than just capital—it
							requires experience, grit, and real-world understanding.
						</p>
						<p className="text-[rgba(var(--color-foreground),0.8)]">
							I believe entrepreneurialism is the best thing about this country.
							It's better to make a job than get a job. Whether it's finding
							alternative pathways to funding, making key introductions at the
							right time, or backing a founder's vision with capital, my goal is
							to help startups succeed on their terms.
						</p>
					</div>
				</div>
			</div>

			<div className="mb-16">
				<div className="relative rounded-lg overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-[rgba(var(--color-emerald),0.1)] to-[rgba(var(--color-emerald),0.05)] -z-10"></div>
					<div className="relative z-10 p-8 border border-[rgba(var(--color-foreground),0.05)] rounded-lg bg-[rgba(var(--color-background),0.8)] backdrop-blur-sm">
						<div className="flex flex-col md:flex-row items-center">
							<div className="md:w-1/3 p-2 flex justify-center">
								<div className="w-48 h-auto relative dark:hidden">
									<Image
										src="/images/venture-builder-logo.png"
										alt="VentureBuilder Logo"
										width={300}
										height={150}
										className="object-contain"
									/>
								</div>
								<div className="w-48 h-auto relative hidden dark:block">
									<Image
										src="/images/venture-builder-logo-white.png"
										alt="VentureBuilder Logo"
										width={300}
										height={150}
										className="object-contain"
									/>
								</div>
							</div>
							<div className="md:w-2/3 p-6">
								<h2 className="text-2xl font-semibold gradient-heading mb-4">
									Current Investment Focus
								</h2>
								<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
									I'm currently working with{" "}
									<a
										href="https://venturebuilder.vc"
										target="_blank"
										rel="noopener noreferrer"
										className="neon-link"
									>
										VentureBuilder.vc
									</a>
									, investing in companies that are working closely with NOV
									through paid pilots to grow and scale their businesses.
								</p>
								<p className="text-[rgba(var(--color-foreground),0.8)]">
									The most successful companies develop sustainable business
									models with real customers and revenue. My focus is on helping
									startups form meaningful commercial relationships that drive
									growth while providing immediate value.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mb-16">
				<div className="relative rounded-lg overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-r from-[rgba(var(--color-violet),0.1)] to-[rgba(var(--color-cyan),0.1)] -z-10"></div>
					<div className="relative z-10 p-8 border border-[rgba(var(--color-foreground),0.05)] rounded-lg bg-[rgba(var(--color-background),0.8)] backdrop-blur-sm text-center">
						<h2 className="text-2xl font-semibold gradient-heading mb-4">
							Discuss Your Startup
						</h2>
						<p className="text-[rgba(var(--color-foreground),0.8)] mb-8 max-w-lg mx-auto">
							If you're building something interesting and looking for an
							investor who understands the founder journey, let's talk.
						</p>
						<a
							href="https://cal.com/afxjzs/startups"
							target="_blank"
							rel="noopener noreferrer"
							className="neon-button-magenta inline-block"
						>
							Schedule a Meeting
						</a>
					</div>
				</div>
			</div>

			<div className="mb-16">
				<div className="max-w-3xl mx-auto">
					<div className="relative rounded-lg py-6 px-8 bg-[rgba(var(--color-background),0.6)] backdrop-blur-sm">
						<div
							className={`absolute inset-0 bg-gradient-to-b from-[rgba(var(--color-${colorTheme}),0.03)] to-transparent rounded-lg opacity-80`}
						></div>
						<div
							className={`absolute -inset-px bg-gradient-to-b from-[rgba(var(--color-${colorTheme}),0.06)] to-transparent rounded-lg blur-sm`}
						></div>
						<blockquote className="relative z-10 pl-4">
							<div
								className={`absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-[rgba(var(--color-${colorTheme}),0.5)] to-[rgba(var(--color-${colorTheme}),0.2)]`}
							></div>
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
