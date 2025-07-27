import VisualLayout from "@/components/VisualLayout"

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <VisualLayout>{children}</VisualLayout>
}
