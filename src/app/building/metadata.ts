import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Doug.is / Building",
	description:
		"Projects and applications I'm currently building or have built in the past.",
	openGraph: {
		title: "Doug.is / Building",
		description:
			"Projects and applications I'm currently building or have built in the past.",
		url: "https://doug.is/building",
		siteName: "doug.is",
		type: "website",
		images: [
			{
				url: "https://doug.is/images/projects/doug-is.png",
				width: 1200,
				height: 630,
				alt: "Building Projects - Doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Doug.is / Building",
		description:
			"Projects and applications I'm currently building or have built in the past.",
		images: ["https://doug.is/images/projects/doug-is.png"],
		creator: "@afxjzs",
	},
	alternates: {
		canonical: "https://doug.is/building",
	},
}
