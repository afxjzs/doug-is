import React from "react"
import "@testing-library/jest-dom"

// Mock next/navigation
jest.mock("next/navigation", () => ({
	useRouter() {
		return {
			push: jest.fn(),
			replace: jest.fn(),
			prefetch: jest.fn(),
			back: jest.fn(),
		}
	},
	useSearchParams() {
		return new URLSearchParams()
	},
	usePathname() {
		return ""
	},
}))

// Mock next/image
jest.mock("next/image", () => ({
	__esModule: true,
	default: (props: any) => {
		// eslint-disable-next-line @next/next/no-img-element
		return React.createElement("img", { ...props, alt: props.alt })
	},
}))
