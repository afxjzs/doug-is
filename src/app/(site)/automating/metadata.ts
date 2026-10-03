import { Metadata } from "next"
import {
	getCanonicalUrl,
	getSiteName,
	getSocialImageUrl,
} from "@/lib/utils/domain-detection"

const title = "doug.is / Automating"
const description =
	"I'm an engineer who builds custom AI automations for the work that eats your week. You talk to me, and I build it."

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description,
		url: getCanonicalUrl("/automating"),
		siteName: getSiteName(),
		type: "website",
		images: [
			{
				url: getSocialImageUrl("/images/projects/doug-is.png"),
				width: 1200,
				height: 630,
				alt: "AI Automation - doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title,
		description,
		images: [getSocialImageUrl("/images/projects/doug-is.png")],
		creator: "@doug__is",
	},
	alternates: {
		canonical: getCanonicalUrl("/automating"),
	},
}
