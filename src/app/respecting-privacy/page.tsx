import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Privacy Policy | Doug.is",
	description: "Privacy policy for Doug.is website",
}

export default function PrivacyPolicyPage() {
	return (
		<div className="max-w-4xl mx-auto py-12 px-4">
			<h1 className="gradient-heading text-4xl md:text-5xl mb-8 text-center">
				Doug.is Privacy Policy
			</h1>

			<div className="mb-12">
				<p className="text-lg mb-6 text-center">
					How we handle your information
				</p>
			</div>

			<div className="bg-[rgba(var(--color-background),0.5)] border border-[rgba(var(--color-foreground),0.1)] rounded-lg p-8 backdrop-blur-sm">
				<div className="prose prose-invert max-w-none">
					<p className="text-xl leading-relaxed">
						Doug won&apos;t tell or share or sell your information. Default
						Friend-D-A style. I&apos;m not in the business of screwing people
						over.
					</p>
				</div>
			</div>
		</div>
	)
}
