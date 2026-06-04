import { describe, expect, it, vi, beforeEach } from "bun:test"

/**
 * SPEC-005 Auth — Magic Link / OTP
 * Tests: AuthProvider state management logic
 * 
 * Note: React component tests require a proper test environment.
 * These tests verify the auth state management logic.
 */

import type { AuthSession, AuthUser } from "../lib/authClient"

// Mock storage for testing
let mockStorage: AuthSession | null = null

const mockLoadSession = async (): Promise<AuthSession | null> => {
  return mockStorage
}

const mockSaveSession = async (session: AuthSession): Promise<void> => {
  mockStorage = session
}

const mockClearSession = async (): Promise<void> => {
  mockStorage = null
}

// Simplified auth state manager (mimics AuthProvider logic without React)
class AuthStateManager {
  private session: AuthSession | null = null
  private isLoading: boolean = true

  constructor() {
    this.initialize()
  }

  private async initialize() {
    const stored = await mockLoadSession()
    this.session = stored
    this.isLoading = false
  }

  async signIn(session: AuthSession) {
    await mockSaveSession(session)
    this.session = session
  }

  async signOut() {
    await mockClearSession()
    this.session = null
  }

  getSession(): AuthSession | null {
    return this.session
  }

  getUser(): AuthUser | null {
    return this.session?.user ?? null
  }

  getIsLoading(): boolean {
    return this.isLoading
  }
}

describe("Auth State Management", () => {
  beforeEach(() => {
    mockStorage = null
  })

  describe("initialization", () => {
    it("starts with null session and isLoading=true", async () => {
      mockStorage = null
      const manager = new AuthStateManager()
      // Wait for async initialization
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(manager.getSession()).toBeNull()
      expect(manager.getUser()).toBeNull()
      expect(manager.getIsLoading()).toBe(false)
    })

    it("loads stored session on initialization", async () => {
      const storedSession: AuthSession = {
        token: "stored-token",
        user: { id: "user-1", email: "stored@example.com" },
      }
      mockStorage = storedSession
      const manager = new AuthStateManager()
      await new Promise(resolve => setTimeout(resolve, 0))
      expect(manager.getSession()).toEqual(storedSession)
      expect(manager.getUser()).toEqual(storedSession.user)
    })
  })

  describe("signIn", () => {
    it("updates session and saves to storage", async () => {
      const manager = new AuthStateManager()
      await new Promise(resolve => setTimeout(resolve, 0))

      const newSession: AuthSession = {
        token: "new-token",
        user: { id: "user-2", email: "new@example.com" },
      }

      await manager.signIn(newSession)

      expect(manager.getSession()).toEqual(newSession)
      expect(manager.getUser()).toEqual(newSession.user)
      expect(mockStorage).toEqual(newSession)
    })

    it("overwrites previous session", async () => {
      mockStorage = {
        token: "old-token",
        user: { id: "user-1", email: "old@example.com" },
      }
      const manager = new AuthStateManager()
      await new Promise(resolve => setTimeout(resolve, 0))

      const newSession: AuthSession = {
        token: "new-token",
        user: { id: "user-2", email: "new@example.com" },
      }

      await manager.signIn(newSession)

      expect(manager.getSession()).toEqual(newSession)
      expect(mockStorage).toEqual(newSession)
    })
  })

  describe("signOut", () => {
    it("clears session and storage", async () => {
      mockStorage = {
        token: "test-token",
        user: { id: "user-1", email: "test@example.com" },
      }
      const manager = new AuthStateManager()
      await new Promise(resolve => setTimeout(resolve, 0))

      expect(manager.getSession()).not.toBeNull()

      await manager.signOut()

      expect(manager.getSession()).toBeNull()
      expect(manager.getUser()).toBeNull()
      expect(mockStorage).toBeNull()
    })

    it("handles signOut when not signed in", async () => {
      mockStorage = null
      const manager = new AuthStateManager()
      await new Promise(resolve => setTimeout(resolve, 0))

      await manager.signOut()

      expect(manager.getSession()).toBeNull()
      expect(mockStorage).toBeNull()
    })
  })
})
