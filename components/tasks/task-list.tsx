"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel"; // Import Id type
import { TaskCard, TaskCardProps } from "@/components/ui/task-card"; // Import TaskCardProps
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function TaskList() {
    const tasks = useQuery(api.tasks.getTasks, {});
    const updateTask = useMutation(api.tasks.updateTask);
    const router = useRouter();
    const [filter, setFilter] = useState("all");

    if (tasks === undefined) return <div>Loading tasks...</div>;

    const filteredTasks = filter === "all"
        ? tasks
        : tasks.filter(task => task.status === filter);

    const handleStatusChange = async (id: Id<"tasks">, status: string) => { // Change id type to Id<"tasks">
        try {
            await updateTask({ id, status }); // id is now correctly typed
        } catch (err) {
            console.error("Failed to update task status:", err);
        }
    };

    const handleViewDetails = (id: string) => {
        router.push(`/tasks/${id}`);
    };

    const handleEdit = (id: string) => {
        router.push(`/tasks/${id}/edit`);
    };

    // Transform Convex data to fit TaskCard component props
    const transformedTasks = filteredTasks.map((task: typeof api.tasks.getTasks._returnType[number]) => ({ // Explicitly type task
        id: task._id,
        title: task.title,
        description: task.description,
        dueDate: new Date(task.dueDate),
        status: task.status,
        assignee: task.assignee ? ({ // Add null check for assignee and explicitly type
            id: (task.assignee as { _id: Id<"users">; name: string; avatarUrl?: string })._id, // Assert task.assignee with expected structure
            name: (task.assignee as { _id: Id<"users">; name: string; avatarUrl?: string }).name, // Assert task.assignee with expected structure
            avatarUrl: (task.assignee as { _id: Id<"users">; name: string; avatarUrl?: string }).avatarUrl // Assert task.assignee with expected structure
        } as TaskCardProps['assignee']) : undefined, // Return undefined if no assignee
        location: task.location,
        documentCount: task.documents.length,
        completedDocuments: task.documents.filter(doc =>
            doc.status === "uploaded" || doc.status === "verified"
        ).length
    }));

    return (
        <div className="space-y-6">
            <div className="flex gap-2 mb-4">
                <Button
                    variant={filter === "all" ? "default" : "outline"}
                    onClick={() => setFilter("all")}
                >
                    All
                </Button>
                <Button
                    variant={filter === "pending" ? "default" : "outline"}
                    onClick={() => setFilter("pending")}
                >
                    Pending
                </Button>
                <Button
                    variant={filter === "in-progress" ? "default" : "outline"}
                    onClick={() => setFilter("in-progress")}
                >
                    In Progress
                </Button>
                <Button
                    variant={filter === "completed" ? "default" : "outline"}
                    onClick={() => setFilter("completed")}
                >
                    Completed
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {transformedTasks.map((task) => (
                    <TaskCard
                        key={task.id}
                        id={task.id}
                        title={task.title}
                        description={task.description}
                        dueDate={task.dueDate}
                        status={task.status}
                        assignee={task.assignee}
                        location={task.location}
                        documentCount={task.documentCount}
                        completedDocuments={task.completedDocuments}
                        onStatusChange={handleStatusChange}
                        onEdit={handleEdit}
                        onViewDetails={handleViewDetails}
                    />
                ))}

                {transformedTasks.length === 0 && (
                    <div className="col-span-full text-center py-8">
                        <p className="text-gray-500">No tasks found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}