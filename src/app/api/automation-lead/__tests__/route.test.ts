/**
 * Product requirements for the /automating lead endpoint. Only the database
 * and Telegram are mocked, because they're the outside world.
 *
 * - A visitor who leaves out name, email, or the problem, or gives a bad
 *   email, is told so and nothing is saved.
 * - A visitor is never told "success" unless the lead was saved where the
 *   admin inbox reads it.
 * - A saved lead notifies Doug, and a notification failure never loses the
 *   lead or hides the failure.
 */

jest.mock("next/server", () => ({
	NextResponse: {
		json: jest.fn((body: unknown, init?: { status?: number }) => ({
			status: init?.status || 200,
			body,
		})),
	},
}))

const mockInsert = jest.fn()
const mockFrom = jest.fn(() => ({ insert: mockInsert }))
const mockCreateServiceRoleClient = jest.fn(() => ({ from: mockFrom }))
jest.mock("@/lib/supabase/server", () => ({
	createServiceRoleClient: () => mockCreateServiceRoleClient(),
}))

const mockFetch = jest.fn()
global.fetch = mockFetch

import { POST } from "../route"

type MockResponse = { status: number; body: { message: string } }

const validLead = {
	name: "Jane Smith",
	email: "jane@example.com",
	phone: "555-1234",
	context: "business",
	problem: "I retype every invoice into QuickBooks by hand",
}

async function post(body: unknown): Promise<MockResponse> {
	return (await POST({ json: async () => body } as Request)) as unknown as MockResponse
}

function savedRows() {
	return mockInsert.mock.calls.flatMap(([rows]) => rows)
}

describe("automation lead API", () => {
	let errorSpy: jest.SpyInstance

	beforeEach(() => {
		jest.clearAllMocks()
		mockInsert.mockResolvedValue({ error: null })
		mockFetch.mockResolvedValue({ ok: true, text: async () => "" })
		process.env.TELEGRAM_BOT_TOKEN = "test-token"
		process.env.TELEGRAM_CHAT_ID = "test-chat"
		errorSpy = jest.spyOn(console, "error").mockImplementation(() => {})
	})

	afterEach(() => {
		errorSpy.mockRestore()
		delete process.env.TELEGRAM_BOT_TOKEN
		delete process.env.TELEGRAM_CHAT_ID
	})

	it.each(["name", "email", "problem"])("tells the visitor %s is required and saves nothing", async (field) => {
		const res = await post({ ...validLead, [field]: "  " })
		expect(res.status).toBe(400)
		expect(res.body.message).toBeTruthy()
		expect(savedRows()).toHaveLength(0)
	})

	it("tells the visitor a malformed email is wrong and saves nothing", async () => {
		const res = await post({ ...validLead, email: "not-an-email" })
		expect(res.status).toBe(400)
		expect(savedRows()).toHaveLength(0)
	})

	it("saves the lead where the admin inbox reads it, then reports success", async () => {
		const res = await post(validLead)
		expect(res.status).toBe(200)
		expect(mockFrom).toHaveBeenCalledWith("contact_messages")
		const [row] = savedRows()
		expect(row).toMatchObject({ name: validLead.name, email: validLead.email })
		expect(row.message).toContain(validLead.problem)
		expect(row.message).toContain(validLead.phone)
	})

	it("never reports success when the database can't be reached", async () => {
		mockCreateServiceRoleClient.mockImplementationOnce(() => {
			throw new Error("Service role key is missing")
		})
		const res = await post(validLead)
		expect(res.status).toBe(500)
		expect(res.body.message).toBeTruthy()
		expect(errorSpy).toHaveBeenCalled()
	})

	it("never reports success when the save fails", async () => {
		mockInsert.mockResolvedValueOnce({ error: { code: "XX000", message: "boom" } })
		const res = await post(validLead)
		expect(res.status).toBe(500)
		expect(errorSpy).toHaveBeenCalled()
	})

	it("notifies Doug on Telegram with what the visitor wrote", async () => {
		await post(validLead)
		const telegramCall = mockFetch.mock.calls.find(([url]) => String(url).includes("api.telegram.org"))
		expect(telegramCall).toBeDefined()
		expect(telegramCall![1].body).toContain(validLead.problem)
	})

	it("keeps the lead and surfaces the error when Telegram rejects the notification", async () => {
		mockFetch.mockResolvedValueOnce({ ok: false, status: 400, text: async () => "bad" })
		const res = await post(validLead)
		expect(res.status).toBe(200)
		expect(savedRows()).toHaveLength(1)
		expect(errorSpy).toHaveBeenCalled()
	})

	it("keeps the lead and surfaces the error when Telegram isn't configured", async () => {
		delete process.env.TELEGRAM_BOT_TOKEN
		const res = await post(validLead)
		expect(res.status).toBe(200)
		expect(savedRows()).toHaveLength(1)
		expect(errorSpy).toHaveBeenCalled()
	})
})
