"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

// List of hostels
const HOSTELS = ["KP-1", "KP-1A", "KP-12", "KP-6", "KP-5", "KP-51", "QC-4", "QC-3"]

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    hostel: "",
    roomNumber: "",
    whatsappNumber: "",
  })

  const [hostel, setHostel] = useState("")
  const [otherHostel, setOtherHostel] = useState("")
  const [showOtherHostel, setShowOtherHostel] = useState(false)
  const [roomNumber, setRoomNumber] = useState("")
  const [whatsapp, setWhatsapp] = useState("")

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile")

        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await response.json()
        setUserData(data)
        setHostel(data.hostel)
        setRoomNumber(data.roomNumber)
        setWhatsapp(data.whatsappNumber)

        // Check if hostel is in the list
        if (!HOSTELS.includes(data.hostel)) {
          setShowOtherHostel(true)
          setOtherHostel(data.hostel)
          setHostel("other")
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [toast])

  const handleHostelChange = (value: string) => {
    setHostel(value)
    setShowOtherHostel(value === "other")
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      const selectedHostel = showOtherHostel ? otherHostel : hostel

      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostel: selectedHostel,
          roomNumber,
          whatsappNumber: whatsapp,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      const updatedData = await response.json()
      setUserData(updatedData)

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
        description: "Your profile has been updated",
      })
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update your profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center p-4 bg-white border-b">
        <Link href="/" className="flex items-center text-sm font-medium text-blue-600">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="container px-4 py-8 mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold">Account Settings</h1>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View and update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={userData.name} disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={userData.email} disabled />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hostel Information</CardTitle>
              <CardDescription>Update your hostel and room details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
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
                  <div className="grid gap-2">
                    <Label htmlFor="otherHostel">Specify Hostel</Label>
                    <Input
                      id="otherHostel"
                      value={otherHostel}
                      onChange={(e) => setOtherHostel(e.target.value)}
                      placeholder="Enter your hostel name"
                    />
                  </div>
                )}

                <div className="grid gap-2">
                  <Label htmlFor="roomNumber">Room Number</Label>
                  <Input
                    id="roomNumber"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    placeholder="e.g., 302"
                  />
                </div>

                <Separator className="my-2" />

                <div className="grid gap-2">
                  <Label htmlFor="whatsapp">WhatsApp Number</Label>
                  <Input
                    id="whatsapp"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="e.g., 9876543210"
                  />
                  <p className="text-xs text-gray-500">For buyers to contact you</p>
                </div>

                <Button onClick={handleSave} disabled={isSaving} className="justify-self-end mt-2">
                  {isSaving ? "Saving..." : "Save Changes"}
                  {!isSaving && <Save className="w-4 h-4 ml-2" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

