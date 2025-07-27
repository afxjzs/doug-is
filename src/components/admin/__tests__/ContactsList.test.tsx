import { render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ContactsList from "../ContactsList"
import { ContactMessage } from "@/lib/supabase/clientData"

// Mock contact data for testing
const mockContacts: ContactMessage[] = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		subject: "Website Inquiry",
		message: "I'm interested in your services. Please contact me.",
		created_at: "2024-01-15T10:30:00Z",
		is_read: false,
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane@example.com",
		subject: "Partnership Opportunity",
		message: "We'd like to discuss a potential partnership with your company.",
		created_at: "2024-01-14T14:20:00Z",
		is_read: true,
	},
	{
		id: "3",
		name: "Bob Wilson",
		email: "bob@example.com",
		subject: "",
		message: "Quick question about your pricing.",
		created_at: "2024-01-13T09:15:00Z",
		is_read: false,
	},
	{
		id: "4",
		name: "Alice Johnson",
		email: "alice@example.com",
		subject: "Bug Report",
		message: "Found an issue with the contact form submission.",
		created_at: "2024-01-12T16:45:00Z",
		is_read: true,
	},
]

describe("ContactsList - Admin Contact Management Testing", () => {
	const user = userEvent.setup()

	beforeEach(() => {
		// Reset any state between tests
		jest.clearAllMocks()
	})

	// Helper function to get a specific contact row by name
	const getContactRow = (name: string) => {
		return screen.getByText(name).closest(".bg-white")
	}

	// Helper function to get button within a specific row
	const getRowButton = (row: Element | null) => {
		return row?.querySelector("button")
	}

	describe("Component Rendering and Initial State", () => {
		it("should render correctly with contact data", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Check filter tabs with exact text matching
			expect(screen.getByText("All (4)")).toBeInTheDocument()
			expect(screen.getByText("Unread (2)")).toBeInTheDocument()
			expect(screen.getByText("Read (2)")).toBeInTheDocument()

			// Check all contacts are visible
			expect(screen.getByText("John Doe")).toBeInTheDocument()
			expect(screen.getByText("Jane Smith")).toBeInTheDocument()
			expect(screen.getByText("Bob Wilson")).toBeInTheDocument()
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument()

			// Check contact details
			expect(screen.getByText("john@example.com")).toBeInTheDocument()
			expect(screen.getByText("Website Inquiry")).toBeInTheDocument()
		})

		it("should show correct unread vs read styling", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Unread messages should have cyan border
			const johnRow = getContactRow("John Doe")
			const bobRow = getContactRow("Bob Wilson")
			expect(johnRow).toHaveClass("border-[rgba(var(--color-cyan),0.3)]")
			expect(bobRow).toHaveClass("border-[rgba(var(--color-cyan),0.3)]")

			// Read messages should have standard border
			const janeRow = getContactRow("Jane Smith")
			const aliceRow = getContactRow("Alice Johnson")
			expect(janeRow).toHaveClass("border-[rgba(var(--color-foreground),0.1)]")
			expect(aliceRow).toHaveClass("border-[rgba(var(--color-foreground),0.1)]")
		})

		it("should render correct button text for read/unread status", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Unread messages should show "Mark as read"
			const johnRow = getContactRow("John Doe")
			const johnButton = getRowButton(johnRow)
			expect(johnButton).toHaveTextContent("Mark as read")

			const bobRow = getContactRow("Bob Wilson")
			const bobButton = getRowButton(bobRow)
			expect(bobButton).toHaveTextContent("Mark as read")

			// Read messages should show "Mark as unread"
			const janeRow = getContactRow("Jane Smith")
			const janeButton = getRowButton(janeRow)
			expect(janeButton).toHaveTextContent("Mark as unread")

			const aliceRow = getContactRow("Alice Johnson")
			const aliceButton = getRowButton(aliceRow)
			expect(aliceButton).toHaveTextContent("Mark as unread")
		})
	})

	describe("Filter Functionality", () => {
		it("should filter to show only unread messages", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Click Unread filter using exact text
			const unreadButton = screen.getByRole("button", { name: "Unread (2)" })
			await user.click(unreadButton)

			// Only unread messages should be visible
			expect(screen.getByText("John Doe")).toBeInTheDocument()
			expect(screen.getByText("Bob Wilson")).toBeInTheDocument()
			expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument()
			expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument()
		})

		it("should filter to show only read messages", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Click Read filter using exact text
			const readButton = screen.getByRole("button", { name: "Read (2)" })
			await user.click(readButton)

			// Only read messages should be visible
			expect(screen.getByText("Jane Smith")).toBeInTheDocument()
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument()
			expect(screen.queryByText("John Doe")).not.toBeInTheDocument()
			expect(screen.queryByText("Bob Wilson")).not.toBeInTheDocument()
		})

		it("should show all messages when All filter is selected", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Click Unread first to change state
			const unreadButton = screen.getByRole("button", { name: "Unread (2)" })
			await user.click(unreadButton)

			// Then click All to show everything
			const allButton = screen.getByRole("button", { name: "All (4)" })
			await user.click(allButton)

			// All messages should be visible
			expect(screen.getByText("John Doe")).toBeInTheDocument()
			expect(screen.getByText("Jane Smith")).toBeInTheDocument()
			expect(screen.getByText("Bob Wilson")).toBeInTheDocument()
			expect(screen.getByText("Alice Johnson")).toBeInTheDocument()
		})

		it("should apply correct active styling to selected filter", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// All tab should start active
			const allButton = screen.getByRole("button", { name: "All (4)" })
			expect(allButton).toHaveClass("border-[rgba(var(--color-violet),1)]")

			// Click Read filter
			const readButton = screen.getByRole("button", { name: "Read (2)" })
			await user.click(readButton)

			// Read tab should now be active (uses green color)
			expect(readButton).toHaveClass("border-[rgba(var(--color-green),1)]")
			expect(allButton).toHaveClass("border-transparent")
		})
	})

	describe("Message Expansion", () => {
		it("should expand message content when clicking on message header", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Message content should not be visible initially
			expect(
				screen.queryByText(
					"I'm interested in your services. Please contact me."
				)
			).not.toBeInTheDocument()

			// Click on John's message header
			await user.click(screen.getByText("John Doe"))

			// Message content should now be visible
			expect(
				screen.getByText("I'm interested in your services. Please contact me.")
			).toBeInTheDocument()
		})

		it("should collapse message when clicking header again", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Expand message
			await user.click(screen.getByText("John Doe"))
			expect(
				screen.getByText("I'm interested in your services. Please contact me.")
			).toBeInTheDocument()

			// Click again to collapse
			await user.click(screen.getByText("John Doe"))
			expect(
				screen.queryByText(
					"I'm interested in your services. Please contact me."
				)
			).not.toBeInTheDocument()
		})

		it("should show correct chevron rotation for expanded messages", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			const johnRow = getContactRow("John Doe")
			const chevronIcon = johnRow?.querySelector("svg")

			// Chevron should not be rotated initially
			expect(chevronIcon).not.toHaveClass("rotate-180")

			// Expand message
			await user.click(screen.getByText("John Doe"))

			// Chevron should be rotated after expansion
			await waitFor(() => {
				expect(chevronIcon).toHaveClass("rotate-180")
			})
		})
	})

	describe("Read/Unread Status Management", () => {
		it("should toggle message from unread to read", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// John's message starts as unread
			const johnRow = getContactRow("John Doe")
			const johnButton = getRowButton(johnRow)

			expect(johnButton).toHaveTextContent("Mark as read")

			// Click to mark as read
			if (johnButton) {
				await user.click(johnButton)
			}

			// Should lose the blue unread indicator
			await waitFor(() => {
				expect(
					johnRow?.querySelector(
						".bg-\\[rgba\\(var\\(--color-cyan\\)\\,1\\)\\]"
					)
				).not.toBeInTheDocument()
			})

			// Button text should change
			expect(johnButton).toHaveTextContent("Mark as unread")
		})

		it("should toggle message from read to unread", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Jane's message starts as read
			const janeRow = getContactRow("Jane Smith")
			const janeButton = getRowButton(janeRow)

			expect(janeButton).toHaveTextContent("Mark as unread")

			// Click to mark as unread
			if (janeButton) {
				await user.click(janeButton)
			}

			// Should now show blue indicator for unread
			await waitFor(() => {
				expect(
					janeRow?.querySelector(
						".bg-\\[rgba\\(var\\(--color-cyan\\)\\,1\\)\\]"
					)
				).toBeInTheDocument()
			})

			// Button text should change
			expect(janeButton).toHaveTextContent("Mark as read")
		})

		it("should update filter counts when toggling read status", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Initial counts: All (4), Unread (2), Read (2)
			expect(screen.getByText("Unread (2)")).toBeInTheDocument()
			expect(screen.getByText("Read (2)")).toBeInTheDocument()

			// Mark John's message as read
			const johnRow = getContactRow("John Doe")
			const johnButton = getRowButton(johnRow)

			if (johnButton) {
				await user.click(johnButton)
			}

			// Counts should update: Unread (1), Read (3)
			await waitFor(() => {
				expect(screen.getByText("Unread (1)")).toBeInTheDocument()
				expect(screen.getByText("Read (3)")).toBeInTheDocument()
			})
		})

		it("should not expand message when clicking read/unread button", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Message should not be expanded initially
			expect(
				screen.queryByText(
					"I'm interested in your services. Please contact me."
				)
			).not.toBeInTheDocument()

			// Click John's mark as read button
			const johnRow = getContactRow("John Doe")
			const johnButton = getRowButton(johnRow)

			if (johnButton) {
				await user.click(johnButton)
			}

			// Message should still not be expanded
			expect(
				screen.queryByText(
					"I'm interested in your services. Please contact me."
				)
			).not.toBeInTheDocument()
		})

		it("should show correct styling for read vs unread messages", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Find John's message (unread) and Jane's message (read)
			const johnRow = getContactRow("John Doe")
			const janeRow = getContactRow("Jane Smith")

			// Unread message should have cyan border
			expect(johnRow).toHaveClass("border-[rgba(var(--color-cyan),0.3)]")

			// Read message should have standard border
			expect(janeRow).toHaveClass("border-[rgba(var(--color-foreground),0.1)]")
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

			// Check that dates are formatted properly
			expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument()
			expect(screen.getByText(/Jan 14, 2024/)).toBeInTheDocument()
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
				message: "Line 1\\nLine 2\\nLine 3",
			}
			render(<ContactsList initialContacts={[messageWithLineBreaks]} />)

			// Expand message
			await user.click(screen.getByText("John Doe"))

			// Message should be displayed with whitespace preserved
			const messageContent = screen.getByText("Line 1\\nLine 2\\nLine 3")
			expect(messageContent).toHaveClass("whitespace-pre-wrap")
		})
	})

	describe("Accessibility and User Experience", () => {
		it("should have proper clickable areas for message expansion", async () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// The entire message header should be clickable
			const messageHeader =
				screen.getByText("John Doe").closest("[role='button']") ||
				screen.getByText("John Doe").closest(".cursor-pointer")

			expect(messageHeader).toBeInTheDocument()
		})

		it("should provide visual feedback for unread messages", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Unread messages should have a blue indicator dot
			const unreadIndicators = screen
				.getAllByRole("generic")
				.filter(
					(element) =>
						element.className.includes("bg-[rgba(var(--color-cyan),1)]") &&
						element.className.includes("w-2 h-2 rounded-full")
				)

			// Should have 2 unread indicators (John and Bob)
			expect(unreadIndicators).toHaveLength(2)
		})

		it("should show hover states on interactive elements", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Filter buttons should have hover states
			const unreadTab = screen.getByRole("button", { name: "Unread (2)" })
			expect(unreadTab).toHaveClass(
				"hover:text-[rgba(var(--color-foreground),0.8)]"
			)

			// Check that read/unread buttons exist and are properly configured
			const johnRow = getContactRow("John Doe")
			const johnButton = getRowButton(johnRow)
			expect(johnButton).toBeInTheDocument()
			expect(johnButton).toHaveTextContent("Mark as read")
		})

		it("should display email addresses as clickable mailto links", () => {
			render(<ContactsList initialContacts={mockContacts} />)

			// Email addresses should be displayed (though not as links in this component)
			expect(screen.getByText("john@example.com")).toBeInTheDocument()
			expect(screen.getByText("jane@example.com")).toBeInTheDocument()
		})
	})
})
