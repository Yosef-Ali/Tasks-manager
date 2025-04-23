import type React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

interface MetricCardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
    subtext: string;
    change: string;
    changeType: "positive" | "negative" | "neutral";
    items: { label: string; value: string }[];
    footer: string;
    buttonText: string;
}

export function MetricCard({
    icon,
    title,
    value,
    subtext,
    change,
    changeType,
    items,
    footer,
    buttonText,
}: MetricCardProps) {
    return (
        <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition-all duration-200">
            <div className="p-6 border-b border-border">
                <div className="flex justify-between items-start">
                    <div className="bg-secondary/50 p-2 rounded-md">{icon}</div>
                    <div
                        className={`flex items-center text-xs font-medium ${changeType === "positive"
                                ? "text-green-500"
                                : changeType === "negative"
                                    ? "text-red-500"
                                    : "text-muted-foreground"
                            }`}
                    >
                        {changeType === "positive" ? (
                            <ChevronUp className="h-3 w-3 mr-1" />
                        ) : changeType === "negative" ? (
                            <ChevronDown className="h-3 w-3 mr-1" />
                        ) : null}
                        {change}
                    </div>
                </div>
                <div className="mt-4">
                    <div className="text-sm text-muted-foreground font-medium">{title}</div>
                    <div className="flex items-baseline mt-1">
                        <div className="text-3xl font-bold text-foreground">{value}</div>
                        <div className="ml-2 text-xs text-muted-foreground">{subtext}</div>
                    </div>
                </div>
            </div>
            <div className="px-6 py-4">
                {items.map((item, index) => (
                    <div key={index} className="flex justify-between py-1">
                        <div className="text-sm text-muted-foreground">{item.label}</div>
                        <div className="text-sm text-muted-foreground">{item.value}</div>
                    </div>
                ))}
            </div>
            <div className="px-6 py-4 border-t border-border">
                <div className="text-xs text-amber-600 mb-3">{footer}</div>
                <button className="text-xs text-primary font-medium hover:text-primary/80 transition-colors duration-200">
                    {buttonText}
                </button>
            </div>
        </div>
    );
}