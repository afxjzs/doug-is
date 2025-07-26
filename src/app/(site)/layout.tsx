import VisualLayout from "@/components/VisualLayout"

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<main className="flex-1">
			<VisualLayout>{children}</VisualLayout>
		</main>
	)
}
