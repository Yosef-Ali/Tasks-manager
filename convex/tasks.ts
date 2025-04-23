import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all tasks with optional filtering
export const getTasks = query({
    args: {
        status: v.optional(v.string()),
        assigneeId: v.optional(v.id("users")),
        taskType: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        let tasks;
        if (args.status && args.assigneeId) {
            tasks = await ctx.db
                .query("tasks")
                .withIndex("by_status_and_assignee", (q) =>
                    q.eq("status", args.status!)
                        .eq("assigneeId", args.assigneeId!))
                .collect();
        } else if (args.status) {
            tasks = await ctx.db
                .query("tasks")
                .withIndex("by_status", (q) => q.eq("status", args.status!))
                .collect();
        } else if (args.assigneeId) {
            tasks = await ctx.db
                .query("tasks")
                .withIndex("by_assignee", (q) => q.eq("assigneeId", args.assigneeId!))
                .collect();
        } else {
            tasks = await ctx.db.query("tasks").collect();
        }

        // For each task, get the assignee and documents
        const tasksWithRelations = await Promise.all(
            tasks.map(async (task) => {
                const assignee = await ctx.db.get(task.assigneeId);
                const documents = await ctx.db
                    .query("documents")
                    .withIndex("by_task", (q) => q.eq("taskId", task._id))
                    .collect();

                return {
                    ...task,
                    assignee,
                    documents,
                };
            })
        );

        return tasksWithRelations;
    },
});

// Get a single task by ID
export const getTask = query({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        const task = await ctx.db.get(args.id);
        if (!task) {
            return null;
        }

        const assignee = await ctx.db.get(task.assigneeId);
        const documents = await ctx.db
            .query("documents")
            .withIndex("by_task", (q) => q.eq("taskId", task._id))
            .collect();

        return {
            ...task,
            assignee,
            documents,
        };
    },
});

// Create a new task
export const createTask = mutation({
    args: {
        title: v.string(),
        description: v.optional(v.string()),
        taskType: v.string(),
        status: v.string(),
        priority: v.string(),
        dueDate: v.string(),
        location: v.optional(v.string()),
        completedSteps: v.array(v.string()),
        totalSteps: v.number(),
        assigneeId: v.id("users"),
        creatorId: v.id("users"),
        parentTaskId: v.optional(v.id("tasks")),
        createdAt: v.string(), // Add createdAt to args
    },
    handler: async (ctx, args) => {
        const taskId = await ctx.db.insert("tasks", {
            ...args, // Now includes createdAt
        });

        return taskId;
    },
});

// Update an existing task
export const updateTask = mutation({
    args: {
        id: v.id("tasks"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        taskType: v.optional(v.string()),
        status: v.optional(v.string()),
        priority: v.optional(v.string()),
        dueDate: v.optional(v.string()),
        location: v.optional(v.string()),
        completedSteps: v.optional(v.array(v.string())),
        totalSteps: v.optional(v.number()),
        assigneeId: v.optional(v.id("users")),
    },
    handler: async (ctx, args) => {
        const { id, ...fields } = args;

        const existingTask = await ctx.db.get(id);
        if (!existingTask) {
            throw new Error("Task not found");
        }

        await ctx.db.patch(id, fields);

        return await ctx.db.get(id);
    },
});

// Delete a task
export const deleteTask = mutation({
    args: { id: v.id("tasks") },
    handler: async (ctx, args) => {
        const existingTask = await ctx.db.get(args.id);
        if (!existingTask) {
            throw new Error("Task not found");
        }

        await ctx.db.delete(args.id);
    },
});