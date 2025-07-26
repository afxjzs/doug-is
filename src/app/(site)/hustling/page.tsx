import { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import SocialIcons from "@/components/SocialIcons"
import ConnectCta from "@/components/ConnectCta"

export const metadata: Metadata = {
	title: "doug.is / Hustling",
	description: "About me and how to get in touch",
}

export default function HustlingPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="text-4xl font-bold gradient-heading mb-4">Hey...</h1>
				{/* <p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					About me, my work, and how to get in touch.
				</p> */}
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
				<div>
					<div className="relative h-80 rounded-lg overflow-hidden mb-2">
						<Image
							src="/images/doug-lola.webp"
							alt="Doug Rogers with his cat Lola"
							fill
							className="object-cover"
							priority
						/>
					</div>
					<p className="text-sm text-center text-[rgba(var(--color-foreground),0.6)] italic">
						Doug & Lola (c. 2024)
					</p>
				</div>
				<div>
					<h2 className="text-2xl font-semibold gradient-heading mb-4">
						About Me
					</h2>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						I&apos;m Doug Rogers, a passionate developer, investor, and
						entrepreneur. With over 25 years of experience in the tech industry,
						I specialize in building modern web applications, helping B2b
						startups, and providing strategic advisory services.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-6">
						My background spans software development, product design, and
						general engineering. I enjoy combining these disciplines to create
						innovative solutions and help businesses grow.
					</p>
					<SocialIcons iconSize="small" />
				</div>
			</div>

			<div className="bg-[rgba(var(--color-foreground),0.02)] border border-[rgba(var(--color-foreground),0.05)] p-8 rounded-lg mb-16">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					What I Do
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="dark-card">
						<h3 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)] mb-3">
							Development
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)]">
							Building modern mobile &amp; web applications with Typescript,
							Ruby, Flutter, Swift, and other technologies.
						</p>
					</div>
					<div className="dark-card">
						<h3 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)] mb-3">
							Investing
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)]">
							I work directly with corporate accelerator programs, as well as
							invest my own money from time to time.
						</p>
					</div>
					<div className="dark-card">
						<h3 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)] mb-3">
							Advisory
						</h3>
						<p className="text-[rgba(var(--color-foreground),0.7)]">
							Helping businesses grow through strategic planning, product
							development, and technical guidance.
						</p>
					</div>
				</div>
			</div>
			<div className="mb-16">
				<figure>
					<Image
						src="/images/tech-crunch.jpg"
						alt="TechCrunch article featuring Doug Rogers"
						width={800}
						height={400}
						className="rounded-lg w-full"
						priority
					/>
					<figcaption className="text-center text-sm text-[rgba(var(--color-foreground),0.7)] mt-2">
						Pitching DubPrime on stage at TechCrunch Disrupt 2024
					</figcaption>
				</figure>
			</div>

			{/* Connect CTA Section */}
			<ConnectCta
				className="mb-16"
				title="Ready to Work Together?"
				description="Whether you have a project in mind or just want to chat about opportunities, I'm always open to new connections."
				buttonText="Let's Connect"
				buttonHref="/connecting"
			/>
		</div>
	)
}
