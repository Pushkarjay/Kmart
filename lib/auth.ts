import { compare, hash } from "bcrypt"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

// Secret key for JWT
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "fallback_secret_key_for_development")

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

// Create JWT token
export async function createToken(payload: any): Promise<string> {
  return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("7d").sign(secretKey)
}

// Verify JWT token
export async function verifyToken(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    return null
  }
}

// Set auth cookie
export async function setAuthCookie(token: string): Promise<void> {
  cookies().set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  })
}

// Get auth cookie
export function getAuthCookie(): string | undefined {
  return cookies().get("auth_token")?.value
}

// Remove auth cookie
export function removeAuthCookie(): void {
  cookies().delete("auth_token")
}

// Get current user from token
export async function getCurrentUser() {
  const token = getAuthCookie()
  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload) return null

  return payload
}

