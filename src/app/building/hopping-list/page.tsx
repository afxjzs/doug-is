import Link from "next/link"
import SafeImage from "@/components/SafeImage"
import Image from "next/image"
import {
	getCanonicalUrl,
	getSocialImageUrl,
	getSiteName,
} from "@/lib/utils/domain-detection"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({
	trail: ["building", "Hopping List"],
	description:
		"A dynamic shopping list app for families and couples that lets you manage items across multiple stores",
	path: "/building/hopping-list",
	image: { url: "/images/projects/hopping-list-logo.png", width: 800, height: 800 },
})

export default function HoppingListPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<Link href="/building" className="text-[rgb(var(--color-accent))] hover:text-[rgba(var(--color-accent),0.8)] transition-colors mb-4 inline-block">
					← Back to Projects
				</Link>
				<h1 className="text-4xl font-bold display-heading mb-4">
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
			<div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
				<Link
					href="https://testflight.apple.com/join/CscPEAD4"
					target="_blank"
					rel="noopener noreferrer"
					className="btn-primary text-xl py-3 px-8"
				>
					Sign up to be a beta tester
				</Link>
				<Link
					href="/building/hopping-list/feedback"
					className="btn-secondary text-xl py-3 px-8"
				>
					Give Feedback
				</Link>
			</div>

			{/* How to become a beta tester */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold display-heading mb-6">
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
								className="text-[rgb(var(--color-accent))] hover:text-[rgba(var(--color-accent),0.8)] underline"
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
							<strong>Provide Feedback</strong> - Tell me what works and
							what doesn&apos;t. Seriously, it helps a lot.{" "}
							<Link
								href="/building/hopping-list/feedback"
								className="text-[rgb(var(--color-accent))] hover:text-[rgba(var(--color-accent),0.8)] underline font-medium"
							>
								Submit feedback here
							</Link>
							.
						</li>
					</ol>
					<div className="mt-6 p-4 bg-[rgba(var(--color-foreground),0.05)] rounded-lg border border-[rgba(var(--color-foreground),0.1)]">
						<p className="text-[rgba(var(--color-foreground),0.8)] mb-3">
							<strong>Note:</strong> Hopping List needs an iPhone or iPad on
							iOS 17 or later. Android version coming soon, probably.
						</p>
						<div className="flex flex-wrap gap-3">
							<Link
								href="/building/hopping-list/feedback"
								className="text-sm text-[rgb(var(--color-accent))] hover:text-[rgba(var(--color-accent),0.8)] underline"
							>
								Report a Bug
							</Link>
							<Link
								href="/building/hopping-list/feedback"
								className="text-sm text-[rgb(var(--color-accent))] hover:text-[rgba(var(--color-accent),0.8)] underline"
							>
								Request a Feature
							</Link>
						</div>
					</div>
				</div>
			</div>

			{/* Features */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold display-heading mb-6">
					Key Features
				</h2>
				<div className="dark-card">
					<ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[rgba(var(--color-foreground),0.8)]">
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Add Items to Multiple Stores</strong>
								<p>
									Add an item once and pick every store that carries it
								</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Store-Specific Shopping Lists</strong>
								<p>
									Only see items available at the store you&apos;re currently
									shopping at
								</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>One List for the Household</strong>
								<p>
									Join with a group code and a 4-digit PIN. No email, no
									account.
								</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Staples</strong>
								<p>
									Mark what you always buy. Check it off and it comes back
									to your list about 20 hours later.
								</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Scan a Barcode</strong>
								<p>Point the camera at a barcode to add the item</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Scan a Receipt (Beta)</strong>
								<p>
									Take a photo of a receipt, then pick which items to add.
									The photo never leaves your phone. Names come out cleaner
									on a phone with Apple Intelligence.
								</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Aisle Order</strong>
								<p>
									After a few trips, a store&apos;s list sorts in the order
									you usually check things off
								</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Out of Stock</strong>
								<p>
									Swipe an item the store didn&apos;t have. It leaves that
									store&apos;s list for a while and stays on the others.
								</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Recent Activity</strong>
								<p>See who added or picked up what</p>
							</div>
						</li>
						<li className="flex items-start">
							<span className="check-mark mr-2 mt-1">✓</span>
							<div>
								<strong>Works on a Bad Connection</strong>
								<p>
									Your last loaded list shows right away, marked with its
									age, while the app fetches the current one
								</p>
							</div>
						</li>
					</ul>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold display-heading mb-6">
					The Problem & Solution
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						My wife and I shop at like four different stores. Every existing
						list app either does too little or way too much. We just needed
						one list that knows which items go to which stores.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						The main thing: you add an item once and tag it to whichever
						stores carry it. When you&apos;re at a specific store, you only
						see what&apos;s relevant there.
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
				<h2 className="text-2xl font-semibold display-heading mb-6">
					Pain Points Solved
				</h2>
				<div className="dark-card">
					<ul className="list-disc pl-6 space-y-3 text-[rgba(var(--color-foreground),0.8)]">
						<li>
							<strong>One Shared List:</strong> Everyone in the household sees
							the same list, so nobody has to ask what&apos;s needed. A change
							someone else makes shows up the next time you open a list.
						</li>
						<li>
							<strong>Simplicity First:</strong> Other apps wanted me to file
							every item under an aisle and a category. Hopping List asks for
							a name and which stores carry it. It works out the aisle order
							from what you check off first.
						</li>
						<li>
							<strong>Store-Specific Lists:</strong> When shopping, you only see
							what's needed AND available at your current location
						</li>
						<li>
							<strong>Free During the Beta:</strong> No monthly fee, or any fee
							for that matter. It&apos;s not even in the App Store yet.
						</li>
					</ul>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold display-heading mb-6">
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
			<div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
				<Link
					href="https://testflight.apple.com/join/CscPEAD4"
					target="_blank"
					rel="noopener noreferrer"
					className="btn-primary text-xl py-3 px-8"
				>
					Become a Beta Tester Now
				</Link>
				<Link
					href="/building/hopping-list/feedback"
					className="btn-secondary text-xl py-3 px-8"
				>
					Share Your Feedback
				</Link>
			</div>

			<hr className="border-[rgba(var(--color-foreground),0.1)] mb-12" />

			{/* Privacy: what the app stores and sends. Every line must match what
			    the app does; check the app's code before changing one. The id
			    lets other pages link straight to this section. */}
			<div className="mb-12" id="privacy">
				<h2 className="text-2xl font-semibold display-heading mb-6">
					What the App Stores and Sends
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						No account, no ads, no tracking. The details:
					</p>
					<ul className="list-disc pl-6 space-y-3 text-[rgba(var(--color-foreground),0.8)]">
						<li>
							<strong>No account:</strong> You never give the app an email or
							a phone number. You join a household with a group code and a
							PIN, and pick a name for yourself.
						</li>
						<li>
							<strong>Your lists:</strong> Items, stores, notes, and that name
							are saved in the app&apos;s database so your household can share
							them. Only members of your group can read them through the app.
							I run the database, so I can see them too.
						</li>
						<li>
							<strong>Receipts:</strong> A receipt photo never leaves your
							phone. The app reads the text on the phone and drops the lines
							that look like a payment card, a loyalty number, or the
							cashier&apos;s name before it saves anything. The product lines
							you review are saved to your group: what you added, with its
							price, and what you skipped. All groups share one thing: a
							vocabulary of product names (that &quot;MISSION CARB&quot; means
							tortillas), with no prices, dates, or who bought what.
						</li>
						<li>
							<strong>Barcodes:</strong> When you scan a barcode the app
							hasn&apos;t seen, it looks the number up on{" "}
							<Link
								href="https://world.openfoodfacts.org"
								target="_blank"
								rel="noopener noreferrer"
								className="text-[rgb(var(--color-accent))] hover:text-[rgba(var(--color-accent),0.8)] underline"
							>
								Open Food Facts
							</Link>
							, a public product database. It sends the barcode number and
							nothing from your lists.
						</li>
						<li>
							<strong>Errors (new in version 2.0.6):</strong> The app sends me
							its errors and slow requests so I can fix problems without
							asking you for details. A report has the error, the app version,
							your iOS version, and which group and member it came from (as
							ids, not names). It has no item names, store names, or notes. To
							stop it, turn off &quot;Send errors to Doug&quot; in Settings →
							Diagnostics. Reports older than 30 days are deleted the next
							time your phone sends one.
						</li>
					</ul>
					<p className="text-[rgba(var(--color-foreground),0.8)] mt-4">
						Questions?{" "}
						<Link
							href="/building/hopping-list/feedback"
							className="text-[rgb(var(--color-accent))] hover:text-[rgba(var(--color-accent),0.8)] underline"
						>
							Send me a note
						</Link>
						.
					</p>
				</div>
			</div>

			{/* Technical Details Section */}
			<div className="mb-12">
				<h2 className="text-2xl font-semibold display-heading mb-6">
					Behind the App
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						I built Hopping List after my wife and I couldn't find a shopping
						list app that worked for us - all the existing options were either
						too simplistic or overcomplicated with unnecessary features. At the
						same time, I needed to familiarize myself with FlutterFlow for
						building a much more complex app for DubPrime, so this project
						served dual purposes. I&apos;ve since moved it off FlutterFlow to
						plain Flutter.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						I kept it simple on purpose. No meal planning, no recipe
						integration. Just lists, stores, and items. What I&apos;ve added
						since is about getting items in faster: scan a barcode, or a
						whole receipt.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						It&apos;s in TestFlight right now for iOS. Android... eventually.
						Probably.
					</p>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				<div className="dark-card">
					<h2 className="text-xl font-semibold mb-4">
						Technical Details
					</h2>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						It started in FlutterFlow (a visual dev tool for Flutter) because
						I needed to learn it for DubPrime anyway. It&apos;s plain Flutter
						now. Supabase handles the backend: a Postgres database and
						sign-in that needs no account. Receipt scanning runs on the
						phone: Apple&apos;s Vision framework reads the text, and
						Apple&apos;s on-device model cleans up the names.
					</p>
					<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Flutter
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
							Apple Vision (on-device text recognition)
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Open Food Facts (barcode lookups)
						</li>
					</ul>
				</div>

				<div className="dark-card">
					<h2 className="text-xl font-semibold mb-4">
						Development Resources
					</h2>
					<div className="space-y-4">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
							The current code is private. The original FlutterFlow version
							is public if you want to poke around.
						</p>
						<div>
							<Link
								href="https://github.com/afxjzs/hoppinglist"
								target="_blank"
								rel="noopener noreferrer"
								className="btn-primary w-full text-center inline-block"
							>
								Original Version on GitHub
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="flex justify-center">
				<Link href="/building" className="btn-primary">
					← Back to Projects
				</Link>
			</div>
		</div>
	)
}
