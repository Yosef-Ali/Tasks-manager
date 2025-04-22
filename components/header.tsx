"use client"

import { useState } from "react"
import { Bell, Menu, Search } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  toggleSidebar: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="bg-card border-b border-border py-3 px-6 flex items-center justify-between">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary"
        >
          <Menu size={20} />
          <span className="sr-only">Toggle sidebar</span>
        </button>
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search tasks, documents, and users..."
            className="w-80 pl-10 pr-4 py-2 rounded-md bg-secondary/50 text-foreground border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            <span className="sr-only">Notifications</span>
          </button>
          <ThemeToggle />
          <div className="flex items-center ml-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
              S
            </div>
            <span className="ml-2 font-medium text-foreground hidden md:block">Dr. Samuel</span>
          </div>
        </div>
      </div>
    </header>
  )
}
