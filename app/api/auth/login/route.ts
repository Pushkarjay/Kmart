import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { verifyPassword, createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password)

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Create token
    const token = await createToken({
      id: user.id,
      email: user.email,
      name: user.name,
    })

    // Set cookie
    await setAuthCookie(token)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

