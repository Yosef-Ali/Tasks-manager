import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3 } from "lucide-react";

interface DepartmentStat {
    name: string;
    count: number;
}

export function DepartmentActivityCard({
    stats,
    totalTasks
}: {
    stats: DepartmentStat[];
    totalTasks: number;
}) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Department Activity
                </CardTitle>
                <CardDescription>Tasks by department</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {stats.slice(0, 5).map((dept) => (
                        <div key={dept.name} className="flex items-center gap-4">
                            <div className="w-[180px] truncate font-medium">{dept.name}</div>
                            <div className="flex-1">
                                <Progress
                                    value={totalTasks ? (dept.count / totalTasks) * 100 : 0}
                                    className="h-2"
                                />
                            </div>
                            <div className="text-muted-foreground text-sm tabular-nums">
                                {dept.count} tasks
                            </div>
                        </div>
                    ))}
                    {stats.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                            No department data available
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
