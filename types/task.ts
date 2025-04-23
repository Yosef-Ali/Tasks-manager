"use client";

import { z } from "zod";
import { Id } from "@/convex/_generated/dataModel";

// Zod schema for task validation
export const TaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    // Allow string values for compatibility with existing code
    taskType: z.string(),
    status: z.string(),
    priority: z.string(),
    dueDate: z.date().optional(), // Date objects in forms, string in API/storage
    location: z.string().optional(),
    // These fields aren't in the form, so don't include them in the schema:
    // assigneeId, completedSteps, totalSteps, creatorId, etc.
});

// Existing Task interface (can remain for type checking elsewhere)
export interface Task {
    _id: Id<"tasks">;
    title: string;
    description?: string;
    taskType: string; // Keep as string if Convex expects string
    status: string;   // Keep as string if Convex expects string
    priority: string; // Keep as string if Convex expects string
    dueDate: string; // Keep as string if Convex expects string (ISO format)
    location?: string;
    completedSteps: string[];
    totalSteps: number;
    assigneeId: Id<"users">;
    creatorId: Id<"users">;
    parentTaskId?: Id<"tasks">;
    createdAt?: string;
    assignee?: {
        _id: Id<"users">;
        name: string;
        email: string;
        avatarUrl?: string;
    } | null;
    documents?: any[];
}
