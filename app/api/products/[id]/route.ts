import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// Get a product by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const product = await prisma.product.findUnique({
      where: { id },
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

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Get product error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// Update a product
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const body = await request.json()

    // Find product
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user is the seller
    if (product.sellerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: body,
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

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error("Update product error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

// Delete a product
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Find product
    const product = await prisma.product.findUnique({
      where: { id },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user is the seller
    if (product.sellerId !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete product error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

