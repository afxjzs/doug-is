import { metadata } from "./metadata"
import VisualLayout from "@/components/VisualLayout"

export { metadata }

export default function BuildingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <VisualLayout>{children}</VisualLayout>
}
