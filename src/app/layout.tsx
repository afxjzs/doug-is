import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import LayoutWrapper from "@/components/LayoutWrapper"
import { ClientAnalyticsWrapper } from "@/components/ClientAnalyticsWrapper"

// Local font fallback
const interLocal = localFont({
	src: [
		{
			path: "../../public/fonts/Inter-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/Inter-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/Inter-SemiBold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../../public/fonts/Inter-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-inter-local",
	fallback: ["system-ui", "Arial", "sans-serif"],
})

// Optimize font loading with display swap and preload
const inter = Inter({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-inter",
	preload: true,
	fallback: ["system-ui", "Arial", "sans-serif"],
	adjustFontFallback: true,
	weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
	title: "Doug.is...",
	description:
		"Personal website of Doug Rogers - Developer, Investor, and Entrepreneur",
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
		siteName: "Doug.is",
		title: "Doug.is - Developer, Investor, Entrepreneur",
		description:
			"Personal website of Doug Rogers - Developer, Investor, and Entrepreneur",
		images: [
			{
				url: "/android-chrome-512x512.png",
				width: 512,
				height: 512,
				alt: "Doug.is",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Doug.is - Developer, Investor, Entrepreneur",
		description:
			"Personal website of Doug Rogers - Developer, Investor, and Entrepreneur",
		images: ["/android-chrome-512x512.png"],
		creator: "@glowingrec",
	},
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html
			lang="en"
			className={`scroll-smooth ${inter.variable} ${interLocal.variable}`}
		>
			<head />
			<body>
				{children}
				<ClientAnalyticsWrapper />
			</body>
		</html>
	)
}
