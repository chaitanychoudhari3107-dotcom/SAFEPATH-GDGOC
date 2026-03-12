import { NextRequest, NextResponse } from "next/server"

// This endpoint will connect to your Flask backend's /analyze-comment endpoint
// For now, it provides a mock response for demo purposes

export async function POST(request: NextRequest) {
  try {
    const { comment } = await request.json()

    if (!comment || typeof comment !== "string") {
      return NextResponse.json(
        { error: "Comment is required" },
        { status: 400 }
      )
    }

    // Try to call the Flask backend
    const FLASK_BACKEND_URL = "https://safepath-l728.onrender.com"
    try {
      const backendResponse = await fetch(`${FLASK_BACKEND_URL}/analyze-comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment }),
      })

      if (backendResponse.ok) {
        const data = await backendResponse.json()
        return NextResponse.json(data)
      }
    } catch (backendError) {
      // Backend not available, fall back to mock response
      console.log("Flask backend not available, using mock response")
    }

    // Mock analysis for demo purposes
    const result = getMockAnalysis(comment)
    return NextResponse.json(result)

  } catch (error) {
    console.error("Error analyzing comment:", error)
    return NextResponse.json(
      { error: "Failed to analyze comment" },
      { status: 500 }
    )
  }
}

interface AnalysisResult {
  classification: "safe" | "neutral" | "unsafe"
  reason: string
  confidence: number
}

function getMockAnalysis(comment: string): AnalysisResult {
  const lowerComment = comment.toLowerCase()
  
  const unsafeKeywords = [
    "dark", "dim", "unsafe", "scared", "dangerous", "no light", 
    "isolated", "empty", "harassment", "suspicious", "crime",
    "avoid", "fear", "risk", "threat", "alone"
  ]
  
  const safeKeywords = [
    "well-lit", "police", "patrol", "safe", "shops", "busy", 
    "crowded", "hospital", "cctv", "camera", "guard", "security",
    "active", "people", "open", "market", "station"
  ]
  
  const hasUnsafe = unsafeKeywords.some(kw => lowerComment.includes(kw))
  const hasSafe = safeKeywords.some(kw => lowerComment.includes(kw))
  
  if (hasUnsafe && !hasSafe) {
    return {
      classification: "unsafe",
      reason: "This comment indicates potential safety concerns in the area, such as poor lighting, isolation, or previous negative experiences. We recommend choosing an alternative route if available or traveling with companions.",
      confidence: 0.85
    }
  } else if (hasSafe && !hasUnsafe) {
    return {
      classification: "safe",
      reason: "This comment indicates positive safety features in the area, such as good lighting, active security presence, or busy establishments. This route appears to be a safe choice.",
      confidence: 0.88
    }
  } else {
    return {
      classification: "neutral",
      reason: "This comment provides general information about the route without clear safety indicators in either direction. Consider checking other reviews or gathering more information about this area.",
      confidence: 0.72
    }
  }
}
