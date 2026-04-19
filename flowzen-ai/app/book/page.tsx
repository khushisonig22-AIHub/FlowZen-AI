"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Calendar, MapPin, Clock, ArrowLeft } from "lucide-react"
import { format } from "date-fns"

interface Event {
  id: string
  name: string
  date: string
  time: string
  venue: string
  capacity: number
  gates: number
}

export default function BookTicket() {
  const [user, setUser] = useState<any>(null)
  const [events] = useState<Event[]>([
    {
      id: "1",
      name: "Tech Conference 2024",
      date: "2024-12-15",
      time: "09:00",
      venue: "Convention Center",
      capacity: 1000,
      gates: 4
    },
    {
      id: "2",
      name: "Music Festival",
      date: "2024-12-20",
      time: "18:00",
      venue: "Stadium Arena",
      capacity: 5000,
      gates: 6
    },
    {
      id: "3",
      name: "Business Summit",
      date: "2024-12-25",
      time: "10:00",
      venue: "Hotel Grand",
      capacity: 300,
      gates: 2
    }
  ])
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("flowzen_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(currentUser))
  }, [router])

  const allocateGate = (eventId: string): { entryGate: string; exitGate: string } => {
    // AI-powered gate allocation algorithm with entry/exit routing
    const event = events.find(e => e.id === eventId)
    if (!event) return { entryGate: "1", exitGate: "4" }

    // Get gate configuration
    const gatesConfig = JSON.parse(localStorage.getItem("flowzen_gates") || "{}")
    const gates = gatesConfig.gates || []
    
    // Get existing bookings for this event
    const allBookings = JSON.parse(localStorage.getItem("flowzen_bookings") || "[]")
    const eventBookings = allBookings.filter((b: any) => b.eventId === eventId)

    // Count bookings per gate
    const gateCounts: { [key: string]: number } = {}
    
    // Initialize gate counts
    gates.forEach((gate: any) => {
      const currentLoad = eventBookings.filter((b: any) => b.entryGate === gate.id).length
      gateCounts[gate.id] = currentLoad
    })

    // Find entry gate with least bookings and capacity available
    let minBookings = Infinity
    let bestEntryGate = "gate-1"
    let bestExitGate = "gate-4"

    gates.filter((g: any) => g.type === "entry").forEach((gate: any) => {
      const count = gateCounts[gate.id] || 0
      if (count < gate.capacity && count < minBookings) {
        minBookings = count
        bestEntryGate = gate.id
      }
    })

    // Assign exit gate (distribute across available exit gates)
    const exitGates = gates.filter((g: any) => g.type === "exit")
    if (exitGates.length > 0) {
      const exitCounts: { [key: string]: number } = {}
      exitGates.forEach((gate: any) => {
        exitCounts[gate.id] = eventBookings.filter((b: any) => b.exitGate === gate.id).length
      })
      
      let minExitCount = Infinity
      exitGates.forEach((gate: any) => {
        const count = exitCounts[gate.id] || 0
        if (count < gate.capacity && count < minExitCount) {
          minExitCount = count
          bestExitGate = gate.id
        }
      })
    }

    return { entryGate: bestEntryGate, exitGate: bestExitGate }
  }

  const handleBooking = async () => {
    if (!selectedEvent || !user) return

    setIsLoading(true)

    const event = events.find(e => e.id === selectedEvent)
    if (!event) return

    const { entryGate, exitGate } = allocateGate(selectedEvent)

    // Get gate names from config
    const gatesConfig = JSON.parse(localStorage.getItem("flowzen_gates") || "{}")
    const gates = gatesConfig.gates || []
    
    const entryGateInfo = gates.find((g: any) => g.id === entryGate) || { name: entryGate }
    const exitGateInfo = gates.find((g: any) => g.id === exitGate) || { name: exitGate }

    const booking = {
      id: Date.now().toString(),
      userId: user.id,
      eventId: selectedEvent,
      eventName: event.name,
      date: event.date,
      time: event.time,
      venue: event.venue,
      entryGate: entryGate,
      entryGateName: entryGateInfo.name,
      exitGate: exitGate,
      exitGateName: exitGateInfo.name,
      status: "confirmed",
      qrCode: `QR-${Date.now()}`,
      createdAt: new Date().toISOString()
    }

    // Save booking
    const allBookings = JSON.parse(localStorage.getItem("flowzen_bookings") || "[]")
    allBookings.push(booking)
    localStorage.setItem("flowzen_bookings", JSON.stringify(allBookings))

    router.push(`/ticket/${booking.id}`)
    setIsLoading(false)
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FlowZen AI</span>
            </div>
            <Link href="/dashboard">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Book Your Ticket</h1>
            <p className="text-gray-600 mt-2">Select an event and get AI-optimized gate allocation</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Event Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select Event</CardTitle>
                <CardDescription>Choose from available events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="event">Event</Label>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEvent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-blue-50 rounded-lg"
                  >
                    <h3 className="font-semibold text-blue-900 mb-2">Event Details</h3>
                    {(() => {
                      const event = events.find(e => e.id === selectedEvent)
                      return event ? (
                        <div className="space-y-2 text-sm text-blue-800">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {format(new Date(event.date), "PPP")}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.venue}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2" />
                            Capacity: {event.capacity} | Gates: {event.gates}
                          </div>
                        </div>
                      ) : null
                    })()}
                  </motion.div>
                )}

                <Button
                  onClick={handleBooking}
                  disabled={!selectedEvent || isLoading}
                  className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {isLoading ? "Allocating Gate..." : "Book Ticket"}
                </Button>
              </CardContent>
            </Card>

            {/* AI Gate Allocation Info */}
            <Card>
              <CardHeader>
                <CardTitle>AI Gate Allocation</CardTitle>
                <CardDescription>How our AI optimizes crowd flow</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Load Balancing</h4>
                      <p className="text-sm text-gray-600">Distributes attendees evenly across available gates</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Real-time Optimization</h4>
                      <p className="text-sm text-gray-600">Adjusts allocations based on current crowd patterns</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Predictive Analysis</h4>
                      <p className="text-sm text-gray-600">Uses historical data to predict optimal gate assignments</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">4</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Instant Processing</h4>
                      <p className="text-sm text-gray-600">Gate allocation happens in milliseconds</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  )
}