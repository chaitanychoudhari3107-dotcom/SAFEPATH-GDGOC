"use client"

import { Database, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface DataItem {
  name: string
  description: string
  status: "done" | "in-progress" | "pending"
}

interface DataStatusProps {
  data?: DataItem[]
  className?: string
}

const defaultData: DataItem[] = [
  {
    name: "export.geojson",
    description: "306 lit roads",
    status: "done"
  },
  {
    name: "export__1_.geojson",
    description: "83 hospitals + police stations",
    status: "done"
  },
  {
    name: "safety_reviews.csv",
    description: "25 community safety reviews",
    status: "in-progress"
  }
]

export function DataStatus({ data = defaultData, className }: DataStatusProps) {
  const getStatusIcon = (status: DataItem["status"]) => {
    switch (status) {
      case "done":
        return <CheckCircle className="w-4 h-4 text-safe" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-warning animate-pulse" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: DataItem["status"]) => {
    switch (status) {
      case "done":
        return (
          <span className="text-xs font-mono bg-safe/20 text-safe px-2 py-0.5 rounded">
            DONE
          </span>
        )
      case "in-progress":
        return (
          <span className="text-xs font-mono bg-warning/20 text-warning px-2 py-0.5 rounded">
            IN PROGRESS
          </span>
        )
      case "pending":
        return (
          <span className="text-xs font-mono bg-secondary text-muted-foreground px-2 py-0.5 rounded">
            PENDING
          </span>
        )
    }
  }

  const doneCount = data.filter(d => d.status === "done").length
  const totalCount = data.length

  return (
    <div className={cn("bg-card border border-border rounded-xl p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="font-mono text-sm font-bold tracking-wide text-primary uppercase">
            Data Status
          </h2>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {doneCount}/{totalCount} ready
        </span>
      </div>

      <div className="space-y-3">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
          >
            <div className="flex-shrink-0">
              {getStatusIcon(item.status)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground truncate">
                  {item.name}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {item.description}
              </span>
            </div>
            <div className="flex-shrink-0">
              {getStatusBadge(item.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">Data readiness</span>
          <span className="text-xs font-mono text-foreground">
            {Math.round((doneCount / totalCount) * 100)}%
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-safe rounded-full transition-all duration-500"
            style={{ width: `${(doneCount / totalCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
