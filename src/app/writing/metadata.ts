import { Metadata } from "next"

export const metadata: Metadata = {
	title: "doug.is / Writing",
	description:
		"Thoughts, ideas, and musings on technology, business, and life.",
	openGraph: {
		title: "doug.is / Writing",
		description:
			"Thoughts, ideas, and musings on technology, business, and life.",
		url: "https://doug.is/writing",
		siteName: "doug.is",
		type: "website",
		images: [
			{
				url: "https://doug.is/images/doug-2024-cropped-compr.png",
				width: 1200,
				height: 630,
				alt: "Writing - doug.is Blog",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "doug.is / Writing",
		description:
			"Thoughts, ideas, and musings on technology, business, and life.",
		images: ["https://doug.is/images/doug-2024-cropped-compr.png"],
		creator: "@doug__is",
	},
	alternates: {
		canonical: "https://doug.is/writing",
	},
}
