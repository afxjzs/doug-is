import { Metadata } from "next"

export const metadata: Metadata = {
	title: "doug.is / Advising",
	description:
		"Fractional CTO and advisor for early-stage founders. No pitch deck required.",
	openGraph: {
		title: "doug.is / Advising",
		description:
			"Fractional CTO and advisor for early-stage founders. No pitch deck required.",
		url: "https://doug.is/advising",
		siteName: "doug.is",
		type: "website",
		images: [
			{
				url: "https://doug.is/images/projects/doug-is.png",
				width: 1200,
				height: 630,
				alt: "Advising Services - doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "doug.is / Advising",
		description:
			"Fractional CTO and advisor for early-stage founders. No pitch deck required.",
		images: ["https://doug.is/images/projects/doug-is.png"],
		creator: "@doug__is",
	},
	alternates: {
		canonical: "https://doug.is/advising",
	},
}
