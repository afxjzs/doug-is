import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

// Optimize font loading with display swap and preload
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
	preload: true,
	fallback: ["system-ui", "Arial", "sans-serif"],
})

export const metadata: Metadata = {
	title: "Doug.is",
	description:
		"Personal website of Doug Rogers - Developer, Investor, and Entrepreneur",
	metadataBase: new URL("https://doug.is"),
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://doug.is",
		siteName: "Doug.is",
		title: "Doug.is - Developer, Investor, Entrepreneur",
		description:
			"Personal website of Doug Rogers - Developer, Investor, and Entrepreneur",
		images: [
			{
				url: "https://doug.is/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Doug.is - Developer, Investor, Entrepreneur",
		description:
			"Personal website of Doug Rogers - Developer, Investor, and Entrepreneur",
		images: ["https://doug.is/og-image.jpg"],
		creator: "@username",
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className={`scroll-smooth ${inter.variable}`}>
			<body className="min-h-screen flex flex-col">
				{/* Subtle grid background */}
				<div className="fixed inset-0 bg-[url('/grid-bg.svg')] opacity-5 z-0 pointer-events-none"></div>

				{/* Subtle gradient overlay */}
				<div className="fixed inset-0 bg-gradient-to-br from-[rgba(var(--color-violet),0.05)] via-transparent to-[rgba(var(--color-cyan),0.05)] z-0 pointer-events-none"></div>

				{/* Subtle noise texture */}
				<div className="fixed inset-0 bg-[url('/noise.png')] opacity-[0.02] z-0 pointer-events-none mix-blend-overlay"></div>

				{/* Scanlines effect */}
				<div className="fixed inset-0 scanlines opacity-10 z-0 pointer-events-none"></div>

				<Header />
				<main className="flex-grow container mx-auto px-4 pt-28 pb-12 relative z-10">
					{children}
				</main>
				<Footer />
				<Analytics />
			</body>
		</html>
	)
}
