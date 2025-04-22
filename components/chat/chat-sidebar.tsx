"use client"

import { Search, Plus, History, Inbox, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function ChatSidebar({ isOpen, onClose, className }: ChatSidebarProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 w-[300px] bg-background border-r transition-transform duration-300 ease-in-out z-30 lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Input placeholder="Search chats..." className="flex-1" />
            <Button size="icon" variant="ghost" className="shrink-0">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-auto py-3"
            >
              <Inbox className="h-5 w-5" />
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">Patient Inquiries</span>
                <span className="text-xs text-muted-foreground">3 new messages</span>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-auto py-3"
            >
              <History className="h-5 w-5" />
              <div className="flex flex-col items-start text-left">
                <span className="font-medium">Lab Results</span>
                <span className="text-xs text-muted-foreground">Last message 2h ago</span>
              </div>
            </Button>
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Button>
        </div>
      </div>
    </div>
  )
}