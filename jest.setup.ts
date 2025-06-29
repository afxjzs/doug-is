import React from "react"
import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util"

// Polyfills for Next.js server actions in Jest environment
if (!global.TextEncoder) {
	global.TextEncoder = TextEncoder
}
if (!global.TextDecoder) {
	global.TextDecoder = TextDecoder as any
}

// Mock Web APIs not available in Node.js
global.Request = global.Request || jest.fn()
global.Response = global.Response || jest.fn()
global.fetch = global.fetch || jest.fn()

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
