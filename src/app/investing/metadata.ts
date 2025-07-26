import { Metadata } from "next"

export const metadata: Metadata = {
	title: "doug.is / Investing",
	description:
		"Investment thesis, portfolio companies, and investment opportunities I'm exploring.",
	openGraph: {
		title: "doug.is / Investing",
		description:
			"Investment thesis, portfolio companies, and investment opportunities I'm exploring.",
		url: "https://doug.is/investing",
		siteName: "doug.is",
		type: "website",
		images: [
			{
				url: "https://doug.is/images/investing.jpg",
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
			"Investment thesis, portfolio companies, and investment opportunities I'm exploring.",
		images: ["https://doug.is/images/investing.jpg"],
		creator: "@glowingrec",
	},
	alternates: {
		canonical: "https://doug.is/investing",
	},
}
