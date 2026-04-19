"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Users, Zap, Shield, BarChart3, ArrowRight, CheckCircle } from "lucide-react"

export default function Home() {
  useEffect(() => {
    // Setup admin user
    const adminUser = {
      id: "admin-1",
      name: "Admin User",
      email: "admin@flowzen.ai",
      password: "admin123",
      role: "admin",
      createdAt: new Date().toISOString()
    }

    const users = JSON.parse(localStorage.getItem("flowzen_users") || "[]")
    const existingAdmin = users.find((u: any) => u.role === "admin")

    if (!existingAdmin) {
      users.push(adminUser)
      localStorage.setItem("flowzen_users", JSON.stringify(users))
    }

    // Initialize gates with entry/exit configuration
    const gatesConfig = {
      gates: [
        { id: "gate-1", name: "Gate A", capacity: 100, type: "entry", currentCount: 0 },
        { id: "gate-2", name: "Gate B", capacity: 100, type: "entry", currentCount: 0 },
        { id: "gate-3", name: "Gate C", capacity: 100, type: "entry", currentCount: 0 },
        { id: "gate-4", name: "Gate D", capacity: 80, type: "exit", currentCount: 0 },
        { id: "gate-5", name: "Gate E", capacity: 80, type: "exit", currentCount: 0 }
      ]
    }
    
    const existingGates = localStorage.getItem("flowzen_gates")
    if (!existingGates) {
      localStorage.setItem("flowzen_gates", JSON.stringify(gatesConfig))
    }
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linear-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FlowZen AI</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Smart Crowd Management
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Powered by AI
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Revolutionize event experiences with intelligent gate allocation,
              real-time monitoring, and seamless crowd flow optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <Button size="lg" className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline">
                Watch Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose FlowZen AI?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Advanced AI algorithms ensure optimal crowd distribution and enhanced safety
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Intelligent Gate Allocation",
                description: "AI-powered algorithms assign optimal gates based on crowd density and flow patterns"
              },
              {
                icon: Shield,
                title: "Enhanced Security",
                description: "Real-time monitoring and automated alerts for crowd management safety"
              },
              {
                icon: BarChart3,
                title: "Live Analytics",
                description: "Comprehensive dashboards with real-time data and predictive insights"
              },
              {
                icon: Users,
                title: "Crowd Flow Optimization",
                description: "Minimize wait times and maximize throughput with smart routing"
              },
              {
                icon: CheckCircle,
                title: "Seamless Integration",
                description: "Easy integration with existing ticketing systems and venue infrastructure"
              },
              {
                icon: BarChart3,
                title: "Data-Driven Decisions",
                description: "Make informed decisions with detailed analytics and reporting"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow"
              >
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to transform your event management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Book Your Ticket",
                description: "Users book tickets through our platform with intelligent gate assignment"
              },
              {
                step: "02",
                title: "AI Gate Allocation",
                description: "Our AI analyzes crowd patterns and assigns optimal entry gates"
              },
              {
                step: "03",
                title: "Seamless Entry",
                description: "QR code scanning ensures fast, secure entry with real-time monitoring"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-linear-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Events?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of venues using FlowZen AI for smarter crowd management
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-linear-to-r from-blue-600 to-purple-600 rounded flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">FlowZen AI</span>
          </div>
          <p className="text-gray-600">
            © 2024 FlowZen AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

