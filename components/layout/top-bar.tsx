"use client"

import { X } from "lucide-react"
import { useState } from "react"

export function TopBar() {
  const [showAnnouncement, setShowAnnouncement] = useState(true)

  if (!showAnnouncement) return null

  return (
    <div className="bg-secondary py-3 px-6 flex items-center justify-center text-sm">
      <span className="mr-2 text-secondary-foreground">We might win Hospital of the Year!</span>
      <a href="#" className="text-primary hover:text-primary/80">
        SUPPORT US
      </a>
      <button
        className="ml-auto text-muted-foreground hover:text-foreground"
        onClick={() => setShowAnnouncement(false)}
      >
        <span className="sr-only">Close</span>
        <X size={20} />
      </button>
    </div>
  )
}
