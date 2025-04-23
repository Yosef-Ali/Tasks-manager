import type React from "react";
import { Pie, PieChart, Cell } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatusCardProps {
    title: string;
    value: string;
    percentage: number;
    icon?: React.ReactNode;
    trend?: "up" | "down" | "neutral";
}

export function StatusCard({ title, value, percentage, icon, trend }: StatusCardProps) {
    // Calculate the angle based on percentage (only show partial arc)
    const chartData = [
        { name: "progress", value: percentage },
        { name: "remaining", value: 100 - percentage },
    ];

    return (
        <div className="relative flex items-center py-6 px-7 bg-card rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 group">
            {icon && (
                <div className="absolute top-3 left-3 bg-primary/10 p-1.5 rounded-md">
                    {icon}
                </div>
            )}
            <div className="flex flex-col">
                <div className="flex items-baseline">
                    <div className="text-2xl font-bold text-foreground">{percentage}</div>
                    <span className="text-lg font-medium text-foreground/70 ml-0.5">%</span>
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-1">{title}</div>
                <div className="text-xs text-muted-foreground/70 mt-1 flex items-center">
                    {value} total
                    {trend && (
                        <span className={`ml-2 flex items-center text-xs ${trend === "up" ? "text-green-500" :
                                trend === "down" ? "text-red-500" : "text-gray-500"
                            }`}>
                            {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> :
                                trend === "down" ? <TrendingDown className="h-3 w-3 mr-1" /> : null}
                            {trend === "up" ? "↑" : trend === "down" ? "↓" : ""}
                        </span>
                    )}
                </div>
            </div>
            <div className="absolute right-7 top-1/2 -translate-y-1/2 h-16 w-16 transition-all duration-300 group-hover:scale-105">
                <PieChart width={64} height={64}>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        innerRadius={22}
                        outerRadius={30}
                        startAngle={180}
                        endAngle={0}
                        strokeWidth={0}
                        cornerRadius={10}
                    >
                        <Cell key="progress" fill="hsl(var(--primary))" />
                        <Cell key="remaining" fill="hsl(var(--primary)/0.2)" />
                    </Pie>
                </PieChart>
            </div>
        </div>
    );
}