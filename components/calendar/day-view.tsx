"use client"

import { useState, useEffect } from "react"
import { format, addHours, isSameDay, isSameHour, parseISO, startOfDay, endOfDay } from "date-fns"
import { cn } from "@/lib/utils"
import type { Note } from "@/types/calendar"
import { NoteItem } from "./note-item"

interface DayViewProps {
    currentDate: Date
    onDateClick: (date: Date) => void
    getNotesForDate: (date: Date) => Note[]
}

export function DayView({ currentDate, onDateClick, getNotesForDate }: DayViewProps) {
    const [timeSlots, setTimeSlots] = useState<Date[]>([])
    const [currentTime, setCurrentTime] = useState(new Date())

    // Create time slots for the day (hourly)
    useEffect(() => {
        const slots = Array.from({ length: 24 }, (_, i) => {
            const date = new Date(currentDate)
            date.setHours(i, 0, 0, 0)
            return date
        })
        setTimeSlots(slots)
    }, [currentDate])

    // Update current time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)

        return () => clearInterval(timer)
    }, [])

    // Get all notes for the current day
    const dayNotes = getNotesForDate(currentDate)

    return (
        <div className="flex flex-col h-full overflow-hidden bg-background">
            {/* Day header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex flex-col">
                    <h2 className="text-xl font-semibold text-foreground">
                        {format(currentDate, "EEEE")}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                        {format(currentDate, "MMMM d, yyyy")}
                    </div>
                </div>
            </div>

            {/* All-day events section */}
            {dayNotes.length > 0 && (
                <div className="border-b border-border p-2">
                    <div className="text-xs font-medium text-muted-foreground mb-1 px-2">ALL DAY</div>
                    <div className="flex flex-wrap gap-2 p-2">
                        {dayNotes.map((note) => (
                            <div key={note.id} className="max-w-xs">
                                <NoteItem note={note} isCompact />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Time slots grid */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col divide-y divide-border relative">
                    {/* Current time indicator */}
                    {isSameDay(currentDate, new Date()) && (
                        <div
                            className="absolute left-0 right-0 flex items-center z-10 pointer-events-none"
                            style={{
                                top: `${(currentTime.getHours() * 60 + currentTime.getMinutes()) / 1440 * 100}%`
                            }}
                        >
                            <div className="w-2 h-2 rounded-full bg-primary ml-2"></div>
                            <div className="h-px flex-1 bg-primary"></div>
                            <div className="ml-1 text-xs font-medium text-primary">
                                {format(currentTime, "h:mm a")}
                            </div>
                        </div>
                    )}

                    {/* Time slots */}
                    {timeSlots.map((timeSlot) => {
                        const notesForSlot = dayNotes.filter(note => {
                            const noteHour = new Date(note.date).getHours()
                            return noteHour === timeSlot.getHours()
                        })

                        return (
                            <div
                                key={timeSlot.toString()}
                                className={cn(
                                    "flex h-20 group hover:bg-muted/50 transition-colors",
                                    isSameHour(timeSlot, currentTime) && isSameDay(timeSlot, currentTime) && "bg-primary/5"
                                )}
                                onClick={() => {
                                    // Create a new date at this time slot
                                    const clickedDate = new Date(currentDate)
                                    clickedDate.setHours(timeSlot.getHours(), 0, 0, 0)
                                    onDateClick(clickedDate)
                                }}
                            >
                                {/* Time label */}
                                <div className="w-16 flex-shrink-0 py-1 pr-2 text-right text-xs text-muted-foreground font-medium">
                                    {format(timeSlot, "h a")}
                                </div>

                                {/* Event content area */}
                                <div className="flex-1 p-1 relative">
                                    {/* Notes for this hour */}
                                    {notesForSlot.length > 0 ? (
                                        <div className="flex flex-col gap-1">
                                            {notesForSlot.map(note => (
                                                <NoteItem
                                                    key={note.id}
                                                    note={note}
                                                    isCompact
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="text-xs text-muted-foreground">Click to add</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
