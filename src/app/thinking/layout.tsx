import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function ThinkingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Header />
			<main className="flex-grow container mx-auto px-4 pt-28 pb-12 relative z-10">
				{children}
			</main>
			<Footer />
		</>
	)
}
