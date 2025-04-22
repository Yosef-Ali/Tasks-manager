"use client"

import { Menu, X, Info, UserCircle2, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface ChatHeaderProps {
  title: string
  onToggleSidebar: () => void
  isSidebarOpen: boolean
  isDesktop: boolean
}

export function ChatHeader({ title, onToggleSidebar, isSidebarOpen, isDesktop }: ChatHeaderProps) {
  return (
    <header className="border-b py-3 px-4 flex items-center justify-between bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10 h-16">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className={cn(
            "h-9 w-9 rounded-full",
            isDesktop ? "lg:hidden" : ""
          )}
        >
          {isSidebarOpen ?
            <X className="h-5 w-5" /> :
            <Menu className="h-5 w-5" />
          }
        </Button>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary text-xs">SA</AvatarFallback>
            <AvatarImage src="/placeholder-logo.svg" alt="Sodo Assistant" />
          </Avatar>
          <div>
            <h1 className="font-semibold leading-none">{title}</h1>
            <p className="text-xs text-muted-foreground mt-1">Sodo Assistant</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" title="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" title="Chat information">
          <Info className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" title="Your profile">
          <UserCircle2 className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
