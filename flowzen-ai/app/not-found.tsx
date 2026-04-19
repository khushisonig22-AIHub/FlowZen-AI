"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="text-center space-y-8 max-w-md">
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center">
            <Search className="w-12 h-12 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-6xl font-bold text-white">404</h1>
          <h2 className="text-2xl font-semibold text-slate-200">Page not found</h2>
          <p className="text-slate-400">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/" aria-label="Go back to home page">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} aria-label="Go back to previous page">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )
}