import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
	title: "Oil Price Ticker | Building | Doug.is",
	description:
		"A macOS menu bar app that displays live oil price updates with customizable preferences and real-time data.",
	openGraph: {
		title: "Oil Price Ticker - Live Oil Prices in Your Mac Menu Bar",
		description:
			"A simple macOS menu bar app that keeps you updated with live oil price data",
		url: "https://www.doug.is/building/oil-price-ticker",
		siteName: "Doug.is",
		images: [
			{
				url: "https://www.doug.is/images/projects/oil-price-ticker/oil-price-icon.png",
				width: 256,
				height: 256,
				alt: "Oil Price Ticker App Icon",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Oil Price Ticker - Live Oil Prices in Your Mac Menu Bar",
		description:
			"A simple macOS menu bar app that keeps you updated with live oil price data",
		images: [
			"https://www.doug.is/images/projects/oil-price-ticker/oil-price-icon.png",
		],
	},
}

export default function OilPriceTickerPage() {
	return (
		<div className="max-w-4xl mx-auto">
			{/* Breadcrumb Navigation */}
			<div className="mb-8">
				<Link
					href="/building"
					className="text-[rgba(var(--color-orange),0.8)] hover:text-[rgba(var(--color-orange),1)] transition-colors inline-flex items-center gap-2"
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
				<div className="text-center mb-8">
					<h1 className="text-5xl font-bold gradient-heading mb-6">
						Oil Price Ticker
					</h1>
					<p className="text-xl text-[rgba(var(--color-foreground),0.8)] max-w-2xl mx-auto leading-relaxed">
						A macOS menu bar app that displays live oil price updates with
						customizable preferences and real-time data. Working with NOV, so
						that means the price of oil is important to me and I just wanted to
						see how fast I could put this together. <br />
						Turns out it was about 45 minutes end to end.
					</p>
				</div>

				{/* Main Screenshot */}
				<div className="relative w-full max-w-3xl mx-auto mb-8 rounded-xl overflow-hidden bg-[rgba(var(--color-background),0.6)] p-8">
					<Image
						src="/images/projects/oil-price-ticker/oil-price-ticker-screenshot.png"
						alt="Oil Price Ticker Screenshot"
						width={800}
						height={600}
						className="w-full h-auto rounded-lg shadow-lg"
						priority
					/>
				</div>

				{/* Primary CTA Buttons */}
				<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
					<Link
						href="/files/OilPriceTicker.zip"
						download
						className="neon-button-orange text-lg px-8 py-3 flex items-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7,10 12,15 17,10" />
							<line x1="12" y1="15" x2="12" y2="3" />
						</svg>
						Download for macOS
					</Link>
					<Link
						href="https://github.com/afxjzs/oil-price-ticker"
						target="_blank"
						rel="noopener noreferrer"
						className="text-[rgba(var(--color-foreground),0.7)] hover:text-[rgba(var(--color-orange),0.9)] transition-colors border border-[rgba(var(--color-foreground),0.2)] hover:border-[rgba(var(--color-orange),0.3)] px-6 py-3 rounded-lg flex items-center gap-2"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
						</svg>
						View Source
					</Link>
				</div>
			</div>

			{/* Key Features Section */}
			<div className="mb-16">
				<h2 className="text-3xl font-bold gradient-heading mb-8 text-center">
					Key Features
				</h2>
				<div className="grid md:grid-cols-3 gap-8">
					<div className="text-center p-6 bg-[rgba(var(--color-orange),0.05)] border border-[rgba(var(--color-orange),0.1)] rounded-xl">
						<div className="w-16 h-16 mx-auto mb-4 bg-[rgba(var(--color-orange),0.1)] rounded-full flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 text-[rgba(var(--color-orange),0.8)]"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
							</svg>
						</div>
						<h3 className="text-xl font-semibold mb-2 text-[rgba(var(--color-orange),0.9)]">
							Live Updates
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)]">
							Real-time oil price data updated automatically in your menu bar
						</p>
					</div>

					<div className="text-center p-6 bg-[rgba(var(--color-orange),0.05)] border border-[rgba(var(--color-orange),0.1)] rounded-xl">
						<div className="w-16 h-16 mx-auto mb-4 bg-[rgba(var(--color-orange),0.1)] rounded-full flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 text-[rgba(var(--color-orange),0.8)]"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<rect width="18" height="18" x="3" y="3" rx="2" />
								<path d="M3 9h18" />
								<path d="M9 21V9" />
							</svg>
						</div>
						<h3 className="text-xl font-semibold mb-2 text-[rgba(var(--color-orange),0.9)]">
							Menu Bar Integration
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)]">
							Seamlessly integrates with macOS menu bar for easy access
						</p>
					</div>

					<div className="text-center p-6 bg-[rgba(var(--color-orange),0.05)] border border-[rgba(var(--color-orange),0.1)] rounded-xl">
						<div className="w-16 h-16 mx-auto mb-4 bg-[rgba(var(--color-orange),0.1)] rounded-full flex items-center justify-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-8 w-8 text-[rgba(var(--color-orange),0.8)]"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
								<circle cx="12" cy="12" r="3" />
							</svg>
						</div>
						<h3 className="text-xl font-semibold mb-2 text-[rgba(var(--color-orange),0.9)]">
							Customizable Preferences
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)]">
							Adjust update intervals and display settings to your preferences
						</p>
					</div>
				</div>
			</div>

			{/* Screenshots Section */}
			<div className="mb-16">
				<h2 className="text-3xl font-bold gradient-heading mb-8 text-center">
					Screenshots
				</h2>
				<div className="grid md:grid-cols-2 gap-8">
					<div className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] rounded-xl p-6">
						<h3 className="text-xl font-semibold mb-4 text-[rgba(var(--color-orange),0.9)]">
							Main Screenshot
						</h3>
						<div className="relative w-full h-64 rounded-lg overflow-hidden">
							<Image
								src="/images/projects/oil-price-ticker/oil-price-ticker-screenshot.png"
								alt="Oil Price Ticker Main Screenshot"
								fill
								style={{ objectFit: "contain" }}
								className="rounded-lg"
							/>
						</div>
					</div>

					<div className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] rounded-xl p-6">
						<h3 className="text-xl font-semibold mb-4 text-[rgba(var(--color-orange),0.9)]">
							Preferences
						</h3>
						<div className="relative w-full h-64 rounded-lg overflow-hidden">
							<Image
								src="/images/projects/oil-price-ticker/oil-price-ticker-pref-screenshot.png"
								alt="Preferences Screenshot"
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
				<h2 className="text-3xl font-bold gradient-heading mb-8 text-center">
					Technical Requirements
				</h2>
				<div className="bg-[rgba(var(--color-foreground),0.03)] border border-[rgba(var(--color-foreground),0.08)] rounded-xl p-8">
					<div className="grid md:grid-cols-2 gap-8">
						<div>
							<h3 className="text-xl font-semibold mb-4 text-[rgba(var(--color-orange),0.9)]">
								Compatibility
							</h3>
							<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
								<li className="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-[rgba(var(--color-orange),0.8)]"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m9 12 2 2 4-4" />
									</svg>
									macOS 10.12 or later
								</li>
								<li className="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-[rgba(var(--color-orange),0.8)]"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m9 12 2 2 4-4" />
									</svg>
									Intel and Apple Silicon supported
								</li>
								<li className="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-[rgba(var(--color-orange),0.8)]"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m9 12 2 2 4-4" />
									</svg>
									Internet connection required
								</li>
							</ul>
						</div>

						<div>
							<h3 className="text-xl font-semibold mb-4 text-[rgba(var(--color-orange),0.9)]">
								Technologies
							</h3>
							<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
								<li className="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-[rgba(var(--color-orange),0.8)]"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m9 12 2 2 4-4" />
									</svg>
									Swift & Objective-C
								</li>
								<li className="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-[rgba(var(--color-orange),0.8)]"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m9 12 2 2 4-4" />
									</svg>
									Cocoa frameworks
								</li>
								<li className="flex items-center gap-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4 text-[rgba(var(--color-orange),0.8)]"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="m9 12 2 2 4-4" />
									</svg>
									REST API integration
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Call to Action */}
			<div className="text-center">
				<h2 className="text-3xl font-bold gradient-heading mb-6">
					Ready to track oil prices?
				</h2>
				<p className="text-lg text-[rgba(var(--color-foreground),0.7)] mb-8 max-w-2xl mx-auto">
					Download Oil Price Ticker now and keep up with live oil market data
					directly from your macOS menu bar. If it breaks or you have any
					issues, feel free to{" "}
					<Link
						href="/contact"
						className="text-[rgba(var(--color-orange),0.8)] hover:text-[rgba(var(--color-orange),1)] transition-colors"
					>
						reach out
					</Link>
					.
				</p>
				<Link
					href="/files/OilPriceTicker.zip"
					download
					className="neon-button-orange text-lg px-8 py-3 inline-flex items-center gap-2"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="7,10 12,15 17,10" />
						<line x1="12" y1="15" x2="12" y2="3" />
					</svg>
					Download for macOS
				</Link>
			</div>
		</div>
	)
}
