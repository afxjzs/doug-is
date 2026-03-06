/**
 * Environment detection and database selection utilities
 *
 * This module automatically detects whether we're running in:
 * - Local development (using local Supabase instance)
 * - Production (using remote Supabase project)
 * - And selects the appropriate database configuration
 */

/**
 * Environment types
 */
export type Environment = "local" | "production" | "development"

/**
 * Database configuration for different environments
 */
export interface DatabaseConfig {
	url: string
	anonKey: string
	serviceRoleKey?: string
}

function getLocalSetupInstructions(): string {
	return [
		"Local Supabase is required in development.",
		"1) Ensure Docker Desktop is running.",
		"2) Run: supabase start",
		"3) Add local env vars to .env.local:",
		"   NEXT_PUBLIC_SUPABASE_URL_LOCAL=http://127.0.0.1:54331",
		"   NEXT_PUBLIC_SUPABASE_ANON_KEY_LOCAL=<local anon key>",
		"   SUPABASE_SERVICE_ROLE_KEY_LOCAL=<local service role key>",
		"4) Run: supabase db push",
		"5) Restart: ./start.sh",
	].join("\n")
}

function requireEnvVar(name: string): string {
	const value = process.env[name]
	if (!value) {
		throw new Error(`Missing required environment variable: ${name}\n\n${getLocalSetupInstructions()}`)
	}
	return value
}

/**
 * Detects the current environment
 */
export function detectEnvironment(): Environment {
	// Check if we're in a browser environment
	if (typeof window !== "undefined") {
		// Browser environment - check if we're on localhost
		const isLocalHost =
			window.location.hostname === "localhost" ||
			window.location.hostname === "127.0.0.1" ||
			window.location.hostname === "local.doug.is"
		if (isLocalHost) {
			return "local"
		}
		return "production"
	}

	// Server environment
	if (process.env.NODE_ENV === "development") {
		return "local"
	}

	return "production"
}

/**
 * Gets the appropriate database configuration for the current environment
 */
export function getDatabaseConfig(): DatabaseConfig {
	const environment = detectEnvironment()

	if (environment === "local") {
		return {
			url: requireEnvVar("NEXT_PUBLIC_SUPABASE_URL_LOCAL"),
			anonKey: requireEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY_LOCAL"),
			serviceRoleKey: requireEnvVar("SUPABASE_SERVICE_ROLE_KEY_LOCAL"),
		}
	}

	// Production environment
	return {
		url: requireEnvVar("NEXT_PUBLIC_SUPABASE_URL"),
		anonKey: requireEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
		serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
	}
}

/**
 * Checks if we're running in local development
 */
export function isLocalDevelopment(): boolean {
	return detectEnvironment() === "local"
}

/**
 * Checks if we're running in production
 */
export function isProduction(): boolean {
	return detectEnvironment() === "production"
}

/**
 * Gets the current database URL
 */
export function getDatabaseUrl(): string {
	return getDatabaseConfig().url
}

/**
 * Gets the current anon key
 */
export function getAnonKey(): string {
	return getDatabaseConfig().anonKey
}

/**
 * Gets the current service role key
 */
export function getServiceRoleKey(): string {
	return getDatabaseConfig().serviceRoleKey || ""
}

/**
 * Logs the current environment configuration (for debugging)
 */
export function logEnvironmentConfig(): void {
	if (process.env.NODE_ENV === "development") {
		const config = getDatabaseConfig()
		const environment = detectEnvironment()

		console.log("🔧 Supabase Environment Configuration:")
		console.log(`   Environment: ${environment}`)
		console.log(`   Database URL: ${config.url}`)
		console.log(`   Has Anon Key: ${!!config.anonKey}`)
		console.log(`   Has Service Role Key: ${!!config.serviceRoleKey}`)
	}
}
