import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Doug.is / Connecting",
	description:
		"Let's connect! Find me on social media, send me an email, or schedule a meeting.",
	openGraph: {
		title: "Doug.is / Connecting",
		description:
			"Let's connect! Find me on social media, send me an email, or schedule a meeting.",
		url: "https://doug.is/connecting",
		siteName: "doug.is",
		type: "website",
		images: [
			{
				url: "https://doug.is/images/doug-2024-cropped-compr.png",
				width: 1200,
				height: 630,
				alt: "Connect with Doug",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Doug.is / Connecting",
		description:
			"Let's connect! Find me on social media, send me an email, or schedule a meeting.",
		images: ["https://doug.is/images/doug-2024-cropped-compr.png"],
		creator: "@afxjzs",
	},
	alternates: {
		canonical: "https://doug.is/connecting",
	},
}
