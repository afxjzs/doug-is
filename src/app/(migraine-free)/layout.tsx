import "@/app/globals.css"

export default function MigraineFreeLayout({
	children,
}: {
	children: React.ReactNode
}) {
	// Route group layout - provides complete isolated layout for migraine-free routes
	// This completely bypasses the root layout's ServerLayoutWrapper
	return (
		<div className="min-h-screen bg-gray-900 text-white">
			{/* Simple, clean background without cyberpunk effects */}
			<div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 z-0 pointer-events-none"></div>

			{/* Content - NO ServerLayoutWrapper, NO header, NO footer */}
			<div className="relative z-10">{children}</div>
		</div>
	)
}
