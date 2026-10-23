/**
 * Admin Root Layout
 *
 * Shared by the public auth pages (login, register, setup) and the gated
 * (protected) route group. It does NO auth: the gate is
 * src/app/admin/(protected)/layout.tsx.
 */

import "./admin.css"

export default function AdminRootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return <>{children}</>
}
