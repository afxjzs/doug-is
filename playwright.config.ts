import { defineConfig, devices } from "@playwright/test"
import dotenv from "dotenv"

// Load test environment variables
dotenv.config({ path: ".env.test" })

/**
 * REAL END-TO-END TESTING CONFIG
 *
 * This tests the actual shit that matters - what users see and interact with
 */
export default defineConfig({
	testDir: "./e2e-tests",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: "html",

	use: {
		baseURL: "http://local.doug.is:3000",
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},

	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
		{
			name: "firefox",
			use: { ...devices["Desktop Firefox"] },
		},
		{
			name: "webkit",
			use: { ...devices["Desktop Safari"] },
		},
	],

	webServer: {
		command: "npm run dev",
		url: "http://local.doug.is:3000",
		reuseExistingServer: !process.env.CI,
	},
})
