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
	title = "Let\u2019s Connect",
	description = "If you want to talk shop, bounce an idea around, or just say hi, I'm around.",
	buttonText = "Get in Touch",
	buttonHref = "/connecting",
}: ConnectCtaProps) {
	return (
		<div className={`relative ${className}`}>
			<div
				className="relative z-10 p-8 rounded-lg"
				style={{
					backgroundColor: "rgb(var(--color-card-bg))",
					border: "1px solid rgba(var(--color-border), 0.08)",
				}}
			>
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
					<div className="flex-1">
						<h2
							className="text-2xl font-semibold mb-2 md:text-left"
							style={{
								fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
								color: "rgb(var(--color-foreground))",
							}}
						>
							{title}
						</h2>
						<p
							className="md:text-left"
							style={{ color: "rgba(var(--color-foreground), 0.45)" }}
						>
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
