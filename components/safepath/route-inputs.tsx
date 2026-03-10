"use client"

import { useState } from "react"
import { MapPin, Navigation, Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RouteInputsProps {
  onSearch: (start: string, end: string) => void
  isLoading?: boolean
  className?: string
}

export function RouteInputs({ onSearch, isLoading = false, className }: RouteInputsProps) {
  const [startLocation, setStartLocation] = useState("FC College, Pune")
  const [endLocation, setEndLocation] = useState("Balewadi, Pune")

  const handleSearch = () => {
    if (startLocation && endLocation) {
      onSearch(startLocation, endLocation)
    }
  }

  const handleSwap = () => {
    const temp = startLocation
    setStartLocation(endLocation)
    setEndLocation(temp)
  }

  return (
    <div className={cn("bg-card border border-border rounded-xl p-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="w-5 h-5 text-primary" />
        <h2 className="font-mono text-sm font-bold tracking-wide text-primary uppercase">
          Plan Your Route
        </h2>
      </div>
      
      <div className="space-y-3">
        {/* Start Location */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20" />
          </div>
          <input
            type="text"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
            placeholder="Start location"
            className="w-full bg-input border border-border rounded-lg py-3 px-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={() => setStartLocation("FC College, Pune")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={handleSwap}
            className="p-2 rounded-full bg-secondary hover:bg-secondary/80 transition-colors group"
          >
            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground rotate-90" />
          </button>
        </div>

        {/* End Location */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-safe ring-4 ring-safe/20" />
          </div>
          <input
            type="text"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            placeholder="Destination"
            className="w-full bg-input border border-border rounded-lg py-3 px-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={() => setEndLocation("Balewadi, Pune")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          disabled={isLoading || !startLocation || !endLocation}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-all disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <span>Finding safe routes...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Find Safe Routes</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}
