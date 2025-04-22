"use client"

import type React from "react"

import { useState } from "react"
import { Sidebar } from "@/components/layout/sidebar"
// import { TopBar } from "@/components/layout/top-bar" // Removed TopBar
import { Header } from "@/components/header"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* <TopBar /> */} {/* Removed TopBar */}
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-y-auto bg-background p-6 md:p-8"> {/* Adjusted padding, removed max-width wrapper */}
          {children}
        </main>
      </div>
    </div>
  )
}
