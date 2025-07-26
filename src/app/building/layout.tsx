import { metadata } from "./metadata"
import LayoutWrapper from "@/components/LayoutWrapper"

export { metadata }

export default function BuildingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <LayoutWrapper>{children}</LayoutWrapper>
}
