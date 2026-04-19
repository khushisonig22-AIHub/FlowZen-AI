"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, MapPin, Clock, ArrowLeft, Download, Share2 } from "lucide-react"
import QRCode from "qrcode"

interface Booking {
  id: string
  eventName: string
  date: string
  time: string
  venue: string
  entryGate?: string
  entryGateName?: string
  exitGate?: string
  exitGateName?: string
  gate?: string
  status: string
  qrCode: string
}

export default function TicketPage() {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const currentUser = localStorage.getItem("flowzen_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(currentUser))

    // Load booking
    const allBookings = JSON.parse(localStorage.getItem("flowzen_bookings") || "[]")
    const bookingData = allBookings.find((b: any) => b.id === params.id)

    if (!bookingData) {
      router.push("/dashboard")
      return
    }

    setBooking(bookingData)

    // Generate QR code
    QRCode.toDataURL(bookingData.qrCode, {
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    }).then((url: string) => {
      setQrCodeUrl(url)
    }).catch((err: any) => {
      console.error(err)
    })
  }, [params.id, router])

  const handleDownload = () => {
    // Simple download simulation
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `ticket-${booking?.id}.png`
    link.click()
  }

  if (!booking || !user) return null

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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Your Boarding Pass</h1>
            <p className="text-gray-600 mt-2">Present this ticket at the gate for entry</p>
          </div>

          {/* Ticket Card */}
          <Card className="max-w-2xl mx-auto shadow-2xl border-2">
            <CardHeader className="bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{booking.eventName}</CardTitle>
                  <CardDescription className="text-blue-100">
                    Ticket #{booking.id}
                  </CardDescription>
                </div>
                <Badge className="bg-white text-blue-600">
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Event Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        {booking.time}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {booking.venue}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Attendee</h3>
                    <p className="text-gray-600">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* Gate & QR Code */}
                <div className="text-center space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h3 className="font-semibold text-green-900 mb-2 text-xs">ENTRY GATE</h3>
                      <div className="text-3xl font-bold text-green-600 bg-green-50 rounded-lg py-3 px-4 inline-block">
                        {booking.entryGateName || booking.gate || 'A'}
                      </div>
                      <p className="text-xs text-green-600 mt-1">Check-in here</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-900 mb-2 text-xs">EXIT GATE</h3>
                      <div className="text-3xl font-bold text-red-600 bg-red-50 rounded-lg py-3 px-4 inline-block">
                        {booking.exitGateName || 'D'}
                      </div>
                      <p className="text-xs text-red-600 mt-1">Exit after event</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 italic">
                    AI-optimized gate allocation for crowd management
                  </p>

                  {qrCodeUrl && (
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">QR Code</h3>
                      <div className="bg-white p-4 rounded-lg inline-block border-2 border-gray-200">
                        <img
                          src={qrCodeUrl}
                          alt="QR Code"
                          className="w-32 h-32"
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Scan at entry gate for verification
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">Entry & Exit Instructions</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Arrive at least 30 minutes before the event</li>
                  <li>• Proceed to ENTRY GATE {booking.entryGateName || booking.gate || 'A'} as indicated</li>
                  <li>• Show this boarding pass and valid ID</li>
                  <li>• QR code will be scanned for entry verification</li>
                  <li>• After the event, please exit through EXIT GATE {booking.exitGateName || 'D'}</li>
                  <li>• Check with staff for any capacity limits or queue information</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button onClick={handleDownload} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download Ticket
            </Button>
            <Button variant="outline">
              <Share2 className="w-4 h-4 mr-2" />
              Share Ticket
            </Button>
            <Link href="/dashboard">
              <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                View All Bookings
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}