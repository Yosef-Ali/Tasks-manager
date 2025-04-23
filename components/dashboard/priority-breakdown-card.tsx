import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart } from "lucide-react";

interface PriorityStat {
    priority: string;
    count: number;
}

export function PriorityBreakdownCard({
    stats,
    totalTasks
}: {
    stats: PriorityStat[];
    totalTasks: number;
}) {
    return (
        <Card className="lg:col-span-1">
            <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center">
                    <PieChart className="h-5 w-5 mr-2 text-primary" />
                    Priority Breakdown
                </CardTitle>
                <CardDescription>Tasks by priority level</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {stats.map((stat) => (
                        <div key={stat.priority} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className={`h-3 w-3 rounded-full ${stat.priority === 'high' ? 'bg-red-500' :
                                        stat.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                                    }`} />
                                <div className="flex-1 font-medium capitalize">{stat.priority}</div>
                                <div className="text-muted-foreground">{stat.count} tasks</div>
                            </div>
                            <Progress
                                value={totalTasks ? (stat.count / totalTasks) * 100 : 0}
                                className={`h-2 ${stat.priority === 'high' ? 'bg-red-100 [&>div]:bg-red-500' :
                                        stat.priority === 'medium' ? 'bg-orange-100 [&>div]:bg-orange-500' :
                                            'bg-green-100 [&>div]:bg-green-500'
                                    }`}
                            />
                        </div>
                    ))}
                    {stats.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                            No priority data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
