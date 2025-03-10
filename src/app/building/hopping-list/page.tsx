import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"

export const metadata: Metadata = {
	title: "Hopping List | Building | Doug.is",
	description:
		"A shopping list app that helps you organize your grocery shopping by store sections",
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
					A shopping list app that helps you organize your grocery shopping by
					store sections.
				</p>
			</div>

			<div className="relative h-80 rounded-lg overflow-hidden mb-12">
				<SafeImage
					src="/images/projects/hopping-list.jpg"
					alt="Hopping List"
					fill
					className="object-cover"
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
							Next.js
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							React
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Tailwind CSS
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Supabase
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							TypeScript
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
							Store section organization
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Shareable lists
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Item history and suggestions
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Offline support
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Dark/light mode
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
								href="https://hopping-list.vercel.app"
								target="_blank"
								rel="noopener noreferrer"
								className="neon-button-cyan w-full text-center inline-block"
							>
								Live Demo
							</Link>
						</div>
						<div>
							<Link
								href="https://github.com/afxjzs/hopping-list"
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
						Hopping List was created to solve the common problem of inefficient
						grocery shopping. By organizing items by store section, shoppers can
						navigate stores more efficiently, saving time and reducing the
						chance of forgetting items.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						The app allows users to create multiple lists, share them with
						family members or roommates, and track frequently purchased items
						for quick addition to future lists.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						Built with Next.js and Supabase, Hopping List features real-time
						updates, offline support, and a responsive design that works well on
						mobile devices while shopping.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Development Challenges
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						One of the main challenges was implementing an intuitive
						drag-and-drop interface for reordering items and sections while
						maintaining state synchronization with the backend.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Another challenge was ensuring offline functionality worked
						seamlessly, with changes syncing properly once connectivity was
						restored.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						The project also required careful consideration of data structures
						to efficiently store and retrieve shopping lists, items, and store
						sections while maintaining good performance.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Future Plans
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Future development plans include:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-[rgba(var(--color-foreground),0.8)]">
						<li>Integration with grocery store APIs for price comparison</li>
						<li>
							Recipe integration to automatically add ingredients to lists
						</li>
						<li>Smart suggestions based on purchase history and frequency</li>
						<li>Barcode scanning for quick item addition</li>
						<li>Native mobile apps for iOS and Android</li>
					</ul>
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
