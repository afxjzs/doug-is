import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Doug.is / Hustling",
	description:
		"Side projects, gigs, and entrepreneurial ventures I'm working on.",
	openGraph: {
		title: "Doug.is / Hustling",
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
				alt: "Hustling - Doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Doug.is / Hustling",
		description:
			"Side projects, gigs, and entrepreneurial ventures I'm working on.",
		images: ["https://doug.is/images/doug-2024-cropped-compr.png"],
		creator: "@afxjzs",
	},
	alternates: {
		canonical: "https://doug.is/hustling",
	},
}
