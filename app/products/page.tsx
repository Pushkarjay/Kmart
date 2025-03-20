"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Filter, Search, MessageCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"

// List of hostels
const HOSTELS = ["All Hostels", "KP-1", "KP-1A", "KP-12", "KP-6", "KP-5", "KP-51", "QC-4", "QC-3"]

// List of categories
const CATEGORIES = [
  "all",
  "books",
  "electronics",
  "furniture",
  "clothing",
  "stationery",
  "transportation",
  "home",
  "other",
]

export default function ProductsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [products, setProducts] = useState([])

  const [selectedHostel, setSelectedHostel] = useState("All Hostels")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")

  useEffect(() => {
    fetchProducts()
  }, [selectedHostel, selectedCategory, sortBy])

  const fetchProducts = async () => {
    setIsLoading(true)

    try {
      const params = new URLSearchParams()

      if (selectedHostel !== "All Hostels") {
        params.append("hostel", selectedHostel)
      }

      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }

      if (searchQuery) {
        params.append("search", searchQuery)
      }

      params.append("sortBy", sortBy)

      const response = await fetch(`/api/products?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchProducts()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
          <h1 className="text-3xl font-bold">Browse Products</h1>
          <Button asChild>
            <Link href="/products/sell">Sell an Item</Link>
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col gap-4 p-4 mb-8 bg-white rounded-lg shadow md:flex-row">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="flex flex-col gap-4 md:flex-row">
            <Select value={selectedHostel} onValueChange={setSelectedHostel}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Hostel" />
              </SelectTrigger>
              <SelectContent>
                {HOSTELS.map((hostel) => (
                  <SelectItem key={hostel} value={hostel}>
                    {hostel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="furniture">Furniture</SelectItem>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="stationery">Stationery</SelectItem>
                <SelectItem value="transportation">Transportation</SelectItem>
                <SelectItem value="home">Home & Bedding</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={fetchProducts}>
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product: any) => (
              <div
                key={product.id}
                className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
              >
                <Link href={`/products/${product.id}`}>
                  <img
                    src={product.images?.[0] || "/placeholder.svg?height=200&width=300"}
                    alt={product.name}
                    className="object-cover w-full h-48"
                  />
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <Badge variant="outline" className="ml-2">
                      {product.hostel}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold">₹{product.price}</span>
                    <span className="text-sm text-gray-500">{new Date(product.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      Room {product.roomNumber}
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-auto"
                            onClick={() => window.open(`https://wa.me/${product.seller.whatsappNumber}`, "_blank")}
                          >
                            <MessageCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Contact on WhatsApp</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-lg shadow">
            <h3 className="text-lg font-medium">No products found</h3>
            <p className="mt-2 text-gray-500">Try changing your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

