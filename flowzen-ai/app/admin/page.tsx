"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Activity, TrendingUp, AlertTriangle, BarChart3, Settings, LogOut } from "lucide-react"

interface GateStats {
  gate: string
  currentOccupancy: number
  capacity: number
  throughput: number
  status: "normal" | "busy" | "critical"
}

interface Analytics {
  totalBookings: number
  activeEvents: number
  averageWaitTime: number
  gateUtilization: number
}

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [gateStats, setGateStats] = useState<GateStats[]>([])
  const [analytics, setAnalytics] = useState<Analytics>({
    totalBookings: 0,
    activeEvents: 0,
    averageWaitTime: 0,
    gateUtilization: 0
  })
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("flowzen_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }

    const userData = JSON.parse(currentUser)
    if (userData.role !== "admin") {
      router.push("/dashboard")
      return
    }

    setUser(userData)

    // Load gate configuration and simulate real-time monitoring
    const gatesConfig = JSON.parse(localStorage.getItem("flowzen_gates") || "{}")
    const gates = gatesConfig.gates || []

    // Simulate real-time gate monitoring
    const simulateGateStats = () => {
      const stats: GateStats[] = gates.map((gate: any) => {
        const currentOccupancy = Math.floor(Math.random() * gate.capacity)
        const throughput = Math.floor(Math.random() * 30) + 5

        let status: "normal" | "busy" | "critical" = "normal"
        if (currentOccupancy > gate.capacity * 0.8) status = "critical"
        else if (currentOccupancy > gate.capacity * 0.6) status = "busy"

        return {
          gate: `${gate.name} (${gate.type})`,
          currentOccupancy,
          capacity: gate.capacity,
          throughput,
          status
        }
      })
      setGateStats(stats)
    }

    // Load analytics
    const allBookings = JSON.parse(localStorage.getItem("flowzen_bookings") || "[]")
    const totalBookings = allBookings.length
    const activeEvents = 3 // Simulated
    const averageWaitTime = Math.floor(Math.random() * 15) + 5
    const gateUtilization = Math.floor(Math.random() * 30) + 65

    setAnalytics({
      totalBookings,
      activeEvents,
      averageWaitTime,
      gateUtilization
    })

    simulateGateStats()

    // Update every 5 seconds to simulate real-time
    const interval = setInterval(simulateGateStats, 5000)
    return () => clearInterval(interval)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("flowzen_current_user")
    router.push("/")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal": return "bg-green-100 text-green-800"
      case "busy": return "bg-yellow-100 text-yellow-800"
      case "critical": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
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
              <span className="text-xl font-bold text-gray-900">FlowZen AI - Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Admin: {user.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Live monitoring and analytics for crowd management</p>
            </div>
            <Button variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>

          {/* Analytics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Events</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.activeEvents}</div>
                <p className="text-xs text-muted-foreground">
                  Currently running
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Wait Time</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.averageWaitTime}min</div>
                <p className="text-xs text-muted-foreground">
                  -8% improvement
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gate Utilization</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics.gateUtilization}%</div>
                <p className="text-xs text-muted-foreground">
                  Optimal performance
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Live Gate Monitoring */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Live Gate Monitoring
                </CardTitle>
                <CardDescription>
                  Real-time gate occupancy and throughput
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gateStats.map((gate) => (
                    <motion.div
                      key={gate.gate}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">Gate {gate.gate}</span>
                          <Badge className={getStatusColor(gate.status)}>
                            {gate.status}
                          </Badge>
                        </div>
                        <span className="text-sm text-gray-600">
                          {gate.currentOccupancy}/{gate.capacity}
                        </span>
                      </div>
                      <Progress
                        value={(gate.currentOccupancy / gate.capacity) * 100}
                        className="mb-2"
                      />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Throughput: {gate.throughput}/min</span>
                        <span>{Math.round((gate.currentOccupancy / gate.capacity) * 100)}% full</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  System Alerts
                </CardTitle>
                <CardDescription>
                  Active notifications and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {gateStats.filter(gate => gate.status === "critical").length > 0 && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                        <span className="font-semibold text-red-800">Critical Gates</span>
                      </div>
                      <p className="text-sm text-red-700 mt-1">
                        {gateStats.filter(gate => gate.status === "critical").map(g => `Gate ${g.gate}`).join(", ")} are at critical capacity
                      </p>
                    </div>
                  )}

                  {gateStats.filter(gate => gate.status === "busy").length > 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Busy Gates</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        {gateStats.filter(gate => gate.status === "busy").map(g => `Gate ${g.gate}`).join(", ")} are experiencing high traffic
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">AI Optimization</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Gate allocation algorithm is performing optimally with {analytics.gateUtilization}% utilization
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Performance</span>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      Average wait time reduced by 8% compared to last week
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest bookings and gate assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {JSON.parse(localStorage.getItem("flowzen_bookings") || "[]")
                  .slice(-5)
                  .reverse()
                  .map((booking: any) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.eventName}</p>
                          <p className="text-sm text-gray-600">
                            Gate {booking.gate} • {new Date(booking.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Confirmed
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}