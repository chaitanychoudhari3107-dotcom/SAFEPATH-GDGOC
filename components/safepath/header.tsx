"use client"

import { Shield, Map, Settings, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={cn(
      "bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40",
      className
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-mono text-lg font-bold text-foreground tracking-tight">
                SafePath
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">
                AI-Powered Safe Navigation
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavItem icon={Map} label="Map" active />
            <NavItem icon={Shield} label="Safety" />
            <NavItem icon={Info} label="About" />
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Status Badge */}
            <div className="hidden sm:flex items-center gap-2 bg-safe/10 border border-safe/30 rounded-full px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
              <span className="text-xs font-mono text-safe">LIVE</span>
            </div>

            {/* Location Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-secondary rounded-full px-3 py-1.5">
              <Map className="w-3 h-3 text-primary" />
              <span className="text-xs text-muted-foreground">Pune, India</span>
            </div>

            {/* Settings */}
            <button className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function NavItem({ 
  icon: Icon, 
  label, 
  active = false 
}: { 
  icon: React.ElementType
  label: string
  active?: boolean 
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
        active 
          ? "bg-primary/10 text-primary" 
          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
      )}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  )
}
