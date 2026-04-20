"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Crown, 
  Zap, 
  Clock, 
  Users, 
  Shield, 
  ArrowLeft,
  Star,
  Check
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface VIPGate {
  id: string
  name: string
  tier: 'gold' | 'platinum' | 'diamond'
  crowd: number
  waitTime: number
  capacity: number
}

const vipGates: VIPGate[] = [
  { id: 'vip1', name: 'VIP Gate V1', tier: 'gold', crowd: 10, waitTime: 2, capacity: 50 },
  { id: 'vip2', name: 'VIP Gate V2', tier: 'platinum', crowd: 5, waitTime: 1, capacity: 30 },
  { id: 'vip3', name: 'VIP Gate V3 (Premium)', tier: 'diamond', crowd: 2, waitTime: 0, capacity: 20 },
]

const tierBenefits = {
  gold: ['Priority Entry', 'Dedicated VIP Gate', 'Fast Pass', '20% on Merch'],
  platinum: ['All Gold Benefits', 'Express Lane', 'VIP Lounge Access', '30% on Merch', 'Free Water'],
  diamond: ['All Platinum Benefits', 'Personal Escort', 'Front Row Seating', '50% on Merch', 'Premium VIP Lounge']
}

const tierColors = {
  gold: 'from-yellow-600 to-yellow-800',
  platinum: 'from-slate-400 to-slate-600',
  diamond: 'from-cyan-400 to-blue-600'
}

export default function VIPPage() {
  const [user, setUser] = useState<any>(null)
  const [vipTier, setVipTier] = useState<'gold' | 'platinum' | 'diamond' | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = localStorage.getItem("flowzen_current_user")
    if (!currentUser) {
      router.push("/login")
      return
    }
    const userData = JSON.parse(currentUser)
    setUser(userData)
    
    // Mock VIP tier assignment
    const tiers: ('gold' | 'platinum' | 'diamond')[] = ['gold', 'platinum', 'diamond']
    setVipTier(tiers[Math.floor(Math.random() * tiers.length)])
  }, [router])

  if (!user) return null

  const availableGates = vipTier 
    ? vipGates.filter(gate => {
        if (vipTier === 'gold') return gate.tier === 'gold'
        if (vipTier === 'platinum') return gate.tier === 'gold' || gate.tier === 'platinum'
        return true
      })
    : []

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="sticky top-0 z-40 bg-slate-900/95 border-b border-slate-800 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80">
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold">VIP Access System</h1>
          {vipTier && (
            <Badge className={`bg-gradient-to-r ${tierColors[vipTier]} text-white`}>
              <Crown className="h-3 w-3 mr-1" />
              {vipTier.toUpperCase()}
            </Badge>
          )}
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8">
        {vipTier ? (
          <>
            {/* Current Tier */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-8 rounded-2xl bg-gradient-to-r ${tierColors[vipTier]} p-8 text-white`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome, VIP {vipTier.toUpperCase()} Member!</h2>
                  <p className="text-lg opacity-90">Enjoy exclusive benefits and priority access</p>
                </div>
                <Crown className="h-16 w-16 opacity-50" />
              </div>
            </motion.div>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-4">Your Benefits</h3>
              <div className="grid gap-4 lg:grid-cols-2">
                {tierBenefits[vipTier].map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3 rounded-lg bg-slate-900/50 border border-slate-800 p-4"
                  >
                    <Check className={`h-5 w-5 ${vipTier === 'diamond' ? 'text-cyan-400' : vipTier === 'platinum' ? 'text-slate-300' : 'text-yellow-500'}`} />
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* VIP Gates */}
            <div>
              <h3 className="text-2xl font-bold mb-4">Available VIP Gates</h3>
              <div className="grid gap-6 lg:grid-cols-3">
                {availableGates.map((gate) => (
                  <motion.div
                    key={gate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 hover:border-slate-700 transition"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold">{gate.name}</h4>
                      <Zap className="h-5 w-5 text-yellow-500" />
                    </div>

                    {/* Wait Time */}
                    <div className="rounded-lg bg-slate-800/50 p-4 mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="h-4 w-4" />
                          <span>Wait Time</span>
                        </div>
                        <span className="text-2xl font-bold text-emerald-400">{gate.waitTime} min</span>
                      </div>
                    </div>

                    {/* Crowd */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Crowd</span>
                        <span className="font-semibold">{gate.crowd}/{gate.capacity}</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-emerald-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(gate.crowd / gate.capacity) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-yellow-600 to-yellow-800">
                      Enter {gate.name}
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Upgrade Offer */}
            {vipTier !== 'diamond' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 rounded-2xl border border-sky-500/30 bg-gradient-to-r from-sky-900/20 to-blue-900/20 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Upgrade to {vipTier === 'gold' ? 'Platinum' : 'Diamond'}</h3>
                    <p className="text-slate-300">Get even more exclusive benefits and priority access</p>
                  </div>
                  <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
                    Upgrade Now
                  </Button>
                </div>
              </motion.div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-12 text-center">
            <Crown className="h-16 w-16 mx-auto mb-4 text-slate-500" />
            <h2 className="text-2xl font-bold mb-2">Become VIP Today</h2>
            <p className="text-slate-400 mb-6">Get priority access, shorter waits, and exclusive benefits</p>
            <Button className="bg-gradient-to-r from-yellow-600 to-yellow-800">
              Upgrade to VIP
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
