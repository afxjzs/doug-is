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
		"^react-markdown$": "<rootDir>/src/__mocks__/react-markdown.tsx",
		"^remark-gfm$": "<rootDir>/src/__mocks__/remark-gfm.ts",
	},
	transformIgnorePatterns: [
		"node_modules/(?!(react-markdown|remark-.*|rehype-.*|unified|bail|is-plain-obj|trough|vfile|vfile-message|unist-.*|mdast-.*|micromark|decode-named-character-reference|character-entities|property-information|hast-util-whitespace|space-separated-tokens|comma-separated-tokens|pretty-bytes|ccount)/)",
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
