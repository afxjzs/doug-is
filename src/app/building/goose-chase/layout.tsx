import { pageMetadata } from "@/lib/metadata"

// The page is a client component, so its metadata lives here.
export const metadata = pageMetadata({
	trail: ["building", "Goose Chase"],
	description:
		"A curated guide to Chicago's finest venues based on Dante The Don's Barstool Sports article.",
	path: "/building/goose-chase",
})

export default function GooseChaseLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children
}
