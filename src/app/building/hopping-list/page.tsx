import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"
import Image from "next/image"

export const metadata: Metadata = {
	title: "Hopping List | Building | Doug.is",
	description:
		"A dynamic shopping list app for families and couples that lets you manage items across multiple stores",
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

			<div className="relative h-160 rounded-lg overflow-hidden mb-12">
				<Image
					src="/images/projects/hopping-list/overview.webp"
					alt="Hopping List Overview"
					fill
					className="object-contain"
					priority
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
				<div className="dark-card">
					<h2 className="text-xl font-semibold gradient-text-cyan mb-4">
						Technologies
					</h2>
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
							Custom FlutterFlow components
						</li>
					</ul>
				</div>

				<div className="dark-card">
					<h2 className="text-xl font-semibold gradient-text-magenta mb-4">
						Features
					</h2>
					<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Add items to multiple stores at once
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Store-specific shopping lists
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Real-time list updates
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Shared lists for families/couples
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Simple, intuitive UI
						</li>
					</ul>
				</div>

				<div className="dark-card">
					<h2 className="text-xl font-semibold gradient-text-violet mb-4">
						Links
					</h2>
					<div className="space-y-4">
						<div>
							<Link
								href="https://testflight.apple.com/join/CscPEAD4"
								target="_blank"
								rel="noopener noreferrer"
								className="neon-button-cyan w-full text-center inline-block"
							>
								TestFlight (iOS)
							</Link>
						</div>
						<div>
							<Link
								href="https://github.com/afxjzs/hoppinglist"
								target="_blank"
								rel="noopener noreferrer"
								className="neon-button-violet w-full text-center inline-block"
							>
								GitHub Repository
							</Link>
						</div>
					</div>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Project Overview
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

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Development Process
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
						Hopping List was developed using FlutterFlow, a visual development
						platform for Flutter apps, which enabled rapid prototyping and
						iteration. Supabase provides the backend with PostgreSQL database,
						authentication, and real-time updates for shared lists.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
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

			<div className="flex justify-center mb-8">
				<Link
					href="https://testflight.apple.com/join/CscPEAD4"
					target="_blank"
					rel="noopener noreferrer"
					className="neon-button-magenta"
				>
					Try on TestFlight
				</Link>
			</div>

			<div className="flex justify-center">
				<Link href="/building" className="neon-button-cyan">
					← Back to Projects
				</Link>
			</div>
		</div>
	)
}
