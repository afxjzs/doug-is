/**
 * Tests for AnalyticsProviderComponent.
 *
 * The construction-count assertions exist because the default provider was
 * once created as a default parameter value (`provider = new PostHogProvider()`),
 * which re-evaluates on every render: each re-render built a fresh provider,
 * re-ran posthog.init (dev console spam), and re-sent the
 * "analytics_initialized" event (duplicate analytics in prod).
 */

import { render } from "@testing-library/react"
import { AnalyticsProviderComponent } from "../context"
import { PostHogProvider } from "../providers/posthog"

const mockInitialize = jest.fn()
const mockIsInitialized = jest.fn(() => true)
const mockTrackEvent = jest.fn()

jest.mock("../providers/posthog", () => ({
	PostHogProvider: jest.fn().mockImplementation(() => ({
		initialize: mockInitialize,
		isInitialized: mockIsInitialized,
		trackEvent: mockTrackEvent,
		trackPageView: jest.fn(),
		identifyUser: jest.fn(),
		resetUser: jest.fn(),
		setUserProperties: jest.fn(),
	})),
}))

describe("AnalyticsProviderComponent", () => {
	beforeEach(() => {
		jest.clearAllMocks()
	})

	it("constructs the default PostHog provider exactly once across re-renders", () => {
		const { rerender } = render(
			<AnalyticsProviderComponent>
				<div>one</div>
			</AnalyticsProviderComponent>
		)
		rerender(
			<AnalyticsProviderComponent>
				<div>two</div>
			</AnalyticsProviderComponent>
		)
		rerender(
			<AnalyticsProviderComponent>
				<div>three</div>
			</AnalyticsProviderComponent>
		)

		expect(PostHogProvider).toHaveBeenCalledTimes(1)
	})

	it("sends analytics_initialized exactly once across re-renders", () => {
		const { rerender } = render(
			<AnalyticsProviderComponent>
				<div>one</div>
			</AnalyticsProviderComponent>
		)
		rerender(
			<AnalyticsProviderComponent>
				<div>two</div>
			</AnalyticsProviderComponent>
		)

		const initEvents = mockTrackEvent.mock.calls.filter(
			(call) => call[0]?.event === "analytics_initialized"
		)
		expect(initEvents).toHaveLength(1)
	})

	it("uses an injected provider instead of constructing PostHog", () => {
		const injected = {
			initialize: jest.fn(),
			isInitialized: jest.fn(() => false),
			trackEvent: jest.fn(),
			trackPageView: jest.fn(),
			identifyUser: jest.fn(),
			resetUser: jest.fn(),
			setUserProperties: jest.fn(),
		}

		render(
			<AnalyticsProviderComponent provider={injected}>
				<div>child</div>
			</AnalyticsProviderComponent>
		)

		expect(PostHogProvider).not.toHaveBeenCalled()
		expect(injected.initialize).toHaveBeenCalled()
	})
})
