import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"
import Image from "next/image"

export const metadata: Metadata = {
	title: "Hopping List | Building | Doug.is",
	description:
		"A dynamic shopping list app for families and couples that lets you manage items across multiple stores",
	openGraph: {
		title: "Hopping List - The Smart Multi-Store Shopping List App",
		description:
			"A shopping list app that shows you what you need at each specific store",
		url: "https://www.doug.is/building/hopping-list",
		siteName: "Doug.is",
		images: [
			{
				url: "https://www.doug.is/images/projects/hopping-list-logo.png",
				width: 800,
				height: 800,
				alt: "Hopping List App Icon",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "Hopping List - Smart Shopping List",
		description:
			"A shopping list app that shows you what you need at each specific store",
		images: ["https://www.doug.is/images/projects/hopping-list-logo.png"],
	},
}

export default function HoppingListPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<Link href="/building" className="neon-link mb-4 inline-block">
					← Back to Projects
				</Link>
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					Hopping List
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					A dynamic shopping list app for families and couples that lets you see
					what you need at each specific store.
				</p>
			</div>

			<div className="relative h-160 rounded-lg overflow-hidden mb-8">
				<Image
					src="/images/projects/hopping-list/overview.webp"
					alt="Hopping List Overview"
					fill
					className="object-contain"
					priority
				/>
			</div>

			{/* Main CTA */}
			<div className="flex justify-center mb-12">
				<Link
					href="https://testflight.apple.com/join/CscPEAD4"
					target="_blank"
					rel="noopener noreferrer"
					className="neon-button-magenta text-xl py-3 px-8"
				>
					Sign up to be a beta tester
				</Link>
			</div>

			{/* How to become a beta tester */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					How to Become a Beta Tester
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Becoming a beta tester for Hopping List is simple and free:
					</p>
					<ol className="list-decimal pl-6 space-y-3 text-[rgba(var(--color-foreground),0.8)]">
						<li>
							<strong>Download TestFlight</strong> - First, download the free
							TestFlight app from the App Store. TestFlight is Apple's official
							app for testing beta versions.
						</li>
						<li>
							<strong>Join the Hopping List Beta</strong> - Click the "Sign up
							to be a beta tester" button above, or use{" "}
							<Link
								href="https://testflight.apple.com/join/CscPEAD4"
								className="text-[rgba(var(--color-magenta),0.9)] hover:text-[rgba(var(--color-magenta),1)] underline"
							>
								this TestFlight link
							</Link>
							.
						</li>
						<li>
							<strong>Install Hopping List</strong> - Once you've joined the
							beta through TestFlight, you can install Hopping List directly
							from the TestFlight app.
						</li>
						<li>
							<strong>Provide Feedback</strong> - Your feedback is invaluable to
							me and helps improve the app before its official release.
						</li>
					</ol>
					<div className="mt-6 p-4 bg-[rgba(var(--color-foreground),0.05)] rounded-lg border border-[rgba(var(--color-foreground),0.1)]">
						<p className="text-[rgba(var(--color-foreground),0.8)]">
							<strong>Note:</strong> TestFlight is only available for iOS
							devices. Android version coming soon, probably.
						</p>
					</div>
				</div>
			</div>

			{/* Features */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Key Features
				</h2>
				<div className="dark-card">
					<ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[rgba(var(--color-foreground),0.8)]">
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Add Items to Multiple Stores</strong>
								<p>
									Add a single item to appear on lists for multiple locations
								</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Store-Specific Shopping Lists</strong>
								<p>
									Only see items available at the store you're currently
									shopping at
								</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Real-time List Updates</strong>
								<p>Changes instantly sync between family members</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Simple, Intuitive UI</strong>
								<p>No complex setup or learning curve required</p>
							</div>
						</li>
					</ul>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					The Problem & Solution
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Hopping List was created to solve the common problem faced by
						couples and families: efficiently managing shopping lists across
						multiple stores. Most existing solutions are either too simplistic
						or overly complicated.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						The core feature that sets Hopping List apart is the ability to add
						a single item to multiple store locations. When you're at a specific
						store, you only see the items you need that are available at that
						location.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						For example, if you need milk and it's available at both Target and
						Safeway, you'll see it on both store lists. But if broccoli is only
						available at Trader Joe's, it will only appear when you're shopping
						there.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Pain Points Solved
				</h2>
				<div className="dark-card">
					<ul className="list-disc pl-6 space-y-3 text-[rgba(var(--color-foreground),0.8)]">
						<li>
							<strong>Real-time List Updates:</strong> No more uncertainty about
							what needs to be purchased with live-updating shared lists
						</li>
						<li>
							<strong>Simplicity First:</strong> Other solutions were too
							complicated with unnecessary features like aisle tracking -
							everyone knows where bread is located...
						</li>
						<li>
							<strong>Store-Specific Lists:</strong> When shopping, you only see
							what's needed AND available at your current location
						</li>
						<li>
							<strong>No Subscription Required:</strong> Unlike many shopping
							list apps, Hopping List doesn't charge a monthly fee or any fee
							for that matter. It's not even in the app store yet.
						</li>
					</ul>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					App Screenshots
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="dark-card p-4">
						<div className="mb-3">
							<Image
								src="/images/projects/hopping-list/homescreen.png"
								alt="Hopping List Home Screen"
								width={400}
								height={800}
								className="rounded-lg mx-auto"
							/>
						</div>
						<p className="text-center text-[rgba(var(--color-foreground),0.7)]">
							Home screen showing your stores
						</p>
					</div>
					<div className="dark-card p-4">
						<div className="mb-3">
							<Image
								src="/images/projects/hopping-list/edit-apples.png"
								alt="Editing an item for multiple stores"
								width={400}
								height={800}
								className="rounded-lg mx-auto"
							/>
						</div>
						<p className="text-center text-[rgba(var(--color-foreground),0.7)]">
							Adding an item to multiple store locations
						</p>
					</div>
					<div className="dark-card p-4">
						<div className="mb-3">
							<Image
								src="/images/projects/hopping-list/safeway.png"
								alt="Safeway Shopping List"
								width={400}
								height={800}
								className="rounded-lg mx-auto"
							/>
						</div>
						<p className="text-center text-[rgba(var(--color-foreground),0.7)]">
							Store-specific shopping list for Safeway
						</p>
					</div>
					<div className="dark-card p-4">
						<div className="mb-3">
							<Image
								src="/images/projects/hopping-list/tjs.png"
								alt="Trader Joe's Shopping List"
								width={400}
								height={800}
								className="rounded-lg mx-auto"
							/>
						</div>
						<p className="text-center text-[rgba(var(--color-foreground),0.7)]">
							Trader Joe's list with different items
						</p>
					</div>
				</div>
			</div>

			{/* Secondary CTA */}
			<div className="flex justify-center mb-16">
				<Link
					href="https://testflight.apple.com/join/CscPEAD4"
					target="_blank"
					rel="noopener noreferrer"
					className="neon-button-magenta text-xl py-3 px-8"
				>
					Become a Beta Tester Now
				</Link>
			</div>

			<hr className="border-[rgba(var(--color-foreground),0.1)] mb-12" />

			{/* Technical Details Section */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Behind the App
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						I built Hopping List after my wife and I couldn't find a shopping
						list app that worked for us - all the existing options were either
						too simplistic or overcomplicated with unnecessary features. At the
						same time, I needed to familiarize myself with FlutterFlow for
						building a much more complex app for DubPrime, so this project
						served dual purposes.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						The app was designed with simplicity in mind, focusing on solving
						the core problem without unnecessary complexity. The user interface
						is intuitive, making it easy for anyone to use without a learning
						curve.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						The app is currently available in TestFlight for iOS users, with
						plans for a full App Store release and Android version in the
						future.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				<div className="dark-card">
					<h2 className="text-xl font-semibold gradient-text-cyan mb-4">
						Technical Details
					</h2>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Hopping List was developed using FlutterFlow, a visual development
						platform for Flutter apps, which enabled rapid prototyping and
						iteration. Supabase provides the backend with PostgreSQL database,
						authentication, and real-time updates for shared lists.
					</p>
					<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Flutter
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							FlutterFlow
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Supabase
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							PostgreSQL
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Custom FlutterFlow Components
						</li>
					</ul>
				</div>

				<div className="dark-card">
					<h2 className="text-xl font-semibold gradient-text-violet mb-4">
						Development Resources
					</h2>
					<div className="space-y-4">
						<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
							Source code and resources for developers interested in the
							technical implementation.
						</p>
						<div>
							<Link
								href="https://github.com/afxjzs/hoppinglist"
								target="_blank"
								rel="noopener noreferrer"
								className="neon-button-magenta w-full text-center inline-block"
							>
								GitHub Repository
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-center">
				<Link href="/building" className="neon-button-magenta">
					← Back to Projects
				</Link>
			</div>
		</div>
	)
}
