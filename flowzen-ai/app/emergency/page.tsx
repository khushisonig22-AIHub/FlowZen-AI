"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  AlertTriangle, 
  Phone, 
  Heart, 
  Shield, 
  Users, 
  MapPin, 
  ArrowLeft,
  Clock,
  CheckCircle2,
  X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface SOSAlert {
  id: string
  type: 'medical' | 'security' | 'lost'
  status: 'pending' | 'attended' | 'resolved'
  timestamp: string
  description: string
}

const medicalBooths = [
  { id: 'mb1', name: 'Medical Booth 1', location: 'Zone A', distance: 50, staffAvailable: 2 },
  { id: 'mb2', name: 'Medical Booth 2', location: 'Zone B', distance: 120, staffAvailable: 1 },
  { id: 'mb3', name: 'First Aid Station', location: 'Zone C', distance: 200, staffAvailable: 3 },
]

const securityPoints = [
  { id: 'sp1', name: 'Security Post 1', location: 'Main Entrance', distance: 80, available: true },
  { id: 'sp2', name: 'Security Post 2', location: 'Zone D', distance: 150, available: true },
]

export default function EmergencyPage() {
  const [user, setUser] = useState<any>(null)
  const [alerts, setAlerts] = useState<SOSAlert[]>([])
  const [showSOSModal, setShowSOSModal] = useState(false)
  const [selectedType, setSelectedType] = useState<'medical' | 'security' | 'lost' | null>(null)
  const [description, setDescription] = useState('')
  const [crowdLevel, setCrowdLevel] = useState(72) // Mock crowd level
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("flowzen_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(currentUser))

    // Simulate auto-trigger at 90% crowd
    const timer = setInterval(() => {
      setCrowdLevel(prev => {
        const newLevel = prev + Math.random() * 5 - 2
        if (newLevel > 89 && newLevel < 91) {
          handleAutoSOSAlert('medical')
        }
        return Math.min(98, Math.max(60, newLevel))
      })
    }, 5000)

    return () => clearInterval(timer)
  }, [router])

  const handleAutoSOSAlert = (type: string) => {
    const newAlert: SOSAlert = {
      id: Math.random().toString(36),
      type: type as any,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString(),
      description: 'Auto-triggered due to high crowd level (>90%)'
    }
    setAlerts([newAlert, ...alerts])
  }

  const handleSOSSubmit = () => {
    if (!selectedType || !description.trim()) return

    const newAlert: SOSAlert = {
      id: Math.random().toString(36),
      type: selectedType,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString(),
      description
    }

    setAlerts([newAlert, ...alerts])
    setShowSOSModal(false)
    setSelectedType(null)
    setDescription('')

    // Show success message
    alert('SOS Alert sent! Admin and nearby staff have been notified.')
  }

  const getSOSIcon = (type: string) => {
    switch(type) {
      case 'medical': return <Heart className="h-5 w-5" />
      case 'security': return <Shield className="h-5 w-5" />
      case 'lost': return <Users className="h-5 w-5" />
      default: return <AlertTriangle className="h-5 w-5" />
    }
  }

  const getSOSColor = (type: string) => {
    switch(type) {
      case 'medical': return 'bg-red-600'
      case 'security': return 'bg-yellow-600'
      case 'lost': return 'bg-blue-600'
      default: return 'bg-slate-600'
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Sticky SOS Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
      >
        <motion.button
          onClick={() => setShowSOSModal(true)}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-20 w-20 rounded-full bg-gradient-to-r from-red-600 to-rose-700 shadow-2xl flex items-center justify-center cursor-pointer hover:shadow-red-500/50 transition"
        >
          <div className="flex flex-col items-center">
            <AlertTriangle className="h-8 w-8 text-white" />
            <span className="text-xs font-bold text-white">SOS</span>
          </div>
        </motion.button>
      </motion.div>

      <nav className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold">Emergency & Safety</h1>
          <div className="text-sm">
            <span className={`font-bold ${crowdLevel > 85 ? 'text-red-400' : 'text-emerald-400'}`}>
              Crowd: {crowdLevel.toFixed(0)}%
            </span>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Crowd Warning */}
        {crowdLevel > 85 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border-2 border-red-500 bg-gradient-to-r from-red-900/20 to-rose-900/20 p-6"
          >
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center"
              >
                <AlertTriangle className="h-5 w-5 text-white" />
              </motion.div>
              <div>
                <p className="font-bold text-red-300">HIGH CROWD LEVEL DETECTED</p>
                <p className="text-sm text-red-200">Event is at {crowdLevel.toFixed(0)}% capacity. Please use emergency exits if needed.</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Medical Assistance */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Medical Assistance</h2>
          <div className="grid gap-6 lg:grid-cols-3">
            {medicalBooths.map((booth) => (
              <motion.div
                key={booth.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-500/30 bg-red-950/10 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-6 w-6 text-red-500" />
                  <h3 className="text-xl font-bold">{booth.name}</h3>
                </div>
                <div className="space-y-2 mb-4 text-sm text-slate-300">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {booth.location}
                  </p>
                  <p className="flex items-center gap-2">
                    📍 {booth.distance}m away
                  </p>
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> {booth.staffAvailable} staff available
                  </p>
                </div>
                <Button className="w-full bg-gradient-to-r from-red-600 to-rose-600">
                  Call Medical
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Security Contact</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            {securityPoints.map((point) => (
              <motion.div
                key={point.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-yellow-500/30 bg-yellow-950/10 p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-yellow-500" />
                  <h3 className="text-xl font-bold">{point.name}</h3>
                </div>
                <div className="space-y-2 mb-4 text-sm text-slate-300">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {point.location}
                  </p>
                  <p className="flex items-center gap-2">
                    📍 {Math.round(Math.random() * 100 + 80)}m away
                  </p>
                  <Badge className={point.available ? 'bg-emerald-600' : 'bg-red-600'}>
                    {point.available ? 'Available' : 'Busy'}
                  </Badge>
                </div>
                <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-800">
                  Contact Security
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SOS Alerts History */}
        {alerts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-4">SOS Alert History</h2>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`rounded-2xl border ${alert.status === 'resolved' ? 'border-emerald-500/30 bg-emerald-950/10' : 'border-yellow-500/30 bg-yellow-950/10'} p-6`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`${getSOSColor(alert.type)} rounded-lg p-2 text-white flex-shrink-0`}>
                        {getSOSIcon(alert.type)}
                      </div>
                      <div>
                        <h3 className="font-bold text-white capitalize">{alert.type} Alert</h3>
                        <p className="text-sm text-slate-400 mt-1">{alert.description}</p>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {alert.timestamp}
                        </p>
                      </div>
                    </div>
                    <Badge className={alert.status === 'resolved' ? 'bg-emerald-600' : alert.status === 'attended' ? 'bg-blue-600' : 'bg-yellow-600'}>
                      {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                    </Badge>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* SOS Modal */}
      <AnimatePresence>
        {showSOSModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSOSModal(false)}
          >
            <motion.div
              className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 p-8"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Emergency Alert</h2>
                <button onClick={() => setShowSOSModal(false)} className="cursor-pointer">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {!selectedType ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedType('medical')}
                    className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 p-6 text-center font-bold text-white hover:shadow-lg hover:shadow-red-500/50 transition cursor-pointer"
                  >
                    <Heart className="h-6 w-6 mx-auto mb-2" />
                    Medical Emergency
                  </button>
                  <button
                    onClick={() => setSelectedType('security')}
                    className="w-full rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-700 p-6 text-center font-bold text-white hover:shadow-lg hover:shadow-yellow-500/50 transition cursor-pointer"
                  >
                    <Shield className="h-6 w-6 mx-auto mb-2" />
                    Security Issue
                  </button>
                  <button
                    onClick={() => setSelectedType('lost')}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-center font-bold text-white hover:shadow-lg hover:shadow-blue-500/50 transition cursor-pointer"
                  >
                    <Users className="h-6 w-6 mx-auto mb-2" />
                    Lost Person
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the emergency..."
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 p-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                    rows={4}
                  />
                  <div className="flex gap-4">
                    <Button
                      onClick={() => setSelectedType(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={handleSOSSubmit}
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 cursor-pointer"
                    >
                      Send Alert
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
