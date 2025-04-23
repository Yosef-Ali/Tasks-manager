"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    CalendarIcon,
    FileTextIcon,
    MapPinIcon,
    TagIcon,
    XIcon,
} from "lucide-react";
import { format } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";
import type { Task } from "@/types/task";

interface TaskActionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    task: Task | null;
    onStatusChange: (id: Id<"tasks">, status: string) => void;
    onEdit: (id: Id<"tasks">) => void;
    onDelete?: (id: Id<"tasks">) => void;
    onShare?: (id: Id<"tasks">) => void;
}

export function TaskActionSheet({
    isOpen,
    onClose,
    task,
    onStatusChange,
    onEdit,
    onDelete,
    onShare
}: TaskActionSheetProps) {
    if (!task) return null;

    // Calculate progress
    const progressValue = task.totalSteps > 0
        ? (task.completedSteps.length / task.totalSteps) * 100
        : 0;

    // Format status badge color
    const getStatusBadgeClass = () => {
        switch (task.status) {
            case "completed":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "in-progress":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "under-review":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
            default:
                return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
        }
    };

    // Format status display text
    const formatStatus = (status: string) => {
        return status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ');
    };

    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent className="sm:max-w-md md:max-w-lg p-0 bg-gray-900 text-gray-100 flex flex-col h-full" side="right">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-700 flex-shrink-0">
                    <SheetHeader>
                        <div className="flex justify-between items-center">
                            <SheetTitle className="text-xl font-semibold text-white">{task.title}</SheetTitle>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge className={`${getStatusBadgeClass()} px-2 py-1`}>
                                {formatStatus(task.status)}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                                {task.taskType}
                            </Badge>
                            {task.priority && (
                                <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
                                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                                </Badge>
                            )}
                        </div>
                    </SheetHeader>
                </div>

                {/* Main content with scroll */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    {/* Description Section */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {task.description ? (
                                <p className="text-gray-300">{task.description}</p>
                            ) : (
                                <p className="text-gray-500 italic">No description provided</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Details Section */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-400">Due Date</h3>
                                    <div className="flex items-center text-white">
                                        <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>{format(new Date(task.dueDate), "PPP")}</span>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-400">Priority</h3>
                                    <div className="flex items-center text-white">
                                        <TagIcon className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>{task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : "Not set"}</span>
                                    </div>
                                </div>
                            </div>

                            {task.location && (
                                <div className="space-y-2">
                                    <h3 className="text-sm font-medium text-gray-400">Location</h3>
                                    <div className="flex items-center text-white">
                                        <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                                        <span>{task.location}</span>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 pt-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium text-gray-400">Progress</h3>
                                    <span className="text-sm text-gray-300">{Math.round(progressValue)}% Complete</span>
                                </div>
                                <Progress value={progressValue} className="h-2" />
                                <div className="text-xs text-gray-400 pt-1">
                                    {task.completedSteps.length} of {task.totalSteps} steps completed
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Assignee Section */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Assignment</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {task.assignee ? (
                                <div className="flex items-center">
                                    <Avatar className="h-10 w-10 mr-3 ring-2 ring-gray-700">
                                        <AvatarImage src={task.assignee.avatarUrl || undefined} />
                                        <AvatarFallback className="bg-blue-600 text-white">
                                            {task.assignee.name.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-medium text-white">{task.assignee.name}</div>
                                        <div className="text-sm text-gray-400">{task.assignee.email}</div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No assignee</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Documents Section */}
                    <Card className="bg-gray-800 border-gray-700">
                        <CardHeader>
                            <CardTitle className="text-lg text-white">Documents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {task.documents && task.documents.length > 0 ? (
                                <div className="space-y-3">
                                    {task.documents.map((doc, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 rounded-md bg-gray-700">
                                            <div className="flex items-center">
                                                <FileTextIcon className="h-4 w-4 mr-2 text-gray-400" />
                                                <span className="text-gray-200">{doc.name || `Document ${index + 1}`}</span>
                                            </div>
                                            <Badge variant={doc.status === "verified" ? "default" : "outline"} className={doc.status === "verified" ? "bg-green-600 text-white" : ""}>
                                                {doc.status === "verified" ? "Verified" : "Pending"}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No documents attached</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Footer with action buttons */}
                <div className="mt-auto px-6 py-4 border-t border-gray-700 bg-gray-900 flex justify-end space-x-2 sticky bottom-0">
                    <Button
                        type="button"
                        onClick={() => onStatusChange(task._id, task.status === "completed" ? "pending" : "completed")}
                        className={task.status === "completed" ? "bg-amber-600 hover:bg-amber-500" : "bg-green-600 hover:bg-green-500"}
                    >
                        Mark as {task.status === "completed" ? "Pending" : "Completed"}
                    </Button>
                    <Button
                        type="button"
                        onClick={() => onEdit(task._id)}
                        className="bg-blue-600 hover:bg-blue-500 text-white"
                    >
                        Edit Task
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
