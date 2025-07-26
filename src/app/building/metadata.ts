import { Metadata } from "next"
import {
	getCanonicalUrl,
	getSocialImageUrl,
	getSiteName,
} from "@/lib/utils/domain-detection"

export const metadata: Metadata = {
	title: `${getSiteName()} / Building`,
	description: "Projects and applications I've built",
	openGraph: {
		title: `${getSiteName()} / Building`,
		description: "Projects and applications I've built",
		url: getCanonicalUrl("/building"),
		siteName: getSiteName(),
		images: [
			{
				url: getSocialImageUrl("/images/projects/doug-is.png"),
				width: 1200,
				height: 630,
				alt: "Building Projects - Doug.is",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: `${getSiteName()} / Building`,
		description: "Projects and applications I've built",
		images: [getSocialImageUrl("/images/projects/doug-is.png")],
		creator: "@glowingrec",
	},
	alternates: {
		canonical: getCanonicalUrl("/building"),
	},
}
