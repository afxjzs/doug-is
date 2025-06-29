import { metadata } from "./metadata"
import MainSiteLayout from "@/components/MainSiteLayout"

export { metadata }

export default function BuildingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <MainSiteLayout>{children}</MainSiteLayout>
}
