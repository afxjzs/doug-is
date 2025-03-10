import Link from "next/link"
import Image from "next/image"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Hire Me | Doug.is",
	description: "Professional experience, skills, and resume of Doug.",
}

export default function HireablePage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-12">
				<h1 className="text-4xl font-bold text-gray-900 mb-4">Hire Me</h1>
				<p className="text-xl text-gray-600">
					I&apos;m available for consulting, advisory roles, and select
					projects.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
				<div className="col-span-1">
					<div className="relative h-64 w-full rounded-lg overflow-hidden">
						<Image
							src="/images/profile.jpg"
							alt="Doug's profile"
							fill
							className="object-cover"
						/>
					</div>
				</div>
				<div className="col-span-2">
					<h2 className="text-2xl font-semibold text-gray-900 mb-4">
						About Me
					</h2>
					<p className="text-gray-600 mb-6">
						I&apos;m a seasoned professional with expertise in technology,
						investing, and business advisory. With a track record of helping
						businesses grow and succeed, I bring a unique perspective and
						valuable insights to every project.
					</p>
					<div className="flex space-x-4">
						<Link
							href="/resume.pdf"
							target="_blank"
							rel="noopener noreferrer"
							className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
						>
							Download Resume
						</Link>
						<Link
							href="/around-here-somehwere"
							className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
						>
							Contact Me
						</Link>
					</div>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold text-gray-900 mb-6">
					Core Skills
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							Technology
						</h3>
						<ul className="space-y-2 text-gray-600">
							<li>Software Development</li>
							<li>Product Management</li>
							<li>Technical Architecture</li>
							<li>Digital Transformation</li>
						</ul>
					</div>
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							Business
						</h3>
						<ul className="space-y-2 text-gray-600">
							<li>Strategic Planning</li>
							<li>Business Development</li>
							<li>Market Analysis</li>
							<li>Growth Strategy</li>
						</ul>
					</div>
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-xl font-semibold text-gray-900 mb-3">
							Finance
						</h3>
						<ul className="space-y-2 text-gray-600">
							<li>Investment Analysis</li>
							<li>Financial Modeling</li>
							<li>Portfolio Management</li>
							<li>Fundraising</li>
						</ul>
					</div>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold text-gray-900 mb-6">
					Experience Highlights
				</h2>
				<div className="space-y-8">
					<div className="border-l-4 border-blue-500 pl-6">
						<h3 className="text-xl font-semibold text-gray-900">
							Senior Advisor
						</h3>
						<p className="text-gray-500 mb-2">
							Tech Ventures Inc. | 2020 - Present
						</p>
						<p className="text-gray-600">
							Providing strategic guidance to technology startups, helping them
							navigate growth challenges and capitalize on market opportunities.
						</p>
					</div>
					<div className="border-l-4 border-blue-500 pl-6">
						<h3 className="text-xl font-semibold text-gray-900">
							Director of Product
						</h3>
						<p className="text-gray-500 mb-2">Innovation Labs | 2016 - 2020</p>
						<p className="text-gray-600">
							Led product strategy and development for a suite of enterprise
							software solutions, driving 40% year-over-year revenue growth.
						</p>
					</div>
					<div className="border-l-4 border-blue-500 pl-6">
						<h3 className="text-xl font-semibold text-gray-900">
							Investment Analyst
						</h3>
						<p className="text-gray-500 mb-2">Capital Partners | 2012 - 2016</p>
						<p className="text-gray-600">
							Conducted in-depth market research and financial analysis to
							identify high-potential investment opportunities in the technology
							sector.
						</p>
					</div>
				</div>
			</div>

			<div className="text-center">
				<p className="text-gray-600 mb-6">
					Interested in working together? Download my full resume or get in
					touch.
				</p>
				<div className="flex justify-center space-x-4">
					<Link
						href="/resume.pdf"
						target="_blank"
						rel="noopener noreferrer"
						className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
					>
						Download Resume
					</Link>
					<Link
						href="/around-here-somehwere"
						className="px-6 py-3 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors"
					>
						Contact Me
					</Link>
				</div>
			</div>
		</div>
	)
}
