import { compare, hash } from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

// Secret key for JWT
const getSecretKey = () => {
  const secret = process.env.JWT_SECRET
  if (!secret || secret.length < 32) {
    console.warn("JWT_SECRET is not set or is too short. Using fallback secret.")
    return new TextEncoder().encode("fallback_secret_key_for_development_only_please_change_in_production")
  }
  return new TextEncoder().encode(secret)
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  try {
    return await hash(password, 12)
  } catch (error) {
    console.error("Error hashing password:", error)
    throw new Error("Failed to hash password")
  }
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  try {
    return await compare(password, hashedPassword)
  } catch (error) {
    console.error("Error verifying password:", error)
    return false
  }
}

// Create JWT token
export async function createToken(payload: any): Promise<string> {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(getSecretKey())
  } catch (error) {
    console.error("Error creating token:", error)
    throw new Error("Failed to create authentication token")
  }
}

// Verify JWT token
export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey())
    return payload
  } catch (error) {
    console.error("Error verifying token:", error)
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  try {
    cookies().set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
    })
  } catch (error) {
    console.error("Error setting auth cookie:", error)
    throw new Error("Failed to set authentication cookie")
  }
}

// Get auth cookie
export function getAuthCookie(): string | undefined {
  try {
    return cookies().get("auth_token")?.value
  } catch (error) {
    console.error("Error getting auth cookie:", error)
    return undefined
  }
}

// Remove auth cookie
export function removeAuthCookie(): void {
  try {
    cookies().delete("auth_token")
  } catch (error) {
    console.error("Error removing auth cookie:", error)
  }
}

// Get current user from token
export async function getCurrentUser() {
  try {
    const token = getAuthCookie()
    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload) return null

    return payload
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}



