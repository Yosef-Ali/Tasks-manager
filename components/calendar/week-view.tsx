"use client"

import { useState, useEffect } from "react"
import { format, startOfWeek, endOfWeek, eachDayOfInterval, addHours, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import type { Note } from "@/types/calendar"
import { NoteItem } from "./note-item"

interface WeekViewProps {
  currentDate: Date
  onDateClick: (date: Date) => void
  getNotesForDate: (date: Date) => Note[]
}

export function WeekView({ currentDate, onDateClick, getNotesForDate }: WeekViewProps) {
  const [weekDays, setWeekDays] = useState<Date[]>([])
  const hours = Array.from({ length: 24 }, (_, i) => i)

  useEffect(() => {
    // Get the start and end dates for the week
    const weekStart = startOfWeek(currentDate)
    const weekEnd = endOfWeek(weekStart)

    // Generate an array of all days in the week
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd })
    setWeekDays(days)
  }, [currentDate])

  return (
    <div className="flex flex-col h-full">
      {/* Week header with days */}
      <div className="grid grid-cols-8 border-b border-border">
        {/* Time column header */}
        <div className="py-2 text-center text-sm font-medium text-muted-foreground border-r border-border"></div>

        {/* Days of the week */}
        {weekDays.map((day) => (
          <div
            key={day.toString()}
            className={cn("py-2 text-center flex flex-col items-center", isToday(day) && "bg-primary/10")}
          >
            <div className="text-sm font-medium text-muted-foreground">{format(day, "EEE")}</div>
            <div
              className={cn(
                "flex items-center justify-center h-8 w-8 mt-1 rounded-full transition-colors",
                isToday(day) && "bg-primary text-primary-foreground",
              )}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-8 divide-x divide-border h-full">
          {/* Time labels column */}
          <div className="text-xs text-muted-foreground pr-2 relative border-r border-border pt-3">
            {hours.map((hour) => (
              <div key={hour} className="h-12 relative">
                <span className="absolute top-0 right-2">
                  {hour === 0 ? "12 AM" : hour < 12 ? `${hour} AM` : hour === 12 ? "12 PM" : `${hour - 12} PM`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDays.map((day) => {
            const dayNotes = getNotesForDate(day)

            return (
              <div key={day.toString()} className={cn("relative", isToday(day) && "bg-primary/10")}>
                {/* Hour cells */}
                {hours.map((hour) => {
                  const hourDate = addHours(new Date(day), hour)

                  return (
                    <div
                      key={hour}
                      className="h-12 border-b border-border hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => onDateClick(hourDate)}
                    >
                      {/* Render notes that start at this hour */}
                      {dayNotes
                        .filter((note) => {
                          const noteHour = note.date.getHours()
                          return noteHour === hour
                        })
                        .map((note) => (
                          <div key={note.id} className="px-1 py-0.5">
                            <NoteItem note={note} isCompact />
                          </div>
                        ))}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
