import { metadata } from "./metadata"

export { metadata }

// The root layout (src/app/layout.tsx) already wraps every route in
// LayoutWrapper, which renders the site chrome (header + footer). This layout
// must NOT wrap again or /building/* pages render the header and footer twice.
// It exists only to attach the Building section metadata; render children as-is.
export default function BuildingLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}
