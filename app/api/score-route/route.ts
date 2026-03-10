import { NextRequest, NextResponse } from "next/server"

// This endpoint will connect to your Flask backend's /score-route endpoint
// For now, it provides mock data for demo purposes

export async function POST(request: NextRequest) {
  try {
    const { routes } = await request.json()

    // Try to call the Flask backend
    const FLASK_BACKEND_URL = process.env.FLASK_BACKEND_URL || "http://localhost:5000"
    
    try {
      const backendResponse = await fetch(`${FLASK_BACKEND_URL}/score-route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routes }),
      })

      if (backendResponse.ok) {
        const data = await backendResponse.json()
        return NextResponse.json(data)
      }
    } catch (backendError) {
      // Backend not available, fall back to mock response
      console.log("Flask backend not available, using mock response")
    }

    // Return mock scored routes for demo
    const scoredRoutes = getMockScoredRoutes()
    return NextResponse.json(scoredRoutes)

  } catch (error) {
    console.error("Error scoring routes:", error)
    return NextResponse.json(
      { error: "Failed to score routes" },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Return mock routes for demo
  const scoredRoutes = getMockScoredRoutes()
  return NextResponse.json(scoredRoutes)
}

interface ScoredRoute {
  route_id: string
  time_min: number
  safety_score: number
  highlights: string[]
}

function getMockScoredRoutes(): ScoredRoute[] {
  return [
    {
      route_id: "route-a",
      time_min: 18,
      safety_score: 8.7,
      highlights: [
        "Well-lit main roads",
        "Near police station",
        "Hospital on route",
        "Active commercial area"
      ]
    },
    {
      route_id: "route-b",
      time_min: 15,
      safety_score: 6.2,
      highlights: [
        "Moderate lighting",
        "Residential areas",
        "Some dark patches"
      ]
    },
    {
      route_id: "route-c",
      time_min: 12,
      safety_score: 4.5,
      highlights: [
        "Shortest route",
        "Limited street lighting",
        "Isolated stretches"
      ]
    }
  ]
}
