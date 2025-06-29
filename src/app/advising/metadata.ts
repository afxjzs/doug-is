import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Doug.is / Advising",
	description:
		"Advisory roles and consulting services for startups and established companies.",
	openGraph: {
		title: "Doug.is / Advising",
		description:
			"Advisory roles and consulting services for startups and established companies.",
		url: "https://doug.is/advising",
		siteName: "doug.is",
		type: "website",
		images: [
			{
				url: "https://doug.is/images/advisory-services.jpg",
				width: 1200,
				height: 630,
				alt: "Advising Services - Doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Doug.is / Advising",
		description:
			"Advisory roles and consulting services for startups and established companies.",
		images: ["https://doug.is/images/advisory-services.jpg"],
		creator: "@afxjzs",
	},
	alternates: {
		canonical: "https://doug.is/advising",
	},
}
