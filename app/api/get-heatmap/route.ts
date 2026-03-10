import { NextResponse } from "next/server"

// This endpoint will connect to your Flask backend's /get-heatmap endpoint
// For now, it provides mock heatmap data for demo purposes

export async function GET() {
  try {
    // Try to call the Flask backend
    const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || "http://localhost:5000"
    
    try {
      const backendResponse = await fetch(`${FLASK_BACKEND_URL}/get-heatmap`)

      if (backendResponse.ok) {
        const data = await backendResponse.json()
        return NextResponse.json(data)
      }
    } catch (backendError) {
      // Backend not available, fall back to mock response
      console.log("Flask backend not available, using mock heatmap data")
    }

    // Return mock heatmap data for Pune area
    const heatmapData = getMockHeatmapData()
    return NextResponse.json(heatmapData)

  } catch (error) {
    console.error("Error getting heatmap data:", error)
    return NextResponse.json(
      { error: "Failed to get heatmap data" },
      { status: 500 }
    )
  }
}

interface HeatmapPoint {
  lat: number
  lng: number
  weight?: number
}

function getMockHeatmapData(): HeatmapPoint[] {
  // Mock incident/safety data points around Pune
  // These represent areas with varying safety levels
  
  const basePoints: HeatmapPoint[] = [
    // High risk areas (darker on heatmap)
    { lat: 18.5550, lng: 73.8000, weight: 0.9 },
    { lat: 18.5480, lng: 73.7950, weight: 0.8 },
    { lat: 18.5420, lng: 73.8100, weight: 0.7 },
    
    // Medium risk areas
    { lat: 18.5600, lng: 73.7800, weight: 0.5 },
    { lat: 18.5350, lng: 73.8200, weight: 0.5 },
    { lat: 18.5700, lng: 73.7700, weight: 0.4 },
    
    // Low risk areas (lighter on heatmap)
    { lat: 18.5250, lng: 73.8400, weight: 0.2 },
    { lat: 18.5300, lng: 73.8350, weight: 0.2 },
    { lat: 18.5750, lng: 73.7650, weight: 0.3 },
    
    // Additional points for better coverage
    { lat: 18.5450, lng: 73.8050, weight: 0.6 },
    { lat: 18.5520, lng: 73.7880, weight: 0.55 },
    { lat: 18.5380, lng: 73.8250, weight: 0.45 },
    { lat: 18.5650, lng: 73.7750, weight: 0.35 },
    { lat: 18.5280, lng: 73.8300, weight: 0.25 },
  ]
  
  return basePoints
}
