/**
 * Tests for the PostHogProvider init guard.
 *
 * posthog-js is a module-level singleton: calling init on an already-loaded
 * instance logs "You have already initialized PostHog!" — the dev-console spam
 * this guard exists to prevent when more than one provider instance is ever
 * constructed (StrictMode double-mount, HMR, a second provider site).
 */

import posthog from "posthog-js"

jest.mock("posthog-js", () => ({
	__esModule: true,
	default: {
		init: jest.fn(),
		__loaded: false,
		capture: jest.fn(),
		debug: jest.fn(),
	},
}))

// Import after the mock so the provider sees the mocked module
import { PostHogProvider } from "../posthog"

describe("PostHogProvider", () => {
	beforeEach(() => {
		jest.clearAllMocks()
		;(posthog as unknown as { __loaded: boolean }).__loaded = false
		// Real posthog.init marks the singleton loaded; mirror that
		;(posthog.init as jest.Mock).mockImplementation(() => {
			;(posthog as unknown as { __loaded: boolean }).__loaded = true
		})
		process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_test_key_1234567890"
		// Provider init logs verbose status lines; keep test output clean
		jest.spyOn(console, "log").mockImplementation(() => {})
	})

	afterEach(() => {
		delete process.env.NEXT_PUBLIC_POSTHOG_KEY
		jest.restoreAllMocks()
	})

	it("initializes posthog on first construction", () => {
		new PostHogProvider()
		expect(posthog.init).toHaveBeenCalledTimes(1)
	})

	it("does not re-init the posthog singleton from a second instance", () => {
		new PostHogProvider()
		new PostHogProvider()
		expect(posthog.init).toHaveBeenCalledTimes(1)
	})

	it("reports initialized when the singleton was loaded by another instance", () => {
		new PostHogProvider()
		const second = new PostHogProvider()
		expect(second.isInitialized()).toBe(true)
	})
})
