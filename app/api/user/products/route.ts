import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// Get current user's products
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const products = await prisma.product.findMany({
      where: { sellerId: user.id },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error("Get user products error:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}

