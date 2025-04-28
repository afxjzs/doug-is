import MainSiteLayout from "@/components/MainSiteLayout"

export default function SiteLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<main className="flex-1">
			<MainSiteLayout>{children}</MainSiteLayout>
		</main>
	)
}
