import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth"
import { validateEmail, validatePassword } from "@/lib/validators"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, hostel, roomNumber, whatsappNumber } = body

    // Validate input
    if (!name || !email || !password || !hostel || !roomNumber || !whatsappNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength (e.g., at least 8 characters, one number, one special character)
    if (!validatePassword(password)) {
      return NextResponse.json({ error: "Password does not meet the required strength" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        hostel,
        roomNumber,
        whatsappNumber,
      },
    })

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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
