import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const hostel = searchParams.get("hostel")
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "recent"

    // Build filter
    const filter: any = {}

    if (hostel && hostel !== "All Hostels") {
      filter.hostel = hostel
    }

    if (category && category !== "all") {
      filter.category = category
    }

    if (search) {
      filter.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Build sort
    let orderBy: any = { createdAt: "desc" }

    if (sortBy === "price-low") {
      orderBy = { price: "asc" }
    } else if (sortBy === "price-high") {
      orderBy = { price: "desc" }
    }

    // Get products
    const products = await prisma.product.findMany({
      where: filter,
      orderBy,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            hostel: true,
            roomNumber: true,
            whatsappNumber: true,
          },
        },
      },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// Create a new product
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, price, category, images, hostel, roomNumber } = body

    // Validate input
    if (!name || !description || !price || !category || !hostel || !roomNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number.parseFloat(price),
        category,
        images: images || [],
        hostel,
        roomNumber,
        sellerId: user.id,
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            hostel: true,
            roomNumber: true,
            whatsappNumber: true,
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

