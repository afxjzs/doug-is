import type { Config } from "jest"
import nextJest from "next/jest"

const createJestConfig = nextJest({
	dir: "./",
})

const config: Config = {
	setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
	testEnvironment: "jest-environment-jsdom",
	moduleNameMapper: {
		"^@/(.*)$": "<rootDir>/src/$1",
	},
	transformIgnorePatterns: [
		"node_modules/(?!(react-markdown|remark-.*|rehype-.*)/)",
	],
	testMatch: ["**/*.test.ts", "**/*.test.tsx"],
	collectCoverage: true,
	collectCoverageFrom: [
		"src/**/*.{ts,tsx}",
		"!src/**/*.d.ts",
		"!src/**/*.stories.{ts,tsx}",
		"!src/app/api/**/*",
	],
}

export default createJestConfig(config)
