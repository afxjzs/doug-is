import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"

export const metadata: Metadata = {
	title: "Professional | doug.is",
	description: "Professional experience and resume of Doug Rogers",
}

export default function ProfessionalPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					doug.is/professional
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					My professional experience and resume.
				</p>
			</div>

			<div className="flex justify-end mb-8">
				<Link
					href="/resume.pdf"
					target="_blank"
					rel="noopener noreferrer"
					className="neon-button-cyan"
				>
					Download PDF Resume
				</Link>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Professional Summary
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Experienced software developer and entrepreneur with over 10 years
						of experience in web development, product management, and business
						strategy. Passionate about building innovative solutions that solve
						real-world problems and deliver exceptional user experiences.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						Skilled in modern web technologies including React, Next.js,
						TypeScript, and various backend frameworks. Strong background in
						financial markets, business advisory, and startup ecosystems.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Work Experience
				</h2>

				{/* Experience Item 1 */}
				<div className="dark-card mb-6 group hover:border-[rgba(var(--color-cyan),0.2)]">
					<div className="flex flex-col md:flex-row justify-between mb-4">
						<div>
							<h3 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)] group-hover:text-[rgba(var(--color-cyan),1)] transition-colors">
								Senior Software Engineer
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)]">
								TechCorp Inc.
							</p>
						</div>
						<div className="text-[rgba(var(--color-foreground),0.6)] mt-2 md:mt-0">
							Jan 2020 - Present
						</div>
					</div>
					<ul className="list-disc pl-6 space-y-2 text-[rgba(var(--color-foreground),0.8)]">
						<li>
							Led development of the company&apos;s flagship product, increasing
							user engagement by 45%
						</li>
						<li>
							Architected and implemented a microservices infrastructure that
							improved system reliability by 99.9%
						</li>
						<li>
							Mentored junior developers and established best practices for the
							engineering team
						</li>
						<li>
							Collaborated with product and design teams to create intuitive
							user experiences
						</li>
					</ul>
				</div>

				{/* Experience Item 2 */}
				<div className="dark-card mb-6 group hover:border-[rgba(var(--color-magenta),0.2)]">
					<div className="flex flex-col md:flex-row justify-between mb-4">
						<div>
							<h3 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)] group-hover:text-[rgba(var(--color-magenta),1)] transition-colors">
								Product Manager
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)]">
								InnovateCo
							</p>
						</div>
						<div className="text-[rgba(var(--color-foreground),0.6)] mt-2 md:mt-0">
							Jun 2017 - Dec 2019
						</div>
					</div>
					<ul className="list-disc pl-6 space-y-2 text-[rgba(var(--color-foreground),0.8)]">
						<li>
							Managed the product roadmap for a SaaS platform with 50,000+ users
						</li>
						<li>
							Conducted user research and translated findings into product
							requirements
						</li>
						<li>
							Collaborated with engineering teams to prioritize features and
							ensure timely delivery
						</li>
						<li>
							Increased revenue by 30% through strategic product improvements
							and pricing optimization
						</li>
					</ul>
				</div>

				{/* Experience Item 3 */}
				<div className="dark-card group hover:border-[rgba(var(--color-violet),0.2)]">
					<div className="flex flex-col md:flex-row justify-between mb-4">
						<div>
							<h3 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)] group-hover:text-[rgba(var(--color-violet),1)] transition-colors">
								Founder & CEO
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)]">
								StartupX
							</p>
						</div>
						<div className="text-[rgba(var(--color-foreground),0.6)] mt-2 md:mt-0">
							Jan 2015 - May 2017
						</div>
					</div>
					<ul className="list-disc pl-6 space-y-2 text-[rgba(var(--color-foreground),0.8)]">
						<li>
							Founded a tech startup focused on simplifying financial management
							for small businesses
						</li>
						<li>
							Raised $1.2M in seed funding and grew the team to 12 employees
						</li>
						<li>
							Developed the MVP and acquired the first 500 customers through
							strategic marketing
						</li>
						<li>
							Successfully navigated the company through acquisition by a larger
							financial services firm
						</li>
					</ul>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Education
				</h2>
				<div className="dark-card mb-6">
					<div className="flex flex-col md:flex-row justify-between mb-2">
						<div>
							<h3 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)]">
								Master of Business Administration
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)]">
								Harvard Business School
							</p>
						</div>
						<div className="text-[rgba(var(--color-foreground),0.6)] mt-2 md:mt-0">
							2012 - 2014
						</div>
					</div>
				</div>

				<div className="dark-card">
					<div className="flex flex-col md:flex-row justify-between mb-2">
						<div>
							<h3 className="text-xl font-semibold text-[rgba(var(--color-foreground),0.9)]">
								Bachelor of Science in Computer Science
							</h3>
							<p className="text-[rgba(var(--color-foreground),0.7)]">
								Massachusetts Institute of Technology
							</p>
						</div>
						<div className="text-[rgba(var(--color-foreground),0.6)] mt-2 md:mt-0">
							2008 - 2012
						</div>
					</div>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">Skills</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="dark-card">
						<h3 className="text-xl font-semibold gradient-text-cyan mb-4">
							Technical
						</h3>
						<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								JavaScript/TypeScript
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								React & Next.js
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Node.js
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								SQL & NoSQL Databases
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								AWS & Cloud Infrastructure
							</li>
						</ul>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold gradient-text-magenta mb-4">
							Business
						</h3>
						<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Product Management
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Strategic Planning
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Financial Analysis
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Market Research
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Business Development
							</li>
						</ul>
					</div>

					<div className="dark-card">
						<h3 className="text-xl font-semibold gradient-text-violet mb-4">
							Leadership
						</h3>
						<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Team Management
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Mentoring
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Project Leadership
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Cross-functional Collaboration
							</li>
							<li className="flex items-center">
								<span className="check-mark mr-2">✓</span>
								Public Speaking
							</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="flex justify-center">
				<Link
					href="/resume.pdf"
					target="_blank"
					rel="noopener noreferrer"
					className="neon-button-magenta"
				>
					Download PDF Resume
				</Link>
			</div>
		</div>
	)
}
