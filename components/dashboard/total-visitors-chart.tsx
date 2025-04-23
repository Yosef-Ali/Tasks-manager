"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const taskChartData = [
    { date: "2024-04-01", completed: 15, pending: 25, inProgress: 10 },
    { date: "2024-04-02", completed: 18, pending: 22, inProgress: 12 },
    { date: "2024-04-03", completed: 20, pending: 20, inProgress: 15 },
    { date: "2024-04-04", completed: 25, pending: 18, inProgress: 13 },
    { date: "2024-04-05", completed: 22, pending: 23, inProgress: 11 },
    { date: "2024-04-06", completed: 30, pending: 15, inProgress: 18 },
    { date: "2024-04-07", completed: 28, pending: 17, inProgress: 16 },
    { date: "2024-04-12", completed: 25, pending: 20, inProgress: 14 },
    { date: "2024-04-17", completed: 35, pending: 15, inProgress: 20 },
    { date: "2024-04-22", completed: 32, pending: 18, inProgress: 17 },
    { date: "2024-04-27", completed: 40, pending: 12, inProgress: 22 },
    { date: "2024-05-02", completed: 38, pending: 14, inProgress: 19 },
    { date: "2024-05-07", completed: 45, pending: 10, inProgress: 25 },
    { date: "2024-05-12", completed: 42, pending: 13, inProgress: 21 },
    { date: "2024-05-17", completed: 50, pending: 8, inProgress: 28 },
    { date: "2024-05-22", completed: 48, pending: 10, inProgress: 26 },
    { date: "2024-05-27", completed: 55, pending: 5, inProgress: 30 },
    { date: "2024-06-01", completed: 52, pending: 7, inProgress: 28 },
    { date: "2024-06-06", completed: 48, pending: 11, inProgress: 24 },
    { date: "2024-06-11", completed: 45, pending: 15, inProgress: 20 },
    { date: "2024-06-16", completed: 42, pending: 18, inProgress: 18 },
    { date: "2024-06-21", completed: 38, pending: 20, inProgress: 15 },
    { date: "2024-06-24", completed: 40, pending: 12, inProgress: 20 },
    { date: "2024-06-25", completed: 42, pending: 10, inProgress: 22 },
    { date: "2024-06-26", completed: 38, pending: 14, inProgress: 19 },
    { date: "2024-06-27", completed: 45, pending: 8, inProgress: 25 },
    { date: "2024-06-28", completed: 41, pending: 11, inProgress: 21 },
    { date: "2024-06-29", completed: 39, pending: 13, inProgress: 18 },
    { date: "2024-06-30", completed: 48, pending: 5, inProgress: 28 },
]

const taskChartConfig = {
    tasks: {
        label: "Tasks",
    },
    completed: {
        label: "Completed",
        color: "hsl(142, 69%, 58%)", // green-400
    },
    inProgress: {
        label: "In Progress",
        color: "hsl(213, 94%, 68%)", // blue-400
    },
    pending: {
        label: "Pending",
        color: "hsl(48, 96%, 53%)", // yellow-400
    },
} satisfies ChartConfig

export function TaskOverviewChart() {
    const isMobile = useIsMobile()
    const [timeRange, setTimeRange] = React.useState("30d")

    React.useEffect(() => {
        if (isMobile) {
            setTimeRange("7d")
        }
    }, [isMobile])

    const filteredData = taskChartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card className="@container/card overflow-hidden border-border/40 hover:border-primary/20 transition-all duration-300">
            <CardHeader className="relative border-b border-border/10 bg-card/50 px-6">
                <CardTitle className="text-xl font-semibold">Task Overview</CardTitle>
                <CardDescription>
                    <span className="@[540px]/card:block hidden">Task completion trends for the selected period</span>
                    <span className="@[540px]/card:hidden">Task trends</span>
                </CardDescription>
                <div className="absolute right-6 top-4">
                    <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="@[767px]/card:flex hidden"
                    >
                        <ToggleGroupItem value="90d" className="h-8 px-2.5 text-xs">
                            Last 3 months
                        </ToggleGroupItem>
                        <ToggleGroupItem value="30d" className="h-8 px-2.5 text-xs">
                            Last 30 days
                        </ToggleGroupItem>
                        <ToggleGroupItem value="7d" className="h-8 px-2.5 text-xs">
                            Last 7 days
                        </ToggleGroupItem>
                    </ToggleGroup>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="@[767px]/card:hidden flex w-40 h-8 text-xs" aria-label="Select a value">
                            <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="90d" className="rounded-lg text-xs">
                                Last 3 months
                            </SelectItem>
                            <SelectItem value="30d" className="rounded-lg text-xs">
                                Last 30 days
                            </SelectItem>
                            <SelectItem value="7d" className="rounded-lg text-xs">
                                Last 7 days
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer config={taskChartConfig} className="aspect-auto h-[250px] w-full">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="fillCompleted" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(142, 69%, 58%)" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="hsl(142, 69%, 58%)" stopOpacity={0.3} />
                            </linearGradient>
                            <linearGradient id="fillInProgress" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(213, 94%, 68%)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="hsl(213, 94%, 68%)" stopOpacity={0.3} />
                            </linearGradient>
                            <linearGradient id="fillPending" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(48, 96%, 53%)" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="hsl(48, 96%, 53%)" stopOpacity={0.3} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} opacity={0.2} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            minTickGap={32}
                            stroke="hsl(var(--muted-foreground)/0.5)"
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            stroke="hsl(var(--muted-foreground)/0.5)"
                            width={40}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="pending"
                            type="natural"
                            fill="url(#fillPending)"
                            stroke="hsl(48, 96%, 53%)"
                            strokeWidth={2}
                            fillOpacity={0.6}
                        />
                        <Area
                            dataKey="inProgress"
                            type="natural"
                            fill="url(#fillInProgress)"
                            stroke="hsl(213, 94%, 68%)"
                            strokeWidth={2}
                            fillOpacity={0.7}
                        />
                        <Area
                            dataKey="completed"
                            type="natural"
                            fill="url(#fillCompleted)"
                            stroke="hsl(142, 69%, 58%)"
                            strokeWidth={2}
                            fillOpacity={0.8}
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
