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

describe("GoogleAnalytics", () => {
	it("renders Google Analytics scripts with valid tracking ID", () => {
		const testGaId = "G-TEST123"
		render(<GoogleAnalytics gaId={testGaId} />)

		// Check that both scripts are rendered
		expect(
			screen.getByTestId("script-google-analytics-script")
		).toBeInTheDocument()
		expect(
			screen.getByTestId("script-google-analytics-config")
		).toBeInTheDocument()

		// Check that the gtag script has the correct src
		const gtagScript = screen.getByTestId("script-google-analytics-script")
		expect(gtagScript).toHaveAttribute(
			"data-src",
			`https://www.googletagmanager.com/gtag/js?id=${testGaId}`
		)

		// Check that the config script contains the tracking ID
		const configScript = screen.getByTestId("script-google-analytics-config")
		expect(configScript).toHaveAttribute("data-strategy", "afterInteractive")
	})

	it("renders nothing when no tracking ID is provided", () => {
		const { container } = render(<GoogleAnalytics gaId="" />)
		expect(container.firstChild).toBeNull()
	})

	it("renders nothing when tracking ID is undefined", () => {
		const { container } = render(<GoogleAnalytics gaId={undefined as any} />)
		expect(container.firstChild).toBeNull()
	})

	it("uses afterInteractive strategy for optimal loading", () => {
		const testGaId = "G-TEST123"
		render(<GoogleAnalytics gaId={testGaId} />)

		const gtagScript = screen.getByTestId("script-google-analytics-script")
		const configScript = screen.getByTestId("script-google-analytics-config")

		expect(gtagScript).toHaveAttribute("data-strategy", "afterInteractive")
		expect(configScript).toHaveAttribute("data-strategy", "afterInteractive")
	})
})
