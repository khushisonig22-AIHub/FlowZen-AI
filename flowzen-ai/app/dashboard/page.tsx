"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertTriangle,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react"

interface Booking {
  id: string
  userId: string
  eventName: string
  date: string
  time: string
  gate?: string
  entryGate?: string
  entryGateName?: string
  exitGate?: string
  exitGateName?: string
  status: "confirmed" | "used" | "cancelled"
  qrCode: string
  crowdPercentage?: number
}

const getCrowdPercent = (id: string) => {
  const base = Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return Math.min(98, Math.max(32, (base % 71) + 30))
}

const capacityLabel = (percent: number) => {
  if (percent >= 80) return "High crowd"
  if (percent >= 50) return "Moderate crowd"
  return "Low crowd"
}

const capacityColor = (percent: number) => {
  if (percent >= 80) return "bg-red-500"
  if (percent >= 50) return "bg-yellow-400"
  return "bg-emerald-500"
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "bg-emerald-100 text-emerald-800"
    case "used":
      return "bg-sky-100 text-sky-800"
    case "cancelled":
      return "bg-rose-100 text-rose-800"
    default:
      return "bg-slate-100 text-slate-800"
  }
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertBooking, setAlertBooking] = useState<Booking | null>(null)
  const router = useRouter()

  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return

    const currentUser = localStorage.getItem("flowzen_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    setUser(userData)

    const allBookings: Booking[] = JSON.parse(
      localStorage.getItem("flowzen_bookings") || "[]"
    )

    const userBookings = allBookings
      .filter((booking) => booking.userId === userData.id)
      .map((booking) => ({
        ...booking,
        crowdPercentage: getCrowdPercent(booking.id),
      }))

    setBookings(userBookings)
    initializedRef.current = true
  }, []) // Empty dependency array to run only once // Only depend on router to avoid infinite loops

  useEffect(() => {
    const highAlert = bookings.find(
      (booking) => booking.crowdPercentage && booking.crowdPercentage >= 80 && booking.status === "confirmed"
    )
    if (highAlert) {
      setAlertBooking(highAlert)
      setAlertVisible(true)
    }
  }, [bookings])

  const alertCount = useMemo(
    () => bookings.filter((booking) => booking.crowdPercentage && booking.crowdPercentage >= 80 && booking.status === "confirmed").length,
    [bookings]
  )

  const stats = useMemo(
    () => ({
      total: bookings.length,
      active: bookings.filter((booking) => booking.status === "confirmed").length,
      upcoming: bookings.filter((booking) => booking.status !== "cancelled").length,
    }),
    [bookings]
  )

  const handleCancelBooking = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?")
    if (!confirmed) {
      return
    }

    const updatedBookings = bookings.map((booking) =>
      booking.id === id ? { ...booking, status: "cancelled" as const } : booking
    )
    setBookings(updatedBookings)

    const allBookings: Booking[] = JSON.parse(
      localStorage.getItem("flowzen_bookings") || "[]"
    )
    const persistedBookings = allBookings.map((booking) =>
      booking.id === id ? { ...booking, status: "cancelled" } : booking
    )
    localStorage.setItem("flowzen_bookings", JSON.stringify(persistedBookings))
  }

  const handleLogout = () => {
    localStorage.removeItem("flowzen_current_user")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="bg-slate-900/95 border-b border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg shadow-slate-950/20">
              <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">FlowZen AI</p>
              <p className="text-lg font-semibold text-white">Smart crowd command center</p>
            </div>
          </div>
          <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
            <button
              type="button"
              className="group relative inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-2 text-sm font-medium text-slate-100 shadow-sm transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-label="View notifications"
            >
              <Bell className="h-5 w-5 text-slate-200" aria-hidden="true" />
              Notifications
              {alertCount > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-rose-500 px-2 text-xs font-semibold text-white">
                  {alertCount}
                </span>
              )}
            </button>
            <div className="text-right">
              <p className="text-sm text-slate-400">Welcome back,</p>
              <p className="text-base font-semibold text-white">{user.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} aria-label="Log out">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-10 rounded-3xl border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/40">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-400">Smart event intelligence</p>
              <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">AI-powered crowd alerts and booking control</h1>
              <p className="mt-4 max-w-2xl text-slate-300">Monitor capacity with confidence, manage bookings instantly, and keep guests safe across every event.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:w-[26rem]">
              <Link href="/book" aria-label="Book a new ticket">
                <Button className="w-full">Book Ticket</Button>
              </Link>
              <Link href="/" aria-label="Open event overview">
                <Button variant="secondary" className="w-full">Venue overview</Button>
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="dashboard-stats" className="grid gap-6 lg:grid-cols-3">
          <Card className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white shadow-2xl">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">Total Bookings</p>
                <Ticket className="h-5 w-5 text-sky-100/90" aria-hidden="true" />
              </div>
              <CardTitle className="text-4xl font-semibold">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Your current booking volume at a glance.</CardDescription>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white shadow-2xl">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">Active Tickets</p>
                <Users className="h-5 w-5 text-emerald-100/90" aria-hidden="true" />
              </div>
              <CardTitle className="text-4xl font-semibold">{stats.active}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Confirmed tickets ready for event entry.</CardDescription>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-2xl">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">Upcoming Events</p>
                <CalendarDays className="h-5 w-5 text-violet-100/90" aria-hidden="true" />
              </div>
              <CardTitle className="text-4xl font-semibold">{stats.upcoming}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Events scheduled and ready to monitor.</CardDescription>
            </CardContent>
          </Card>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="dashboard-stats" className="text-2xl font-semibold text-white">Live bookings</h2>
              <p className="mt-2 text-slate-400">Manage bookings, monitor crowd levels, and adjust access in real time.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-slate-800 text-slate-200">Alerts: {alertCount}</Badge>
              <Badge className="bg-slate-800 text-slate-200">High crowd threshold: 80%</Badge>
            </div>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-center shadow-2xl">
              <Ticket className="mx-auto mb-4 h-14 w-14 text-slate-500" aria-hidden="true" />
              <p className="text-xl font-semibold text-white">No bookings found</p>
              <p className="mt-2 text-slate-400">Create your first booking to enable crowd monitoring and smart alerts.</p>
              <div className="mt-6 flex justify-center">
                <Link href="/book" aria-label="Create first booking">
                  <Button>Book your first event</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const crowd = booking.crowdPercentage ?? 45
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-[2rem] border border-slate-800 bg-slate-900/90 p-6 shadow-2xl"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-800 text-sky-300">
                            <Ticket className="h-6 w-6" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold text-white">{booking.eventName}</h3>
                            <p className="mt-1 text-sm text-slate-400">{booking.date} · {booking.time}</p>
                          </div>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                            <p className="font-medium text-slate-100">Entry</p>
                            <p className="mt-2">{booking.entryGateName || booking.gate || "TBD"}</p>
                          </div>
                          <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                            <p className="font-medium text-slate-100">Exit</p>
                            <p className="mt-2">{booking.exitGateName || "N/A"}</p>
                          </div>
                          <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                            <p className="font-medium text-slate-100">Status</p>
                            <p className="mt-2 capitalize">{booking.status}</p>
                          </div>
                          <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                            <p className="font-medium text-slate-100">Crowd</p>
                            <p className="mt-2">{capacityLabel(crowd)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-4">
                        <div className="rounded-3xl bg-slate-950/80 p-4 text-sm text-slate-300">
                          <div className="flex items-center justify-between text-slate-200">
                            <span>Crowd Capacity</span>
                            <span>{crowd}%</span>
                          </div>
                          <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                              className={`${capacityColor(crowd)} h-full rounded-full transition-all duration-500`}
                              style={{ width: `${crowd}%` }}
                              aria-hidden="true"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                          <Badge className="bg-slate-800 text-slate-200">{capacityLabel(crowd)}</Badge>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <Button
                            variant={booking.status === "cancelled" ? "outline" : "destructive"}
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={booking.status === "cancelled"}
                            aria-label={
                              booking.status === "cancelled"
                                ? `Booking ${booking.eventName} is already cancelled`
                                : `Cancel booking for ${booking.eventName}`
                            }
                          >
                            {booking.status === "cancelled" ? "Canceled" : "Cancel Booking"}
                          </Button>
                          <Link href={`/ticket/${booking.id}`} aria-label={`View ticket for ${booking.eventName}`}>
                            <Button variant="outline">View Ticket</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      <AnimatePresence>
        {alertVisible && alertBooking && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="alert-modal-title"
          >
            <motion.div
              className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-950 p-8 shadow-2xl"
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-rose-500/15 text-rose-300">
                  <AlertTriangle className="h-8 w-8" aria-hidden="true" />
                </div>
                <div className="space-y-2">
                  <p id="alert-modal-title" className="text-xl font-semibold text-white">High crowd expected</p>
                  <p className="text-slate-400">Event: {alertBooking.eventName}</p>
                </div>
              </div>
              <div className="mt-6 rounded-3xl bg-slate-900 p-6 text-white">
                <div className="flex items-center gap-3 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" aria-hidden="true" />
                  <span>{alertBooking.crowdPercentage}% capacity</span>
                </div>
                <p className="mt-4 text-slate-300">High crowd expected! Arrive 30 mins early.</p>
                <p className="mt-2 text-slate-400">Suggested arrival time: 30 minutes before event start.</p>
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button onClick={() => setAlertVisible(false)} aria-label="Acknowledge crowd alert">
                  Got it
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setAlertVisible(false)
                    router.push("/book")
                  }}
                  aria-label="Change time slot"
                >
                  Change Time Slot
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
