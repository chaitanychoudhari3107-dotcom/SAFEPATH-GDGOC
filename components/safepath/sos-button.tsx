"use client"

import { useState, useEffect } from "react"
import { Phone, AlertTriangle, X, MapPin, MessageCircle, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SOSButtonProps {
  emergencyContacts?: { name: string; phone: string }[]
  className?: string
}

export function SOSButton({ 
  emergencyContacts = [
    { name: "Police", phone: "100" },
    { name: "Women Helpline", phone: "1091" },
    { name: "Emergency", phone: "112" }
  ],
  className 
}: SOSButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  // Get current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
          setIsGettingLocation(false)
        },
        (error) => {
          console.error("Error getting location:", error)
          // Fallback to Pune center
          setLocation({ lat: 18.5204, lng: 73.8567 })
          setIsGettingLocation(false)
        }
      )
    } else {
      setLocation({ lat: 18.5204, lng: 73.8567 })
      setIsGettingLocation(false)
    }
  }

  // Auto-get location when expanded
  useEffect(() => {
    if (isExpanded && !location) {
      getCurrentLocation()
    }
  }, [isExpanded, location])

  // Countdown timer for auto-send
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown !== null && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      sendSOSMessage()
      setCountdown(null)
    }
    return () => clearTimeout(timer)
  }, [countdown])

  const sendSOSMessage = () => {
    const locationUrl = location 
      ? `https://www.google.com/maps?q=${location.lat},${location.lng}`
      : "Location not available"
    
    const message = encodeURIComponent(
      `🚨 EMERGENCY SOS 🚨\n\nI need help! This is an emergency.\n\n📍 My current location:\n${locationUrl}\n\nSent via SafePath App`
    )
    
    // Open WhatsApp with pre-filled message
    window.open(`https://wa.me/?text=${message}`, "_blank")
  }

  const startCountdown = () => {
    setCountdown(5)
  }

  const cancelCountdown = () => {
    setCountdown(null)
  }

  const callEmergency = (phone: string) => {
    window.open(`tel:${phone}`, "_self")
  }

  const shareLocation = () => {
    if (location) {
      const locationUrl = `https://www.google.com/maps?q=${location.lat},${location.lng}`
      
      if (navigator.share) {
        navigator.share({
          title: "My Location - SafePath SOS",
          text: "I'm sharing my location with you for safety",
          url: locationUrl
        })
      } else {
        navigator.clipboard.writeText(locationUrl)
        alert("Location copied to clipboard!")
      }
    }
  }

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Expanded SOS Panel */}
      {isExpanded && (
        <div className="absolute bottom-20 right-0 w-80 bg-card border border-border rounded-xl p-4 shadow-2xl animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <h3 className="font-mono text-sm font-bold text-danger uppercase">
                Emergency SOS
              </h3>
            </div>
            <button
              onClick={() => {
                setIsExpanded(false)
                cancelCountdown()
              }}
              className="p-1 hover:bg-secondary rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Countdown Alert */}
          {countdown !== null && (
            <div className="mb-4 p-4 bg-danger/20 border border-danger/30 rounded-lg animate-pulse">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-danger mb-2">
                  {countdown}
                </div>
                <p className="text-sm text-danger mb-3">
                  Sending SOS in {countdown} seconds...
                </p>
                <Button
                  onClick={cancelCountdown}
                  variant="outline"
                  className="border-danger text-danger hover:bg-danger hover:text-danger-foreground"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Location Status */}
          <div className="mb-4 p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-xs font-mono text-muted-foreground uppercase">
                Current Location
              </span>
            </div>
            {isGettingLocation ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span>Getting location...</span>
              </div>
            ) : location ? (
              <div className="text-sm text-foreground">
                {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                <button
                  onClick={shareLocation}
                  className="ml-2 text-primary hover:underline text-xs"
                >
                  Share
                </button>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Location unavailable
              </div>
            )}
          </div>

          {/* Emergency Contacts */}
          <div className="space-y-2 mb-4">
            <div className="text-xs font-mono text-muted-foreground uppercase mb-2">
              Quick Call
            </div>
            {emergencyContacts.map((contact, idx) => (
              <button
                key={idx}
                onClick={() => callEmergency(contact.phone)}
                className="w-full flex items-center justify-between p-3 bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-safe" />
                  <span className="text-sm font-medium text-foreground">
                    {contact.name}
                  </span>
                </div>
                <span className="text-sm font-mono text-muted-foreground">
                  {contact.phone}
                </span>
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={sendSOSMessage}
              className="bg-safe hover:bg-safe/90 text-safe-foreground"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button
              onClick={shareLocation}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Auto-send SOS */}
          {countdown === null && (
            <Button
              onClick={startCountdown}
              className="w-full mt-3 bg-danger hover:bg-danger/90 text-danger-foreground"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Auto-Send SOS (5s)
            </Button>
          )}
        </div>
      )}

      {/* Main SOS Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all",
          isExpanded 
            ? "bg-secondary border-2 border-danger"
            : "bg-danger hover:bg-danger/90 animate-pulse",
          countdown !== null && "animate-bounce"
        )}
      >
        {isExpanded ? (
          <X className="w-6 h-6 text-danger" />
        ) : (
          <div className="text-center">
            <AlertTriangle className="w-6 h-6 text-danger-foreground mx-auto" />
            <span className="text-[10px] font-bold text-danger-foreground">SOS</span>
          </div>
        )}
      </button>
    </div>
  )
}
