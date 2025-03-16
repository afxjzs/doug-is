import { Metadata } from "next"
import Link from "next/link"
import SafeImage from "@/components/SafeImage"

export const metadata: Metadata = {
	title: "Inn Ruby Gem | Building | Doug.is",
	description:
		"A simple Ruby gem that adds the .in? method as an inverse of Ruby's .include? method",
}

export default function InnPage() {
	return (
		<div className="max-w-4xl mx-auto">
			<div className="mb-8">
				<Link href="/building" className="neon-link mb-4 inline-block">
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
					src="/images/projects/rubygems-logo.png"
					alt="RubyGems Logo"
					width={300}
					height={300}
					className="object-contain"
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
					<h2 className="text-xl font-semibold gradient-text-magenta mb-4">
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
					<h2 className="text-xl font-semibold gradient-text-violet mb-4">
						Links
					</h2>
					<div className="space-y-4">
						<div>
							<Link
								href="https://rubygems.org/gems/inn/versions/0.0.4"
								target="_blank"
								rel="noopener noreferrer"
								className="neon-button-cyan w-full text-center inline-block"
							>
								RubyGems
							</Link>
						</div>
						<div>
							<Link
								href="https://github.com/afxjzs/inn"
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
						Inn is a lightweight Ruby gem that adds the <code>.in?</code> method
						to objects, which serves as an inverse of Ruby's built-in{" "}
						<code>.include?</code> method. This simple addition makes code more
						readable in certain contexts.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						I built this gem primarily to go through the process of releasing a
						gem through the official RubyGems channels. It was a valuable
						learning experience in understanding the Ruby ecosystem, gem
						packaging, and distribution.
					</p>
					<p className="text-[rgba(var(--color-foreground),0.8)]">
						While the functionality is straightforward, the project represents
						an important step in my journey as a Ruby developer and contributor
						to the open-source community.
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
						This simple extension makes code more readable in certain contexts,
						especially when checking if an element is contained within a
						collection.
					</p>
				</div>
			</div>

			<div className="mb-12">
				<h2 className="text-2xl font-semibold gradient-heading mb-6">
					Development Journey
				</h2>
				<div className="dark-card">
					<p className="text-[rgba(var(--color-foreground),0.8)] mb-4">
						The primary purpose of creating the Inn gem was to learn the process
						of building and publishing a Ruby gem. The development journey
						involved:
					</p>
					<ul className="list-disc pl-6 space-y-2 text-[rgba(var(--color-foreground),0.8)]">
						<li>Learning the structure and conventions of Ruby gems</li>
						<li>Setting up the necessary files (gemspec, Rakefile, etc.)</li>
						<li>
							Writing tests to ensure the functionality worked as expected
						</li>
						<li>Creating documentation and examples</li>
						<li>Publishing the gem to RubyGems.org</li>
						<li>Managing versions and releases</li>
					</ul>
					<p className="text-[rgba(var(--color-foreground),0.8)] mt-4">
						While the functionality of the gem is simple, the experience of
						going through the entire process of creating and publishing a gem
						was invaluable. It provided hands-on experience with the Ruby
						ecosystem's tooling and publishing workflows.
					</p>
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
