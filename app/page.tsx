import Link from "next/link"
import { ArrowRight, ShoppingBag, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Animation */}
      <section className="relative flex flex-col items-center justify-center w-full min-h-screen px-4 py-12 text-center bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
            Hostel Marketplace
          </h1>
          <p className="max-w-md mx-auto mt-4 text-xl text-white/90">
            Buy and sell items exclusively within your hostel community
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-white/90">
              <Link href="#browse">
                Browse Items <ShoppingBag className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-emerald-400 border-emerald-400 hover:bg-emerald-400/10"
            >
              <Link href="/auth">
                Get Started <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowRight className="w-8 h-8 text-white rotate-90" />
        </div>
      </section>

      {/* Product Listings */}
      <section id="browse" className="w-full px-4 py-16 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="mb-8 text-3xl font-bold text-center">Recently Listed Items</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden transition-shadow bg-white rounded-lg shadow-md hover:shadow-lg"
              >
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-48"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <div className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                      {product.hostel}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold">₹{product.price}</span>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button asChild variant="outline">
              <Link href="/products">
                View All Products <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Authentication Section */}
      <section id="auth" className="w-full px-4 py-16 bg-white">
        <div className="container mx-auto max-w-md">
          <h2 className="mb-8 text-3xl font-bold text-center">Join the Marketplace</h2>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <div className="grid gap-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/auth?tab=login">Login</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full">
                <Link href="/auth?tab=signup">Sign Up</Link>
              </Button>
              <div className="flex justify-center mt-4">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/settings" className="flex items-center text-gray-500">
                    <Settings className="w-4 h-4 mr-2" />
                    Account Settings
                  </Link>
                </Button>
              </div>
              <p className="mt-4 text-sm text-center text-gray-500">
                Only students from your hostel can register and access the marketplace
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-4 py-6 mt-auto bg-gray-800 text-gray-300">
        <div className="container mx-auto text-center">
          <p>© {new Date().getFullYear()} Hostel Marketplace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

// Sample product data
const products = [
  {
    id: 1,
    name: "Textbooks Bundle",
    category: "Books",
    price: 1200,
    hostel: "KP-6",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 2,
    name: "Study Desk",
    category: "Furniture",
    price: 2500,
    hostel: "KP-1",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 3,
    name: "Bicycle",
    category: "Transportation",
    price: 3500,
    hostel: "QC-4",
    image: "/placeholder.svg?height=200&width=300",
  },
  {
    id: 4,
    name: "Scientific Calculator",
    category: "Electronics",
    price: 800,
    hostel: "KP-12",
    image: "/placeholder.svg?height=200&width=300",
  },
]

