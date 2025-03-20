"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// List of hostels
const HOSTELS = ["KP-1", "KP-1A", "KP-12", "KP-6", "KP-5", "KP-51", "QC-4", "QC-3"]

export default function SellProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [hostel, setHostel] = useState("")
  const [otherHostel, setOtherHostel] = useState("")
  const [showOtherHostel, setShowOtherHostel] = useState(false)
  const [roomNumber, setRoomNumber] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  // For image upload - in a real app, you'd use a service like Cloudinary or AWS S3
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setImageFiles((prev) => [...prev, ...newFiles])

      const newImages = newFiles.map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleHostelChange = (value: string) => {
    setHostel(value)
    setShowOtherHostel(value === "other")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const selectedHostel = showOtherHostel ? otherHostel : hostel

      // In a real app, you'd upload images to a storage service
      // For this example, we'll just use placeholder URLs
      const imageUrls = images.length > 0 ? images : ["/placeholder.svg?height=200&width=300"]

      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: title,
          description,
          price: Number.parseFloat(price),
          category,
          images: imageUrls,
          hostel: selectedHostel,
          roomNumber,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create product")
      }

      // Add the new hostel if it's not in the list
      if (showOtherHostel && !HOSTELS.includes(otherHostel)) {
        try {
          await fetch("/api/hostels", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: otherHostel }),
          })
        } catch (error) {
          console.error("Failed to add new hostel:", error)
        }
      }

      toast({
        title: "Success",
        description: "Your product has been listed for sale",
      })

      router.push("/products")
    } catch (error) {
      console.error("Error creating product:", error)
      toast({
        title: "Error",
        description: "Failed to list your product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center p-4 bg-white border-b">
        <Link href="/products" className="flex items-center text-sm font-medium text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>
      </div>

      <div className="container px-4 py-8 mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">Sell an Item</h1>

        <div className="p-6 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Product Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Engineering Textbooks Bundle"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="10"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g., 1200"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your item in detail. Include condition, age, brand, etc."
                rows={5}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Product Images</Label>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-gray-100">
                    <img
                      src={img || "/placeholder.svg"}
                      alt={`Product image ${index + 1}`}
                      className="object-cover w-full h-full"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md aspect-square cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="text-xs text-gray-500">Upload Image</p>
                    </div>
                    <Input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                )}
              </div>
              <p className="text-xs text-gray-500">Upload up to 5 images. First image will be the cover.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hostel">Hostel</Label>
              <Select value={hostel} onValueChange={handleHostelChange} required>
                <SelectTrigger id="hostel">
                  <SelectValue placeholder="Select your hostel" />
                </SelectTrigger>
                <SelectContent>
                  {HOSTELS.map((hostelName) => (
                    <SelectItem key={hostelName} value={hostelName}>
                      {hostelName}
                    </SelectItem>
                  ))}
                  <SelectItem value="other">Other (Not Listed)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showOtherHostel && (
              <div className="space-y-2">
                <Label htmlFor="otherHostel">Specify Hostel</Label>
                <Input
                  id="otherHostel"
                  value={otherHostel}
                  onChange={(e) => setOtherHostel(e.target.value)}
                  placeholder="Enter your hostel name"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="roomNumber">Room Number</Label>
              <Input
                id="roomNumber"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g., 302"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp Number</Label>
              <Input id="whatsapp" placeholder="e.g., 9876543210" required />
              <p className="text-xs text-gray-500">For buyers to contact you</p>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button variant="outline" type="button" asChild>
                <Link href="/products">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Listing Item..." : "List Item for Sale"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

