"use client"

import { useState } from "react"
import { PageHeader } from "@/components/ui/page-header"
import MainCalendar from "@/components/calendar/main-calendar"
import { Button } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CalendarPageClient() {
    const [view, setView] = useState<"day" | "week" | "month" | "year">("month")
    const [currentDate, setCurrentDate] = useState(new Date())

    const navigateToday = () => setCurrentDate(new Date())
    const navigatePrevious = () => {
        const newDate = new Date(currentDate)
        if (view === "month") newDate.setMonth(currentDate.getMonth() - 1)
        else if (view === "week") newDate.setDate(currentDate.getDate() - 7)
        else if (view === "day") newDate.setDate(currentDate.getDate() - 1)
        else newDate.setFullYear(currentDate.getFullYear() - 1)
        setCurrentDate(newDate)
    }
    const navigateNext = () => {
        const newDate = new Date(currentDate)
        if (view === "month") newDate.setMonth(currentDate.getMonth() + 1)
        else if (view === "week") newDate.setDate(currentDate.getDate() + 7)
        else if (view === "day") newDate.setDate(currentDate.getDate() + 1)
        else newDate.setFullYear(currentDate.getFullYear() + 1)
        setCurrentDate(newDate)
    }

    return (
        <div className="flex flex-col h-screen bg-background">
            <div className="p-4 border-b border-border">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <PageHeader
                        title="Calendar"
                        description="Schedule and manage hospital events"
                    />

                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search events"
                                className="pl-9 w-full sm:w-[200px] h-9"
                            />
                        </div>
                        <Button size="sm" className="h-9">
                            <PlusIcon className="h-4 w-4 mr-1" /> Add Event
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={navigateToday}>Today</Button>
                    <Button variant="ghost" size="icon" onClick={navigatePrevious}>
                        <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={navigateNext}>
                        <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                    <h2 className="text-lg font-semibold text-foreground">
                        {currentDate.toLocaleDateString('en-US', {
                            month: 'long',
                            year: 'numeric',
                            day: view === 'day' ? 'numeric' : undefined
                        })}
                    </h2>
                </div>

                <div className="flex items-center">
                    <Tabs value={view} onValueChange={(value) => setView(value as "day" | "week" | "month" | "year")} className="w-full">
                        <TabsList className="bg-muted">
                            <TabsTrigger value="day">Day</TabsTrigger>
                            <TabsTrigger value="week">Week</TabsTrigger>
                            <TabsTrigger value="month">Month</TabsTrigger>
                            <TabsTrigger value="year">Year</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <div className="h-full bg-background border border-border">
                    <MainCalendar
                        view={view}
                        onViewChange={setView}
                        currentDate={currentDate}
                        onDateChange={setCurrentDate}
                    />
                </div>
            </div>
        </div>
    )
}
