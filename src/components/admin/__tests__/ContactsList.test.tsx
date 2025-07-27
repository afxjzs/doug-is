import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ContactsList from "../ContactsList"
import { ContactMessage } from "@/lib/supabase/clientData"

// Mock data for testing
const mockContacts: ContactMessage[] = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		subject: "Website Inquiry",
		message: "I'm interested in your services. Please contact me.",
		created_at: "2024-01-15T02:30:00Z",
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane@example.com",
		subject: "Partnership Opportunity",
		message: "We'd like to discuss a potential partnership with your company.",
		created_at: "2024-01-14T06:20:00Z",
	},
	{
		id: "3",
		name: "Bob Wilson",
		email: "bob@example.com",
		subject: "",
		message: "Quick question about your pricing.",
		created_at: "2024-01-13T01:15:00Z",
	},
	{
		id: "4",
		name: "Alice Johnson",
		email: "alice@example.com",
		subject: "Bug Report",
		message: "Found an issue with the contact form submission.",
		created_at: "2024-01-12T08:45:00Z",
	},
]

describe("ContactsList - Admin Contact Management Testing", () => {
	const user = userEvent.setup()

	// Helper function to get contact row by name
	const getContactRow = (name: string) => {
		const contactElement = screen.getByText(name)
		return contactElement.closest(".contact-card")
	}

	describe("Initial Rendering", () => {
		it("should render all contact messages", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			expect(screen.getByText("John Doe")).toBeInTheDocument()
			expect(screen.getByText("Jane Smith")).toBeInTheDocument()
			expect(screen.getByText("Bob Wilson")).toBeInTheDocument()
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument()
		})

		it("should display contact subjects", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			expect(screen.getByText("Website Inquiry")).toBeInTheDocument()
			expect(screen.getByText("Partnership Opportunity")).toBeInTheDocument()
			expect(screen.getByText("Bug Report")).toBeInTheDocument()
		})

		it("should display contact emails", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			expect(screen.getByText("john@example.com")).toBeInTheDocument()
			expect(screen.getByText("jane@example.com")).toBeInTheDocument()
			expect(screen.getByText("bob@example.com")).toBeInTheDocument()
			expect(screen.getByText("alice@example.com")).toBeInTheDocument()
		})

		it("should display formatted dates", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// The component formats dates with time, so we check for the date part
			expect(screen.getByText(/Jan 14/)).toBeInTheDocument()
			expect(screen.getByText(/Jan 13/)).toBeInTheDocument()
			expect(screen.getAllByText(/Jan 12/)).toHaveLength(2)
		})

		it("should show filter tabs with correct counts", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			expect(screen.getByText("All (4)")).toBeInTheDocument()
			expect(screen.getByText("Unread (4)")).toBeInTheDocument()
			expect(screen.getByText("Read (0)")).toBeInTheDocument()
		})

		it("should have 'All' filter active by default", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			const allTab = screen.getByRole("button", { name: "All (4)" })
			expect(allTab).toHaveClass("active")
		})
	})

	describe("Message Expansion", () => {
		it("should show message content when expanded", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Message should be expanded by default
			expect(
				screen.getByText("I'm interested in your services. Please contact me.")
			).toBeInTheDocument()
			expect(
				screen.getByText(
					"We'd like to discuss a potential partnership with your company."
				)
			).toBeInTheDocument()
		})
	})

	describe("Filter Functionality", () => {
		it("should show all messages when 'All' filter is selected", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// All messages should be visible
			expect(screen.getByText("John Doe")).toBeInTheDocument()
			expect(screen.getByText("Jane Smith")).toBeInTheDocument()
			expect(screen.getByText("Bob Wilson")).toBeInTheDocument()
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument()
		})

		it("should show all messages when 'Unread' filter is selected", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Click unread filter
			await user.click(screen.getByText("Unread (4)"))

			// All messages should still be visible (since we removed read/unread functionality)
			expect(screen.getByText("John Doe")).toBeInTheDocument()
			expect(screen.getByText("Jane Smith")).toBeInTheDocument()
			expect(screen.getByText("Bob Wilson")).toBeInTheDocument()
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument()
		})

		it("should show all messages when 'Read' filter is selected", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Click read filter
			await user.click(screen.getByText("Read (0)"))

			// All messages should still be visible (since we removed read/unread functionality)
			expect(screen.getByText("John Doe")).toBeInTheDocument()
			expect(screen.getByText("Jane Smith")).toBeInTheDocument()
			expect(screen.getByText("Bob Wilson")).toBeInTheDocument()
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument()
		})
	})

	describe("Edge Cases and Data Handling", () => {
		it("should display 'No Subject' for messages without subject", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Bob's message has empty subject
			expect(screen.getByText("No Subject")).toBeInTheDocument()
		})

		it("should format dates correctly", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Check that dates are formatted properly (with time)
			expect(screen.getByText(/Jan 14/)).toBeInTheDocument()
			expect(screen.getByText(/Jan 13/)).toBeInTheDocument()
		})

		it("should handle empty contact list", () => {
			render(<ContactsList initialContacts={[]} />)

			expect(
				screen.getByText("No contact submissions found.")
			).toBeInTheDocument()

			// Filter tabs should show zero counts
			expect(screen.getByText("All (0)")).toBeInTheDocument()
			expect(screen.getByText("Unread (0)")).toBeInTheDocument()
			expect(screen.getByText("Read (0)")).toBeInTheDocument()
		})

		it("should handle single contact message", () => {
			const singleContact = [mockContacts[0]]
			render(<ContactsList initialContacts={singleContact} />)

			expect(screen.getByText("All (1)")).toBeInTheDocument()
			expect(screen.getByText("Unread (1)")).toBeInTheDocument()
			expect(screen.getByText("Read (0)")).toBeInTheDocument()
			expect(screen.getByText("John Doe")).toBeInTheDocument()
		})

		it("should preserve line breaks in message content", async () => {
			const messageWithLineBreaks = {
				...mockContacts[0],
				message: "Line 1\nLine 2\nLine 3",
			}
			render(<ContactsList initialContacts={[messageWithLineBreaks]} />)

			// Message should be displayed with whitespace preserved
			const messageContent = screen.getByText(/Line 1/)
			expect(messageContent).toHaveClass("contact-message")
		})
	})

	describe("Accessibility and User Experience", () => {
		it("should have proper clickable areas for message expansion", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// The entire message header should be clickable
			const messageHeader = screen
				.getByText("John Doe")
				.closest(".contact-header")

			expect(messageHeader).toBeInTheDocument()
		})

		it("should display email addresses with proper spacing", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Email addresses should be displayed with separators
			expect(screen.getByText("john@example.com")).toBeInTheDocument()
			expect(screen.getByText("jane@example.com")).toBeInTheDocument()

			// Check for separator dots
			const separators = screen.getAllByText("•")
			expect(separators.length).toBeGreaterThan(0)
		})
	})
})
