"use client"

import type React from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// List of hostels
const HOSTELS = ["KP-1", "KP-1A", "KP-12", "KP-6", "KP-5", "KP-51", "QC-4", "QC-3"]

export default function AuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const defaultTab = searchParams.get("tab") || "login"

  const [activeTab, setActiveTab] = useState(defaultTab)
  const [isLoading, setIsLoading] = useState(false)

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [hostel, setHostel] = useState("")
  const [otherHostel, setOtherHostel] = useState("")
  const [showOtherHostel, setShowOtherHostel] = useState(false)
  const [roomNumber, setRoomNumber] = useState("")
  const [whatsappNumber, setWhatsappNumber] = useState("")

  const handleHostelChange = (value: string) => {
    setHostel(value)
    setShowOtherHostel(value === "other")
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("app/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })

      router.push(callbackUrl)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const selectedHostel = showOtherHostel ? otherHostel : hostel

      const response = await fetch("app/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          hostel: selectedHostel,
          roomNumber,
          whatsappNumber,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Add the new hostel if it's not in the list
      if (showOtherHostel) {
        try {
          await fetch("app/api/hostels", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: otherHostel }),
          })
        } catch (error) {
          console.error("Failed to add new hostel:", error)
        }
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      })

      router.push(callbackUrl)
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center p-4 bg-white border-b">
        <Link href="/" className="flex items-center text-sm font-medium text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12 bg-gray-50">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h1 className="mb-6 text-2xl font-bold text-center">Welcome to Hostel Marketplace</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="your.email@college.edu"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
              <div className="mt-4 text-sm text-center text-gray-500">
                <Link href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signupEmail">College Email</Label>
                  <Input
                    id="signupEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@college.edu"
                    required
                  />
                  <p className="text-xs text-gray-500">Must be a valid college email address</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hostel">Hostel</Label>
                  <Select value={hostel} onValueChange={handleHostelChange}>
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
                  <Input
                    id="whatsapp"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="e.g., 9876543210"
                    required
                  />
                  <p className="text-xs text-gray-500">For buyers to contact you</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signupPassword">Password</Label>
                  <Input
                    id="signupPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

