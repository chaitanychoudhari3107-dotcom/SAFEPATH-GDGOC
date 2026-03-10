"use client"

import { useState } from "react"
import { Brain, Send, AlertCircle, CheckCircle, AlertTriangle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnalysisResult {
  classification: "safe" | "neutral" | "unsafe"
  reason: string
  confidence: number
}

interface CommentAnalysisProps {
  onAnalysisComplete?: (result: AnalysisResult) => void
  className?: string
}

export function CommentAnalysis({ onAnalysisComplete, className }: CommentAnalysisProps) {
  const [comment, setComment] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!comment.trim()) return

    setIsAnalyzing(true)
    setError(null)
    setResult(null)

    try {
      // Call your backend API here
      const response = await fetch("/api/analyze-comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment })
      })

      if (!response.ok) {
        throw new Error("Analysis failed")
      }

      const data = await response.json()
      setResult(data)
      onAnalysisComplete?.(data)
    } catch (err) {
      // Fallback mock response for demo
      const mockResult = getMockAnalysis(comment)
      setResult(mockResult)
      onAnalysisComplete?.(mockResult)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getClassificationStyles = (classification: string) => {
    switch (classification) {
      case "safe":
        return {
          bg: "bg-safe/10",
          border: "border-safe/30",
          text: "text-safe",
          icon: CheckCircle,
          label: "SAFE"
        }
      case "unsafe":
        return {
          bg: "bg-danger/10",
          border: "border-danger/30",
          text: "text-danger",
          icon: AlertCircle,
          label: "UNSAFE"
        }
      default:
        return {
          bg: "bg-warning/10",
          border: "border-warning/30",
          text: "text-warning",
          icon: AlertTriangle,
          label: "NEUTRAL"
        }
    }
  }

  return (
    <div className={cn("bg-card border border-border rounded-xl p-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="w-5 h-5 text-primary" />
        <h2 className="font-mono text-sm font-bold tracking-wide text-primary uppercase">
          AI Safety Analysis
        </h2>
        <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono">
          Gemini
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Share your experience about this route. Our AI will analyze it to help improve safety scores.
      </p>

      {/* Comment Input */}
      <div className="relative mb-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="e.g., 'The street lights on this road are very dim after 9 PM' or 'Well-lit area with many shops open late'"
          rows={3}
          className="w-full bg-input border border-border rounded-lg py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
        />
        <div className="absolute bottom-3 right-3 text-xs text-muted-foreground">
          {comment.length}/500
        </div>
      </div>

      {/* Analyze Button */}
      <Button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !comment.trim()}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-all disabled:opacity-50"
      >
        {isAnalyzing ? (
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Analyzing with Gemini AI...</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            <span>Analyze Comment</span>
          </div>
        )}
      </Button>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-danger/10 border border-danger/30 rounded-lg">
          <div className="flex items-center gap-2 text-danger text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Analysis Result */}
      {result && (
        <div className="mt-4 space-y-3">
          <div className="text-xs text-muted-foreground font-mono uppercase">
            Analysis Result
          </div>
          
          {(() => {
            const styles = getClassificationStyles(result.classification)
            const Icon = styles.icon
            return (
              <div className={cn(
                "p-4 rounded-lg border",
                styles.bg,
                styles.border
              )}>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={cn("w-6 h-6", styles.text)} />
                  <div>
                    <div className={cn("font-mono font-bold text-lg", styles.text)}>
                      {styles.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Confidence: {(result.confidence * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>
                <p className="text-sm text-foreground">
                  {result.reason}
                </p>
              </div>
            )
          })()}

          {/* Impact notice */}
          <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-warning mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Score Impact: </span>
              {result.classification === "unsafe" && (
                <span className="text-danger">-0.5 safety points applied to this route</span>
              )}
              {result.classification === "safe" && (
                <span className="text-safe">+0.3 safety points applied to this route</span>
              )}
              {result.classification === "neutral" && (
                <span>No score change applied</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sample comments for testing */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="text-xs text-muted-foreground mb-2 font-mono">
          QUICK TEST COMMENTS
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            "Well-lit area with police patrol",
            "Dark street, no lights",
            "Normal traffic road"
          ].map((sample, idx) => (
            <button
              key={idx}
              onClick={() => setComment(sample)}
              className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 rounded-full transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// Mock analysis for demo purposes
function getMockAnalysis(comment: string): AnalysisResult {
  const lowerComment = comment.toLowerCase()
  
  const unsafeKeywords = ["dark", "dim", "unsafe", "scared", "dangerous", "no light", "isolated", "empty", "harassment"]
  const safeKeywords = ["well-lit", "police", "patrol", "safe", "shops", "busy", "crowded", "hospital", "cctv", "camera"]
  
  const hasUnsafe = unsafeKeywords.some(kw => lowerComment.includes(kw))
  const hasSafe = safeKeywords.some(kw => lowerComment.includes(kw))
  
  if (hasUnsafe && !hasSafe) {
    return {
      classification: "unsafe",
      reason: "This comment indicates potential safety concerns in the area, such as poor lighting or isolation. We recommend choosing an alternative route if available.",
      confidence: 0.85
    }
  } else if (hasSafe && !hasUnsafe) {
    return {
      classification: "safe",
      reason: "This comment indicates positive safety features in the area, such as good lighting, security presence, or active establishments.",
      confidence: 0.88
    }
  } else {
    return {
      classification: "neutral",
      reason: "This comment provides general information about the route without clear safety indicators. Consider checking other reviews for more details.",
      confidence: 0.72
    }
  }
}
