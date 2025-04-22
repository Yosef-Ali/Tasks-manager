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
import { DayView } from "./day-view"
import { AddNoteDialog } from "./add-note-dialog"
import type { Note } from "@/types/calendar"

// Unique name to avoid import collision
export type MainCalendarView = "day" | "week" | "month" | "year"

export interface MainCalendarProps {
    initialView?: MainCalendarView
    initialDate?: Date
    view?: MainCalendarView
    onViewChange?: (view: MainCalendarView) => void
    currentDate?: Date
    onDateChange?: (date: Date) => void
}

function MainCalendar({
    initialView = "month",
    initialDate = new Date(),
    view,
    onViewChange,
    currentDate: externalDate,
    onDateChange
}: MainCalendarProps) {
    const [internalDate, setInternalDate] = useState(initialDate)
    const [internalView, setInternalView] = useState<MainCalendarView>(initialView)
    const [notes, setNotes] = useState<Note[]>([])
    const [isAddNoteOpen, setIsAddNoteOpen] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)

    // Use either controlled or uncontrolled state
    const effectiveDate = externalDate || internalDate
    const effectiveView = view || internalView

    useEffect(() => {
        if (view) setInternalView(view)
    }, [view])
    useEffect(() => {
        if (externalDate) setInternalDate(externalDate)
    }, [externalDate])

    useEffect(() => {
        const savedNotes = localStorage.getItem("calendar-notes")
        if (savedNotes) {
            try {
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

    useEffect(() => {
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

    const getNotesForDate = (date: Date) => notes.filter((note) => isSameDay(note.date, date))

    return (
        <div className="flex flex-col w-full h-full bg-background rounded-lg shadow-md overflow-hidden">
            <div className="flex-1 overflow-auto">
                {effectiveView === "day" && (
                    <DayView currentDate={effectiveDate} onDateClick={handleDateClick} getNotesForDate={getNotesForDate} />
                )}
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
            <AddNoteDialog
                isOpen={isAddNoteOpen}
                onClose={() => setIsAddNoteOpen(false)}
                onAddNote={handleAddNote}
                selectedDate={selectedDate}
            />
        </div>
    )
}

export default MainCalendar;
