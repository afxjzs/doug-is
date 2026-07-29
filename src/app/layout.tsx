import type { Metadata } from "next"
import { JetBrains_Mono, Playfair_Display, DM_Sans } from "next/font/google"
import "./globals.css"
import { ClientAnalyticsWrapper } from "@/components/ClientAnalyticsWrapper"
import { TooltipProvider } from "@/components/ui/tooltip"
import LayoutWrapper from "@/components/LayoutWrapper"
import { GoogleAnalytics } from "@/components/GoogleAnalytics"

// Body font — variable, with the optical-size axis; the body default weight
// (375, slightly lighter than regular) is set in globals.css
const dmSans = DM_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-body",
	fallback: ["system-ui", "Arial", "sans-serif"],
	axes: ["opsz"],
})

// Monospace font — for terminal, tags, buttons, code
const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-mono",
	fallback: ["'Fira Code'", "'SF Mono'", "monospace"],
	weight: ["300", "400", "500"],
})

// Display font — serif for headlines and emphasis
const playfairDisplay = Playfair_Display({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-display",
	fallback: ["Georgia", "serif"],
	weight: ["400", "700"],
	style: ["normal", "italic"],
})

export const metadata: Metadata = {
	title: "doug.is...",
	description:
		"Personal website of Doug Rogers - Engineer, Advisor, and Investor",
	metadataBase: new URL("https://doug.is"),
	icons: {
		icon: [
			{ url: "/favicon.ico", sizes: "any" },
			{ url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
			{
				url: "/android-chrome-192x192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				url: "/android-chrome-512x512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
		other: [{ rel: "manifest", url: "/site.webmanifest" }],
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://doug.is",
		siteName: "doug.is",
		title: "doug.is - Engineer, Advisor, Investor",
		description:
			"Personal website of Doug Rogers - Engineer, Advisor, and Investor",
		images: [
			{
				url: "/android-chrome-512x512.png",
				width: 512,
				height: 512,
				alt: "doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "doug.is - Engineer, Advisor, Investor",
		description:
			"Personal website of Doug Rogers - Engineer, Advisor, and Investor",
		images: ["/android-chrome-512x512.png"],
		creator: "@doug__is",
	},
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className="scroll-smooth" suppressHydrationWarning>
			<head />
			<body className={`${dmSans.variable} ${jetbrainsMono.variable} ${playfairDisplay.variable}`}>
				{/* Google Analytics - Load early for comprehensive tracking */}
				<GoogleAnalytics />

				<TooltipProvider>
					<ClientAnalyticsWrapper>
						<LayoutWrapper>{children}</LayoutWrapper>
					</ClientAnalyticsWrapper>
				</TooltipProvider>
			</body>
		</html>
	)
}
