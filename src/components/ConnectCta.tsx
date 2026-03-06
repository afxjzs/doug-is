import Link from "next/link"

type ConnectCtaProps = {
	className?: string
	title?: string
	description?: string
	buttonText?: string
	buttonHref?: string
}

export default function ConnectCta({
	className = "",
	title = "Let's Connect",
	description = "Interested in working together or just want to say hello? I'm always open to new opportunities and connections.",
	buttonText = "Get in Touch",
	buttonHref = "/connecting",
}: ConnectCtaProps) {
	return (
		<div className={`relative ${className}`}>
			<div className="relative z-10 p-8 border border-[rgba(var(--color-border),0.1)] rounded-lg bg-[rgba(var(--color-foreground),0.03)]">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					<div className="flex-1">
						<h2 className="text-2xl font-semibold gradient-heading mb-2 md:text-left">
							{title}
						</h2>
						<p className="text-[rgba(var(--color-foreground),0.8)] md:text-left">
							{description}
						</p>
					</div>
					<div className="flex md:flex-shrink-0 justify-center md:justify-end">
						<Link
							href={buttonHref}
							className="btn-primary whitespace-nowrap"
						>
							{buttonText}
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
