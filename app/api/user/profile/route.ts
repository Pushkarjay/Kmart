import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// Get current user profile
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        email: true,
        hostel: true,
        roomNumber: true,
        whatsappNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Get profile error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// Update user profile
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { hostel, roomNumber, whatsappNumber } = body

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        hostel,
        roomNumber,
        whatsappNumber,
      },
      select: {
        id: true,
        name: true,
        email: true,
        hostel: true,
        roomNumber: true,
        whatsappNumber: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Update profile error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

