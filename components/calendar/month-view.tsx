"use client"

import { useState, useEffect } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns"
import { cn } from "@/lib/utils"
import type { Note } from "@/types/calendar"
import { NoteItem } from "./note-item"

interface MonthViewProps {
  currentDate: Date
  onDateClick: (date: Date) => void
  getNotesForDate: (date: Date) => Note[]
}

export function MonthView({ currentDate, onDateClick, getNotesForDate }: MonthViewProps) {
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  useEffect(() => {
    // Get the start and end dates for the calendar view
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(monthStart)
    const calendarStart = startOfWeek(monthStart)
    const calendarEnd = endOfWeek(monthEnd)

    // Generate an array of all days to display
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })
    setCalendarDays(days)
  }, [currentDate])

  // Days of the week header
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="h-full flex flex-col">
      {/* Days of week header */}
      <div className="grid grid-cols-7 border-b border-border">
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-center text-sm font-medium text-muted-foreground">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-6 divide-x divide-y divide-border">
        {calendarDays.map((day) => {
          const dayNotes = getNotesForDate(day)
          const isCurrentMonth = isSameMonth(day, currentDate)

          return (
            <div
              key={day.toString()}
              onClick={() => onDateClick(day)}
              className={cn(
                "min-h-[100px] p-1 transition-colors hover:bg-muted/50 cursor-pointer relative",
                !isCurrentMonth && "bg-muted/20",
                isToday(day) && "bg-primary/10",
              )}
            >
              <div className="flex justify-between items-start">
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-sm transition-colors",
                    isToday(day) && "bg-primary text-primary-foreground",
                    !isCurrentMonth && "text-muted-foreground",
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              {/* Notes for this day */}
              <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px]">
                {dayNotes.map((note) => (
                  <NoteItem key={note.id} note={note} isCompact />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
