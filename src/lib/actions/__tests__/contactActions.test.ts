import { submitContactForm, type ContactFormData } from "../contactActions"
import { createAdminClient } from "@/lib/supabase/serverClient"
import { revalidatePath } from "next/cache"

// Mock external dependencies
jest.mock("@/lib/supabase/serverClient")
jest.mock("next/cache")

const mockCreateAdminClient = jest.mocked(createAdminClient)
const mockRevalidatePath = jest.mocked(revalidatePath)

// Mock Supabase client
const mockSupabaseClient = {
	from: jest.fn(),
}

// Mock database operations
const mockFrom = jest.fn()
const mockInsert = jest.fn()
const mockSelect = jest.fn()

describe("Contact Actions - Server-Side Testing", () => {
	beforeEach(() => {
		// Clear all mocks before each test
		jest.clearAllMocks()

		// Setup default mock chain
		mockCreateAdminClient.mockReturnValue(mockSupabaseClient as any)
		mockSupabaseClient.from.mockReturnValue({
			insert: mockInsert,
		})
		mockInsert.mockReturnValue({
			select: mockSelect,
		})
		mockSelect.mockResolvedValue({
			data: [{ id: 1, name: "Test", email: "test@example.com" }],
			error: null,
		})
	})

	describe("Form Validation Testing", () => {
		it("should validate and accept properly formatted form data", async () => {
			const validFormData: ContactFormData = {
				name: "John Doe",
				email: "john@example.com",
				subject: "Test Subject",
				message: "This is a test message with sufficient length",
			}

			const result = await submitContactForm(validFormData)

			expect(result.success).toBe(true)
			expect(result.message).toBe("Your message has been sent successfully!")
			expect(result.errors).toBeUndefined()
		})

		it("should reject form data with invalid name (too short)", async () => {
			const invalidFormData: ContactFormData = {
				name: "J", // Too short
				email: "john@example.com",
				subject: "Test Subject",
				message: "This is a test message with sufficient length",
			}

			const result = await submitContactForm(invalidFormData)

			expect(result.success).toBe(false)
			expect(result.message).toBe("Form validation failed")
			expect(result.errors).toBeDefined()
			expect(result.errors?.[0].message).toBe(
				"Name must be at least 2 characters"
			)
		})

		it("should reject form data with invalid email format", async () => {
			const invalidFormData: ContactFormData = {
				name: "John Doe",
				email: "invalid-email", // Invalid format
				subject: "Test Subject",
				message: "This is a test message with sufficient length",
			}

			const result = await submitContactForm(invalidFormData)

			expect(result.success).toBe(false)
			expect(result.message).toBe("Form validation failed")
			expect(result.errors).toBeDefined()
			expect(result.errors?.[0].message).toBe(
				"Please enter a valid email address"
			)
		})

		it("should reject form data with invalid subject (too short)", async () => {
			const invalidFormData: ContactFormData = {
				name: "John Doe",
				email: "john@example.com",
				subject: "Hi", // Too short
				message: "This is a test message with sufficient length",
			}

			const result = await submitContactForm(invalidFormData)

			expect(result.success).toBe(false)
			expect(result.message).toBe("Form validation failed")
			expect(result.errors).toBeDefined()
			expect(result.errors?.[0].message).toBe(
				"Subject must be at least 3 characters"
			)
		})

		it("should reject form data with invalid message (too short)", async () => {
			const invalidFormData: ContactFormData = {
				name: "John Doe",
				email: "john@example.com",
				subject: "Test Subject",
				message: "Short", // Too short
			}

			const result = await submitContactForm(invalidFormData)

			expect(result.success).toBe(false)
			expect(result.message).toBe("Form validation failed")
			expect(result.errors).toBeDefined()
			expect(result.errors?.[0].message).toBe(
				"Message must be at least 10 characters"
			)
		})

		it("should reject form data with multiple validation errors", async () => {
			const invalidFormData: ContactFormData = {
				name: "J", // Too short
				email: "invalid-email", // Invalid format
				subject: "Hi", // Too short
				message: "Short", // Too short
			}

			const result = await submitContactForm(invalidFormData)

			expect(result.success).toBe(false)
			expect(result.message).toBe("Form validation failed")
			expect(result.errors).toBeDefined()
			expect(result.errors).toHaveLength(4)
		})
	})

	describe("Database Operations Testing", () => {
		const validFormData: ContactFormData = {
			name: "John Doe",
			email: "john@example.com",
			subject: "Test Subject",
			message: "This is a test message with sufficient length",
		}

		it("should successfully insert contact message into database", async () => {
			const result = await submitContactForm(validFormData)

			expect(mockCreateAdminClient).toHaveBeenCalledTimes(1)
			expect(mockSupabaseClient.from).toHaveBeenCalledWith("contact_messages")
			expect(mockInsert).toHaveBeenCalledWith({
				name: "John Doe",
				email: "john@example.com",
				subject: "Test Subject",
				message: "This is a test message with sufficient length",
			})
			expect(mockSelect).toHaveBeenCalledTimes(1)
			expect(result.success).toBe(true)
		})

		it("should revalidate admin path after successful insertion", async () => {
			await submitContactForm(validFormData)

			expect(mockRevalidatePath).toHaveBeenCalledWith("/admin")
		})

		it("should handle database insertion errors gracefully", async () => {
			const databaseError = {
				code: "23505",
				message: "Duplicate entry",
			}

			mockSelect.mockResolvedValue({
				data: null,
				error: databaseError,
			})

			const result = await submitContactForm(validFormData)

			expect(result.success).toBe(false)
			expect(result.message).toBe("Failed to submit form: Duplicate entry")
		})

		it("should handle subject column missing with fallback strategy", async () => {
			// First call fails with subject column error
			const subjectColumnError = {
				code: "PGRST204",
				message: "Column 'subject' does not exist",
			}

			mockSelect
				.mockResolvedValueOnce({
					data: null,
					error: subjectColumnError,
				})
				.mockResolvedValueOnce({
					data: [{ id: 1, name: "Test", email: "test@example.com" }],
					error: null,
				})

			const result = await submitContactForm(validFormData)

			// Should be called twice - first attempt and fallback
			expect(mockInsert).toHaveBeenCalledTimes(2)

			// First call with normal data
			expect(mockInsert).toHaveBeenNthCalledWith(1, {
				name: "John Doe",
				email: "john@example.com",
				subject: "Test Subject",
				message: "This is a test message with sufficient length",
			})

			// Second call with fallback (subject in message)
			expect(mockInsert).toHaveBeenNthCalledWith(2, {
				name: "John Doe",
				email: "john@example.com",
				message:
					"Subject: Test Subject\n\nThis is a test message with sufficient length",
				subject: "",
			})

			expect(result.success).toBe(true)
			expect(result.message).toBe("Your message has been sent successfully!")
		})

		it("should handle fallback strategy failure", async () => {
			const subjectColumnError = {
				code: "PGRST204",
				message: "Column 'subject' does not exist",
			}

			const fallbackError = {
				code: "23505",
				message: "Fallback failed",
			}

			mockSelect
				.mockResolvedValueOnce({
					data: null,
					error: subjectColumnError,
				})
				.mockResolvedValueOnce({
					data: null,
					error: fallbackError,
				})

			const result = await submitContactForm(validFormData)

			expect(result.success).toBe(false)
			expect(result.message).toBe("Failed to submit form: Fallback failed")
		})
	})

	describe("Error Handling and Edge Cases", () => {
		const validFormData: ContactFormData = {
			name: "John Doe",
			email: "john@example.com",
			subject: "Test Subject",
			message: "This is a test message with sufficient length",
		}

		it("should handle createAdminClient throwing an error", async () => {
			mockCreateAdminClient.mockImplementation(() => {
				throw new Error("Admin client creation failed")
			})

			const result = await submitContactForm(validFormData)

			expect(result.success).toBe(false)
			expect(result.message).toBe(
				"An unexpected error occurred. Please try again later."
			)
		})

		it("should handle Supabase client method throwing an error", async () => {
			mockSupabaseClient.from.mockImplementation(() => {
				throw new Error("Database connection failed")
			})

			const result = await submitContactForm(validFormData)

			expect(result.success).toBe(false)
			expect(result.message).toBe(
				"An unexpected error occurred. Please try again later."
			)
		})

		it("should handle edge case with whitespace-only values that pass validation", async () => {
			const edgeCaseFormData: ContactFormData = {
				name: "  ", // Spaces pass validation (Zod doesn't trim by default)
				email: "test@example.com",
				subject: "   ", // Spaces pass validation
				message: "This is a valid message length",
			}

			// Our current schema doesn't trim whitespace, so spaces pass validation
			const result = await submitContactForm(edgeCaseFormData)

			expect(result.success).toBe(true)
			expect(result.message).toBe("Your message has been sent successfully!")
		})

		it("should handle very long input values", async () => {
			const longFormData: ContactFormData = {
				name: "A".repeat(1000), // Very long name
				email: "test@example.com",
				subject: "B".repeat(1000), // Very long subject
				message: "C".repeat(10000), // Very long message
			}

			const result = await submitContactForm(longFormData)

			// Should pass validation (no max length limits in schema)
			expect(result.success).toBe(true)
			expect(mockInsert).toHaveBeenCalledWith({
				name: "A".repeat(1000),
				email: "test@example.com",
				subject: "B".repeat(1000),
				message: "C".repeat(10000),
			})
		})

		it("should handle special characters and unicode in form data with valid ASCII email", async () => {
			const unicodeFormData: ContactFormData = {
				name: "João José-Smith 🚀",
				email: "joao@example.com", // Use ASCII email (international domains not supported by Zod)
				subject: "Test with émojis 😀 and àccénts",
				message: "Message with unicode characters: ñ, é, 中文, 🎉",
			}

			const result = await submitContactForm(unicodeFormData)

			expect(result.success).toBe(true)
			expect(mockInsert).toHaveBeenCalledWith({
				name: "João José-Smith 🚀",
				email: "joao@example.com",
				subject: "Test with émojis 😀 and àccénts",
				message: "Message with unicode characters: ñ, é, 中文, 🎉",
			})
		})

		it("should reject international domain names in email addresses", async () => {
			const internationalEmailData: ContactFormData = {
				name: "João José-Smith",
				email: "joão@example.com", // International domain - should be rejected
				subject: "Test Subject",
				message: "This is a test message with sufficient length",
			}

			const result = await submitContactForm(internationalEmailData)

			expect(result.success).toBe(false)
			expect(result.message).toBe("Form validation failed")
			expect(result.errors).toBeDefined()
			expect(result.errors?.[0].message).toBe(
				"Please enter a valid email address"
			)
		})
	})

	describe("Response Format Testing", () => {
		const validFormData: ContactFormData = {
			name: "John Doe",
			email: "john@example.com",
			subject: "Test Subject",
			message: "This is a test message with sufficient length",
		}

		it("should return properly formatted success response", async () => {
			const result = await submitContactForm(validFormData)

			expect(result).toEqual({
				success: true,
				message: "Your message has been sent successfully!",
			})
			expect(result.errors).toBeUndefined()
		})

		it("should return properly formatted validation error response", async () => {
			const invalidFormData: ContactFormData = {
				name: "J",
				email: "invalid",
				subject: "Hi",
				message: "Short",
			}

			const result = await submitContactForm(invalidFormData)

			expect(result).toHaveProperty("success", false)
			expect(result).toHaveProperty("message", "Form validation failed")
			expect(result).toHaveProperty("errors")
			expect(Array.isArray(result.errors)).toBe(true)
			expect(result.errors?.length).toBeGreaterThan(0)
		})

		it("should return properly formatted database error response", async () => {
			mockSelect.mockResolvedValue({
				data: null,
				error: { code: "23505", message: "Database error" },
			})

			const result = await submitContactForm(validFormData)

			expect(result).toEqual({
				success: false,
				message: "Failed to submit form: Database error",
			})
			expect(result.errors).toBeUndefined()
		})

		it("should return properly formatted unexpected error response", async () => {
			mockCreateAdminClient.mockImplementation(() => {
				throw new Error("Unexpected error")
			})

			const result = await submitContactForm(validFormData)

			expect(result).toEqual({
				success: false,
				message: "An unexpected error occurred. Please try again later.",
			})
			expect(result.errors).toBeUndefined()
		})
	})

	describe("Integration Testing", () => {
		const validFormData: ContactFormData = {
			name: "Integration Test User",
			email: "integration@example.com",
			subject: "Integration Test Subject",
			message: "This is an integration test message",
		}

		it("should complete full successful submission workflow", async () => {
			const result = await submitContactForm(validFormData)

			// Verify final success result
			expect(result.success).toBe(true)
			expect(result.message).toBe("Your message has been sent successfully!")

			// Verify admin path revalidation
			expect(mockRevalidatePath).toHaveBeenCalledWith("/admin")

			// Verify database operations were called correctly
			expect(mockCreateAdminClient).toHaveBeenCalled()
			expect(mockInsert).toHaveBeenCalledWith({
				name: validFormData.name,
				email: validFormData.email,
				subject: validFormData.subject,
				message: validFormData.message,
			})
			expect(mockSelect).toHaveBeenCalled()
		})

		it("should handle complete error workflow", async () => {
			mockCreateAdminClient.mockImplementation(() => {
				throw new Error("Complete failure test")
			})

			const result = await submitContactForm(validFormData)

			// Verify final error result
			expect(result.success).toBe(false)
			expect(result.message).toBe(
				"An unexpected error occurred. Please try again later."
			)

			// Verify that createAdminClient was called and threw an error
			expect(mockCreateAdminClient).toHaveBeenCalled()
		})
	})
})
