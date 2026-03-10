"use client"

import { Shield, Clock, Route as RouteIcon, ChevronRight, Award } from "lucide-react"
import { cn } from "@/lib/utils"

interface Route {
  id: string
  name: string
  color: string
  safetyScore: number
  duration: string
  distance: string
  highlights: string[]
}

interface RouteResultsProps {
  routes: Route[]
  selectedRoute: string | null
  onRouteSelect: (routeId: string) => void
  isLoading?: boolean
  className?: string
}

export function RouteResults({ 
  routes, 
  selectedRoute, 
  onRouteSelect,
  isLoading = false,
  className 
}: RouteResultsProps) {
  if (isLoading) {
    return (
      <div className={cn("bg-card border border-border rounded-xl p-4", className)}>
        <div className="flex items-center gap-2 mb-4">
          <RouteIcon className="w-5 h-5 text-primary" />
          <h2 className="font-mono text-sm font-bold tracking-wide text-primary uppercase">
            Route Comparison
          </h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-secondary/50 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-muted rounded w-1/3 mb-3" />
              <div className="h-3 bg-muted rounded w-2/3 mb-2" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (routes.length === 0) {
    return (
      <div className={cn("bg-card border border-border rounded-xl p-4", className)}>
        <div className="flex items-center gap-2 mb-4">
          <RouteIcon className="w-5 h-5 text-primary" />
          <h2 className="font-mono text-sm font-bold tracking-wide text-primary uppercase">
            Route Comparison
          </h2>
        </div>
        <div className="text-center py-8 text-muted-foreground">
          <RouteIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Enter locations to find safe routes</p>
        </div>
      </div>
    )
  }

  // Find the safest route
  const safestRouteId = routes.reduce((prev, current) => 
    current.safetyScore > prev.safetyScore ? current : prev
  ).id

  return (
    <div className={cn("bg-card border border-border rounded-xl p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RouteIcon className="w-5 h-5 text-primary" />
          <h2 className="font-mono text-sm font-bold tracking-wide text-primary uppercase">
            Route Comparison
          </h2>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {routes.length} routes found
        </span>
      </div>

      <div className="space-y-3">
        {routes.map((route) => {
          const isSafest = route.id === safestRouteId
          const isSelected = route.id === selectedRoute
          const scoreColor = getScoreColor(route.safetyScore)

          return (
            <button
              key={route.id}
              onClick={() => onRouteSelect(route.id)}
              className={cn(
                "w-full text-left bg-secondary/50 hover:bg-secondary rounded-lg p-4 transition-all border-2",
                isSelected ? "border-primary" : "border-transparent",
                isSafest && "ring-1 ring-safe/30"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: route.color }}
                  />
                  <span className="font-semibold text-foreground">{route.name}</span>
                  {isSafest && (
                    <span className="flex items-center gap-1 bg-safe/20 text-safe px-2 py-0.5 rounded-full text-xs font-mono">
                      <Award className="w-3 h-3" />
                      SAFEST
                    </span>
                  )}
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 text-muted-foreground transition-transform",
                  isSelected && "rotate-90"
                )} />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Shield className={cn("w-4 h-4", scoreColor)} />
                  <div>
                    <div className={cn("font-mono font-bold text-lg", scoreColor)}>
                      {route.safetyScore.toFixed(1)}
                    </div>
                    <div className="text-xs text-muted-foreground">Safety</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <div className="font-mono font-bold text-foreground">
                      {route.duration}
                    </div>
                    <div className="text-xs text-muted-foreground">Time</div>
                  </div>
                </div>
                <div>
                  <div className="font-mono font-bold text-foreground">
                    {route.distance}
                  </div>
                  <div className="text-xs text-muted-foreground">Distance</div>
                </div>
              </div>

              {/* Safety highlights */}
              {isSelected && route.highlights.length > 0 && (
                <div className="pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground mb-2">Safety Features:</div>
                  <div className="flex flex-wrap gap-1">
                    {route.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2 font-mono">SAFETY SCORE LEGEND</div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-safe" />
            <span className="text-muted-foreground">8-10 Safe</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">5-7 Moderate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-danger" />
            <span className="text-muted-foreground">0-4 Caution</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function getScoreColor(score: number): string {
  if (score >= 8) return "text-safe"
  if (score >= 5) return "text-warning"
  return "text-danger"
}
