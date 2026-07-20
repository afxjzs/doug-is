import { render, screen } from "@testing-library/react"
import { GoogleAnalytics } from "../GoogleAnalytics"

// Mock Next.js Script component
jest.mock("next/script", () => {
	return {
		__esModule: true,
		default: ({ id, src, strategy, dangerouslySetInnerHTML }: any) => {
			return (
				<div
					data-testid={`script-${id}`}
					data-src={src}
					data-strategy={strategy}
				>
					{dangerouslySetInnerHTML && (
						<script
							dangerouslySetInnerHTML={dangerouslySetInnerHTML}
							data-testid="inline-script"
						/>
					)}
				</div>
			)
		},
	}
})

// process.env.NODE_ENV is typed read-only, so assign it via defineProperty.
const setNodeEnv = (value: string | undefined) => {
	Object.defineProperty(process.env, "NODE_ENV", {
		value,
		configurable: true,
		writable: true,
	})
}

describe("GoogleAnalytics", () => {
	it("renders Google Analytics scripts in production environment", () => {
		// Mock NODE_ENV to production
		const originalEnv = process.env.NODE_ENV
		setNodeEnv("production")

		render(<GoogleAnalytics />)

		// Check that both scripts are rendered
		expect(
			screen.getByTestId("script-google-analytics-script")
		).toBeInTheDocument()
		expect(
			screen.getByTestId("script-google-analytics-config")
		).toBeInTheDocument()

		// Check that the gtag script has the correct hardcoded src
		const gtagScript = screen.getByTestId("script-google-analytics-script")
		expect(gtagScript).toHaveAttribute(
			"data-src",
			"https://www.googletagmanager.com/gtag/js?id=G-RVQRV9JEND"
		)

		// Check that the config script contains the hardcoded tracking ID
		const configScript = screen.getByTestId("script-google-analytics-config")
		expect(configScript).toHaveAttribute("data-strategy", "afterInteractive")

		// Restore original NODE_ENV
		setNodeEnv(originalEnv)
	})

	it("renders nothing in development environment", () => {
		// Mock NODE_ENV to development
		const originalEnv = process.env.NODE_ENV
		setNodeEnv("development")

		const { container } = render(<GoogleAnalytics />)
		expect(container.firstChild).toBeNull()

		// Restore original NODE_ENV
		setNodeEnv(originalEnv)
	})

	it("renders nothing in test environment", () => {
		// Mock NODE_ENV to test
		const originalEnv = process.env.NODE_ENV
		setNodeEnv("test")

		const { container } = render(<GoogleAnalytics />)
		expect(container.firstChild).toBeNull()

		// Restore original NODE_ENV
		setNodeEnv(originalEnv)
	})

	it("uses afterInteractive strategy for optimal loading", () => {
		// Mock NODE_ENV to production
		const originalEnv = process.env.NODE_ENV
		setNodeEnv("production")

		render(<GoogleAnalytics />)

		const gtagScript = screen.getByTestId("script-google-analytics-script")
		const configScript = screen.getByTestId("script-google-analytics-config")

		expect(gtagScript).toHaveAttribute("data-strategy", "afterInteractive")
		expect(configScript).toHaveAttribute("data-strategy", "afterInteractive")

		// Restore original NODE_ENV
		setNodeEnv(originalEnv)
	})
})
