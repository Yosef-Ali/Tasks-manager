import type React from "react";
import { Pie, PieChart, Cell } from "recharts";

interface StatusCardProps {
    title: string;
    value: string;
    percentage: number;
}

export function StatusCard({ title, value, percentage }: StatusCardProps) {
    // Calculate the angle based on percentage (only show partial arc)
    const chartData = [
        { name: "progress", value: percentage },
        { name: "remaining", value: 100 - percentage },
    ];

    return (
        <div className="relative flex items-center py-6 px-7 bg-card rounded-xl border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 group">
            <div className="flex flex-col">
                <div className="flex items-baseline">
                    <div className="text-2xl font-bold text-foreground">{percentage}</div>
                    <span className="text-lg font-medium text-foreground/70 ml-0.5">%</span>
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-1">{title}</div>
                <div className="text-xs text-muted-foreground/70 mt-1">{value} total</div>
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