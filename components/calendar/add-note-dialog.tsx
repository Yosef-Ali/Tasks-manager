"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { Note } from "@/types/calendar"

interface AddNoteDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddNote: (note: Omit<Note, "id" | "date">) => void
  selectedDate: Date | null
}

export function AddNoteDialog({ isOpen, onClose, onAddNote, selectedDate }: AddNoteDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [color, setColor] = useState("blue")

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setTitle("")
      setDescription("")
      setColor("blue")
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) return

    onAddNote({
      title,
      description,
      color,
    })
  }

  const colorOptions = [
    { value: "blue", label: "Blue" },
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" },
    { value: "purple", label: "Purple" },
    { value: "pink", label: "Pink" },
    { value: "indigo", label: "Indigo" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Note</DialogTitle>
          {selectedDate && (
            <p className="text-sm text-gray-500">
              {format(selectedDate, "EEEE, MMMM d, yyyy")}
              {selectedDate.getHours() !== 0 && ` at ${format(selectedDate, "h:mm a")}`}
            </p>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => (
                <div
                  key={option.value}
                  className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                    color === option.value ? "border-black" : "border-transparent"
                  }`}
                  style={{ backgroundColor: getColorValue(option.value) }}
                  onClick={() => setColor(option.value)}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Note</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// Helper function to get actual color values
function getColorValue(color: string): string {
  const colorMap: Record<string, string> = {
    blue: "#3b82f6",
    red: "#ef4444",
    green: "#10b981",
    yellow: "#f59e0b",
    purple: "#8b5cf6",
    pink: "#ec4899",
    indigo: "#6366f1",
  }

  return colorMap[color] || colorMap.blue
}
