import Image from "next/image"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
	title: "About | Doug.is",
	description: "Learn more about Doug and what he does",
}

export default function AboutPage() {
	return (
		<div className="space-y-16">
			{/* Header */}
			<div className="relative py-16 text-center">
				<div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-3xl -z-10"></div>
				<h1 className="text-4xl md:text-5xl font-bold mb-4 relative inline-block">
					<span className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
						About Me
					</span>
					<span className="absolute -inset-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-30 blur-lg"></span>
				</h1>
				<p className="text-xl text-white/80 max-w-2xl mx-auto">
					Exploring investing, advisory, and more through a digital lens.
				</p>
			</div>

			{/* Bio Section */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
				<div className="relative aspect-square max-w-md mx-auto md:mx-0">
					<div className="absolute inset-0 bg-gradient-to-r from-pink-500/30 to-purple-500/30 rounded-xl -z-10 blur-xl"></div>
					<div className="absolute inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl -z-10"></div>
					<div className="relative h-full w-full rounded-xl overflow-hidden border border-white/10">
						<Image
							src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
							alt="Doug's profile"
							fill
							className="object-cover"
							priority
						/>
					</div>
				</div>

				<div className="space-y-6">
					<h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
						Hi, I&apos;m Doug
					</h2>
					<div className="space-y-4 text-white/80">
						<p>
							I&apos;m a professional with expertise in investing and business
							advisory. With over a decade of experience in the financial
							sector, I help individuals and businesses navigate complex
							financial landscapes.
						</p>
						<p>
							My approach combines data-driven analysis with strategic thinking
							to deliver practical solutions. I believe in making complex
							concepts accessible and actionable.
						</p>
						<p>
							When I&apos;m not working, you can find me exploring new
							technologies, contributing to open-source projects, or writing
							about my experiences and insights on this blog.
						</p>
					</div>
				</div>
			</div>

			{/* Expertise Section */}
			<div className="space-y-8">
				<h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent text-center">
					Areas of Expertise
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<ExpertiseCard
						title="Investing"
						description="Strategic investment planning, portfolio management, and market analysis for individuals and organizations."
						gradient="from-blue-500 to-purple-600"
					/>
					<ExpertiseCard
						title="Advisory"
						description="Business strategy, operational optimization, and growth planning for startups and established companies."
						gradient="from-purple-500 to-pink-600"
					/>
					<ExpertiseCard
						title="Technology"
						description="Digital transformation, technology implementation, and innovation strategies for modern businesses."
						gradient="from-pink-500 to-orange-500"
					/>
				</div>
			</div>

			{/* Contact Section */}
			<div className="relative p-8 md:p-12 rounded-xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
				<div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 -z-10"></div>
				<div className="relative z-10 text-center">
					<h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent mb-4">
						Get in Touch
					</h2>
					<p className="text-white/80 max-w-2xl mx-auto mb-6">
						Interested in working together or have questions about my services?
						I&apos;d love to hear from you.
					</p>
					<Link
						href="mailto:contact@doug.is"
						className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-white font-medium hover:opacity-90 transition-opacity inline-block"
					>
						Contact Me
					</Link>
				</div>
			</div>
		</div>
	)
}

function ExpertiseCard({
	title,
	description,
	gradient,
}: {
	title: string
	description: string
	gradient: string
}) {
	return (
		<div className="relative p-6 rounded-xl overflow-hidden border border-white/10 h-full">
			<div
				className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 -z-10`}
			></div>
			<h3 className="text-xl font-bold mb-3">{title}</h3>
			<p className="text-white/70">{description}</p>
		</div>
	)
}
