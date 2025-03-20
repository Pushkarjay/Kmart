"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageCircle, MapPin, Share, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            router.push("/products")
            return
          }
          throw new Error("Failed to fetch product")
        }

        const data = await response.json()
        setProduct(data)

        // If no images, use placeholder
        if (!data.images || data.images.length === 0) {
          data.images = ["/placeholder.svg?height=400&width=600"]
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router, toast])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleContactSeller = () => {
    if (product?.seller?.whatsappNumber) {
      window.open(`https://wa.me/${product.seller.whatsappNumber}`, "_blank")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild className="mt-4">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center p-4 bg-white border-b">
        <Link href="/products" className="flex items-center text-sm font-medium text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="container px-4 py-8 mx-auto">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="overflow-hidden bg-white rounded-lg shadow-md aspect-square">
              <img
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {product.images.map((image: string, index: number) => (
                  <button
                    key={index}
                    className={`overflow-hidden rounded-md aspect-square ${
                      selectedImage === index ? "ring-2 ring-blue-600" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <Badge>{product.category}</Badge>
              </div>
              <p className="mt-2 text-2xl font-bold text-blue-600">₹{product.price}</p>
              <p className="mt-1 text-sm text-gray-500">Listed on {formatDate(product.createdAt)}</p>
            </div>

            <Separator />

            <div>
              <h2 className="mb-2 text-lg font-semibold">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
            </div>

            <Separator />

            <div>
              <h2 className="mb-2 text-lg font-semibold">Location</h2>
              <div className="flex items-center text-gray-700">
                <Badge variant="outline" className="mr-2">
                  {product.hostel}
                </Badge>
                <MapPin className="w-4 h-4 mr-1" />
                <span>Room {product.roomNumber}</span>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="mb-2 text-lg font-semibold">Seller Information</h2>
              <p className="font-medium">{product.seller.name}</p>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1" onClick={handleContactSeller}>
                <MessageCircle className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
              <Button variant="outline" className="w-10 p-0">
                <Heart className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-10 p-0">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

