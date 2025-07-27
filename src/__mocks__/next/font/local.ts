// Manual mock for next/font/local

export default function localFont(options?: any) {
	return {
		className: "inter-local-font",
		variable: "--font-inter-local",
		style: { fontFamily: "Inter" },
	}
}
