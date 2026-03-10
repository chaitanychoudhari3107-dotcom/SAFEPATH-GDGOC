"use client"

import { MapPin, Navigation } from "lucide-react"
import { cn } from "@/lib/utils"

interface Route {
  id: string
  name: string
  color: string
  safetyScore: number
}

interface MapFallbackProps {
  routes: Route[]
  selectedRoute: string | null
  onRouteSelect: (routeId: string) => void
  className?: string
}

export function MapFallback({ 
  routes, 
  selectedRoute, 
  onRouteSelect,
  className 
}: MapFallbackProps) {
  return (
    <div className={cn(
      "relative rounded-xl overflow-hidden bg-card border border-border",
      className
    )}>
      {/* SVG Map Visualization */}
      <svg 
        viewBox="0 0 400 300" 
        className="w-full h-full"
        style={{ background: "linear-gradient(135deg, #1a1f2e 0%, #0e1526 100%)" }}
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Roads background */}
        <path 
          d="M 50 250 Q 100 200 150 180 Q 200 160 250 140 Q 300 120 350 80"
          fill="none" 
          stroke="#2d3748" 
          strokeWidth="20"
          strokeLinecap="round"
        />
        
        {/* Route paths */}
        {routes.map((route, idx) => {
          const paths = [
            "M 60 240 Q 120 200 180 170 Q 240 140 300 110 Q 340 90 360 70",
            "M 60 240 Q 100 180 160 150 Q 220 120 280 100 Q 330 80 360 70",
            "M 60 240 Q 80 150 140 120 Q 200 90 260 80 Q 310 75 360 70"
          ]
          
          const isSelected = route.id === selectedRoute
          
          return (
            <g key={route.id}>
              {/* Route path glow */}
              {isSelected && (
                <path
                  d={paths[idx]}
                  fill="none"
                  stroke={route.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.3"
                  className="animate-pulse"
                />
              )}
              {/* Route path */}
              <path
                d={paths[idx]}
                fill="none"
                stroke={route.color}
                strokeWidth={isSelected ? "4" : "3"}
                strokeLinecap="round"
                opacity={isSelected ? 1 : 0.5}
                className="cursor-pointer transition-all hover:opacity-80"
                onClick={() => onRouteSelect(route.id)}
              />
              {/* Route label */}
              <text
                x={idx === 0 ? 250 : idx === 1 ? 200 : 150}
                y={idx === 0 ? 135 : idx === 1 ? 110 : 95}
                fill={route.color}
                fontSize="10"
                fontFamily="monospace"
                className="pointer-events-none"
              >
                {route.name}
              </text>
            </g>
          )
        })}
        
        {/* Start point - FC College */}
        <circle cx="60" cy="240" r="12" fill="#3b82f6" className="animate-pulse" />
        <circle cx="60" cy="240" r="8" fill="#1e40af" />
        <text x="75" y="245" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
          FC College
        </text>
        
        {/* End point - Balewadi */}
        <circle cx="360" cy="70" r="12" fill="#10b981" className="animate-pulse" />
        <circle cx="360" cy="70" r="8" fill="#047857" />
        <text x="280" y="60" fill="#94a3b8" fontSize="11" fontFamily="sans-serif">
          Balewadi
        </text>
        
        {/* Safety markers */}
        <g opacity="0.7">
          {/* Hospital marker */}
          <rect x="180" y="155" width="16" height="16" rx="3" fill="#ef4444" />
          <text x="183" y="167" fill="white" fontSize="10" fontWeight="bold">H</text>
          
          {/* Police station marker */}
          <rect x="280" y="95" width="16" height="16" rx="3" fill="#3b82f6" />
          <text x="284" y="107" fill="white" fontSize="10" fontWeight="bold">P</text>
        </g>
        
        {/* Compass */}
        <g transform="translate(370, 260)">
          <circle cx="0" cy="0" r="20" fill="#1e293b" stroke="#2d3748" strokeWidth="1" />
          <text x="-4" y="-8" fill="#94a3b8" fontSize="10" fontWeight="bold">N</text>
          <path d="M 0 -12 L 3 0 L 0 -5 L -3 0 Z" fill="#ef4444" />
          <path d="M 0 12 L 3 0 L 0 5 L -3 0 Z" fill="#94a3b8" />
        </g>
      </svg>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg p-3 border border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="text-xs text-muted-foreground">Start: FC College</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-safe" />
          <span className="text-xs text-muted-foreground">End: Balewadi</span>
        </div>
      </div>

      {/* Google Maps API Notice */}
      <div className="absolute top-4 right-4 bg-warning/10 border border-warning/30 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-warning" />
          <span className="text-xs text-warning">Demo Mode</span>
        </div>
      </div>

      {/* Click route instruction */}
      <div className="absolute bottom-4 right-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 border border-border">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary" />
          <span className="text-xs text-muted-foreground">Click a route to select</span>
        </div>
      </div>
    </div>
  )
}
