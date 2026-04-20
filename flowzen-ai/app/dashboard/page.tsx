"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { QRCodeCanvas } from "qrcode.react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
  Download,
  Eye,
  LogOut,
  MapPin,
  Navigation,
  Sparkles,
  Ticket,
  Users,
  X,
} from "lucide-react"
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { getWeather, getWeatherBasedRecommendation } from "@/lib/weather"

interface Booking {
  id: string
  userId: string
  eventName: string
  date: string
  time: string
  venue?: string
  gate?: string
  entryGate?: string
  entryGateName?: string
  exitGate?: string
  exitGateName?: string
  status: "confirmed" | "used" | "cancelled"
  qrCode: string
  crowdPercentage?: number
}

interface Notification {
  id: string
  type: "alert" | "booking" | "weather"
  message: string
  timestamp: number
  read: boolean
  bookingId?: string
}

const getCrowdPercent = (id: string) => {
  const base = Array.from(id).reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return Math.min(98, Math.max(32, (base % 71) + 30))
}

const generateGateData = (seed: number) => {
  return [
    { name: "Gate A", crowd: Math.max(20, (seed + 10) % 70) },
    { name: "Gate B", crowd: Math.max(75, (seed + 45) % 90) },
    { name: "Gate C", crowd: Math.max(30, (seed + 25) % 60) },
    { name: "Gate D", crowd: Math.max(80, (seed + 55) % 95) },
  ]
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
  const [weather, setWeather] = useState<any>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertDismissed, setAlertDismissed] = useState(false)
  const [alertBooking, setAlertBooking] = useState<Booking | null>(null)
  const [selectedQRBooking, setSelectedQRBooking] = useState<Booking | null>(null)
  const [showQRModal, setShowQRModal] = useState(false)
  const router = useRouter()

  const initializedRef = useRef(false)

  // Load data on mount
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

    // Load weather
    loadWeather()
  }, [router])

  // Load weather data
  const loadWeather = async () => {
    const weatherData = await getWeather("Delhi")
    setWeather(weatherData)
  }

  // Monitor crowd alerts
  useEffect(() => {
    const highAlert = bookings.find(
      (booking) => booking.crowdPercentage && booking.crowdPercentage >= 80 && booking.status === "confirmed"
    )
    if (highAlert && !alertVisible && !alertDismissed) {
      setAlertBooking(highAlert)
      setAlertVisible(true)
      addNotification({
        type: "alert",
        message: `⚠️ HIGH CROWD at ${highAlert.eventName}`,
        bookingId: highAlert.id,
      })
      // Track event in Google Analytics
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "crowd_alert_shown", {
          event_name: highAlert.eventName,
          crowd_level: highAlert.crowdPercentage,
        })
      }
    }
  }, [bookings, alertVisible, alertDismissed])

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotif: Notification = {
      ...notification,
      id: Math.random().toString(36),
      timestamp: Date.now(),
      read: false,
    }
    setNotifications((prev) => [newNotif, ...prev])
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    )
  }

  const handleCancelBooking = (id: string) => {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?")
    if (!confirmed) return

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

    // Track event in Google Analytics
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "booking_cancelled", {
        booking_id: id,
      })
    }

    addNotification({
      type: "booking",
      message: "✅ Booking cancelled successfully",
      bookingId: id,
    })
  }

  const handleAddToCalendar = (booking: Booking) => {
    const startDate = new Date(`${booking.date}T${booking.time}`)
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000) // 3 hours

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      booking.eventName
    )}&dates=${startDate.toISOString().split(".")[0]}Z/${endDate
      .toISOString()
      .split(".")[0]}Z&details=${encodeURIComponent(
      `Gate: ${booking.entryGateName || booking.gate || "TBD"}`
    )}&location=${encodeURIComponent(booking.venue || "Venue")}`

    window.open(calendarUrl, "_blank")

    addNotification({
      type: "booking",
      message: "📅 Added to Google Calendar",
      bookingId: booking.id,
    })
  }

  const handleLogout = () => {
    localStorage.removeItem("flowzen_current_user")
    router.push("/")
  }

  const alertCount = useMemo(
    () =>
      bookings.filter(
        (booking) =>
          booking.crowdPercentage && booking.crowdPercentage >= 80 && booking.status === "confirmed"
      ).length,
    [bookings]
  )

  const unreadNotifications = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  )

  const stats = useMemo(
    () => ({
      total: bookings.length,
      active: bookings.filter((booking) => booking.status === "confirmed").length,
      upcoming: bookings.filter((booking) => booking.status !== "cancelled").length,
    }),
    [bookings]
  )

  const chartData = useMemo(() => {
    return bookings.map((booking, index) => ({
      name: booking.eventName.substring(0, 10),
      crowd: booking.crowdPercentage || 50,
    }))
  }, [bookings])

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Navbar */}
      <nav className="fixed top-0 z-40 w-full bg-slate-900/95 border-b border-slate-800 shadow-xl backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                FlowZen AI
              </p>
              <p className="text-lg font-semibold text-white">Smart crowd command</p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-end gap-3 sm:gap-4">
            {/* Notification Bell */}
            <div className="relative z-40">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="group relative inline-flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-800/90 px-4 py-2 text-sm font-medium text-slate-100 shadow-sm transition hover:bg-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer pointer-events-auto"
                aria-label="View notifications"
              >
                <Bell className="h-5 w-5 text-slate-200" aria-hidden="true" />
                Notifications
                {unreadNotifications > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-rose-500 px-2 text-xs font-semibold text-white animate-pulse">
                    {unreadNotifications}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl max-h-96 overflow-y-auto z-50 pointer-events-auto"
                  >
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-slate-400">No notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`border-b border-slate-800 p-4 hover:bg-slate-800/50 transition cursor-pointer ${
                            notif.read ? "opacity-60" : ""
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-sm text-slate-200 flex-1">{notif.message}</p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                markNotificationAsRead(notif.id)
                              }}
                              className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer pointer-events-auto whitespace-nowrap"
                            >
                              ✓
                            </button>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="text-right">
              <p className="text-sm text-slate-400">Welcome back,</p>
              <p className="text-base font-semibold text-white">{user.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout} aria-label="Log out" className="cursor-pointer pointer-events-auto">
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        {/* Emergency Banner */}
        {alertCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border-2 border-red-500 bg-gradient-to-r from-red-900/20 to-rose-900/20 p-4 backdrop-blur"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center"
              >
                <AlertTriangle className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <p className="font-semibold text-red-300">⚠️ HIGH CROWD ALERT</p>
                <p className="text-sm text-red-200">
                  {alertCount} location{alertCount > 1 ? "s" : ""} exceeding safe capacity. Consider using Gate A or C.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Weather Widget */}
        {weather && (
          <Card className="mb-8 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="text-3xl">{weather.icon}</span>
                <div>
                  <p>{weather.condition}</p>
                  <p className="text-2xl font-bold">{weather.temp}°C</p>
                </div>
              </CardTitle>
              <CardDescription>{weather.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300">{weather.recommendation}</p>
            </CardContent>
          </Card>
        )}

        {/* Stat Cards */}
        <section aria-labelledby="dashboard-stats" className="grid gap-6 lg:grid-cols-3 mb-10">
          <Card className="overflow-hidden rounded-3xl bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white shadow-2xl">
            <CardHeader className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-100">
                  Total Bookings
                </p>
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
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-100">
                  Active Tickets
                </p>
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
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-100">
                  Upcoming Events
                </p>
                <CalendarDays className="h-5 w-5 text-violet-100/90" aria-hidden="true" />
              </div>
              <CardTitle className="text-4xl font-semibold">{stats.upcoming}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Events scheduled and ready to monitor.</CardDescription>
            </CardContent>
          </Card>
        </section>

        {/* Analytics Charts */}
        {chartData.length > 0 && (
          <section className="mb-10 grid gap-6 lg:grid-cols-2">
            <Card className="bg-slate-900/90 border-slate-800">
              <CardHeader>
                <CardTitle>Crowd Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                      cursor={{ fill: "rgba(100, 100, 100, 0.1)" }}
                    />
                    <Bar dataKey="crowd" fill="#0ea5e9" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/90 border-slate-800">
              <CardHeader>
                <CardTitle>Booking Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Confirmed", value: stats.active },
                        {
                          name: "Cancelled",
                          value: bookings.filter((b) => b.status === "cancelled").length,
                        },
                        { name: "Used", value: bookings.filter((b) => b.status === "used").length },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                      <Cell fill="#3b82f6" />
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e293b", border: "1px solid #475569" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quick Features */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-white mb-6">Premium Features</h2>
          <div className="grid gap-4 lg:grid-cols-4">
            {/* Stalls */}
            <Link href="/stalls" className="group">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                    <span>🍔</span>
                  </div>
                  <h3 className="font-bold text-white">Smart Stalls</h3>
                </div>
                <p className="text-sm text-slate-400">Find food, water & merch with shortest waits</p>
              </div>
            </Link>

            {/* VIP */}
            <Link href="/vip" className="group">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center">
                    <span>👑</span>
                  </div>
                  <h3 className="font-bold text-white">VIP Access</h3>
                </div>
                <p className="text-sm text-slate-400">Skip queues with priority entry gates</p>
              </div>
            </Link>

            {/* Emergency */}
            <Link href="/emergency" className="group">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                    <span>🆘</span>
                  </div>
                  <h3 className="font-bold text-white">Emergency SOS</h3>
                </div>
                <p className="text-sm text-slate-400">Quick access to medical & security</p>
              </div>
            </Link>

            {/* Admin */}
            <Link href="/admin" className="group">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition cursor-pointer h-full">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <span>⚙️</span>
                  </div>
                  <h3 className="font-bold text-white">Admin Panel</h3>
                </div>
                <p className="text-sm text-slate-400">Control center & SOS management</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Live Bookings */}
        <section className="mt-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="dashboard-stats" className="text-2xl font-semibold text-white">
                Live bookings
              </h2>
              <p className="mt-2 text-slate-400">
                Manage bookings, monitor crowd levels, and adjust access in real time.
              </p>
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
              <p className="mt-2 text-slate-400">
                Create your first booking to enable crowd monitoring and smart alerts.
              </p>
              <div className="mt-6 flex justify-center">
                <Link href="/book" aria-label="Create first booking">
                  <Button className="cursor-pointer pointer-events-auto">Book your first event</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((booking) => {
                const crowd = booking.crowdPercentage ?? 45
                const gates = generateGateData(crowd)
                const bestGate = gates.reduce((best, gate) =>
                  gate.crowd < best.crowd ? gate : best
                )
                const recommendation = getWeatherBasedRecommendation(weather, crowd, gates)

                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-[2rem] border bg-slate-900/90 p-6 shadow-2xl ${
                      crowd >= 80 ? "border-red-500/50 bg-red-950/10" : "border-slate-800"
                    }`}
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-800 text-sky-300">
                            <Ticket className="h-6 w-6" aria-hidden="true" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-semibold text-white">{booking.eventName}</h3>
                            <p className="mt-1 text-sm text-slate-400">
                              {booking.date} · {booking.time}
                            </p>
                          </div>
                        </div>

                        {/* Weather Info for this Booking */}
                        {weather && (
                          <div className="rounded-xl bg-gradient-to-r from-sky-900/30 to-slate-900/30 border border-sky-500/30 p-3 flex items-center gap-3">
                            <span className="text-2xl">{weather.icon}</span>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-sky-100">{weather.condition} · {weather.temp}°C</p>
                              <p className="text-xs text-sky-200/80">{weather.recommendation}</p>
                            </div>
                          </div>
                        )}

                        {/* Smart Exit Gate Panel */}
                        <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-950/50 p-4">
                          <p className="mb-3 font-semibold text-slate-200">Smart Exit Gates</p>
                          <div className="grid gap-2">
                            {gates.map((gate) => (
                              <div
                                key={gate.name}
                                className={`flex items-center justify-between rounded-xl p-3 transition ${
                                  gate.crowd >= 80
                                    ? "bg-red-950/50 border border-red-500/30"
                                    : "bg-slate-900/50 border border-slate-700"
                                }`}
                              >
                                <span className="font-medium text-slate-200">{gate.name}</span>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-24 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                      className={`h-full ${
                                        gate.crowd >= 80
                                          ? "bg-red-500"
                                          : gate.crowd >= 50
                                          ? "bg-yellow-400"
                                          : "bg-emerald-500"
                                      }`}
                                      initial={{ width: 0 }}
                                      animate={{ width: `${gate.crowd}%` }}
                                      transition={{ duration: 0.5 }}
                                    />
                                  </div>
                                  <span className="text-sm text-slate-300 w-10 text-right">
                                    {gate.crowd}%
                                  </span>
                                  {gate.crowd >= 80 && (
                                    <motion.div
                                      animate={{ scale: [1, 1.2, 1] }}
                                      transition={{ duration: 0.5, repeat: Infinity }}
                                      className="text-red-500 text-lg"
                                    >
                                      ⚠️
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Weather-based Recommendation */}
                          <div className="mt-3 rounded-lg bg-slate-800/50 p-3 border border-sky-500/30">
                            <p className="text-sm text-sky-200 font-semibold">{recommendation}</p>
                          </div>
                        </div>

                        {/* Main Crowd Display */}
                        <div className="rounded-2xl bg-slate-950/80 p-4 text-sm text-slate-300">
                          <div className="flex items-center justify-between text-slate-200 mb-3">
                            <span className="font-medium">Overall Capacity</span>
                            <span className="text-lg font-bold">{crowd}%</span>
                          </div>
                          <div className="h-4 w-full overflow-hidden rounded-full bg-slate-800">
                            <motion.div
                              className={`${capacityColor(crowd)} h-full rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${crowd}%` }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                          <p className="mt-2 text-xs text-slate-400">{capacityLabel(crowd)}</p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-3 min-w-[200px]">
                        <Button
                          onClick={() => {
                            setSelectedQRBooking(booking)
                            setShowQRModal(true)
                          }}
                          className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 cursor-pointer pointer-events-auto"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View QR Ticket
                        </Button>

                        <Button
                          onClick={() => handleAddToCalendar(booking)}
                          variant="outline"
                          className="w-full cursor-pointer pointer-events-auto"
                        >
                          <CalendarDays className="h-4 w-4 mr-2" />
                          Add to Calendar
                        </Button>

                        <Button
                          onClick={() => {
                            const mapsUrl = `https://maps.google.com/?q=${booking.venue || "Event Venue"}`
                            window.open(mapsUrl, "_blank")
                          }}
                          variant="outline"
                          className="w-full cursor-pointer pointer-events-auto"
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          Get Directions
                        </Button>

                        <Button
                          variant={booking.status === "cancelled" ? "outline" : "destructive"}
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={booking.status === "cancelled"}
                          className="w-full cursor-pointer pointer-events-auto"
                        >
                          {booking.status === "cancelled" ? "Cancelled" : "Cancel Booking"}
                        </Button>

                        <Link href={`/ticket/${booking.id}`} className="w-full">
                          <Button variant="secondary" className="w-full cursor-pointer pointer-events-auto">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>
      </main>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQRModal && selectedQRBooking && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowQRModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Your Ticket</h2>
                <button
                  onClick={() => setShowQRModal(false)}
                  className="text-slate-400 hover:text-white transition cursor-pointer pointer-events-auto"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="bg-white p-4 rounded-2xl mb-4 flex justify-center">
                <QRCodeCanvas
                  value={selectedQRBooking.qrCode}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="space-y-3 mb-6 text-center">
                <h3 className="text-xl font-semibold text-white">{selectedQRBooking.eventName}</h3>
                <p className="text-slate-400">
                  {selectedQRBooking.date} at {selectedQRBooking.time}
                </p>
                <p className="text-slate-400">
                  Gate: {selectedQRBooking.entryGateName || selectedQRBooking.gate || "TBD"}
                </p>
              </div>

              <Button
                onClick={() => {
                  const qrCanvas = document.querySelector("canvas")
                  if (qrCanvas) {
                    const link = document.createElement("a")
                    link.href = qrCanvas.toDataURL()
                    link.download = `ticket-${selectedQRBooking.id}.png`
                    link.click()
                  }
                }}
                className="w-full cursor-pointer pointer-events-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Ticket
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crowd Alert Popup */}
      {alertVisible && alertBooking && (
        <div 
          style={{position:'fixed', top:0, left:0, width:'100%', 
          height:'100%', backgroundColor:'rgba(0,0,0,0.7)', 
          zIndex:99999, display:'flex', alignItems:'center', 
          justifyContent:'center'}}
        >
          <div style={{background:'linear-gradient(135deg,#1a0000,#3d0000)', 
          border:'2px solid #ff0000', borderRadius:'16px', 
          padding:'40px', textAlign:'center', maxWidth:'400px'}}>
            <div style={{fontSize:'48px'}}>⚠️</div>
            <h2 style={{color:'#ff4444', fontSize:'24px', 
            fontWeight:'bold'}}>HIGH CROWD ALERT</h2>
            <p style={{color:'white'}}>{alertBooking.eventName} is approaching capacity</p>
            <p style={{color:'#ff4444', fontSize:'32px', 
            fontWeight:'bold'}}>{alertBooking.crowdPercentage}%</p>
            <button 
              onClick={() => {
                setAlertDismissed(true)
                setAlertVisible(false)
              }}
              style={{background:'#ff0000', color:'white', 
              border:'none', padding:'12px 40px', borderRadius:'8px', 
              fontSize:'16px', cursor:'pointer', marginTop:'16px',
              zIndex:999999, position:'relative'}}
            >
              I Understand
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
