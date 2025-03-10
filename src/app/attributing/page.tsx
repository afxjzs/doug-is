import Link from "next/link"
import IconWithGradient from "./IconWithGradient"

export default function AttributingPage() {
	const attributions = [
		{
			icon: "/icon-thinking.svg",
			creator: "Izwar Muis",
			source: "Noun Project",
		},
		{
			icon: "/icon-building.svg",
			creator: "kholifah",
			source: "Noun Project",
		},
		{
			icon: "/icon-investing-2.svg",
			creator: "Fran Couto",
			source: "Noun Project",
		},
		{
			icon: "/icon-investing-1.svg",
			creator: "Fran Couto",
			source: "Noun Project",
		},
		{
			icon: "/icon-popularity.svg",
			creator: "Gargantia",
			source: "Noun Project",
		},
		{
			icon: "/icon-tutor.svg",
			creator: "Gargantia",
			source: "Noun Project",
		},
		{
			icon: "/icon-hustlin.svg",
			creator: "Chehuna",
			source: "Noun Project",
		},
	]

	return (
		<div className="max-w-4xl mx-auto py-12 px-4">
			<h1 className="gradient-heading text-4xl md:text-5xl mb-8 text-center">
				Attributions
			</h1>

			<div className="mb-12">
				<p className="text-lg mb-6 text-center">
					This page provides attribution for resources used on this site.
				</p>
			</div>

			<div className="bg-[rgba(var(--color-background),0.5)] border border-[rgba(var(--color-foreground),0.1)] rounded-lg p-6 backdrop-blur-sm">
				<h2 className="text-2xl mb-6 gradient-text-violet">Icons</h2>

				<ul className="space-y-6">
					{attributions.map((item, index) => (
						<li
							key={index}
							className="flex items-center gap-4 p-4 border border-[rgba(var(--color-foreground),0.1)] rounded-lg hover:bg-[rgba(var(--color-foreground),0.05)]"
						>
							<IconWithGradient icon={item.icon} creator={item.creator} />
							<div>
								<Link
									href={item.icon}
									className="text-lg hover:text-[rgb(var(--color-violet))]"
								>
									{item.icon.replace("/", "")}
								</Link>
								<p className="text-[rgba(var(--color-foreground),0.7)]">
									Created by {item.creator} from {item.source}
								</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
