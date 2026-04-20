"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Coffee, 
  Droplets, 
  ShoppingBag, 
  Clock, 
  Users, 
  AlertCircle, 
  CheckCircle2, 
  ArrowLeft,
  MapPin
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Stall {
  id: string
  name: string
  type: 'food' | 'water' | 'merchandise'
  crowd: number
  waitingTime: number
  location: string
  capacity: number
}

const mockStalls: Stall[] = [
  { id: 'st1', name: 'Pizza Corner', type: 'food', crowd: 45, waitingTime: 8, location: 'Zone A', capacity: 100 },
  { id: 'st2', name: 'Water Station 1', type: 'water', crowd: 65, waitingTime: 12, location: 'Zone B', capacity: 50 },
  { id: 'st3', name: 'Merch Store', type: 'merchandise', crowd: 30, waitingTime: 3, location: 'Zone A', capacity: 80 },
  { id: 'st4', name: 'Burger Zone', type: 'food', crowd: 75, waitingTime: 15, location: 'Zone C', capacity: 120 },
  { id: 'st5', name: 'Water Station 2', type: 'water', crowd: 25, waitingTime: 2, location: 'Zone D', capacity: 50 },
  { id: 'st6', name: 'Snacks Kiosk', type: 'food', crowd: 55, waitingTime: 10, location: 'Zone B', capacity: 60 },
]

const getStallIcon = (type: string) => {
  switch(type) {
    case 'food': return <Coffee className="h-5 w-5" />
    case 'water': return <Droplets className="h-5 w-5" />
    case 'merchandise': return <ShoppingBag className="h-5 w-5" />
    default: return <MapPin className="h-5 w-5" />
  }
}

const getCrowdColor = (crowd: number, capacity: number) => {
  const percentage = (crowd / capacity) * 100
  if (percentage < 40) return 'bg-emerald-500'
  if (percentage < 70) return 'bg-yellow-500'
  return 'bg-red-500'
}

const getCrowdLabel = (percentage: number) => {
  if (percentage < 40) return 'Low'
  if (percentage < 70) return 'Moderate'
  return 'High'
}

const sortedStalls = [...mockStalls].sort((a, b) => {
  const percentA = (a.crowd / a.capacity) * 100
  const percentB = (b.crowd / b.capacity) * 100
  return percentA - percentB // Least crowded first
})

export default function StallsPage() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("flowzen_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(currentUser))
  }, [router])

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold">Smart Stall Management</h1>
          <div className="text-sm text-slate-400">Sorted by availability</div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Food & Service Stalls</h2>
          <p className="text-slate-400">Find less crowded stalls with shorter waiting times</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {sortedStalls.map((stall) => {
            const percentage = (stall.crowd / stall.capacity) * 100
            const crowdLabel = getCrowdLabel(percentage)
            const isRecommended = percentage < 40

            return (
              <motion.div
                key={stall.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-2xl border p-6 transition-all ${
                  isRecommended
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-slate-800 bg-slate-900/50'
                }`}
              >
                {isRecommended && (
                  <div className="mb-4 inline-block">
                    <Badge className="bg-emerald-500 text-white">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  </div>
                )}

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-slate-800 p-2 text-sky-400">
                      {getStallIcon(stall.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{stall.name}</h3>
                      <p className="text-sm text-slate-400">{stall.type.charAt(0).toUpperCase() + stall.type.slice(1)}</p>
                    </div>
                  </div>
                  <Badge className={`${getCrowdColor(stall.crowd, stall.capacity)} text-white`}>
                    {crowdLabel}
                  </Badge>
                </div>

                {/* Location */}
                <div className="mb-4 flex items-center gap-2 text-sm text-slate-300">
                  <MapPin className="h-4 w-4" />
                  {stall.location}
                </div>

                {/* Crowd Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Crowd</span>
                    <span className="font-semibold">{stall.crowd}/{stall.capacity}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${getCrowdColor(stall.crowd, stall.capacity)}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Waiting Time */}
                <div className="rounded-lg bg-slate-800/50 p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>Waiting Time</span>
                    </div>
                    <span className="font-bold text-lg">{stall.waitingTime} min</span>
                  </div>
                </div>

                {/* Visit Button */}
                <Button className="w-full bg-gradient-to-r from-sky-500 to-indigo-600">
                  Go to {stall.name.split(' ')[0]}
                </Button>
              </motion.div>
            )
          })}
        </div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-900/20 to-indigo-900/20 p-6"
        >
          <div className="flex gap-4">
            <AlertCircle className="h-6 w-6 text-sky-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-white mb-2">Pro Tips</h3>
              <ul className="space-y-1 text-sm text-slate-300">
                <li>✓ Visit stalls marked as "Recommended" for shorter waits</li>
                <li>✓ Check back in 5-10 minutes for updated crowd levels</li>
                <li>✓ Stalls are sorted by availability - least crowded first</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
