import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// Get all hostels
export async function GET() {
  try {
    const hostels = await prisma.hostel.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(hostels)
  } catch (error) {
    console.error("Get hostels error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// Add a new hostel
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name } = body

    // Validate input
    if (!name) {
      return NextResponse.json({ error: "Missing hostel name" }, { status: 400 })
    }

    // Check if hostel already exists
    const existingHostel = await prisma.hostel.findUnique({
      where: { name },
    })

    if (existingHostel) {
      return NextResponse.json({ error: "Hostel already exists" }, { status: 409 })
    }

    // Create hostel
    const hostel = await prisma.hostel.create({
      data: { name },
    })

    return NextResponse.json(hostel)
  } catch (error) {
    console.error("Create hostel error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

