"use client"

import { Flame, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeatmapToggleProps {
  enabled: boolean
  onToggle: (enabled: boolean) => void
  className?: string
}

export function HeatmapToggle({ enabled, onToggle, className }: HeatmapToggleProps) {
  return (
    <div className={cn(
      "bg-card border border-border rounded-xl p-4",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
            enabled ? "bg-warning/20" : "bg-secondary"
          )}>
            <Flame className={cn(
              "w-5 h-5 transition-colors",
              enabled ? "text-warning" : "text-muted-foreground"
            )} />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">Safety Heatmap</h3>
            <p className="text-xs text-muted-foreground">
              Show incident density overlay
            </p>
          </div>
        </div>
        
        <button
          onClick={() => onToggle(!enabled)}
          className={cn(
            "relative w-12 h-6 rounded-full transition-colors",
            enabled ? "bg-warning" : "bg-secondary"
          )}
        >
          <div className={cn(
            "absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform flex items-center justify-center",
            enabled ? "translate-x-7" : "translate-x-1"
          )}>
            {enabled ? (
              <Eye className="w-2.5 h-2.5 text-warning" />
            ) : (
              <EyeOff className="w-2.5 h-2.5 text-muted-foreground" />
            )}
          </div>
        </button>
      </div>

      {enabled && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground mb-2 font-mono">
            HEATMAP LEGEND
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 rounded bg-gradient-to-r from-safe to-warning" />
              <span className="text-xs text-muted-foreground">Low risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 rounded bg-gradient-to-r from-warning to-danger" />
              <span className="text-xs text-muted-foreground">High risk</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
