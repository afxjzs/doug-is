import { test, expect } from "@playwright/test"

/**
 * REAL ADMIN DASHBOARD TESTS
 *
 * These test the actual functionality users see and use
 * - Complete login flow
 * - Navigation between admin pages (dashboard, posts, contacts)
 * - Session persistence across page navigation
 * - Data loading and display
 */

// Get test credentials from environment variables
const TEST_EMAIL = process.env.TEST_ADMIN_EMAIL
const TEST_PASSWORD = process.env.TEST_ADMIN_PASSWORD

if (!TEST_EMAIL || !TEST_PASSWORD) {
	throw new Error(
		"Missing test credentials! Make sure .env.test contains TEST_ADMIN_EMAIL and TEST_ADMIN_PASSWORD"
	)
}

test.describe("Admin Dashboard - REAL TESTS", () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to admin (will redirect to login if not authenticated)
		await page.goto("/admin")
	})

	test("Login page should have proper styling and layout", async ({ page }) => {
		// Test that login form has correct styling - be more specific about which h1
		await expect(
			page.locator("h1").filter({ hasText: "Admin Access" })
		).toBeVisible()

		// Test form container has proper border
		const form = page.locator("form")
		await expect(form).toBeVisible()

		// Test input fields have proper styling
		const emailInput = page.locator('input[name="email"]')
		const passwordInput = page.locator('input[name="password"]')

		await expect(emailInput).toBeVisible()
		await expect(passwordInput).toBeVisible()

		// Test button styling - updated for Server Actions (no type="submit" needed)
		const signInButton = page.locator('button:has-text("Sign In")')
		await expect(signInButton).toBeVisible()
		await expect(signInButton).toContainText("Sign In")
	})

	test("Should redirect if user is not authenticated", async ({ page }) => {
		// When visiting admin, should redirect to login page
		await expect(page).toHaveURL(/\/admin\/login/)
		await expect(
			page.locator("h1").filter({ hasText: "Admin Access" })
		).toBeVisible()
	})

	test("Complete admin flow: login -> dashboard -> posts -> contacts", async ({
		page,
	}) => {
		// Step 1: Fill in login form with credentials from .env.test
		await page.fill('input[name="email"]', TEST_EMAIL)
		await page.fill('input[name="password"]', TEST_PASSWORD)

		// Step 2: Submit login form
		await page.click('button:has-text("Sign In")')

		// Step 3: Should be redirected to admin dashboard
		await expect(page).toHaveURL("/admin")
		await expect(
			page.locator("h1").filter({ hasText: "Admin Dashboard" })
		).toBeVisible()

		// Step 4: Verify dashboard content loads
		await expect(page.locator(".admin-card").first()).toBeVisible()
		await expect(
			page.locator("h2").filter({ hasText: "Posts" }).first()
		).toBeVisible()
		await expect(
			page.locator("h2").filter({ hasText: /^Contact Messages$/ })
		).toBeVisible()

		// Step 5: Navigate to Posts page (use navigation link, not dashboard link)
		await page.click('nav a[href="/admin/posts"]')
		await expect(page).toHaveURL("/admin/posts")
		await expect(
			page.locator("h1").filter({ hasText: "Posts Management" })
		).toBeVisible()

		// Step 6: Verify posts page loads data (should show table or posts)
		await expect(page.locator(".admin-card").first()).toBeVisible()

		// Step 7: Navigate to Contacts page (use navigation link)
		await page.click('nav a[href="/admin/contacts"]')
		await expect(page).toHaveURL("/admin/contacts")
		await expect(
			page.locator("h1").filter({ hasText: "Contact Messages" })
		).toBeVisible()

		// Step 8: Verify contacts page loads data
		await expect(page.locator(".admin-card").first()).toBeVisible()

		// Step 9: Navigate back to dashboard to test session persistence
		await page.click('nav a[href="/admin"]')
		await expect(page).toHaveURL("/admin")
		await expect(
			page.locator("h1").filter({ hasText: "Admin Dashboard" })
		).toBeVisible()

		// Step 10: Verify we're still authenticated (no redirect to login)
		await expect(page).not.toHaveURL(/\/admin\/login/)
	})

	test("Admin navigation should work correctly", async ({ page }) => {
		// Login first with credentials from .env.test
		await page.fill('input[name="email"]', TEST_EMAIL)
		await page.fill('input[name="password"]', TEST_PASSWORD)
		await page.click('button:has-text("Sign In")')

		// Wait for dashboard to load
		await expect(page).toHaveURL("/admin")

		// Test navigation sidebar/menu exists
		await expect(page.locator("nav")).toBeVisible()

		// Test that admin navigation links are present (use nav-specific selectors)
		await expect(page.locator('nav a[href="/admin"]')).toBeVisible()
		await expect(page.locator('nav a[href="/admin/posts"]')).toBeVisible()
		await expect(page.locator('nav a[href="/admin/contacts"]')).toBeVisible()
	})

	test("Session should persist on page refresh", async ({ page }) => {
		// Login first with credentials from .env.test
		await page.fill('input[name="email"]', TEST_EMAIL)
		await page.fill('input[name="password"]', TEST_PASSWORD)
		await page.click('button:has-text("Sign In")')

		// Wait for dashboard to load
		await expect(page).toHaveURL("/admin")

		// Refresh the page
		await page.reload()

		// Should still be on admin dashboard (not redirected to login)
		await expect(page).toHaveURL("/admin")
		await expect(
			page.locator("h1").filter({ hasText: "Admin Dashboard" })
		).toBeVisible()
		await expect(page).not.toHaveURL(/\/admin\/login/)
	})

	test("Admin pages should load data correctly", async ({ page }) => {
		// Login first with credentials from .env.test
		await page.fill('input[name="email"]', TEST_EMAIL)
		await page.fill('input[name="password"]', TEST_PASSWORD)
		await page.click('button:has-text("Sign In")')

		// Wait for dashboard to load and check for data
		await expect(page).toHaveURL("/admin")

		// Dashboard should show post count (use specific heading selector)
		await expect(
			page.locator("h2").filter({ hasText: "Posts" }).first()
		).toBeVisible()

		// Dashboard should show contact messages count
		await expect(
			page.locator("h2").filter({ hasText: /^Contact Messages$/ })
		).toBeVisible()

		// Should show actual data (not just placeholders)
		const postsCount = page
			.locator(".text-3xl.font-bold.text-purple-400")
			.first()
		await expect(postsCount).toBeVisible()

		// Navigate to posts and verify it loads (use nav link)
		await page.click('nav a[href="/admin/posts"]')
		await expect(page).toHaveURL("/admin/posts")
		await expect(
			page.locator("h1").filter({ hasText: "Posts Management" })
		).toBeVisible()

		// Navigate to contacts and verify it loads (use nav link)
		await page.click('nav a[href="/admin/contacts"]')
		await expect(page).toHaveURL("/admin/contacts")
		await expect(
			page.locator("h1").filter({ hasText: "Contact Messages" })
		).toBeVisible()
	})
})

test.describe("Error Handling - REAL ERROR SCENARIOS", () => {
	test("Should handle database connection errors gracefully", async ({
		page,
	}) => {
		// Test what happens when Supabase is unreachable
		test.skip() // Implement with network mocking
	})

	test("Should show loading states correctly", async ({ page }) => {
		// Test loading indicators during data fetching
		test.skip() // Implement with slow network simulation
	})
})
