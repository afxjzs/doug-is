import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"
import {
	getCanonicalUrl,
	getSocialImageUrl,
	getSiteName,
} from "@/lib/utils/domain-detection"

export const metadata: Metadata = {
	title: `Inn Ruby Gem | Building | ${getSiteName()}`,
	description:
		"A simple Ruby gem that adds the .in? method as an inverse of Ruby's .include? method",
	openGraph: {
		title: "Inn Ruby Gem - Inverse of .include? method",
		description:
			"A lightweight Ruby gem that adds the .in? method for improved code readability",
		url: getCanonicalUrl("/building/inn"),
		siteName: getSiteName(),
		type: "website",
		images: [
			{
				url: getSocialImageUrl("/images/projects/rubygems-logo.png"),
				width: 1200,
				height: 630,
				alt: "Inn Ruby Gem",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Inn Ruby Gem - Inverse of .include? method",
		description:
			"A lightweight Ruby gem that adds the .in? method for improved code readability",
		images: [getSocialImageUrl("/images/projects/rubygems-logo.png")],
		creator: "@glowingrec",
	},
	alternates: {
		canonical: getCanonicalUrl("/building/inn"),
	},
}

export default function InnPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<Link href="/building" className="text-[rgb(var(--color-accent))] hover:text-[rgb(var(--color-accent-secondary))] transition-colors mb-4 inline-block">
					← Back to Projects
				</Link>
				<h1 className="text-4xl font-bold gradient-heading mb-4">
					Inn Ruby Gem
				</h1>
				<p className="text-xl text-[rgba(var(--color-foreground),0.8)]">
					A simple Ruby gem that adds the <code>.in?</code> method as an inverse
					of Ruby's <code>.include?</code> method.
				</p>
			</div>

			<div className="relative h-80 rounded-lg overflow-hidden mb-12 bg-white flex items-center justify-center">
				<SafeImage
					src="/images/ruby-gems-logo.png"
					alt="RubyGems Logo"
					width={300}
					height={300}
					className="object-contain"
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
				<div className="dark-card">
					<h2 className="text-xl font-semibold mb-4">
						Technologies
					</h2>
					<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Ruby
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							RubyGems
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Object-Oriented Programming
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Ruby Core Extensions
						</li>
					</ul>
				</div>

				<div className="dark-card">
					<h2 className="text-xl font-semibold mb-4">
						Features
					</h2>
					<ul className="space-y-2 text-[rgba(var(--color-foreground),0.7)]">
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Adds <code>.in?</code> method to objects
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Inverse of Ruby's <code>.include?</code> method
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Improves code readability
						</li>
						<li className="flex items-center">
							<span className="check-mark mr-2">✓</span>
							Lightweight with no dependencies
						</li>
					</ul>
				</div>

				<div className="dark-card">
					<h2 className="text-xl font-semibold mb-4">
						Links
					</h2>
					<div className="space-y-4">
						<div>
							<Link
								href="https://rubygems.org/gems/inn/versions/0.0.4"
								target="_blank"
								rel="noopener noreferrer"
								className="btn-primary w-full text-center inline-block"
							>
								RubyGems
							</Link>
						</div>
						<div>
							<Link
								href="https://github.com/afxjzs/inn"
								target="_blank"
								rel="noopener noreferrer"
								className="btn-secondary w-full text-center inline-block"
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
						Inn adds a <code>.in?</code> method to Ruby objects — the
						opposite of <code>.include?</code>. Instead of asking &quot;does
						this array include X?&quot; you ask &quot;is X in this array?&quot;
						Sometimes that reads better.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						Honestly, I built this mostly to learn how to publish a gem to
						RubyGems. The gem itself is tiny, but going through the whole
						packaging and release process was the point.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Usage Example
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						Using Inn in your Ruby application is straightforward:
					</p>
					<div className="bg-[rgba(var(--color-foreground),0.05)] p-4 rounded-md mb-4 overflow-x-auto">
						<pre className="text-[rgba(var(--color-foreground),0.9)]">
							{`require 'inn'

# Example with arrays
musician1 = "john"
musician2 = "pete"
beatles = ["john", "paul", "george", "ringo"]

musician1.in? beatles  # => true
musician2.in? beatles  # => false

# More readable than the alternative
beatles.include? musician1  # => true
beatles.include? musician2  # => false`}
						</pre>
					</div>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						It&apos;s a small thing, but <code>musician.in? beatles</code> reads
						more naturally than <code>beatles.include? musician</code> in a lot
						of cases.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Development Journey
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						The whole point was to learn the gem publishing workflow end
						to end: gemspec, Rakefile, tests, docs, pushing to
						RubyGems.org, and managing version bumps. The gem does one
						small thing, but the process taught me a lot about how the
						Ruby ecosystem works under the hood.
					</p>
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
