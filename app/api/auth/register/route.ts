import { type NextRequest, NextResponse } from "next/server"
import prisma, { handlePrismaOperation } from "@/lib/prisma"
import { hashPassword, createToken, setAuthCookie } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, hostel, roomNumber, whatsappNumber } = body

    // Validate input
    if (!name || !email || !password || !hostel || !roomNumber || !whatsappNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const [existingUser, existingUserError] = await handlePrismaOperation(() =>
      prisma.user.findUnique({
        where: { email },
      }),
    )

    if (existingUserError) {
      return NextResponse.json({ error: "Database error. Please try again later." }, { status: 500 })
    }

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const [user, userError] = await handlePrismaOperation(() =>
      prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          hostel,
          roomNumber,
          whatsappNumber,
        },
      }),
    )

    if (userError || !user) {
      return NextResponse.json({ error: "Failed to create user. Please try again later." }, { status: 500 })
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
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Something went wrong. Please try again later." }, { status: 500 })
  }
}

