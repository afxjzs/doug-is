import { Metadata } from "next"

export const metadata: Metadata = {
	title: "doug.is / Investing",
	description:
		"Small checks into founders with real revenue. Revenue over pitch decks, every time.",
	openGraph: {
		title: "doug.is / Investing",
		description:
			"Small checks into founders with real revenue. Revenue over pitch decks, every time.",
		url: "https://doug.is/investing",
		siteName: "doug.is",
		type: "website",
		images: [
			{
				url: "https://doug.is/images/projects/doug-is.png",
				width: 1200,
				height: 630,
				alt: "Investing - doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "doug.is / Investing",
		description:
			"Small checks into founders with real revenue. Revenue over pitch decks, every time.",
		images: ["https://doug.is/images/projects/doug-is.png"],
		creator: "@doug__is",
	},
	alternates: {
		canonical: "https://doug.is/investing",
	},
}
