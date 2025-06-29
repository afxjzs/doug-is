import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"

export const metadata: Metadata = {
	title: "JustAte | Building | Doug.is",
	description:
		"A timer app that reminds you to exercise at the optimal time after eating to kickstart your metabolism",
	openGraph: {
		title: "JustAte - Post-Meal Exercise Timer",
		description:
			"A timer app that reminds you to exercise at the optimal time after eating to boost metabolism",
		url: "https://doug.is/building/just-ate",
		siteName: "Doug.is",
		type: "website",
		images: [
			{
				url: "https://doug.is/images/projects/just-ate.jpg",
				width: 1200,
				height: 630,
				alt: "JustAte Exercise Timer App",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "JustAte - Post-Meal Exercise Timer",
		description:
			"A timer app that reminds you to exercise at the optimal time after eating to boost metabolism",
		images: ["https://doug.is/images/projects/just-ate.jpg"],
		creator: "@afxjzs",
	},
	alternates: {
		canonical: "https://doug.is/building/just-ate",
	},
}

export default function JustAtePage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<Link href="/building" className="neon-link mb-4 inline-block">
					← Back to Projects
				</Link>
				<h1 className="text-4xl font-bold gradient-heading mb-4">JustAte</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					A timer app that reminds you to exercise at the optimal time after
					eating to kickstart your metabolism.
				</p>
			</div>

			<div className="relative h-80 rounded-lg overflow-hidden mb-12 bg-gradient-to-r from-cyan-900/30 to-purple-900/30">
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="text-6xl">⏱️ 🍽️ 💪</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
				<div className="dark-card">
					<h2 className="text-xl font-semibold gradient-text-cyan mb-4">
						Technologies
					</h2>
					<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Swift
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							SwiftUI
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							HealthKit
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Local Notifications
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Core Data
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
							Simple one-tap timer activation
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Customizable exercise duration (90-120s)
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Suggested exercise routines
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Meal tracking integration
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Progress and habit tracking
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
								href="https://apps.apple.com/us/app/justateapp"
								target="_blank"
								rel="noopener noreferrer"
								className="neon-button-cyan w-full text-center inline-block"
							>
								App Store
							</Link>
						</div>
						<div>
							<Link
								href="https://justateapp.com"
								target="_blank"
								rel="noopener noreferrer"
								className="neon-button-violet w-full text-center inline-block"
							>
								Website
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
						JustAte was developed based on research showing that short bursts of
						exercise after eating can significantly improve metabolism and help
						with digestion and nutrient absorption. The app solves the problem
						of remembering to exercise at the optimal time window after a meal.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						The concept is simple: after finishing a meal, you tap the timer,
						and the app will notify you at the perfect moment to do a quick
						90-120 second exercise routine. This small habit can lead to
						significant metabolic improvements over time.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						JustAte also provides a variety of quick exercise suggestions that
						can be done anywhere - even at work or in a restaurant - without
						requiring special equipment or causing excessive sweating. The focus
						is on gentle movement that stimulates metabolism rather than intense
						workouts.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Development Challenges
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						One of the main challenges was determining the optimal timing for
						exercise notifications based on different meal types. We worked with
						nutritionists to develop algorithms that suggest slightly different
						timing windows depending on the meal composition (if the user
						chooses to input this data).
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Creating exercise routines that are effective yet simple enough to
						be done anywhere required collaboration with fitness experts. We
						needed to ensure the exercises would provide metabolic benefits
						while being accessible to users of all fitness levels.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						Designing the app to be minimally intrusive while still effective
						was another challenge. We focused on creating a streamlined user
						experience that requires minimal interaction - just a single tap
						after eating - while still providing enough value to make users want
						to continue the habit.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Health Benefits
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						JustAte is based on scientific research showing several benefits of
						post-meal exercise:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-[rgba(var(--color-foreground),0.8)]">
						<li>
							Improved blood glucose regulation, especially important for those
							with insulin sensitivity issues
						</li>
						<li>Enhanced nutrient absorption and distribution to muscles</li>
						<li>Reduced post-meal fatigue and energy dips</li>
						<li>Improved digestion and reduced bloating</li>
						<li>
							Gradual improvement in metabolic rate over time with consistent
							use
						</li>
					</ul>
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
						<li>Android version of the app</li>
						<li>Integration with popular meal tracking and fitness apps</li>
						<li>
							Apple Watch app for easier timer activation and guided exercises
						</li>
						<li>
							Personalized exercise recommendations based on user feedback and
							results
						</li>
						<li>
							Community features to encourage habit formation through social
							accountability
						</li>
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
