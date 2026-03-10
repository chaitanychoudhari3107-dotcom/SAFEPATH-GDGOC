"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { MapFallback } from "./map-fallback"

interface LatLngLiteral {
  lat: number
  lng: number
}

interface Route {
  id: string
  name: string
  color: string
  path: LatLngLiteral[]
  safetyScore: number
  duration: string
  distance: string
}

interface MapViewProps {
  routes: Route[]
  selectedRoute: string | null
  onRouteSelect: (routeId: string) => void
  heatmapData?: LatLngLiteral[]
  showHeatmap?: boolean
  className?: string
}

// Pune coordinates
const PUNE_CENTER = { lat: 18.5204, lng: 73.8567 }

// Sample route coordinates (FC College to Balewadi)
const FC_COLLEGE = { lat: 18.5308, lng: 73.8474 }
const BALEWADI = { lat: 18.5745, lng: 73.7698 }

export function MapView({ 
  routes, 
  selectedRoute, 
  onRouteSelect,
  heatmapData = [],
  showHeatmap = false,
  className 
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [polylines, setPolylines] = useState<any[]>([])
  const [heatmapLayer, setHeatmapLayer] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useFallback, setUseFallback] = useState(false)

  // Check if API key is available
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setUseFallback(true)
      setIsLoaded(true)
    }
  }, [])

  // Initialize map
  useEffect(() => {
    if (useFallback) return
    
    const initMap = async () => {
      try {
        const { Loader } = await import("@googlemaps/js-api-loader")
        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
          version: "weekly",
          libraries: ["places", "visualization"]
        })

        const google = await loader.load()
        
        if (mapRef.current) {
          const mapInstance = new google.maps.Map(mapRef.current, {
            center: PUNE_CENTER,
            zoom: 13,
            styles: darkMapStyles,
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          })

          // Add markers for start and end
          new google.maps.Marker({
            position: FC_COLLEGE,
            map: mapInstance,
            title: "FC College (Start)",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#3b82f6",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3,
            }
          })

          new google.maps.Marker({
            position: BALEWADI,
            map: mapInstance,
            title: "Balewadi (Destination)",
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#10b981",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3,
            }
          })

          setMap(mapInstance)
          setIsLoaded(true)
        }
      } catch (err) {
        console.error("Error loading Google Maps:", err)
        setError("Failed to load Google Maps. Please check your API key.")
      }
    }

    initMap()
  }, [useFallback])

  // Draw routes
  useEffect(() => {
    if (!map || !isLoaded) return

    // Clear existing polylines
    polylines.forEach(p => p.setMap(null))

    const newPolylines = routes.map(route => {
      const isSelected = route.id === selectedRoute
      const polyline = new google.maps.Polyline({
        path: route.path,
        geodesic: true,
        strokeColor: route.color,
        strokeOpacity: isSelected ? 1 : 0.5,
        strokeWeight: isSelected ? 6 : 4,
        map: map,
        zIndex: isSelected ? 10 : 1,
      })

      polyline.addListener("click", () => {
        onRouteSelect(route.id)
      })

      return polyline
    })

    setPolylines(newPolylines)

    // Fit bounds to show all routes
    if (routes.length > 0) {
      const bounds = new google.maps.LatLngBounds()
      routes.forEach(route => {
        route.path.forEach(point => bounds.extend(point))
      })
      map.fitBounds(bounds, 50)
    }

    return () => {
      newPolylines.forEach(p => p.setMap(null))
    }
  }, [map, routes, selectedRoute, isLoaded, onRouteSelect])

  // Heatmap layer
  useEffect(() => {
    if (!map || !isLoaded) return

    if (heatmapLayer) {
      heatmapLayer.setMap(null)
    }

    if (showHeatmap && heatmapData.length > 0) {
      const newHeatmap = new google.maps.visualization.HeatmapLayer({
        data: heatmapData.map(point => new google.maps.LatLng(point.lat, point.lng)),
        map: map,
        radius: 30,
        opacity: 0.6,
      })
      setHeatmapLayer(newHeatmap)
    }
  }, [map, heatmapData, showHeatmap, isLoaded])

  // Use fallback map when no API key
  if (useFallback) {
    return (
      <MapFallback
        routes={routes}
        selectedRoute={selectedRoute}
        onRouteSelect={onRouteSelect}
        className={className}
      />
    )
  }

  if (error) {
    return (
      <div className={cn(
        "relative rounded-xl overflow-hidden bg-card border border-border flex items-center justify-center",
        className
      )}>
        <div className="text-center p-8">
          <div className="text-destructive mb-2">Map Error</div>
          <p className="text-muted-foreground text-sm">{error}</p>
          <p className="text-muted-foreground text-xs mt-2">
            Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your environment variables
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("relative rounded-xl overflow-hidden", className)}>
      {/* Loading overlay */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-card flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground text-sm">Loading map...</span>
          </div>
        </div>
      )}
      
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full min-h-[400px]" />
      
      {/* Map overlay - Route legend */}
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
    </div>
  )
}

// Dark map styles
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1a1f2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1f2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#94a3b8" }]
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#64748b" }]
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#1e293b" }]
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2d3748" }]
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a202c" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3b4a6b" }]
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1a202c" }]
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2d3748" }]
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0e1526" }]
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4a5568" }]
  }
]
