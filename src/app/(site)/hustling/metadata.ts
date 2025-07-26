import { Metadata } from "next"

export const metadata: Metadata = {
	title: "doug.is / Hustling",
	description:
		"Side projects, gigs, and entrepreneurial ventures I'm working on.",
	openGraph: {
		title: "doug.is / Hustling",
		description:
			"Side projects, gigs, and entrepreneurial ventures I'm working on.",
		url: "https://doug.is/hustling",
		siteName: "doug.is",
		type: "website",
		images: [
			{
				url: "https://doug.is/images/doug-2024-cropped-compr.png",
				width: 1200,
				height: 630,
				alt: "Hustling - doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "doug.is / Hustling",
		description:
			"Side projects, gigs, and entrepreneurial ventures I'm working on.",
		images: ["https://doug.is/images/doug-2024-cropped-compr.png"],
		creator: "@glowingrec",
	},
	alternates: {
		canonical: "https://doug.is/hustling",
	},
}
