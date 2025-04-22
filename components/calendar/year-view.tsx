"use client"

import { useState, useEffect } from "react"
import { format, addMonths, startOfYear, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from "date-fns"
import { cn } from "@/lib/utils"
import type { Note } from "@/types/calendar"

interface YearViewProps {
  currentDate: Date
  onDateClick: (date: Date) => void
  getNotesForDate: (date: Date) => Note[]
}

export function YearView({ currentDate, onDateClick, getNotesForDate }: YearViewProps) {
  const [months, setMonths] = useState<
    {
      date: Date
      days: Date[]
    }[]
  >([])

  useEffect(() => {
    // Get the start of the year
    const yearStart = startOfYear(currentDate)

    // Generate data for all 12 months
    const monthsData = Array.from({ length: 12 }, (_, i) => {
      const monthDate = addMonths(yearStart, i)
      const monthStart = startOfMonth(monthDate)
      const monthEnd = endOfMonth(monthStart)
      const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

      return {
        date: monthDate,
        days,
      }
    })

    setMonths(monthsData)
  }, [currentDate])

  // Days of the week header (abbreviated)
  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {months.map((month) => (
        <div
          key={month.date.toString()}
          className="border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
        >
          {/* Month header */}
          <div
            className="bg-muted p-2 text-center font-medium cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={() => {
              // Navigate to this month when clicking the header
              onDateClick(month.date)
            }}
          >
            {format(month.date, "MMMM")}
          </div>

          {/* Mini calendar */}
          <div className="p-1">
            {/* Days of week header */}
            <div className="grid grid-cols-7 text-center text-xs text-muted-foreground">
              {weekDays.map((day, idx) => (
                <div key={day + idx} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1 text-xs">
              {/* Empty cells for days before the start of the month */}
              {Array.from({ length: month.days[0].getDay() }).map((_, i) => (
                <div key={`empty-start-${i}`} className="h-6"></div>
              ))}

              {/* Days of the month */}
              {month.days.map((day) => {
                const hasNotes = getNotesForDate(day).length > 0

                return (
                  <div
                    key={day.toString()}
                    onClick={() => onDateClick(day)}
                    className={cn(
                      "h-6 flex items-center justify-center rounded-full cursor-pointer transition-colors",
                      isToday(day) && "bg-primary text-primary-foreground",
                      hasNotes && !isToday(day) && "bg-primary/20",
                      "hover:bg-muted/70",
                    )}
                  >
                    {format(day, "d")}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
