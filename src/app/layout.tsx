import type { Metadata } from "next"
import { Instrument_Serif, DM_Sans } from "next/font/google"
import "./globals.css"
import { ClientAnalyticsWrapper } from "@/components/ClientAnalyticsWrapper"
import { TooltipProvider } from "@/components/ui/tooltip"
import LayoutWrapper from "@/components/LayoutWrapper"
import { GoogleAnalytics } from "@/components/GoogleAnalytics"

// Display font — for H1, hero text, pull quotes
const instrumentSerif = Instrument_Serif({
	subsets: ["latin"],
	weight: "400",
	display: "swap",
	variable: "--font-display",
	fallback: ["Georgia", "serif"],
})

// Body + subheading font
const dmSans = DM_Sans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-body",
	fallback: ["system-ui", "Arial", "sans-serif"],
	weight: ["400", "500", "600", "700"],
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
		creator: "@glowingrec",
	},
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" className="scroll-smooth" suppressHydrationWarning>
			<head>
				<script
					dangerouslySetInnerHTML={{
						__html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light"){document.documentElement.classList.add("light");document.documentElement.setAttribute("data-theme","light")}else if(t==="dark"){document.documentElement.classList.add("dark");document.documentElement.setAttribute("data-theme","dark")}}catch(e){}})()`,
					}}
				/>
			</head>
			<body className={`${instrumentSerif.variable} ${dmSans.variable}`}>
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
