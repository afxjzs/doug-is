import React from "react"
import "@testing-library/jest-dom"
import { TextEncoder, TextDecoder } from "util"

// Set up environment variables for testing
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co"
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key"
process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-key"

// Mock console methods to reduce noise in test output
const originalConsoleError = console.error
const originalConsoleWarn = console.warn
const originalConsoleLog = console.log

beforeAll(() => {
	// Suppress console.error, console.warn, and console.log during tests
	console.error = jest.fn()
	console.warn = jest.fn()
	console.log = jest.fn()
})

afterAll(() => {
	// Restore original console methods
	console.error = originalConsoleError
	console.warn = originalConsoleWarn
	console.log = originalConsoleLog
})

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
			forward: jest.fn(),
			refresh: jest.fn(),
		}
	},
	useSearchParams() {
		return new URLSearchParams()
	},
	usePathname() {
		return "/"
	},
	redirect: jest.fn(),
	notFound: jest.fn(),
}))

// Mock next/server
jest.mock("next/server", () => {
	// Create a mock constructor for NextResponse
	function MockNextResponse() {
		return {
			headers: new Map(),
			cookies: {
				set: jest.fn(),
				get: jest.fn(),
				getAll: jest.fn(() => []),
				setAll: jest.fn(),
			},
		}
	}

	// Add static methods to the constructor
	MockNextResponse.next = jest.fn((options?: any) => {
		return new MockNextResponse()
	})
	MockNextResponse.redirect = jest.fn()
	MockNextResponse.json = jest.fn()

	return {
		NextResponse: MockNextResponse,
		NextRequest: jest.fn(),
	}
})

// Mock Supabase
jest.mock("@supabase/supabase-js", () => ({
	createClient: jest.fn(() => ({
		auth: {
			getUser: jest.fn(),
			getSession: jest.fn(),
			signInWithPassword: jest.fn(),
			signUp: jest.fn(),
			signOut: jest.fn(),
		},
		from: jest.fn(() => ({
			select: jest.fn().mockReturnThis(),
			insert: jest.fn().mockReturnThis(),
			update: jest.fn().mockReturnThis(),
			delete: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			single: jest.fn(),
			order: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
		})),
		storage: {
			from: jest.fn(() => ({
				upload: jest.fn(),
				getPublicUrl: jest.fn(),
			})),
		},
	})),
	createServerClient: jest.fn(() => ({
		auth: {
			getUser: jest.fn(),
			getSession: jest.fn(),
		},
		from: jest.fn(() => ({
			select: jest.fn().mockReturnThis(),
			insert: jest.fn().mockReturnThis(),
			update: jest.fn().mockReturnThis(),
			delete: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			single: jest.fn(),
			order: jest.fn().mockReturnThis(),
			limit: jest.fn().mockReturnThis(),
		})),
	})),
}))

// Mock next/image
jest.mock("next/image", () => ({
	__esModule: true,
	default: function Image({ src, alt, ...props }: any) {
		// eslint-disable-next-line @next/next/no-img-element
		return React.createElement("img", { src, alt, ...props })
	},
}))

// Next/font mocks are now at the top of the file

// Mock window.location
Object.defineProperty(window, "location", {
	value: {
		href: "",
		pathname: "/",
		search: "",
		hash: "",
		assign: jest.fn(),
		replace: jest.fn(),
		reload: jest.fn(),
	},
	writable: true,
})

// Mock window.history
Object.defineProperty(window, "history", {
	value: {
		pushState: jest.fn(),
		replaceState: jest.fn(),
		go: jest.fn(),
		back: jest.fn(),
		forward: jest.fn(),
	},
	writable: true,
})
