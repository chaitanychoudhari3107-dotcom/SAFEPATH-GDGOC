"use client"

import { useState, useCallback, useEffect } from "react"
import { Header } from "@/components/safepath/header"
import { MapView } from "@/components/safepath/map-view"
import { RouteInputs } from "@/components/safepath/route-inputs"
import { RouteResults } from "@/components/safepath/route-results"
import { CommentAnalysis } from "@/components/safepath/comment-analysis"
import { SOSButton } from "@/components/safepath/sos-button"
import { DataStatus } from "@/components/safepath/data-status"
import { HeatmapToggle } from "@/components/safepath/heatmap-toggle"

// Sample route paths (FC College to Balewadi)
const SAMPLE_ROUTES = [
  {
    id: "route-a",
    name: "Via Main Road",
    color: "#10b981", // green - safest
    path: [
      { lat: 18.5308, lng: 73.8474 }, // FC College
      { lat: 18.5350, lng: 73.8400 },
      { lat: 18.5450, lng: 73.8200 },
      { lat: 18.5550, lng: 73.8000 },
      { lat: 18.5650, lng: 73.7850 },
      { lat: 18.5745, lng: 73.7698 }, // Balewadi
    ],
    safetyScore: 8.7,
    duration: "18 min",
    distance: "7.2 km",
    highlights: ["Well-lit main roads", "Near police station", "Hospital on route", "Active commercial area"]
  },
  {
    id: "route-b",
    name: "Via Bypass Road",
    color: "#f59e0b", // yellow - moderate
    path: [
      { lat: 18.5308, lng: 73.8474 },
      { lat: 18.5400, lng: 73.8350 },
      { lat: 18.5500, lng: 73.8100 },
      { lat: 18.5600, lng: 73.7900 },
      { lat: 18.5745, lng: 73.7698 },
    ],
    safetyScore: 6.2,
    duration: "15 min",
    distance: "6.5 km",
    highlights: ["Moderate lighting", "Residential areas", "Some dark patches"]
  },
  {
    id: "route-c",
    name: "Shortcut Route",
    color: "#ef4444", // red - caution
    path: [
      { lat: 18.5308, lng: 73.8474 },
      { lat: 18.5450, lng: 73.8250 },
      { lat: 18.5600, lng: 73.7950 },
      { lat: 18.5745, lng: 73.7698 },
    ],
    safetyScore: 4.5,
    duration: "12 min",
    distance: "5.8 km",
    highlights: ["Shortest route", "Limited street lighting", "Isolated stretches"]
  }
]

// Sample heatmap data
const SAMPLE_HEATMAP = [
  { lat: 18.5550, lng: 73.8000 },
  { lat: 18.5480, lng: 73.7950 },
  { lat: 18.5420, lng: 73.8100 },
  { lat: 18.5600, lng: 73.7800 },
  { lat: 18.5350, lng: 73.8200 },
  { lat: 18.5700, lng: 73.7700 },
  { lat: 18.5450, lng: 73.8050 },
  { lat: 18.5520, lng: 73.7880 },
]

export default function SafePathApp() {
  const [routes, setRoutes] = useState(SAMPLE_ROUTES)
  const [selectedRoute, setSelectedRoute] = useState<string | null>("route-a")
  const [isLoading, setIsLoading] = useState(false)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [heatmapData, setHeatmapData] = useState(SAMPLE_HEATMAP)

  // Handle route search
  const handleSearch = useCallback(async (start: string, end: string) => {
    setIsLoading(true)
    
    try {
      // Fetch scored routes from API
      const response = await fetch("/api/score-route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start, end })
      })
      
      if (response.ok) {
        const scoredRoutes = await response.json()
        // Update routes with new scores
        const updatedRoutes = SAMPLE_ROUTES.map((route, idx) => ({
          ...route,
          safetyScore: scoredRoutes[idx]?.safety_score || route.safetyScore,
          highlights: scoredRoutes[idx]?.highlights || route.highlights
        }))
        setRoutes(updatedRoutes)
      }
    } catch (error) {
      console.error("Error fetching routes:", error)
    }
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    
    // Auto-select safest route
    const safest = routes.reduce((prev, current) => 
      current.safetyScore > prev.safetyScore ? current : prev
    )
    setSelectedRoute(safest.id)
  }, [routes])

  // Handle route selection
  const handleRouteSelect = useCallback((routeId: string) => {
    setSelectedRoute(routeId)
  }, [])

  // Handle AI analysis result
  const handleAnalysisComplete = useCallback((result: { classification: string }) => {
    // Update route scores based on analysis
    setRoutes(prevRoutes => {
      return prevRoutes.map(route => {
        if (route.id === selectedRoute) {
          let scoreChange = 0
          if (result.classification === "unsafe") {
            scoreChange = -0.5
          } else if (result.classification === "safe") {
            scoreChange = 0.3
          }
          return {
            ...route,
            safetyScore: Math.max(0, Math.min(10, route.safetyScore + scoreChange))
          }
        }
        return route
      })
    })
  }, [selectedRoute])

  // Fetch heatmap data
  useEffect(() => {
    if (showHeatmap) {
      fetch("/api/get-heatmap")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setHeatmapData(data)
          }
        })
        .catch(err => console.error("Error fetching heatmap:", err))
    }
  }, [showHeatmap])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Hero Section */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-balance">
            Navigate Safely from{" "}
            <span className="text-primary">FC College</span> to{" "}
            <span className="text-safe">Balewadi</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            AI-powered route analysis with real-time safety scoring and community feedback
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Controls */}
          <div className="lg:col-span-1 space-y-6">
            <RouteInputs 
              onSearch={handleSearch} 
              isLoading={isLoading}
            />
            
            <RouteResults
              routes={routes}
              selectedRoute={selectedRoute}
              onRouteSelect={handleRouteSelect}
              isLoading={isLoading}
            />
            
            <HeatmapToggle
              enabled={showHeatmap}
              onToggle={setShowHeatmap}
            />
          </div>

          {/* Center/Right - Map and AI */}
          <div className="lg:col-span-2 space-y-6">
            {/* Map */}
            <MapView
              routes={routes}
              selectedRoute={selectedRoute}
              onRouteSelect={handleRouteSelect}
              heatmapData={heatmapData}
              showHeatmap={showHeatmap}
              className="h-[400px] lg:h-[500px]"
            />

            {/* Bottom row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CommentAnalysis 
                onAnalysisComplete={handleAnalysisComplete}
              />
              <DataStatus />
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 pt-6 border-t border-border">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-xs font-mono text-muted-foreground">
                SAFEPATH v1.0
              </span>
              <span className="text-xs text-muted-foreground">
                Hackathon Project • FC College → Balewadi
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Powered by</span>
              <span className="text-xs font-mono text-primary">Google Maps</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-mono text-primary">Gemini AI</span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs font-mono text-primary">Flask</span>
            </div>
          </div>
        </div>
      </main>

      {/* SOS Button - Fixed position */}
      <SOSButton />
    </div>
  )
}
