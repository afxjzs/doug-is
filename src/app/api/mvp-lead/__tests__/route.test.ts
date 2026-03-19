import { createClient } from "@supabase/supabase-js"

// Get the mocked Supabase client created at module load
const mockCreateClient = jest.mocked(createClient)

// We need to set up NextResponse.json properly before importing the route
jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((body: any, init?: { status?: number }) => ({
      status: init?.status || 200,
      body,
      json: async () => body,
    })),
  },
}))

// Mock fetch for Telegram notifications
const mockFetch = jest.fn()
global.fetch = mockFetch

import { POST } from "../route"
import { NextResponse } from "next/server"

function makeRequest(body: Record<string, any>): Request {
  return {
    json: async () => body,
  } as Request
}

describe("MVP Lead API Route", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockFetch.mockResolvedValue({ ok: true })
  })

  describe("validation", () => {
    it("rejects missing required fields", async () => {
      await POST(makeRequest({ name: "Test", email: "test@example.com" }))

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Name, email, idea, and stage are required" },
        { status: 400 }
      )
    })

    it("rejects missing name", async () => {
      await POST(
        makeRequest({
          email: "test@example.com",
          idea: "An app",
          stage: "just-an-idea",
        })
      )

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Name, email, idea, and stage are required" },
        { status: 400 }
      )
    })

    it("rejects missing email", async () => {
      await POST(
        makeRequest({
          name: "Test",
          idea: "An app",
          stage: "just-an-idea",
        })
      )

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Name, email, idea, and stage are required" },
        { status: 400 }
      )
    })

    it("rejects invalid email format", async () => {
      await POST(
        makeRequest({
          name: "Test",
          email: "not-an-email",
          idea: "An app",
          stage: "just-an-idea",
        })
      )

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Invalid email format" },
        { status: 400 }
      )
    })

    it("accepts valid email formats", async () => {
      await POST(
        makeRequest({
          name: "Test",
          email: "user+tag@sub.domain.com",
          idea: "An app",
          stage: "just-an-idea",
        })
      )

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Lead submitted successfully" },
        { status: 200 }
      )
    })
  })

  describe("successful submission", () => {
    it("returns 200 with valid data", async () => {
      await POST(
        makeRequest({
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "555-1234",
          idea: "A marketplace for handmade goods",
          stage: "some-research",
          variant: "default",
        })
      )

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Lead submitted successfully" },
        { status: 200 }
      )
    })

    it("works without optional phone field", async () => {
      await POST(
        makeRequest({
          name: "Jane Smith",
          email: "jane@example.com",
          idea: "A marketplace",
          stage: "just-an-idea",
        })
      )

      expect(NextResponse.json).toHaveBeenCalledWith(
        { message: "Lead submitted successfully" },
        { status: 200 }
      )
    })

    it("inserts into Supabase contact_messages table", async () => {
      const mockClient = mockCreateClient.mock.results[0]?.value
      if (!mockClient) return

      await POST(
        makeRequest({
          name: "Jane",
          email: "jane@test.com",
          phone: "555-0000",
          idea: "My app idea",
          stage: "some-research",
          variant: "default",
        })
      )

      expect(mockClient.from).toHaveBeenCalledWith("contact_messages")
    })
  })

  describe("Telegram notification", () => {
    it("sends Telegram notification on success", async () => {
      process.env.TELEGRAM_BOT_TOKEN = "test-token"
      process.env.TELEGRAM_CHAT_ID = "test-chat-id"

      await POST(
        makeRequest({
          name: "Jane",
          email: "jane@test.com",
          idea: "My app",
          stage: "just-an-idea",
          variant: "default",
        })
      )

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.telegram.org/bottest-token/sendMessage",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
      )

      // Clean up
      delete process.env.TELEGRAM_BOT_TOKEN
      delete process.env.TELEGRAM_CHAT_ID
    })

    it("skips Telegram when credentials not configured", async () => {
      delete process.env.TELEGRAM_BOT_TOKEN
      delete process.env.TELEGRAM_CHAT_ID

      await POST(
        makeRequest({
          name: "Jane",
          email: "jane@test.com",
          idea: "My app",
          stage: "just-an-idea",
        })
      )

      expect(mockFetch).not.toHaveBeenCalledWith(
        expect.stringContaining("telegram"),
        expect.anything()
      )
    })
  })

  describe("error handling", () => {
    it("handles malformed JSON gracefully", async () => {
      const badRequest = {
        json: async () => {
          throw new Error("Invalid JSON")
        },
      } as Request

      await POST(badRequest)

      expect(NextResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining("Internal server error"),
        }),
        { status: 500 }
      )
    })
  })
})
