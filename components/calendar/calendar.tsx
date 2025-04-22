"use client"

import { useState, useEffect } from "react"
import {
  format,
  addMonths,
  addWeeks,
  addYears,
  subMonths,
  subWeeks,
  subYears,
  startOfWeek,
  endOfWeek,
  isSameDay,
  parseISO,
} from "date-fns"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { YearView } from "./year-view"
import { AddNoteDialog } from "./add-note-dialog"
import type { Note } from "@/types/calendar"

type CalendarView = "day" | "week" | "month" | "year"

interface CalendarProps {
  initialView?: CalendarView
  initialDate?: Date
  view?: CalendarView
  onViewChange?: (view: CalendarView) => void
  currentDate?: Date
  onDateChange?: (date: Date) => void
}

function Calendar({
  initialView = "month",
  initialDate = new Date(),
  view,
  onViewChange,
  currentDate: externalDate,
  onDateChange
}: CalendarProps) {
  const [internalDate, setInternalDate] = useState(initialDate)
  const [internalView, setInternalView] = useState<CalendarView>(initialView)
  const [notes, setNotes] = useState<Note[]>([])
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Use either controlled or uncontrolled state
  const effectiveDate = externalDate || internalDate
  const effectiveView = view || internalView

  // Sync with external view if provided
  useEffect(() => {
    if (view) {
      setInternalView(view)
    }
  }, [view])

  // Sync with external date if provided
  useEffect(() => {
    if (externalDate) {
      setInternalDate(externalDate)
    }
  }, [externalDate])

  // Handle internal date changes
  const handleDateChange = (date: Date) => {
    setInternalDate(date)
    if (onDateChange) {
      onDateChange(date)
    }
  }

  // Handle internal view changes
  const handleViewChange = (newView: CalendarView) => {
    setInternalView(newView)
    if (onViewChange) {
      onViewChange(newView)
    }
  }

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("calendar-notes")
    if (savedNotes) {
      try {
        // Convert string dates back to Date objects
        const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
          ...note,
          date: parseISO(note.date),
        }))
        setNotes(parsedNotes)
      } catch (error) {
        console.error("Error parsing saved notes:", error)
      }
    }
  }, [])

  // Save notes to localStorage whenever they change
  useEffect(() => {
    // Convert Date objects to ISO strings for storage
    const notesToSave = notes.map((note) => ({
      ...note,
      date: note.date.toISOString(),
    }))
    localStorage.setItem("calendar-notes", JSON.stringify(notesToSave))
  }, [notes])

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setIsAddNoteOpen(true)
  }

  const handleAddNote = (note: Omit<Note, "id" | "date">) => {
    if (!selectedDate) return

    const newNote: Note = {
      id: Date.now().toString(),
      date: selectedDate,
      title: note.title,
      description: note.description,
      color: note.color,
    }

    setNotes([...notes, newNote])
    setIsAddNoteOpen(false)
  }

  const getNotesForDate = (date: Date) => {
    return notes.filter((note) => isSameDay(note.date, date))
  }

  return (
    <div className="flex flex-col w-full h-full bg-background rounded-lg shadow-md overflow-hidden">
      {/* Calendar Content */}
      <div className="flex-1 overflow-auto">
        {effectiveView === "week" && (
          <WeekView currentDate={effectiveDate} onDateClick={handleDateClick} getNotesForDate={getNotesForDate} />
        )}
        {effectiveView === "month" && (
          <MonthView currentDate={effectiveDate} onDateClick={handleDateClick} getNotesForDate={getNotesForDate} />
        )}
        {effectiveView === "year" && (
          <YearView currentDate={effectiveDate} onDateClick={handleDateClick} getNotesForDate={getNotesForDate} />
        )}
      </div>

      {/* Add Note Dialog */}
      <AddNoteDialog
        isOpen={isAddNoteOpen}
        onClose={() => setIsAddNoteOpen(false)}
        onAddNote={handleAddNote}
        selectedDate={selectedDate}
      />
    </div>
  )
}

export default Calendar;
