import { Metadata } from "next"

export const metadata: Metadata = {
	title: "doug.is / Investing",
	description:
		"Side projects, gigs, and entrepreneurial ventures I'm working on.",
	openGraph: {
		title: "doug.is / Investing",
		description: "Investment targets and other investing-related content.",
		url: "https://doug.is/investing",
		siteName: "doug.is",
		type: "website",
		images: [
			{
				url: "https://doug.is/images/doug-2024-cropped-compr.png",
				width: 1200,
				height: 630,
				alt: "Investing - doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "doug.is / Investing",
		description: "Investment targets and other investing-related content.",
		images: ["https://doug.is/images/doug-2024-cropped-compr.png"],
		creator: "@glowingrec",
	},
	alternates: {
		canonical: "https://doug.is/investing",
	},
}
