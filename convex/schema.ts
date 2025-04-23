import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        avatarUrl: v.optional(v.string()),
        createdAt: v.string(),
        tokenIdentifier: v.string(),
    }).index("by_token", ["tokenIdentifier"]),

    tasks: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        taskType: v.string(), // e.g., 'work-permit', 'license-renewal'
        status: v.string(), // 'pending', 'in-progress', 'completed', 'overdue'
        priority: v.string(), // 'low', 'medium', 'high'
        dueDate: v.string(), // ISO date string
        location: v.optional(v.string()),
        completedSteps: v.array(v.string()), // Array of step IDs that are completed
        totalSteps: v.number(),
        createdAt: v.optional(v.string()), // Made field optional

        // Relations (stored as IDs)
        assigneeId: v.id("users"),
        creatorId: v.id("users"),
        parentTaskId: v.optional(v.id("tasks")),

    })
        .index("by_assignee", ["assigneeId"])
        .index("by_status", ["status"])
        .index("by_creator", ["creatorId"])
        .index("by_parent", ["parentTaskId"])
        .index("by_status_and_assignee", ["status", "assigneeId"]),

    documents: defineTable({
        name: v.string(),
        type: v.string(), // e.g., 'passport', 'certificate'
        status: v.string(), // 'required', 'uploaded', 'verified'
        fileUrl: v.optional(v.string()),
        uploadedAt: v.optional(v.string()), // ISO date string

        // Relations
        taskId: v.id("tasks"),
        uploadedById: v.optional(v.id("users")),
    })
        .index("by_task", ["taskId"])
        .index("by_uploader", ["uploadedById"]),

    notifications: defineTable({
        title: v.string(),
        message: v.string(),
        type: v.string(), // 'task', 'document', 'system'
        isRead: v.boolean(),
        createdAt: v.string(), // ISO date string
        userId: v.id("users"),
        relatedTaskId: v.optional(v.id("tasks")),
    })
        .index("by_user", ["userId"])
        .index("by_user_and_read", ["userId", "isRead"])
});