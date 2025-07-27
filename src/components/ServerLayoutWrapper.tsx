// src/components/ServerLayoutWrapper.tsx

import Header from "./Header"
import Footer from "./Footer"

/**
 * Server-side layout wrapper that provides the standard site layout.
 *
 * This component provides the main site layout (header, main, footer)
 * for regular site pages. Conditional logic for which pages get this
 * layout is handled by LayoutWrapper.
 */
export default function ServerLayoutWrapper({
	children,
}: {
	children: React.ReactNode
}) {
	// Standard site layout with header and footer
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
